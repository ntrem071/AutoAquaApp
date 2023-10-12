<?php

include_once '../backend/includes/users.php';

class UserController {

    private $requestMethod;
    private $userId;
    private $search;
    private $users;
    private $data;


    public function __construct($requestMethod, $userId, $search)
    {

        $this->users = new UserHandler();
        $this->requestMethod = $requestMethod;
        $this->userId = $userId; 
        $this->search = $search;   
        $this->data = json_decode(file_get_contents('php://input')); 
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->userId) {
                    $response = $this->getUser($this->userId);
                } else {
                    echo "LOL";
                    $response = $this->login();
                };
                break;
            case 'POST':
                $response = $this->createUser();
                break;
            case 'PUT':
                $response = $this->updateUserFromRequest($this->userId);
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
                $response['status_code_header'] = 'HTTP/1.1 201 User Created';
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
        echo "LOL";
        if(!empty($this->data->password) && !empty($this->data->name)){
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
        else{
            $response['status_code_header'] = 'HTTP/1.1 406 Unable to login';
            $response['body'] = null;
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



    private function updateUserFromRequest($id)
    {
        $result = $this->users->getAccount($id);
        if(is_null($result)){
            $response['status_code_header'] = 'HTTP/1.1 504 User information not found';
            $response['body'] = null;
            return $response;

        }else if(is_null($this->search)){
            $response['status_code_header'] = 'HTTP/1.1 505 Update item not specified';
            $response['body'] = null;
            return $response;
        }
        else{

            if($this->search="ranges" && !empty($this->data->phRange) && !empty($this->data->ecRange) && !empty($this->data->tempRange)){
                $this->users->setRanges($id, $this->data->phRange, $this->data->ecRange, $this->data->tempRange);
            }

            else if($this->search="phGraph" && !empty($this->data->phGraph)){
                $this->users->setPHGraph($id, $this->data->phGraph);
            }
            else if($this->search="ecGraph" && !empty($this->data->ecGraph)){
                $this->users->setECGraph($id, $this->data->ecGraph);
            }
            else if($this->search="tempGraph" && !empty($this->data->tempGraph)){
                $this->users->setTEMPGraph($id, $this->data->tempGraph);
            }
            else if($this->search="waterGraph" && !empty($this->data->waterGraph)){
                $this->users->setWATERGraph($id, $this->data->waterGraph);
            }

            else if($this->search="phEnable" && !empty($this->data->phEnable)){
                $this->users->setPHEnable($id);
            }
            else if($this->search="ecEnable" && !empty($this->data->ecEnable)){
                $this->users->setECEnable($id);
            }
            else if($this->search="tempEnable" && !empty($this->data->tempEnable)){
                $this->users->setTEMPEnable($id);
            }
            else if($this->search="feedEnable" && !empty($this->data->feedEnable)){
                $this->users->setFEEDEnable($id);
            }
            else if($this->search="ledEnable" && !empty($this->data->ledEnable)){
                $this->users->setLEDEnable($id);
            }

            else if($this->search="feedTimer" && !empty($this->data->feedTimer)){
                $this->users->setFEEDTimer($id, $this->data->feedTimer);
            }
            else if($this->search="ledTimer" && !empty($this->data->ledTimer)){
                $this->users->setLEDTimer($id, $this->data->ledTimer);
            }

            else if($this->search="timezone" && !empty($this->data->timezone)){
                $this->users->setTimezone($id, $this->data->timezone);
            }
            
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