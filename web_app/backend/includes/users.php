<?php

//Intial create user default constants
    define('DEFAULT_PH', [6.0, 7.0]);
    define('DEFAULT_EC', [1.5, 2.5]);
    define('DEFAULT_TEMP', [22.0, 25.0]);


//Add/Modify User obj in User collection
    class UserHandler{
        private $tbl; 

    //Connect to User collection
        public function __construct(){
            require __DIR__ . '/vendor/autoload.php';
            $m= new \MongoDB\Client("mongodb://localhost:27017"); //!!!CONNECT TO WEBSITE!!!
 
            $db = $m->AutoAquaDB;
            $this->tbl = $db->Users;
        }

        //User created on login -> no two emails can be the same
        public function createNewUser($name, $email, $password){
            
            if(is_null($this->tbl->findOne(['email'=>$email]))){
                
                $this->tbl->insertOne(['id'=>new \MongoDB\BSON\ObjectId(),'name'=> $name,'email'=> $email, 'password'=> $password, 
                    'ledTimer'=> [], 'feedTimer'=> [], 'phRange'=> DEFAULT_PH, 'ecRange'=> DEFAULT_EC,'tempRange'=> DEFAULT_TEMP, 
                        'phEnable'=> false,  'ecEnable'=> false,  'tempEnable'=> false, 'feedEnable'=>false, 'ledEnable'=>false,
                            'phGraph'=> [], 'ecGraph'=> [],'tempGraph'=> [], 'waterGraph'=> [], 'timezone'=>'UTC']);
                return true;

            }else{return false;}
        
        }

        //Login with email and password ---- return user id
        public function Login($email, $password){
            $doc= $this->tbl->findOne(['email'=>$email]);


            if(is_null($doc) || (!is_null($doc) && !($doc->password==$password))){
                 return null;
            }else{
                //$this->currDoc = $doc;
                $id =$this->tbl->findOne(['email'=>$email])->id;
                date_default_timezone_set($this->getTimezone($id));
                return $id->__toString();
            }
        }

        //return account doc using id (use json_encode to display)
        public function getAccount($id){
            $obj= new MongoDB\BSON\ObjectId($id);
            return $this->tbl->findOne(['id'=>$obj]);
        }
        //delete user
        public function deleteAccount($id){
            $obj= new MongoDB\BSON\ObjectId($id);
            $this->tbl->deleteOne(['id' => $obj]);
        }


        //FORGOT PASSWORD ONLY
                /*!!!IMPELMENT EXTERNAL EMAIL VERIFICATION PROCESS!!!!*/
        public function setPassword($id, $password){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['password'=>$password]]);
          }

        /*Input param for array: 
                PH[0] = low value(decimal)
                PH[1] = high value(decimal)
        */
        public function setPHRange($id, $PH){
           $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['phRange'=>$PH]]);
        }
        public function setECRange($id, $EC){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['ecRange'=>$EC]]);
        }
        public function setTEMPRange($id, $TE){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['tempRange'=>$TE]]);
        }

        //Enable setters --> no input param, call to function sets to opposite boolean value
        public function setPHEnable($id){ 
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['phEnable'=>!$this->getPHEnable($id)]]);
        }
        public function setECEnable($id){            
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['ecEnable'=>!$this->getECEnable($id)]]);
       }
        public function setTEMPEnable($id){            
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['tempEnable'=>!$this->getTEMPEnable($id)]]);
      }
        public function setFEEDEnable($id){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['feedEnable'=>!$this->getFEEDEnable($id)]]);
       }
        public function setLEDEnable($id){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['ledEnable'=>!$this->getLEDEnable($id)]]);
     } 

        /*Input array param:
            point[0]= timestamp of data collected
            point[1]= data value
          Appends (x,y) pairing to graph array
          Current graph array limit equivalent to 1 year of data if collected hourly (8760 points) -> FIFO

          !!!IMPLEMENT: graph timespan selection for UI (data over 1 week/ 1 month/ 3 months/ etc)!!!
        */     
        public function setPHGraph($id, $point){  //set to lower slice val for function testing  
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$push'=>['phGraph'=>['$each'=>[$point], '$slice'=>-8760]]]);    
      }
        public function setECGraph($id, $point){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$push'=>['ecGraph'=>['$each'=>[$point], '$slice'=>-8760]]]);    
      }
        public function setTEMPGraph($id, $point){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$push'=>['tempGraph'=>['$each'=>[$point], '$slice'=>-8760]]]);    
     }
        public function setWATERGraph($id, $point){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$push'=>['waterGraph'=>['$each'=>[$point], '$slice'=>-8760]]]);    
     }

        /*Input param for array of time pairs (hour, minute):
            arr[0] = LED ON 
            arr[1] = LED OFF 
        */
        public function setLEDTimer($id, $arr){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$push'=>['ledTimer'=>['$each'=>[$arr[0],$arr[1]], '$slice'=>-2]]]);    
      }
        //Input param for array of three optional time pairs (hour, minute)
        public function setFEEDTimer($id, $arr){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$push'=>['feedTimer'=>['$each'=>[$arr[0],$arr[1],$arr[2]], '$slice'=>-3]]]);    
     }

        //Update timezone using string (ie. 'UTC')
            /*IMPLEMENT: USER SELECT FROM DROPDOWN MENU*/
        public function setTimezone($id, $str){
            $this->tbl->updateOne(['email'=>$this->getAccount($id)->email],['$set'=>['timezone'=>$str]]);
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

