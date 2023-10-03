<?php

//Intial create user default constants
    define('DEFAULT_PH', [6.0, 7.0]);
    define('DEFAULT_EC', [1.5, 2.5]);
    define('DEFAULT_TEMP', [22.0, 25.0]);


//Add/Modify User obj in User collection
    class UserHandler{
        private $tbl; 
        private $currDoc;

    //Connect to User collection
        public function __construct(){
            require __DIR__ . '/vendor/autoload.php';
            $m= new \MongoDB\Client("mongodb://localhost:27017"); //!!!CONNECT TO WEBSITE!!!
 
            $db = $m->AutoAquaDB;
            $this->tbl = $db->Users;
        }

        //User created on login -> no two emails can be the same
        public function createNewUser($email, $password){
            
            if(is_null($this->tbl->findOne(['email'=>$email]))){
                
                $this->tbl->insertOne(['email'=> $email, 'password'=> $password, 'ledTimer'=> [], 'feedTimer'=> [], 
                    'phRange'=> DEFAULT_PH, 'ecRange'=> DEFAULT_EC,'tempRange'=> DEFAULT_TEMP, 
                        'phEnable'=> false,  'ecEnable'=> false,  'tempEnable'=> false, 'feedEnable'=>false, 'ledEnable'=>false,
                            'phGraph'=> [], 'ecGraph'=> [],'tempGraph'=> [], 'waterGraph'=> [], 'timezone'=>'UTC']);

            }else{
                echo "Account already exists under this email\n";
            }
            
        }

        //Get account to use get and set functions
        public function getAccount($email, $password){
            $doc= $this->tbl->findOne(['email'=>$email]);


            if(is_null($doc) || (!is_null($doc) && !($doc->password==$password))){
                 echo "ERROR: Invalid Credentials\n";
            }else{
                $this->currDoc = $doc;
                date_default_timezone_set($this->getTimezone());
            }

        }

        //FORGOT PASSWORD ONLY
                /*!!!IMPELMENT EXTERNAL EMAIL VERIFICATION PROCESS!!!!*/
        public function setPassword($password){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['password'=>$password]]);
            $this->getAccount($this->currDoc->email, $this->currDoc->password); //remove later if login not automatic post change?
        }

        /*Input param for all three arrays: 
                PH[0] = low value(decimal)
                PH[1] = high value(decimal)
          IMPLEMENT: single same page save button to update all three at once*/
        public function setRanges($PH, $EC, $TE){
           $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['phRange'=>$PH, 'ecRange'=>$EC, 'tempRange'=>$TE]]);
           $this->getAccount($this->currDoc->email, $this->currDoc->password); //currDOC REFRESH to see updated values
        }

        //Enable setters --> no input param, call to function sets to opposite boolean value
        public function setPHEnable(){ 
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['phEnable'=>!$this->getPHEnable()]]);
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        public function setECEnable(){            
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['ecEnable'=>!$this->getECEnable()]]);
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        public function setTEMPEnable(){            
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['tempEnable'=>!$this->getTEMPEnable()]]);
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        public function setFEEDEnable(){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['feedEnable'=>!$this->getFEEDEnable()]]);
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        public function setLEDEnable(){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['ledEnable'=>!$this->getLEDEnable()]]);
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        } 

        /*Input array param:
            point[0]= timestamp of data collected
            point[1]= data value
          Appends (x,y) pairing to graph array
          Current graph array limit equivalent to 1 year of data if collected hourly (8766 points) -> FIFO

          !!!IMPLEMENT: graph timespan selection for UI (data over 1 week/ 1 month/ 3 months/ etc)!!!
        */     
        public function setPHGraph($point){  //set to lower slice val for function testing  
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$push'=>['phGraph'=>['$each'=>[$point], '$slice'=>-8766]]]);    
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        public function setECGraph($point){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$push'=>['ecGraph'=>['$each'=>[$point], '$slice'=>-8766]]]);    
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        public function setTEMPGraph($point){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$push'=>['tempGraph'=>['$each'=>[$point], '$slice'=>-8766]]]);    
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        public function setWATERGraph($point){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$push'=>['waterGraph'=>['$each'=>[$point], '$slice'=>-8766]]]);    
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }

        /*Input param for array of time pairs (hour, minute):
            arr[0] = LED ON 
            arr[1] = LED OFF 
        */
        public function setLEDTimer($arr){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$push'=>['ledTimer'=>['$each'=>[$arr[0],$arr[1]], '$slice'=>-2]]]);    
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }
        //Input param for array of three optional time pairs (hour, minute)
        public function setFEEDTimer($arr){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$push'=>['feedTimer'=>['$each'=>[$arr[0],$arr[1],$arr[2]], '$slice'=>-3]]]);    
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }

        //Update timezone using string (ie. 'UTC')
            /*IMPLEMENT: USER SELECT FROM DROPDOWN MENU*/
        public function setTimezone($str){
            $this->tbl->updateOne(['email'=>$this->currDoc->email],['$set'=>['timezone'=>$str]]);
            $this->getAccount($this->currDoc->email, $this->currDoc->password);
        }

        //GET() mongodb current document values    
        public function getPHRange(){return $this->currDoc->phRange;}
        public function getECRange(){return $this->currDoc->ecRange;}
        public function getTEMPRange(){return $this->currDoc->tempRange;}

        public function getPHEnable(){return $this->currDoc->phEnable;}
        public function getECEnable(){return $this->currDoc->ecEnable;}
        public function getTEMPEnable(){return $this->currDoc->tempEnable;}
        public function getFEEDEnable(){return $this->currDoc->feedEnable;}
        public function getLEDEnable(){return $this->currDoc->ledEnable;}          

        public function getPHGraph(){return $this->currDoc->phGraph;}
        public function getECGraph(){return $this->currDoc->ecGraph;}
        public function getTEMPGraph(){return $this->currDoc->tempGraph;}
        public function getWATERGraph(){return $this->currDoc->waterGraph;}

        public function getLEDTimer(){return $this->currDoc->ledTimer;}
        public function getFEEDTimer(){return $this->currDoc->feedTimer;}

        public function getTimezone(){return $this->currDoc->timezone;}

        public function docNull(){return is_null($this->currDoc);}
        
        
        //idea not final - requires testing
         public function checkFEEDTimer($arr){
            $time= getdate();
            foreach($arr as $pair){
                if(($time['minutes'] == $pair[1]) && ($time['hours'] == $pair[0]) && $this->getFEEDEnable()){
                    /*!!!IMPLEMENT: call to feed dispensor!!!*/ 
                }
            }
        }

    }

    

    /**************************** SESSION HANDLER TESTING ****************************/

    //NO GET PASSWORD for account safety (set only if verification link validated)
    //NOTE: some changes best observed through MongoDB Compass
    /*!!!IMPELMENT EXTERNAL NO ACCOUNT LOADED ERR (using doc null)!!!!*/  
        $U1 = new Userhandler();
        $U1->createNewUser('C','Z');
        
        //load account by unique email address
        $U1->getAccount('C','B');
        $U1->getAccount('C','M');

        if($U1->docNull()==1){
            echo "ERROR: No Account Loaded\n";
        }else{
            //get ph range high and low values -> uses currDoc for loaded account
            $arr=$U1->getTEMPRange();
            echo "Default array: [",  strval($arr[0]), "," , strval($arr[1]),"]\n";
            //modify ranges
            $U1->setRanges([6.2,7.6],[1.1,1.9],[22,29.7]);
            $arr2=$U1->getTEMPRange();
            echo "Modified array: [",  strval($arr2[0]), "," , strval($arr2[1]),"]\n\n";

            //enable switching
            echo "Pre-enable call value: ", json_encode($U1->getPHEnable()),"\n";
            $U1->setPHEnable();
            echo "Post-enable call value: ", json_encode($U1->getPHEnable()),"\n\n";

            //update password
            $U1->setPassword("M");

            //graph append point (when splice=-3, pushing item 4 to array removes item 1 to maintain array limit)
            /*
                $U1->setWATERGraph(['01', 2.0]);
                $U1->setWATERGraph(['02', 2.2]);
                $U1->setWATERGraph(['03', 2.3]);
                $U1->setWATERGraph(['04', 2.1]);
                echo "Please adjust splice number to -3 to observe intended test results. Current graph points are: \n";
                print_r($U1->getWATERGraph()); 
            */

            //update timers 
            $U1->setLEDTimer([[12,30],[8,0]]);
            print_r($U1->getLEDTimer());
            echo "\n";

            $U1->setFEEDTimer([[12,30],[8,0],[9,30]]);
            $U1->setFEEDTimer([[13,30],[6,0],[7,30]]);
            echo "\n";
            print_r($U1->getFEEDTimer());

            //timezone testing
            echo "Current user timezone is: ",$U1->getTimezone(),"\n";
            $U1->setTimezone("America/Toronto");
            echo "User timezone after switch: ", $U1->getTimezone(),"\n";
            print_r(getdate());
        }      

?>

