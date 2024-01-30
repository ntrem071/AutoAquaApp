#to have port access sudo chmod 666 /dev/ttyHS1

import serial #import PySerial
import datetime
import time
import requests

arduinoMega=serial.Serial(
    port = '/dev/ttyTHS1', #UART ports 8(Rx) & 10(Tx)
    baudrate = 9600
)


while True:
    try:
        data = arduinoMega.readline().rstrip().split(",")
	    #[pH,temperature,water level,EC]
        if data:
            print(datetime.datetime.now())
            print(data)
            probeData = {
                "ph": data[0], 
                "temperature": data[1], 
                "waterLvl": data[2],
                "ec": data[3],
                "timestamp": datetime.datetime.now()
            }
            resp = requests.post('http://yourserver.de/test.php', params=probeData) #server url..?
            print("\n")
        else:
            print("No data found") 
            time.sleep(1)

    except Exception as e:
        print(e)