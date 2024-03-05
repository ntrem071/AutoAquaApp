#imports
import socket 
import threading

from pymongo.server_api import ServerApi
import pyhid_usb_relay
import time
import pprint

class pyLightServer:
    
    clients_list = []

    last_received_message = ""

    def __init__(self):
        self.server_socket = None
        self.create_listening_server()
    #listen for incoming connection
    def create_listening_server(self):
    
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM) #create a socket using TCP port and ipv4
        local_ip = '127.0.0.1'
        local_port = 10319
        # this will allow you to immediately restart a TCP server
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        # this makes the server listen to requests coming from other computers on the network
        self.server_socket.bind((local_ip, local_port))
        print("Listening for incoming messages..")
        self.server_socket.listen(5) #listen for incomming connections / max 5 clients
        self.receive_control_info_in_a_new_thread()
    #fun to receive new msgs
    def receive_control_info(self, so):
        while True:
            incoming_buffer = so.recv(256) #initialize the buffer
            if not incoming_buffer:
                break
            self.last_received_message = incoming_buffer.decode('utf-8')
            manipulateLED()
            self.inform_the_user(so)  # send to all clients
        so.close()
    #broadcast the message to all clients 
    def inform_the_user(self, senders_socket):
        for client in self.clients_list:
            socket, (ip, port) = client
            if socket is not senders_socket:
                socket.sendall(self.last_received_message.encode('utf-8'))

    def receive_control_info_in_a_new_thread(self):
        while True:
            client = so, (ip, port) = self.server_socket.accept()
            self.add_to_clients_list(client)
            print('Connected to ', ip, ':', str(port))
            t = threading.Thread(target=self.receive_control_info, args=(so,))
            t.start()
    #add a new client 
    def add_to_clients_list(self, client):
        if client not in self.clients_list:
            self.clients_list.append(client)

    # Manipulate LED
    def manipulate_LED(self, LED_status):
        relay = pyhid_usb_relay.find()

        # Example of reading state and toggling relay #1
        if not relay.get_state(2):
            relay.toggle_state(2)
        time.sleep(5)
        
        if relay.get_state(2):
            relay.toggle_state(2)
        time.sleep(5)

        # You can also refer to relays by index
        if relay[2]:
            relay[2] = False
        time.sleep(5)

        if not relay[2]:
            relay[2] = True
        time.sleep(55)


if __name__ == "__main__":
    pyLightServer()
