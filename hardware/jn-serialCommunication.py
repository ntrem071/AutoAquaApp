import serial #import PySerial
import time

arduinoUno=serial.Serial(
    port = '/dev/ttyACM0', #subject to change
    baudrate = 9600,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    timeout=5,
    xonxoff=False,
    rtscts=False,
    dsrdtr=False,
    write_timeout=2

)

while True:
    try:
        arduinoUno.write("test from Jetson".encode())
        data = arduinoUno.readLine()

        if data:
            print(data)
        time.sleep(1)
    except Exception as e:
        print(e)
        arduinoUno.close()
