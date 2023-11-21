<?php    
 require __DIR__ . '/vendor/autoload.php';
 
        class MySessionHandler {
    
            private $collection;
            private $sec;
    
            public function __construct($sec){
                $m= new \MongoDB\Client("mongodb://localhost:27017"); 
                $this->collection = $m->AutoAquaDB->Session;
                $this->sec = $sec; 
            }
    
            //on login retrieve new session id string to send to client
            public function newSession($user){
                $id = null;

                if(is_null($this->collection->findOne(['data'=>$user]))){
                    $this->collection->insertOne([
                        'data' => $user,
                        'session_expiry'=> new \MongoDB\BSON\UTCDateTime((time() + $this->sec) * 1000)
                    ]);
                    $id=($this->collection->findOne(['data'=>$user]))->_id;
                }
                return $id; // null if email already used for session
            } 

            //delete session on logout
            public function destroy($id) {
                $this->collection->deleteOne(['_id' => $id]);
                return true;
            } 
    
            //post-login user account retrieval
            public function read($id) {
                $this->updateSessionExpiry($id);//reset expiry time on successful action
                return $this->collection->findOne(['_id' => $id],['projection'=>['_id'=>false]]); // returns null if not found
            } 
    
            //check and delete expired sessions
            public function gc(){
                $currTime = new \MongoDB\BSON\UTCDateTime((time())* 1000);
                $this->collection->deleteMany(['session_expiry' =>  ['$lte'=>$currTime]]);
            } 
            //reset expiry time (call on any successful user interaction with web page)
            public function updateSessionExpiry($id){
                $this->gc();
                $sessionData = $this->collection->findOne(['_id' => $id]);
                if (!is_null($sessionData)){
                    $newExpiryTime = new \MongoDB\BSON\UTCDateTime((time() + $this->sec) * 1000);
                    $this->collection->updateOne(['_id' => $id],['$set' => ['session_expiry' => $newExpiryTime]]);
                } 
            }

            public function getSessionExpiry($id){
                return $this->collection->findOne(['_id' => $id])->session_expiry;
            }
     
    }
?>