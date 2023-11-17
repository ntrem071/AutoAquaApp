<?php

include_once '../backend/includes/FishHandler.php';
include_once '../backend/includes/UserHandler.php';

class FishController {

    private $requestMethod;
    private $fish;
    private $sel1;
    private $data;
    private $response;
    

    public function __construct($requestMethod, $sel1)
    {
        $this->fish = new FishHandler();
        $this->requestMethod = $requestMethod;
        $this->sel1 = $sel1;   
        $this->data = json_decode(file_get_contents('php://input')); 

        $this->response['status_code_header'] = null;
        $this->response['body'] = null;

        $this->processRequest();    
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if(isset($this->sel1)){
                    $this->response = $this->getFish();
                    
                }else{
                    $this->response= $this->getList();
                }
                break;
            case 'POST':
                $this->response = $this->createFish();
                break;
            case 'PUT':
                $this->response = $this->updateFish();
                break;
            case 'DELETE':
                $this->response = $this->deleteFish();
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

    
    private function getList(){
        $result = $this->fish->getList();

        if(is_null($result)){
            $this->response['status_code_header'] = 'HTTP/1.1 504 Fish Collection Empty';
        }else{
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
            $this->response['body'] = json_encode($result);
        }
        return $this->response;
    }

    private function getFish(){
        if (!isset($this->sel1)) {
            $this->response['status_code_header'] = 'HTTP/1.0 403 Name Null';
        }
        else{        
                $result = $this->fish->getFishInfo($this->sel1);

                if(is_null($result)){
                    $this->response['status_code_header'] = 'HTTP/1.1 504 Fish Does Not Exist';
                }else{
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                    $this->response['body'] = json_encode($result);
                }
        } 
        return $this->response;
    }

    private function deleteFish(){
        if(is_null($this->fish->getFishInfo($this->sel1))){
            $this->response['status_code_header'] = 'HTTP/1.1 405 Fish Does Not Exist In Collection';
        }else{
            $this->fish->deleteFish($this->sel1);
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';      
        }
        return $this->response;
    }

    private function updateFish(){        
        if(isset($this->data->fish) && is_null($this->fish->getFishInfo($this->data->fish))){
            $this->response['status_code_header'] = 'HTTP/1.1 503 Fish Does Not Exist In Collection';
        } 
        elseif(isset($this->data->fish)&&isset($this->data->tank_size)&&isset($this->data->ph_range)&&isset($this->data->temp_range)&&isset($this->data->info)){
            $this->fish->updateFish($this->data->fish, $this->data->tank_size, $this->data->ph_range,$this->data->temp_range,$this->data->info);
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';

        }else{$this->response['status_code_header'] = 'HTTP/1.1 402 Missing Inputs';}
        
        return $this->response;
    }

    private function createFish(){        
        if(isset($this->data->fish) && !is_null($this->fish->getFishInfo($this->data->fish))){
            $this->response['status_code_header'] = 'HTTP/1.1 502 Fish Already Exists In Collection';
        }
        elseif(isset($this->data->fish)&&isset($this->data->tank_size)&&isset($this->data->ph_range)&&isset($this->data->temp_range)&&isset($this->data->info)){
                $this->fish->createFish($this->data->fish, $this->data->tank_size, $this->data->ph_range,$this->data->temp_range,$this->data->info);
                $this->response['status_code_header'] = 'HTTP/1.1 200 OK';

        }else{$this->response['status_code_header'] = 'HTTP/1.1 402 Missing Inputs';}
        
        return $this->response;
    }

    private function notFoundResponse(){
        $this->response['status_code_header'] = 'HTTP/1.1 404 Not Found';
        return $this->response;
    }

}


?>