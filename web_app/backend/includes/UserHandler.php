<?php
 require __DIR__ . '/vendor/autoload.php';
 include_once '../backend/includes/MySessionHandler.php';
//Intial create user default constants
    define('DEFAULT_PH', [6.0, 7.0]);
    define('DEFAULT_EC', [1.6, 2.6]);
    define('DEFAULT_TEMP', [22.0, 25.0]);
    define('DEFAULT_LED', [['00', '00'],['00','00']]);
    define('DEFAULT_FEED', [['00', '00'],['00','00'],['00','00']]);


//Add/Modify User obj in User collection
    class UserHandler{
        private $tbl;
        private $session; 

    //Connect to User collection
        public function __construct(){       
            $m= new \MongoDB\Client("mongodb://localhost:27017"); 
            $this->tbl = $m->AutoAquaDB->Users;

            $this->session = new MySessionHandler(30*60); //set to 30 min expiry
            $this->session->gc();
        }

        public function refresh($id){
            $this->session->updateSessionExpiry($id);
        }
        
        //User created on login -> no two emails can be the same
        public function createNewUser($name, $email, $password){
            
            if(is_null($this->tbl->findOne(['email'=>$email]))){
                
                $this->tbl->insertOne(['name'=> $name,'email'=> $email, 'password'=> $password, 
                    'ledTimer'=> DEFAULT_LED, 'feedTimer'=> DEFAULT_FEED, 'phRange'=> DEFAULT_PH, 'ecRange'=> DEFAULT_EC,'tempRange'=> DEFAULT_TEMP, 
                        'phEnable'=> false,  'ecEnable'=> false,  'tempEnable'=> false, 'feedEnable'=>false, 'ledEnable'=>false,
                            'phGraph'=> [], 'ecGraph'=> [],'tempGraph'=> [], 'waterGraph'=> [], 'timezone'=>'UTC', 'plants'=>[], 'fish'=> null, 
                                'recomPH'=>null, 'recomEC'=>null, 'recomHours'=>null]);
                return true;

            }else{return false;}
        
        }
    
        //Login with email and password ---- return session id
        public function Login($email, $password, $requestor){
            $doc= $this->tbl->findOne(['email'=>$email]);

            if(is_null($doc) || (!is_null($doc) && !($doc->password==$password))){
                 return null;
            }else{
                $id= $this->session->newSession($email, $requestor);
                if(!is_null($id)){
                    date_default_timezone_set($this->getTimezone($id));
                    return $id;
                }else{
                    return "Already Logged In";
                }   
            }
        }

        //End session
        public function Logout($id){
            $this->session->destroy($id);
        }

        //return account doc using id (use json_encode to display)
        public function getAccount($id){
            if(!is_null($this->session->read($id))){
                //$this->testGraphs($id); //REMOVE AFTER TESTING
                return $this->tbl->findOne(['email'=>$this->session->read($id)->data],['projection'=>['_id'=>false,'password'=>false]]);
            }else{
                return null;
            }
        }
        //return shortened page-specific user doc
        public function getUser($id, $sel){
            $user = null;
            
            if($sel=='session'){
                    $cur = (new \MongoDB\BSON\UTCDateTime((time()) * 1000));
                    $ex = $this->session->getSessionExpiry($id);
                    $dif= null;
                    if(isset($ex)){
                         $dif = ((int)($ex->__toString()) - (int)($cur->__toString()));
                    }
                    $user = ['expiry' => $dif]; // returns time to expiry ms
            } 
            elseif(!is_null($this->session->read($id))){
                date_default_timezone_set($this->getTimezone($id));
                //$this->testGraphs($id); //REMOVE AFTER TESTING
                if($sel=='home'){
                    $user= $this->tbl->findOne(['email'=>$this->session->read($id)->data],['projection'=>['_id'=>false,'phGraph'=>true,'ecGraph'=>true,'tempGraph'=>true,'waterGraph'=>true]]);
                }elseif($sel=='user'){
                    $user= $this->tbl->findOne(['email'=>$this->session->read($id)->data],['projection'=>['_id'=>false,'name'=>true,'email'=>true]]);
                }elseif($sel=='behavior'){
                    $user= $this->tbl->findOne(['email'=>$this->session->read($id)->data],['projection'=>['_id'=>false,'email'=>true]]);
                }elseif($sel=='search'){
                    $user= $this->tbl->findOne(['email'=>$this->session->read($id)->data],['projection'=>['_id'=>false,'recomPH'=>true,'recomEC'=>true,'recomHours'=>true,'plants'=>true,'fish'=>true]]);
                }elseif($sel=='settings'){
                    $user= $this->tbl->findOne(['email'=>$this->session->read($id)->data],['projection'=>['_id'=>false,'ledTimer'=>true,'feedTimer'=>true,'phRange'=>true,'ecRange'=>true,'tempRange'=>true,'phEnable'=>true,'ecEnable'=>true,'tempEnable'=>true,'feedEnable'=>true,'ledEnable'=>true, 'timezone'=>true]]);
                }
                     
            }
            return $user;
        }
        //delete user
        public function deleteAccount($id){
                $this->tbl->deleteOne(['email' => $this->session->read($id)->data]);
                $this->session->destroy($id);
        }

        //FORGOT PASSWORD ONLY
                /*!!!IMPELMENT EXTERNAL EMAIL VERIFICATION PROCESS!!!!*/
        public function setPassword($id, $password){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['password'=>$password]]);
          }

        /*Input param for array: 
                PH[0] = low value(decimal)
                PH[1] = high value(decimal)
        */
        public function setPHRange($id, $PH){
           $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['phRange'=>$PH]]);
        }
        public function setECRange($id, $EC){
           $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['ecRange'=>$EC]]);
        }
        public function setTEMPRange($id, $TE){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['tempRange'=>$TE]]);
        }

        //Enable setters --> turn on/off subsystems
        public function setPHEnable($id, $tf){ 
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['phEnable'=>$tf]]);
        }
        public function setECEnable($id, $tf){            
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['ecEnable'=>$tf]]);
       }
        public function setTEMPEnable($id, $tf){            
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['tempEnable'=>$tf]]);
      }
        public function setFEEDEnable($id, $tf){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['feedEnable'=>$tf]]);
       }
        public function setLEDEnable($id, $tf){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['ledEnable'=>$tf]]);
     } 

        /*Input array param:
            point[0]= timestamp of data collected
            point[1]= data value
          Appends (x,y) pairing to graph array
          Current graph array limit equivalent to a months of data if collected hourly (760 points) -> FIFO

          !!!IMPLEMENT: graph timespan selection for UI (data over 1 day/ 1 week/ 1 month/ etc)!!!
        */     
        public function setPHGraph($id, $point){  //set to lower slice val for function testing  
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$push'=>['phGraph'=>['$each'=>[[$this->setDate(), $point]], '$slice'=>-760]]]);    
      }
        public function setECGraph($id, $point){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$push'=>['ecGraph'=>['$each'=>[[$this->setDate(), $point]], '$slice'=>-760]]]);    
      }
        public function setTEMPGraph($id, $point){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$push'=>['tempGraph'=>['$each'=>[[$this->setDate(), $point]], '$slice'=>-760]]]);    
     }
        public function setWATERGraph($id, $point){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$push'=>['waterGraph'=>['$each'=>[[$this->setDate(), $point]], '$slice'=>-760]]]);    
     }
        public function setDate(){
            $arr = getdate();
            return sprintf("%02d/%02d/%04d %02d:%02d:%02d", $arr['mday'], $arr['mon'], $arr['year'],$arr['hours'],$arr['minutes'],$arr['seconds']);
     }
        
        public function testGraphs($id){
            for($i=0;$i<760;$i++){
                $this->setPHGraph($id, (rand(50, 80)/10));
                $this->setECGraph($id, (rand(0, 30)/10));
                $this->setTEMPGraph($id, (rand(9, 31)));
                $this->setWATERGraph($id, (rand(140, 300)));
                sleep(1);
            }
        }
        /*Input param for array of time pairs (hour, minute):
            arr[0] = LED ON 
            arr[1] = LED OFF 
        */
        public function setLEDTimer($id, $arr){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$push'=>['ledTimer'=>['$each'=>[$arr[0],$arr[1]], '$slice'=>-2]]]);    
      }
        //Input param for array of three optional time pairs (hour, minute)
        public function setFEEDTimer($id, $arr){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$push'=>['feedTimer'=>['$each'=>[$arr[0],$arr[1],$arr[2]], '$slice'=>-3]]]);    
     }

        //Update timezone using string (ie. 'UTC')
            /*IMPLEMENT: USER SELECT FROM DROPDOWN MENU*/
        public function setTimezone($id, $str){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['timezone'=>$str]]);
       }
       public function  getTimezoneList(){
            return DateTimeZone::listIdentifiers();
        }

       //set ideal ranges based off user saved plants/fish
       public function setRecomPH($id, $ar){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['recomPH'=>$ar]]);
       }
       public function setRecomEC($id, $ar){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['recomEC'=>$ar]]);
        }
        public function setRecomHours($id, $ar){
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['recomHours'=>$ar]]);
        }


       //Update users saved plant docs using array of names as input
       public function setPlants($id, $arr){
            $plants = new PlantHandler();
            $final=[];
            foreach($arr as $name){
                $item = $plants->getPlantInfo($name);
                if($item->plant == $name){
                    array_push($final,$item);
                }
            }
            $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['plants'=>$final]]);
        }
        //Update users saved fish doc using name as input
        public function setFish($id, $name){
            $fish = new FishHandler();
            $item = $fish->getFishInfo($name);

            if($item->fish == $name){
                $this->tbl->updateOne(['email'=>$this->session->read($id)->data],['$set'=>['fish'=>$item]]);
            }
                     
        }

        //GET() mongodb current document values 
        public function getName($id){return $this->getAccount($id)->name;} 

        public function getPHRange($id){return $this->getAccount($id)->phRange;}
        public function getECRange($id){return $this->getAccount($id)->ecRange;}
        public function getTEMPRange($id){return $this->getAccount($id)->tempRange;}

        public function getPHEnable($id){return $this->getAccount($id)->phEnable;}
        public function getECEnable($id){return $this->getAccount($id)->ecEnable;}
        public function getTEMPEnable($id){return $this->getAccount($id)->tempEnable;}
        public function getFEEDEnable($id){return $this->getAccount($id)->feedEnable;}
        public function getLEDEnable($id){return $this->getAccount($id)->ledEnable;}          

        public function getPHGraph($id){return $this->getAccount($id)->phGraph;}
        public function getECGraph($id){return $this->getAccount($id)->ecGraph;}
        public function getTEMPGraph($id){return $this->getAccount($id)->tempGraph;}
        public function getWATERGraph($id){return $this->getAccount($id)->waterGraph;}

        public function getLEDTimer($id){return $this->getAccount($id)->ledTimer;}
        public function getFEEDTimer($id){return $this->getAccount($id)->feedTimer;}

        public function getTimezone($id){return $this->getAccount($id)->timezone;}

        public function getPlants($id){return $this->getAccount($id)->plants;}
        public function getFish($id){return $this->getAccount($id)->fish;}

        public function getRecomPH($id){return $this->getAccount($id)->recomPH;}
        public function getRecomEC($id){return $this->getAccount($id)->recomEC;}
        public function getRecomHours($id){return $this->getAccount($id)->recomHours;}

        
        //Calculate compatibility ranges and hours from user saved plant/ fish species
        public function calculateIdealPH($id){
            $u1 = $this->getAccount($id);
            $ideal= null;

            if(isset($u1->fish)){
                $ideal =$u1->fish->ph_range;
            }
            if(isset($u1->plants)){
                foreach($u1->plants as $item){
                    if(isset($ideal)){
                        if (($ideal[1] <= $item->ph_range[0]) || ($ideal[0] >= $item->ph_range[1])){
                            $this->setRecomPH($id, null);
                            return; //Mutual Exclusion Compatibility Error                            
                        }else{
                            if(($ideal[0] < $item->ph_range[0])){
                                $ideal[0] = $item->ph_range[0];
                            }
                            if(($ideal[1] > $item->ph_range[1])){
                                $ideal[1] = $item->ph_range[1];
                            }
                        }
                    }else{
                        $ideal= $item->ph_range;
                    }
                }
            }
            $this->setRecomPH($id, $ideal);
            return $ideal;
        }
        public function calculateIdealEC($id){
            $u1 = $this->getAccount($id);
            $ideal= null;
            if(isset($u1->plants)){
                foreach($u1->plants as $item){
                    if(isset($ideal)){
                        if (($ideal[1] <= $item->ec_range[0]) || ($ideal[0] >= $item->ec_range[1])){
                            $this->setRecomEC($id, null);
                            return; //Mutual Exclusion Compatibility Error
                        }else{
                            if(($ideal[0] < $item->ec_range[0])){
                                $ideal[0] = $item->ec_range[0];
                            }
                            if(($ideal[1] > $item->ec_range[1])){
                                $ideal[1] = $item->ec_range[1];
                            }    
                        }

                    }else{
                        $ideal= $item->ec_range;
                    }
                }
            }
            $this->setRecomEC($id, $ideal);
            return $ideal;
        }
        //chooses greater value
        public function calculateHours($id){
            $u1 = $this->getAccount($id);
            $ideal= null;

            if(isset($u1->plants)){
                foreach($u1->plants as $item){
                    if(isset($ideal)){
                        if(($ideal[1] < $item->daily_light_requirement[1])){
                            $ideal = $item->daily_light_requirement;
                        }
                    }else{
                        $ideal= $item->daily_light_requirement;
                    }
                }
            }
            $this->setRecomHours($id, $ideal);
            return $ideal;
        }

        //idea not final - requires testing
         public function checkFEEDTimer($id, $arr){
            $time= getdate();
            foreach($arr as $pair){
                if(($time['minutes'] == $pair[1]) && ($time['hours'] == $pair[0]) && $this->getFEEDEnable($id)){
                    /*!!!IMPLEMENT: call to feed dispensor!!!*/ 
                }
            }
        }

    }

?>

