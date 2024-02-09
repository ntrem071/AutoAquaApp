<?php
    include_once '../includes/FishHandler.php';

    class TestFish{
        private $session;

        public function __construct(){
            echo "_____FISH HANDLER TESTING_____\n";
            $this->session = new FishHandler();

        }

        public function getSession(){return $this->session;}

        public function newFish($n, $s, $p, $t, $i){
            if (!($this->session->createFish($n, $s, $p, $t, $i))){
                echo "ERROR: fish already exists\n";
            }else{
                echo "New Fish Created\n";
            }
        }

        public function printUserDoc($name){
            echo $name, " Info: ", json_encode($this->session->getFishInfo($name)),"\n";
        }

    }
        
        //TESTFISH CALLS
        //connection and creation
        $test= new TestFish();
        $test->getSession()->initialize();
        $test->newFish('Bass',null,null,null,null);
        $test->newFish('Trout',null, null, null, null);
       
        echo "\nPlant List: \n";
        print_r($test->getSession()->getList());

        echo "\nSelecting Fish File Info: \n";
        $test->printUserDoc('Bass');
        $test->printUserDoc('Trout');
        
        echo "\nSelected Fish File Info After Update: \n";
        $test->getSession()->updateFish('Bass','12 gallons per fish',[6.5,7.0],[12,18],'NA');
        $test->printUserDoc('Bass');

        echo "\nSelected Fish File Info After Deletion: \n";
        $test->getSession()->deleteFish('Bass');
        $test->printUserDoc('Bass');

        echo nl2br("\n\n\n_______________Testing Fish images retrieval_______________\n\n\n");
        
        //need to change path because of the folders ../includes/img/fish-images/
        $imgSRC = $test->getSession()->getFishImage('Largemouth Bass');
        echo "\n<img src={$imgSRC} width='250' height='250'/> \n\n\n";

        $imgSRC = $test->getSession()->getFishImage("Goldfish");
        echo "\n<img src={$imgSRC} width='250' height='250'/> \n\n\n";

        $imgSRC = $test->getSession()->getFishImage('Koi');
        echo "\n<img src={$imgSRC} width='250' height='250'/> \n\n\n";

        $imgSRC = $test->getSession()->getFishImage('Trout');
        echo "\n<img src={$imgSRC} width='250' height='250'/> \n\n\n";

        $imgSRC = $test->getSession()->getFishImage('Tilapea');
        echo "\n<img src={$imgSRC} width='250' height='250'/> \n\n\n";

        $imgSRC = $test->getSession()->getFishImage('Salmon');
        echo "\n<img src={$imgSRC} width='250' height='250'/> \n\n\n";

        $imgSRC = $test->getSession()->getFishImage('Catfish');
        echo "\n<img src={$imgSRC} width='250' height='250'/> \n\n\n";

        echo nl2br("\n\n\n_______________Testing JSON_______________\n\n");
        
        $json = $test->getSession()->getFishInfo('Trout');
        $json->image = $imgSRC;
        $json = json_encode($json);
        echo $json;


?>