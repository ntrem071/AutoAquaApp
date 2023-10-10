 <?php
    
    include_once '../includes/users.php';
    $colU=new UserHandler(); //establish connection

    $data = json_decode(file_get_contents("php://input"));

    

    //CREATE NEW USER
    if(!empty($data->email) && !empty($data->password) && !empty($data->name)){
        $colU->createNewUser($data->name, $data->email, $data->password);

        if($colU->docNull()){
            http_response_code(503);
            echo json_encode(array("message"=>"Unable to create item. Email already exists in DB")); 
        }else{
            http_response_code(201);
            echo json_encode(array("message"=>"Item was created")); 
        }

    }else{
        http_response_code(400);
        echo json_encode(array("message"=>"Unable to create item. Data incomplete"));
    } 

?>
