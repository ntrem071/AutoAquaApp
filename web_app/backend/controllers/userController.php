<?php

include_once '../backend/includes/users.php';

class UserController {

    private $requestMethod;
    private $userId;
    private $users;
    private $data;
    private $select;
    

    public function __construct($requestMethod, $userId, $select)
    {
        $this->users = new UserHandler();
        $this->requestMethod = $requestMethod;
        $this->userId = $userId; 
        $this->select = $select;   
        $this->data = json_decode(file_get_contents('php://input')); 
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->userId) {
                    $response = $this->getUser($this->userId);
                } 
                break;
            case 'POST':
                if($this->select=='0'){
                    $response = $this->createUser();
                }else if ($this->select == '1'){
                    $response = $this->login();
                }
                break;
            case 'PUT':
                $response = $this->updateUser($this->userId);
                break;
            case 'DELETE':
                $response = $this->deleteUser($this->userId);
                break;
            default:
                $response = $this->notFoundResponse();
                break;
        }
        header($response['status_code_header']);
        if ($response['body']) {
            echo $response['body'];
        }
    }


    private function createUser() //NO RETURN
    {
        if(!empty($this->data->email) && !empty($this->data->password) && !empty($this->data->name)){
            $flag = $this->users->createNewUser($this->data->name, $this->data->email, $this->data->password);
    
            if($flag===false){
                $response['status_code_header'] = 'HTTP/1.1 503 Unable to create item. Email already exists in DB';
                $response['body'] = null;
                return $response;
            }else{
                $response['status_code_header'] = 'HTTP/1.1 200 User Created';
                $response['body'] = null;
                return $response;
            }

        }else{
            $response['status_code_header'] = 'HTTP/1.1 400 Unable to create item. Data incomplete';
            $response['body'] = null;
            return $response;
        } 
    }

    //return id string
    private function login()
    {
        if (!isset($this->data->email) || !isset($this->data->password) ) {
            $response['status_code_header'] = 'HTTP/1.0 403 Credentials Null';
            $response['body'] = null;
            return $response;
        }
        else{        
                $result = $this->users->Login($this->data->email, $this->data->password);

                if(is_null($result)){
                    $response['status_code_header'] = 'HTTP/1.1 504 Credentials Invalid';
                    $response['body'] = null;
                    return $response;
                }

                $response['status_code_header'] = 'HTTP/1.1 200 OK';
                $response['body'] = json_encode($result);
                return $response;
        } 
           
    }
    //return user doc from id string
    private function getUser($id)
    {
        $result = $this->users->getAccount($id);
        if(is_null($result)){
            $response['status_code_header'] = 'HTTP/1.1 504 User information not found';
            $response['body'] = null;
            return $response;
        }
        $response['status_code_header'] = 'HTTP/1.1 200 OK';
        $response['body'] = json_encode($result);
        return $response;
    }



    private function updateUser($id)
    {
        $result = $this->users->getAccount($id);
        if(is_null($result)){
            $response['status_code_header'] = 'HTTP/1.1 504 User information not found';
            $response['body'] = null;
            return $response;

        }
        else{
            //send all data values, set to null if unchanged
            if(isset($this->data->phRange)){$this->users->setPHRange($id, $this->data->phRange);}
            if(isset($this->data->ecRange)){$this->users->setECRange($id, $this->data->ecRange);}
            if(isset($this->data->tempRange)){$this->users->setTEMPRange($id, $this->data->tempRange);}

            if(isset($this->data->phEnable)){$this->users->setPHEnable($id);}
            if(isset($this->data->ecEnable)){$this->users->setECEnable($id);}
            if(isset($this->data->tempEnable)){$this->users->setTEMPEnable($id);}
            if(isset($this->data->feedEnable)){$this->users->setFEEDEnable($id);}
            if(isset($this->data->ledEnable)){$this->users->setLEDEnable($id);}

            if(isset($this->data->feedTimer)){$this->users->setFEEDTimer($id, $this->data->feedTimer);}
            if(isset($this->data->ledTimer)){$this->users->setLEDTimer($id, $this->data->ledTimer);}

            if(isset($this->data->timezone)){$this->users->setTimezone($id, $this->data->timezone);}
            
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = null;
            return $response;
        }
    }


    private function deleteUser($id)
    {
        $this->users->deleteAccount($id);
        
        if(is_null($this->users->getAccount($id))){
            $response['status_code_header'] = 'HTTP/1.1 200 OK';
            $response['body'] = null;
            return $response;
        }

        $response['status_code_header'] = 'HTTP/1.1 405 Invalid ID';
        $response['body'] = null;
        return $response;
    }

    private function notFoundResponse()
    {
        $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        $response['body'] = null;
        return $response;
    }

}


?>