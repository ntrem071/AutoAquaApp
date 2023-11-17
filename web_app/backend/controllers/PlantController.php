<?php

include_once '../backend/includes/PlantHandler.php';
include_once '../backend/includes/UserHandler.php';

class PlantController {

    private $requestMethod;
    private $plants;
    private $sel1;
    private $sel2;
    private $data;
    private $response;
    

    public function __construct($requestMethod, $sel1, $sel2)
    {
        $this->plants = new PlantHandler();
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
                if(isset($this->sel1) && isset($this->sel2)){
                    $this->response = $this->getModifiedList();

                }elseif(isset($this->sel1)){
                    $this->response = $this->getPlant();
                    
                }else{
                    $this->response= $this->getList();
                }
                break;
            case 'POST':
                $this->response = $this->createPlant();
                break;
            case 'PUT':
                $this->response = $this->updatePlant();
                break;
            case 'DELETE':
                $this->response = $this->deletePlant();
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

    private function getModifiedList(){
        
        $fph=false;$fec=false;$fhour=false;
        $arr= explode("_",$this->sel2);

        for($i=0;$i<count($arr);$i++){
            if($arr[$i]=='ph'){$fph=true;}
            if($arr[$i]=='ec'){$fec=true;}
            if($arr[$i]=='hour'){$fhour=true;}
        }

        $users= new UserHandler(); 
        if(($users->getAccount($this->sel1)!=null)){
            $result = $this->plants->getListCompatible($this->sel1, $fph, $fec, $fhour);
            if(is_null($result)){
                $this->response['status_code_header'] = 'HTTP/1.1 504 No Compatible Options';
            }else{
                $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                $this->response['body'] = json_encode($result);
            }
        }else{
            $this->response['status_code_header'] = 'HTTP/1.1 401 Invalid Account ID';
        }
        return $this->response;
        
    }
    private function getList(){
        $result = $this->plants->getListAll();

        if(is_null($result)){
            $this->response['status_code_header'] = 'HTTP/1.1 504 Plant Collection Empty';
        }else{
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
            $this->response['body'] = json_encode($result);
        }
        return $this->response;
    }

    private function getPlant(){
        if (!isset($this->sel1)) {
            $this->response['status_code_header'] = 'HTTP/1.0 403 Name Null';
        }
        else{        
                $result = $this->plants->getPlantInfo($this->sel1);

                if(is_null($result)){
                    $this->response['status_code_header'] = 'HTTP/1.1 504 Plant Does Not Exist';
                }else{
                    $this->response['status_code_header'] = 'HTTP/1.1 200 OK';
                    $this->response['body'] = json_encode($result);
                }
        } 
        return $this->response;
    }

    private function deletePlant(){
        if(is_null($this->plants->getPlantInfo($this->sel1))){
            $this->response['status_code_header'] = 'HTTP/1.1 405 Plant Does Not Exist In Collection';
        }else{
            $this->plants->deletePlant($this->sel1);
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';      
        }
        return $this->response;
    }

    private function updatePlant(){        
        if(isset($this->data->plant) && is_null($this->plants->getPlantInfo($this->data->plant))){
            $this->response['status_code_header'] = 'HTTP/1.1 503 Plant Does Not Exist In Collection';
        } 
        elseif(isset($this->data->plant)&&isset($this->data->daily_light_requirements)&&isset($this->data->ph_range)&&isset($this->data->ec_range)&&isset($this->data->info)){
            $this->plants->updatePlant($this->data->plant, $this->data->daily_light_requirements, $this->data->ph_range,$this->data->ec_range,$this->data->info);
            $this->response['status_code_header'] = 'HTTP/1.1 200 OK';

        }else{$this->response['status_code_header'] = 'HTTP/1.1 402 Missing Inputs';}
        
        return $this->response;
    }

    private function createPlant(){        
        if(isset($this->data->plant) && !is_null($this->plants->getPlantInfo($this->data->plant))){
            $this->response['status_code_header'] = 'HTTP/1.1 502 Plant Already Exists In Collection';
        }
        elseif(isset($this->data->plant)&&isset($this->data->daily_light_requirements)&&isset($this->data->ph_range)&&isset($this->data->ec_range)&&isset($this->data->info)){
                $this->plants->createPlant($this->data->plant, $this->data->daily_light_requirements, $this->data->ph_range,$this->data->ec_range,$this->data->info);
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