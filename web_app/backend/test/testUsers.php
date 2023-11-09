<?php
    include_once '../includes/UserHandler.php';
    
    /**************************** SESSION HANDLER TESTING ****************************/
    class TestUsers{
        private $session;
        private $id;

        public function __construct(){
            echo "/**************************** USER HANDLER TESTING ****************************/\n";
            $this->session = new Userhandler();

        }
        public function savedID(){return $this->id;}
        public function getSession(){return $this->session;}

        public function newuser($n,$e,$p){
            if (!($this->session->createNewUser($n,$e,$p))){
                echo "ERROR: user already exists\n";
            }else{
                echo "New User Created\n";
            }
        }
        public function retrieveID($e,$p){
            $this->id = $this->session->Login($e,$p);
            if (is_null($this->id)){
                echo "ERROR: invalid login credentials\n";
            }else{
                echo "User ID: ", $this->id,"\n";
            }
        }

        public function printUserDoc($id){
            if (is_null($this->id)){
                echo "ERROR: id null\n";
            }else{
                echo "User Profile Data: ", json_encode($this->session->getAccount($id)),"\n\n";
            }
        }


    }
        //ADJUSTABLE VARIABLES
        $n='Alex';
        $e='Amanda@gmail.com';
        $p='pass';

        //TESTUSERS CALLS
        //connection and creation
        $test= new TestUsers();
        $test->newuser($n,$e,$p);
        $test->retrieveID($e,$p);
        $id =$test->savedID();
        $test->printUserDoc($id);
        

        //RANGE UPDATE
        $arr=$test->getSession()->getPHRange($id);
        echo "Default PH array: [",  strval($arr[0]), "," , strval($arr[1]),"]\n";
        $arr=$test->getSession()->getECRange($id);
        echo "Default EC array: [",  strval($arr[0]), "," , strval($arr[1]),"]\n";
        $arr=$test->getSession()->getTEMPRange($id);
        echo "Default TEMP array: [",  strval($arr[0]), "," , strval($arr[1]),"]\n";
        $test->getSession()->setPHRange($id,[6.2,7.6]); 
        $test->getSession()->setECRange($id,[1.1,1.9]); 
        $test->getSession()->setTEMPRange($id,[22,29.7]); 
        $arr2=$test->getSession()->getPHRange($id);
        echo "Modified PH array: [",  strval($arr2[0]), "," , strval($arr2[1]),"]\n";
        $arr2=$test->getSession()->getECRange($id);
        echo "Modified EC array: [",  strval($arr2[0]), "," , strval($arr2[1]),"]\n";
        $arr2=$test->getSession()->getTEMPRange($id);
        echo "Modified TEMP array: [",  strval($arr2[0]), "," , strval($arr2[1]),"]\n\n";

        //ENABLE SWITCHING
        echo "Pre-enable call value: ", json_encode($test->getSession()->getPHEnable($id)),"\n";
        $test->getSession()->setPHEnable($id);
        echo "Post-enable call value: ", json_encode($test->getSession()->getPHEnable($id)),"\n\n";

        //GRAPH APPEND POINT (when splice=-3, pushing item 4 to array removes item 1 to maintain array limit)
            /*
                $test->getSession()->setWATERGraph($id,['01', 2.0]);
                $test->getSession()->setWATERGraph($id,['02', 2.2]);
                $test->getSession()->setWATERGraph($id,['03', 2.3]);
                $test->getSession()->setWATERGraph($id,['04', 2.1]);
                echo "Please adjust splice number to -3 to observe intended test results. Current graph points are: \n";
                print_r($test->getSession()->getWATERGraph($id)); 
            */
       
        //UPDATE TIMERS 
        $test->getSession()->setLEDTimer($id,[[12,30],[8,0]]);
        echo "LED on/off times: ", json_encode($test->getSession()->getLEDTimer($id)),"\n";

        $test->getSession()->setFEEDTimer($id,[[12,30],[8,0],[9,30]]);
        $test->getSession()->setFEEDTimer($id,[[13,30],[6,0],[7,30]]);
        echo "FEED times: ", json_encode($test->getSession()->getFEEDTimer($id)), "\n\n";

        //UPDATE TIMEZONE
        echo "Current user timezone is: ",$test->getSession()->getTimezone($id),"\n";
        $test->getSession()->setTimezone($id,"America/Toronto");
        echo "User timezone after switch: ", $test->getSession()->getTimezone($id),"\n";
        echo "GetDate function: ", json_encode(getdate()), "\n\n";

        //GET FINAL USER DOC
        $test->printUserDoc($id);
        $test->getSession()->deleteAccount($id);
        $test->printUserDoc($id);

        echo "*******************************************************************************************************\n",
             "*   Since design not finalized, testing and implementation will have to be done at a later time for:  *\n",
             "*             --->forgot password verification                                                        *\n",
             "*             --->led/feed timer checks                                                               *\n",
             "*******************************************************************************************************\n";  

?>