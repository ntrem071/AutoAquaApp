#to have port access sudo chmod 666 /dev/ttyTHS1

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
import correctedFinalLEDControl

arduinoMega=serial.Serial(
   port = '/dev/ttyTHS1', #UART ports 8(Rx) & 10(Tx)
   baudrate = 9600
)

ardnoMData = {
    "feed": 0,
    "pHmin": 6.0,
    "pHmax": 7.0,
    "ECmin": 1.6
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

feedAckNot = 1 #signal to indicate the feed has been executed

#no need for timezone since we just want to see if an hour passed but just in case
hourTimer = datetime.datetime.now(timezone).strftime('%H:%M:%S')
updateUserValuesTimer = hourTimer
print(hourTimer)

#Function to get the probe data
def sendProbeData():
    try:
        data = arduinoMega.readline().decode('utf-8').rstrip().split(",")
        #[pH,temperature,water level,EC,feedACK,feedEmpty]
        if data: #True when no arduino to test, otherwise -> data[0] && data[1] && data[2] && data[3]
            print(datetime.datetime.now())
            print(data)
            print(type(data))
            probeData = json.dumps({
                "phPoint": float(data[0]),
                "tempPoint": float(data[1]), 
                "waterPoint": float(data[2]),
                "ecPoint": float(data[3])
            })

            #temporary data when arduino not accessible (only for testing the graph datapoints!!!)
            # probeData = json.dumps({
            #     "phPoint": 6.8,
            #     "tempPoint": 17.4, 
            #     "waterPoint": 300.0,
            #     "ecPoint": 2.5
            # })
            
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

def updateUserSettings():
    #Get the initial values for data collection time
    globals()["userSettings"] = requests.get('https://ceg4913-server.duckdns.org/users/'+sessionId+'/settings', headers=serverHeader, timeout=5)
    globals()["userSettings"] = json.loads(userSettings.text)
    print('Updated User Update: ' + str(userSettings))
    globals()["uLEDtimerOFF"] = userSettings["ledTimer"][0]#first index of the timer is OFF
    globals()["uLEDtimerON"] = userSettings["ledTimer"][1]#second index of the timer is ON
    globals()["uLEDtimerEN"] = userSettings["ledEnable"]#enable of the leds
    globals()["uFEEDtimerON"] = userSettings["feedTimer"]#array of the time for enable feed
    globals()["uFEEDtimerEN"] = userSettings["feedEnable"]#enable of the feed
    globals()["uphRange"] = userSettings["phRange"]#pH range
    globals()["upHEnable"] = userSettings["phEnable"]#pH enable
    globals()["utempRange"] = userSettings["tempRange"]#temperature range
    globals()["utempEnable"] = userSettings["tempEnable"]#temperature enable
    globals()["uecRange"] = userSettings["ecRange"]#ec range
    globals()["uecEnable"] = userSettings["ecEnable"]#ec enable
    globals()["uTimezone"] = userSettings["timezone"]#timezone of user

    if(arduinoMega.writable()):
        arduinoMega.write((str(ardnoMData["feed"]) + ',').encode())
        arduinoMega.write((str(ardnoMData["pHmin"]) + ',').encode())
        arduinoMega.write((str(ardnoMData["pHmax"]) + ',').encode())
        arduinoMega.write((str(ardnoMData["ECmin"])).encode())
        print(str(ardnoMData))

arduinoMega.write((str(1) + ',').encode())
arduinoMega.write((str(ardnoMData["pHmin"]) + ',').encode())
arduinoMega.write((str(ardnoMData["pHmax"]) + ',').encode())
arduinoMega.write((str(ardnoMData["ECmin"])).encode())
print(str(ardnoMData))

#While loop that synchronizes the data collection time
while True:
    now = datetime.datetime.now(timezone)
    nowSTRP = now.strftime('%H:%M:%S')
    print(now.strftime('%H:%M:%S'))
    # if(msvcrt.kbhit()):
    # 	if(msvcrt.getch() == 'q'):
    # 		break
    # 	else:
    # 		print('system continues')
    # else:
    if(uLEDtimerEN):
        print('leds toggle')
        ledONTime1 = datetime.datetime.now(timezone).replace(hour=int(uLEDtimerON[0]), minute=int(uLEDtimerON[1]), second=0, microsecond=0)
        ledONTime2 = datetime.datetime.now(timezone).replace(hour=int(uLEDtimerON[0]), minute=int(uLEDtimerON[1]) + 1, second=0, microsecond=0)
        ledOFFTime1 = datetime.datetime.now(timezone).replace(hour=int(uLEDtimerOFF[0]), minute=int(uLEDtimerOFF[1]), second=0, microsecond=0)
        ledOFFTime2 = datetime.datetime.now(timezone).replace(hour=int(uLEDtimerOFF[0]), minute=int(uLEDtimerOFF[1]) + 1, second=0, microsecond=0)
        if(ledONTime1 <= now <= ledONTime2):
            turnOnLEDs()
        elif(ledOFFTime1 <= now <= ledOFFTime2):
            turnOffLEDs()
    else:
        print('User has disabled the LEDs')
    if(uFEEDtimerEN):
        print('Feed enable')
        for t in uFEEDtimerON:
            fTime1 = datetime.datetime.now(timezone).replace(hour=int(t[0]), minute=int(t[1]), second=0, microsecond=0)
            fTime2 = datetime.datetime.now(timezone).replace(hour=int(t[0]), minute=int(t[1]) + 1, second=0, microsecond=0)
            if((fTime1 <= now <= fTime2) & feedAckNot):
                print('sent feed time flag')
                ardnoMData["feed"] = 1
                if(arduinoMega.writable()):
                    arduinoMega.write((str(ardnoMData["feed"]) + ',').encode())
                    arduinoMega.write((str(ardnoMData["pHmin"]) + ',').encode())
                    arduinoMega.write((str(ardnoMData["pHmax"]) + ',').encode())
                    arduinoMega.write((str(ardnoMData["ECmin"])).encode())
                    print(str(ardnoMData))
    else:
        print('User has disabled the automatic feed feature')
    if(upHEnable):
        print('Dosing pH')
        ardnoMData["pHmin"] = uphRange[0]
        ardnoMData["pHmax"] = uphRange[1]
    else:
        print('User has disabled the pH dosing system')
        ardnoMData["pHmin"] = 'null'
        ardnoMData["pHmax"] = 'null'
    if(uecEnable):
        print('Dosing ec')
        ardnoMData["ECmin"] = uecRange[0]
        ardnoMData["ECmax"] = uecRange[1]
    else:
        print('User has disabled ec')
        ardnoMData["ECmin"] = 'null'
        ardnoMData["ECmax"] = 'null'
    
    diffHour = (datetime.datetime.strptime(nowSTRP, '%H:%M:%S') - datetime.datetime.strptime(hourTimer, '%H:%M:%S')).total_seconds()/1200
    diffMin = (datetime.datetime.strptime(nowSTRP, '%H:%M:%S') - datetime.datetime.strptime(updateUserValuesTimer, '%H:%M:%S')).total_seconds()/60
    print(diffMin)
    if(diffMin > 2):
        #updateUserSettings()
        sendProbeData()
        updateUserValuesTimer = datetime.datetime.now(timezone).strftime('%H:%M:%S')
    if(diffHour > 1):
        sendProbeData()
        #camera
        hourTimer = datetime.datetime.now(timezone).strftime('%H:%M:%S')
        
requests.post('https://ceg4913-server.duckdns.org/users/' + sessionId + '/logout/system', headers=serverHeader, timeout=5)
