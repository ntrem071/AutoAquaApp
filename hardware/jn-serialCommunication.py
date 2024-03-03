#to have port access sudo chmod 666 /dev/ttyHS1

import serial #import PySerial
import datetime
import time
import requests
import struct
import json

#arduinoMega=serial.Serial(
 #   port = '/dev/ttyTHS1', #UART ports 8(Rx) & 10(Tx)
  #  baudrate = 9600
#)

serverHeader = {
	#'Authorization': 'Basic' + buf,
	'Accept': 'application/json',
	'Content-Type': 'application/json'
}

userCreds = json.dumps({
    "email": "lol@pog.ca",
    "password": "c"
})

getSID = requests.post('https://ceg4913-server.duckdns.org/users/na/login/system', headers=serverHeader, data=userCreds, timeout=5)
print(getSID.status_code)
sessionId = json.loads(getSID.text)["sessionId"]
print(sessionId)

while True:
	try:
        #data = arduinoMega.readline().rstrip().split(",")
	    #[pH,temperature,water level,EC]
		if True: #True when no arduino to test, otherwise -> data[0] && data[1] && data[2] && data[3]
			print(datetime.datetime.now())
			#print(data)
			# probeData = json.dumps({
			#     "phPoint": struct.unpack('d', data[0])[0],
			#     "tempPoint": struct.unpack('d', data[1])[0], 
			#     "waterPoint": struct.unpack('d', data[2])[0],
			#     "ecPoint": struct.unpack('d', data[3])[0]
			# })

			#temporary data when arduino not accessible (only for testing the graph datapoints!!!)
			probeData = json.dumps({
			"phPoint": 6.8,
			"tempPoint": 17.4, 
			"waterPoint": 300.0,
			"ecPoint": 2.5
			})
			resp = requests.put('https://ceg4913-server.duckdns.org/users/'+ sessionId + '/graphs', data=probeData, headers=serverHeader, timeout=5) 
			print(resp.status_code)

			if(resp.status_code == 200):
				print("Collected data successfully!")
			time.sleep(3)
		else:
			print("No data found") 
			time.sleep(1)

	except Exception as e:
		print(e)

requests.post('https://ceg4913-server.duckdns.org/users/' + sessionId + '/login/system', headers=serverHeader, data=userCreds, timeout=5)