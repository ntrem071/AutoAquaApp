<?php
    include_once '../includes/PlantHandler.php';
    include_once '../includes/UserHandler.php';
    
    class TestPlants{
        private $session;

        public function __construct(){
            echo "_____PLANT HANDLER TESTING_____\n";
            $this->session = new PlantHandler();

        }
        public function getSession(){return $this->session;}

        public function newPlant($n, $h, $p, $e, $s){
            if (!($this->session->createPlant($n, $h, $p, $e, $s))){
                echo "ERROR: plant already exists\n";
            }else{
                echo "New Plant Created\n";
            }
        }

        public function printUserDoc($name){
            echo $name, " Info: ", json_encode($this->session->getPlantInfo($name)),"\n";
        }

        

    }
        
        //TESTPLANTS CALLS
        //connection and creation
        $test= new TestPlants();
        $test->getSession()->initialize();
        $test->newPlant('Fennel',null,null,null,null);
       
        echo "\nPlant List Snippet: \n";
       $l =$test->getSession()->getListAll();
        for($i=0;$i<5;$i++){ 
           echo " ", $l[$i], ",";
        }
        echo " ", $l[5],"\n";
        echo "\nSelecting Plant File Info: \n";
        $test->printUserDoc('Dill');
        $test->printUserDoc('Fennel');
        
        echo "\nSelected Plant File Info After Update: \n";
        $test->getSession()->updatePlant('Fennel',[8,14],[6,9.0],[1.6,1.8],'NA');
        $test->printUserDoc('Fennel');

        echo "\nSelected Plant File Info After Deletion: \n";
        $test->getSession()->deletePlant('Fennel');
        $test->printUserDoc('Fennel');
        echo "\n";

        // USE ID: '6556fe88325077a4a9068fd2' to filter by ideal
        $test->newPlant('Fennel',[12,14],[6.5,7.0],[1.2,1.6],'NA');
        echo "Filtered list based on ideal PH: ";
        echo json_encode($test->getSession()->getListCompatible(new \MongoDB\BSON\ObjectId('6575247960c91c63d0019af2'), true, false, false));

?>