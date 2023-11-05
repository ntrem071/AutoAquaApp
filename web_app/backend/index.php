<?php
    
    //include_once '../backend/includes/users.php';
    include_once '../backend/controllers/userController.php';

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = explode( '/', $uri );
    
    //no header access ??
    foreach (getallheaders() as $header) {
        header("headers: ", $header);
    }
    
    if(isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) || isset($_SERVER['HTTP_AUTHORIZATION'])){
        list($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']) = explode(':' , base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'], 6)));
        //header("Username: " . $_SERVER["PHP_AUTH_USER"] . ", Password: " . $_SERVER["PHP_AUTH_PW"]);
    }elseif(isset($_SERVER['HTTP_X_REQUESTED_WITH'])){
        header("HTTP/1.1 404 nope");
        exit();
    }else{
        header("HTTP/1.1 406 nope");
        exit();
    }


    // endpoints start with: users, fish, or plants
    if (($uri[1] == 'users') || ($uri[1] == 'fish') ||($uri[1] == 'plants')){
        
        $requestMethod = $_SERVER["REQUEST_METHOD"];

        $email=null;$pass=null;
        if(isset($_SERVER["PHP_AUTH_USER"]) && isset($_SERVER["PHP_AUTH_PW"])){
            $email = $_SERVER["PHP_AUTH_USER"]; 
            $pass = $_SERVER["PHP_AUTH_PW"];
        }
        
        $userId = null; 
        if (isset($uri[2])) {
            $userId = (int) $uri[2];
        }
        $search = null; 
        if (isset($uri[3])) {
            $search = (int) $uri[3];
        }

        if($uri[1] == 'users'){
            echo "->", json_encode(($uri[1] == 'users')) ;
            $controller = new UserController($requestMethod, $userId, $search, $email, $pass);
            $controller->processRequest();
        }
        else if($uri[1] == 'fish'){
            return 0;
        }
        else if($uri[1] == 'plants'){
            return 0;
        }

    }else{
        header("HTTP/1.1 404 Not Found");
        exit();

    }
   
?>

