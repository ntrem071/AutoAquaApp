#to have port access sudo chmod 666 /dev/ttyHS1

#import serial #import PySerial
import datetime
import time
import requests
import struct
import json

# arduinoMega=serial.Serial(
#     port = '/dev/ttyTHS1', #UART ports 8(Rx) & 10(Tx)
#     baudrate = 9600
# )

serverHeader = {         
    #'Authorization':'Basic ' + buf,
    'Accept': 'application/json',
    'Content-Type': 'application/json'   
}

data = {
    "email": "lol@pog.ca",
    "password": "c"
}

headers = {
    'method': 'POST',
    'headers': json.dumps(serverHeader),
    'body': json.dumps(data)
}

#sessionID = requests.post("http://192.168.2.20:8000/index.php/users/na/login", headers=headers)
sessionID = requests.get('http://192.168.2.20:8000', timeout=5)
print(sessionID.status_code)

while False:
    try:
        data = arduinoMega.readline().rstrip().split(",")
	    #[pH,temperature,water level,EC]
        if data:
            print(datetime.datetime.now())
            print(data)
            # probeData = json.dumps({
            #     "phPoint": struct.unpack('d', data[0])[0],
            #     "tempPoint": struct.unpack('d', data[1])[0], 
            #     "waterPoint": struct.unpack('d', data[2])[0],
            #     "ecPoint": struct.unpack('d', data[3])[0]
            # })
            probeData = json.dumps({
                "phPoint": 6.8,
                "tempPoint": 17.4, 
                "waterPoint": 300.0,
                "ecPoint": 2.5
            })
            resp = requests.post('https://ceg4913.duckdns.com/users/'+ sessionID + '/graphs', params=probeData) #server url..?
            print("\n")
        else:
            print("No data found") 
            time.sleep(1)

    except Exception as e:
        print(e)