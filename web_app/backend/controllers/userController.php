<?php

include_once '../backend/includes/UserHandler.php';

class UserController {

    private $requestMethod;
    private $users;
    private $sel1;
    private $sel2;
    private $data;
    private $response;
    

    public function __construct($requestMethod, $sel1, $sel2)
    {
        $this->users = new UserHandler();
        $this->requestMethod = $requestMethod;
        $this->sel1 = $sel1; 
        $this->sel2 = $sel2;   
        $this->data = json_decode(file_get_contents('php://input')); 

        $this->response['status_code_header'] = null;
        $this->response['body'] = null;

        $this->processRequest();
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->sel1) {
                    $this->response = $this->getUser();
                } 
                break;
            case 'POST':
                if($this->sel1== 'create'){
                    $this->response = $this->createUser();
                }else if ($this->sel1 == 'login'){
                    $this->response = $this->login();
                }
                break;
            case 'PUT':
                $this->response = $this->updateUser();
                break;
            case 'DELETE':
                $this->response = $this->deleteUser();
                break;
            default:
                $this->response = $this->notFoundResponse();
                break;
        }

        //return JSON header and body
            header($this->response['status_code_header']);
            if(isset($this->response['body'])){
                echo $this->response['body'];    
            }
    }


    private function createUser() //NO RETURN
    {
        if(!empty($this->data->email) && !empty($this->data->password) && !empty($this->data->name)){
            $flag = $this->users->createNewUser($this->data->name, $this->data->email, $this->data->password);
    
            if(!$flag){
                $this->response['status_code_header'] = 'HTTP/1.1 503 Unable to create item. Email already exists in DB';
            }else if ($flag){
                $this->response['status_code_header'] = 'HTTP/1.1 200 User Created';
            }

        }else{
            $this->response['status_code_header'] = 'HTTP/1.1 400 Unable to create item. Data incomplete';
        } 
        return $this->response;
    }

    //return id string
    private function login()
    {
        if (!isset($this->data->email) || !isset($this->data->password) ) {
            $this->response['status_code_header'] = 'HTTP/1.0 403 Credentials Null';
        }
        else{        
                $result = $this->users->Login($this->data->email, $this->data->password);

                if(is_null($result)){
                    $this->response['status_code_header'] = 'HTTP/1.1 504 Credentials Invalid';
                }else{
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                    $this->response['body'] = json_encode($result);
                }
        } 
        return $this->response;
           
    }
    //return user doc from id string
    private function getUser()
    {
        $result = $this->users->getAccount($this->sel1);
        if(is_null($result)){
            $this->response['status_code_header'] = 'HTTP/1.1 504 User information not found';
        }else{
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
            $this->response['body'] = json_encode($result);       
        }
        return $this->response;
    }



    private function updateUser()
    {
        $id=$this->sel1;
        $result = $this->users->getAccount($id);
        if(is_null($result)){
            $this->response['status_code_header'] = 'HTTP/1.1 504 User information not found';   
                
        }else{
                if($this->sel2=="ranges"){
                    if(isset($this->data->phRange)){$this->users->setPHRange($id, $this->data->phRange);}
                    if(isset($this->data->ecRange)){$this->users->setECRange($id, $this->data->ecRange);}
                    if(isset($this->data->tempRange)){$this->users->setTEMPRange($id, $this->data->tempRange);}
                    if(isset($this->data->phEnable)){$this->users->setPHEnable($id,$this->data->phEnable);}
                    if(isset($this->data->ecEnable)){$this->users->setECEnable($id,$this->data->ecEnable);}
                    if(isset($this->data->tempEnable)){$this->users->setTEMPEnable($id,$this->data->tempEnable);}
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                }                
                elseif($this->sel2=="timezone"){
                    if(isset($this->data->timezone)){$this->users->setTimezone($id, $this->data->timezone);}
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                }
                elseif($this->sel2=="feed"){
                    if(isset($this->data->feedEnable)){$this->users->setFEEDEnable($id,$this->data->feedEnable);}
                    if(isset($this->data->feedTimer)){$this->users->setFEEDTimer($id, $this->data->feedTimer);} 
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';       
                }
                elseif($this->sel2=="enable"){
                    if(isset($this->data->ledEnable)){$this->users->setLEDEnable($id,$this->data->ledEnable);}
                    if(isset($this->data->ledTimer)){$this->users->setLEDTimer($id, $this->data->ledTimer);}
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                }
                elseif($this->sel2=="species"){
                    if(isset($this->data->plants)){$this->users->setPlants($id, $this->data->plants);}
                    if(isset($this->data->fish)){$this->users->setFish($id, $this->data->fish);}
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                }
                else{
                    $this->response['status_code_header'] = 'HTTP/1.1 502 Select Valid Setting Change Option';
                }
        }
        return $this->response;
    }


    private function deleteUser()
    {   
        if(!is_null($this->users->getAccount($this->sel1))){
            $this->users->deleteAccount($this->sel1);
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
        }else{
            $this->response['status_code_header'] = 'HTTP/1.1 405 Invalid ID';
        }

        return $this->response;
    }

    private function notFoundResponse()
    {
        $this->response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        return $this->response;
    }

}


?>