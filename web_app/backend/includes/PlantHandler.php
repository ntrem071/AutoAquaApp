<?php

    class PlantHandler{
        private $tbl; 

        public function __construct(){
            require __DIR__ . '/vendor/autoload.php';
            $m= new \MongoDB\Client("mongodb://localhost:27017"); 

            $db = $m->AutoAquaDB;
            $this->tbl = $db->Plants;
        }

        public function getList(){
            
        }
        public function getPlantInfo($name){
            
        }

        public function createPlant($name){
            
            if(is_null($this->tbl->findOne(['email'=>$name]))){
                
                $this->tbl->insertOne(['name'=> $name]);
                return true;

            }else{return false;}  
        }
        public function deletePlant($name){
             
        }

        //get and set plant values
    }

?>