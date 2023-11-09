<?php

include_once '../backend/includes/UserHandler.php';

class UserController {

    private $requestMethod;
    private $userId;
    private $users;
    private $data;
    private $select;
    private $response;
    

    public function __construct($requestMethod, $userId, $select)
    {
        $this->users = new UserHandler();
        $this->requestMethod = $requestMethod;
        $this->userId = $userId; 
        $this->select = $select;   
        $this->data = json_decode(file_get_contents('php://input')); 

        $this->response['status_code_header'] = null;
        $this->response['body'] = null;

        $this->processRequest();
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->userId) {
                    $this->response = $this->getUser($this->userId);
                } 
                break;
            case 'POST':
                if($this->select== 0){
                    $this->response = $this->createUser();
                }else if ($this->select == 1){
                    $this->response = $this->login();
                }
                break;
            case 'PUT':
                $this->response = $this->updateUser($this->userId);
                break;
            case 'DELETE':
                $this->response = $this->deleteUser($this->userId);
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
                    $this->response['status_code_header'] = 'HTTP/1.1 200 Login Successful';
                    $this->response['body'] = json_encode($result);
                }
        } 
        return $this->response;
           
    }
    //return user doc from id string
    private function getUser($id)
    {
        $result = $this->users->getAccount($id);
        if(is_null($result)){
            $this->response['status_code_header'] = 'HTTP/1.1 504 User information not found';
        }else{
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
            $this->response['body'] = json_encode($result);       
        }
        return $this->response;
    }



    private function updateUser($id)
    {
        $result = $this->users->getAccount($id);
        if(is_null($result)){
            $this->response['status_code_header'] = 'HTTP/1.1 504 User information not found';   
                
        }else{
            if(isset($this->select)){
                if($this->select==2){
                    if(isset($this->data->phRange)){$this->users->setPHRange($id, $this->data->phRange);}
                    if(isset($this->data->ecRange)){$this->users->setECRange($id, $this->data->ecRange);}
                    if(isset($this->data->tempRange)){$this->users->setTEMPRange($id, $this->data->tempRange);}
                    if(isset($this->data->phEnable)){$this->users->setPHEnable($id);}
                    if(isset($this->data->ecEnable)){$this->users->setECEnable($id);}
                    if(isset($this->data->tempEnable)){$this->users->setTEMPEnable($id);}
                }                
                if($this->select==3){
                    if(isset($this->data->timezone)){$this->users->setTimezone($id, $this->data->timezone);}
                }
                if($this->select==4){
                    if(isset($this->data->feedEnable)){$this->users->setFEEDEnable($id);}
                    if(isset($this->data->feedTimer)){$this->users->setFEEDTimer($id, $this->data->feedTimer);}        
                }
                if($this->select==5){
                    if(isset($this->data->ledEnable)){$this->users->setLEDEnable($id);}
                    if(isset($this->data->ledTimer)){$this->users->setLEDTimer($id, $this->data->ledTimer);}
                }
                $this->response['status_code_header'] = 'HTTP/1.1 200 OK';

            }else{
                $this->response['status_code_header'] = 'HTTP/1.1 502 Select Valid Setting Change Option';
            }
        }
        return $this->response;
    }


    private function deleteUser($id)
    {
        $this->users->deleteAccount($id);
        
        if(is_null($this->users->getAccount($id))){
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