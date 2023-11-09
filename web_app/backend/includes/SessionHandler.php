<?php

    class SessionHandler implements \SessionHandlerInterface{

        public function close(): bool {return 0;}
        public function destroy(string $id): bool {return 0;} 
        public function gc(int $max_lifetime): int|false {return 0;} 
        public function open(string $path, string $name): bool {return 0;} 
        public function read(string $id): string|false {return 0;} 
        public function write(string $id, string $data): bool {return 0;} 

    }
?>