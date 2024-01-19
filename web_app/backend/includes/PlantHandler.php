<?php
    include_once '../backend/includes/MySessionHandler.php';

    class PlantHandler{
        private $tbl; 
        private $users;

        public function __construct(){
            require __DIR__ . '/vendor/autoload.php';
            $m= new \MongoDB\Client("mongodb://localhost:27017"); 

            $db = $m->AutoAquaDB;
            $this->tbl = $db->Plants;
            $this->users = new UserHandler();
        }
        //return name list (no extra info)
        public function getListAll(){

            if(empty($this->tbl->count())){
                $this->initialize();
            }

            $ar = array();
            $cursor = $this->tbl->find([],['sort' => ['plant' => 1]]);

            foreach ($cursor as $item) {
                array_push($ar, $item['plant']);
            };
            return $ar; 
        }

        //Calculate within range for getListCompatible(...)
        private function withinRange($range1, $range2){
            if(($range2==null)||($range1[1]<=$range2[0])||($range1[0]>=$range2[1])){
                return false;
            }else{return true;}
        }
        //return list after searching by compatibility (fph is set to true, search by compatible ph)
        public function getListCompatible($id, $fph, $fec, $fhour){
            //Check user ranges (calculated in UserHandler)
            $arr = [];

            $idealPH= $this->users->getRecomPH($id);
            $idealEC= $this->users->getRecomEC($id);
            $idealHours= $this->users->getRecomHours($id);

            //echo "Ideal: ph- ",json_encode($idealPH)," ec- ", json_encode($idealEC)," hours- ", json_encode($idealHours), "\n";
                $flagPH=true;$flagEC=true;$flagHour=true;

                
                $cursor = $this->tbl->find([],['sort' => ['plant' => 1]]);

                foreach ($cursor as $item) {
                    if($fph){ // check pH
                        $flagPH=true;
                        if(!($this->withinRange($item->ph_range, $idealPH))){
                            $flagPH=false;
                        }
                    }
                    if($fec){ //check ec
                        $flagEC=true;
                        if(!($this->withinRange($item->ec_range, $idealEC))){
                            $flagEC=false;
                        }
                    }
                    if($fhour){ // check hours
                        $flagHour=true;
                        if(!($this->withinRange($item->daily_light_requirement, $idealHours))){
                            $flagHour=false;
                        }
                    }
                    if($flagPH && $flagEC && $flagHour){//push if all conditions met
                        array_push($arr, $item->plant);                  
                    }
                }
            
            return $arr; 
        }

        //return plant JSON DOC (use json_encode to display)
        public function getPlantInfo($name){
            return $this->tbl->findOne(['plant'=>$name],['projection'=>['_id'=>false]]);
        }

        public function getPlantImage($path){
            return file_get_contents('serverURL'); //TODO
        }

        /* PLANT DOC CONTAINS
            -plant name
            -hours for daily light requirement
            -ideal ph range (array[2])
            -ideal ec range (array[2])
            -extra info (time to germinate/ mature/ difficulty other important details)
        */ 
        public function createPlant($name, $hours, $pHRange, $ecRange, $summary){
            
            if(is_null($this->tbl->findOne(['plant'=>$name]))){
                
                $this->tbl->insertOne(['plant'=> $name, 'daily_light_requirement'=> $hours, 'ph_range'=>$pHRange, 'ec_range'=>$ecRange, 'info'=>$summary]);
                return true;

            }else{return false;}  
        }

        //update plant values using plant name
        public function updatePlant($name, $hours, $pHRange, $ecRange, $summary){
            $this->tbl->updateOne(['plant'=>$name],['$set'=>['daily_light_requirement'=>$hours,'ph_range'=>$pHRange, 'ec_range'=>$ecRange, 'info'=>$summary]]);
  
       }

       //delete list item from name
       public function deletePlant($name){
            $this->tbl->deleteOne(['plant' => $name]);
       }

       //Set doc list
       public function initialize(){
            $string = file_get_contents("../backend/includes/init/plants.json");
            $json = json_decode($string, true);

            for($i =0; $i<count($json['plants']); $i++) {           
                $p = $json['plants'][$i];
                $this->createPlant($p['plant'], $p['daily_light_requirement'], $p['ph_range'], $p['ec_range'], $p['info']);
            }
        }

    }
?>