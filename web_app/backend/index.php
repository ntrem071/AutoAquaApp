<?php
    
    include_once '../backend/controllers/UserController.php';
    include_once '../backend/controllers/PlantController.php';
    include_once '../backend/controllers/FishController.php';

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode( '/', $uri );


    /* //Authorization header testing for login as GET request
    $headers = apache_request_headers();
    foreach ($headers as $header => $value) {
        if($header=="Authorization"){
            header("Client-$header: $value");
        }
    }
    if(isset($_SERVER['HTTP_AUTHORIZATION'])){
        list($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']) = explode(':' , base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'], 6)));
        header("Test-Auth: ", $_SERVER['HTTP_AUTHORIZATION']);
    }else{
        header("HTTP/1.1 406 nope");
        exit();
    }*/



    // endpoints start with: users, fish, or plants
    if (($uri[1] == 'users') || ($uri[1] == 'fish') ||($uri[1] == 'plants')){
        
        //GET, PUT, POST, DELETE, etc.
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        //path selectors
        $sel1=null;
        if(isset($uri[2])){$sel1=$uri[2];}
        $sel2=null;
        if(isset($uri[3])){$sel2=$uri[3];}
        

        //Select collection and controller
        switch($uri[1]){
            case 'users':
                $controllerU = new UserController($requestMethod, $sel1, $sel2);
                break;
            case 'fish':
                $controller = new FishController($requestMethod, $sel1);
                break;
            case 'plants':
                $controllerP = new PlantController($requestMethod, $sel1, $sel2);
                break;
        }

    }else{
        header("HTTP/1.1 404 Not Found");
        exit();

    }
   
?>

