<?php

    class FishHandler{
        private $tbl; 

        public function __construct(){
            require __DIR__ . '/vendor/autoload.php';
            $m= new \MongoDB\Client("mongodb://localhost:27017"); 

            $db = $m->AutoAquaDB;
            $this->tbl = $db->Fish;
        }

        //return name list (no extra info)
        public function getList(){
            if(empty($this->tbl->count())){
                $this->initialize();
                
            }

            $ar = array();
            $cursor = $this->tbl->find([],['sort' => ['fish' => 1]]);

            foreach ($cursor as $item) {
                array_push($ar, $item['fish']);
            };

            return $ar; 
        }

        //return fish JSON DOC (use json_encode to display)
        public function getFishInfo($name){
            return $this->tbl->findOne(['fish'=>$name],['projection'=>['_id'=>false]]);
        }

        public function getFishImage($path){
            return file_get_contents('serverURL'); //TODO
        }

        /* FISH DOC CONTAINS
            -fish name
            -tank size : # fish
            -ideal ph range (array[2])
            -ideal temp range (array[2])
            -extra info (diseases and parasites, ornamental or edible, size, time to mature, etc.)
        */ 
        public function createFish($name, $size, $pHRange, $tempRange, $summary){
            
            if(is_null($this->tbl->findOne(['fish'=>$name]))){
                
                $this->tbl->insertOne(['fish'=> $name, 'tank_size'=> $size, 'ph_range'=>$pHRange, 'temp_range'=>$tempRange, 'info'=>$summary]);
                return true;

            }else{return false;}  
        }

        //update fish values using fish name
        public function updateFish($name, $size, $pHRange, $tempRange, $summary){
            $this->tbl->updateOne(['fish'=>$name],['$set'=>['fish'=> $name, 'tank_size'=> $size, 'ph_range'=>$pHRange, 'temp_range'=>$tempRange, 'info'=>$summary]]);
  
       }

       //delete list item from name
       public function deleteFish($name){
            $this->tbl->deleteOne(['fish' => $name]);
       }

        public function initialize(){
            $string = file_get_contents("../backend/includes/init/fish.json");
            $json = json_decode($string, true);

            for($i =0; $i<count($json['fish']); $i++) {           
                $f = $json['fish'][$i];
                $this->createFish($f['fish'], $f['tank_size'], $f['ph_range'], $f['temp_range'], $f['info']);
            }
        }
    }

?>