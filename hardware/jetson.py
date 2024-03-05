#to have port access sudo chmod 666 /dev/ttyHS1

import serial #import PySerial
import datetime
import time
import requests
import struct
import json
#import msvcrt
import pytz
import threading
import camera

#arduinoMega=serial.Serial(
 #   port = '/dev/ttyTHS1', #UART ports 8(Rx) & 10(Tx)
  #  baudrate = 9600
#)

ardnoMData = {
	"feed": 0,
	"pump": [
		{
            "pH": 0,
        },		
		{
            "ec": 0,
        }
	]	
}

#Server headers
serverHeader = {
	#'Authorization': 'Basic' + buf,
	'Accept': 'application/json',
	'Content-Type': 'application/json'
}

#User Credentials
userCreds = json.dumps({
    "email": "lol@pog.ca",
    "password": "c"
})

#Get the session ID
getSID = requests.post('https://ceg4913-server.duckdns.org/users/na/login/system', headers=serverHeader, data=userCreds, timeout=5)
print(getSID.status_code)
sessionId = json.loads(getSID.text)["sessionId"]
print(sessionId)

#Get the initial values for data collection time
userSettings = requests.get('https://ceg4913-server.duckdns.org/users/'+sessionId+'/settings', headers=serverHeader, timeout=5)
userSettings = json.loads(userSettings.text)
print(userSettings)
uLEDtimerOFF = userSettings["ledTimer"][0]#first index of the timer is OFF
uLEDtimerON = userSettings["ledTimer"][1]#second index of the timer is ON
uLEDtimerEN = userSettings["ledEnable"]#enable of the leds
uFEEDtimerON = userSettings["feedTimer"]#array of the time for enable feed
uFEEDtimerEN = userSettings["feedEnable"]#enable of the feed
uphRange = userSettings["phRange"]#pH range
upHEnable = userSettings["phEnable"]#pH enable
utempRange = userSettings["tempRange"]#temperature range
utempEnable = userSettings["tempEnable"]#temperature enable
uecRange = userSettings["ecRange"]#ec range
uecEnable = userSettings["ecEnable"]#ec enable
uTimezone = userSettings["timezone"]#timezone of user

timezone = pytz.timezone(uTimezone)

ledONtimer = datetime.datetime.now(timezone).replace(hour=int(uLEDtimerON[0]), minute=int(uLEDtimerON[1]), second=0, microsecond=0)
ledOFFtimer = datetime.datetime.now(timezone).replace(hour=int(uLEDtimerOFF[0]), minute=int(uLEDtimerOFF[1]), second=0, microsecond=0)

#Function to get the probe data
def sendProbeData():
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
			
            #Send data to the server
			resp = requests.put('https://ceg4913-server.duckdns.org/users/'+ sessionId + '/graphs', data=probeData, headers=serverHeader, timeout=5) 
			print(resp.status_code)

			if(resp.status_code == 200):
				print("Data successfully!")
		else:
			print("No data found") 
			time.sleep(1)
	except Exception as e:
		print(e)

timerProbe = threading.Timer(3600, sendProbeData)
timerCamera = threading.Timer(3600, camera)

timerProbe.start()
timerCamera.start()

#While loop that synchronizes the data collection time
while True:
	print(userSettings)
	now = datetime.datetime.now(timezone)
	# if(msvcrt.kbhit()):
	# 	if(msvcrt.getch() == 'q'):
	# 		break
	# 	else:
	# 		print('system continues')
	# else:
	if(uLEDtimerEN):
		print('leds toggle')
		if(now == ledONtimer):
			print('turn leds ON')
		elif(now == ledOFFtimer):
			print('turn leds OFF')
	else:
		print('User has disabled the LEDs')
	if(uFEEDtimerEN):
		print('Feed enable')
		for t in uFEEDtimerON:
			fTime = datetime.datetime.now(timezone).replace(hour=int(t[0]), minute=int(t[1]), second=0, microsecond=0)
			if(fTime == now):
				print('sent feed time flag')
				ardnoMData["feed"] = 1; 
	else:
		print('User has disabled the automatic feed feature')
	if(upHEnable):
		print('Dosing pH')
	else:
		print('User has disabled the pH dosing system')
	if(uecEnable):
		print('Dosing ec')
	else:
		print('User has disabled ec')
		
           

requests.post('https://ceg4913-server.duckdns.org/users/' + sessionId + '/logout/system', headers=serverHeader, timeout=5)