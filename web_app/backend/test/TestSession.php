<?php

    include_once '../includes/MySessionHandler.php';

    echo "SESSION HANDLER TESTING: \n\n";

    $sec=5; //sessions expire after 5s, edit value to change speed of execution
    $s1 = new MySessionHandler($sec); 
    $s1->gc();

    /*_____________________________________________TEST_#1________________________________________________________*/
    echo "   CREATION AND GARBAGE COLLECTION\n";
    echo "   View changes in MongoDB Compass, sessions expire after ",$sec,"s with some delay\n\n";
        
        echo "\tCurrent time ", new \MongoDB\BSON\UTCDateTime(time() * 1000),"\n\n";
        $id = $s1->newSession("b", "app");
        echo "\tFirst unique session id: ";
        if(isset($id)){echo $id," expires at: ",$s1->getSessionExpiry($id);}echo "\n"; //same id
        $id = $s1->newSession("b", "app");
        echo "\tReturn for non-unique session: ";
        if(isset($id)){echo $id," expires at: ",$s1->getSessionExpiry($id);}echo "\n";
        $id = $s1->newSession("c", "app");
        echo "\tSecond unique session id: ";
        if(isset($id)){echo $id," expires at: ",$s1->getSessionExpiry($id);}echo "\n";
        $id = $s1->newSession("c", "system");
        echo "\tThird unique session id: ";
        if(isset($id)){echo $id," expires at: ",$s1->getSessionExpiry($id);}echo "\n"; //diff id

        echo "\t\tWaiting ",$sec,"s...\n";
        sleep($sec); //all prev expire

        $id = $s1->newSession("d", "app");
        echo "\tThird unique session id: ";
        if(isset($id)){echo $id," expires at: ",$s1->getSessionExpiry($id);}echo "\n";

        echo "\t\tWaiting ",($sec-1),"s...\n";
        sleep($sec-1); // newest session should not expire
        
        echo "\tChecking for expiry times <= to ",new \MongoDB\BSON\UTCDateTime((time())* 1000),"\n";
        $s1->gc();
        echo "\tGarbage Collection Complete\n\n";


   /*__________________________________________________TEST_#2________________________________________________________*/
    echo "   READING AND SESSION REFRESH\n\n";
        $d = $s1->read($id);// session "d"
        if(isset($d)){echo "\tSUCCESS: ",json_encode($d),"\n";} // success
        else{ echo "EXPIRED\n";} 

        echo "\t\tWaiting ",($sec-1),"s...\n";
        sleep($sec-1);
        $d = $s1->read($id);
        if(isset($d)){echo "\tSUCCESS: ",json_encode($d),"\n"; } // success
        else{ echo "EXPIRED\n";} 

        echo "\t\tWaiting ",($sec),"s...\n";
        sleep($sec);
        $d = $s1->read($id);
        if(isset($d)){echo "\tSUCCESS: ",json_encode($d),"\n"; } // expired
        else{ echo "\tEXPIRED\n\n";} 


    /*__________________________________________________TEST_#2________________________________________________________*/
    echo "   DESTROY SESSION BEFORE TIMEOUT\n\n";
        $id = $s1->newSession("b", "app");
        $b = $s1->read($id);
        if(isset($b)){echo "\tSUCCESS: ",json_encode($b),"\n"; } // success
        else{ echo "\tEXPIRED\n\n";} 
 
        $s1->destroy($id);
        $b = $s1->read($id);
        if(isset($b)){echo "\tSUCCESS: ",json_encode($b),"\n";} // expired
        else{ echo "\tEXPIRED\n";} 

?>