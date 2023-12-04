<?php
    include_once '../backend/includes/MySessionHandler.php';

    class PlantHandler{
        private $tbl; 

        public function __construct(){
            require __DIR__ . '/vendor/autoload.php';
            $m= new \MongoDB\Client("mongodb://localhost:27017"); 

            $db = $m->AutoAquaDB;
            $this->tbl = $db->Plants;
        }
        //return id from name
        public function getID($name){

        }
        //return name list (no extra info)
        public function getListAll(){
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

            $users= new UserHandler(); 

            $idealPH= $users->calculateIdealPH($id, $this);
            $idealEC= $users->calculateIdealEC($id, $this);
            $idealHours= $users->calculateHours($id, $this);

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
            $this->createPlant('Arugula',[12, 14],[6.5,7.0],[0.8,1.8],'NA');
            $this->createPlant('Dill',[12, 14],[5.5,6.5],[1.2,1.8],'NA');
            $this->createPlant('Bok Choy',[6,8],[6.0,6.5],[1.2,1.8],'NA');
            $this->createPlant('Leek',[14,16],[6.5,7.0],[1.2,1.8],'NA');
        }

    }

?>