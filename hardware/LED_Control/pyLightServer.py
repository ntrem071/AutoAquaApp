import pymongo
from pymongo.server_api import ServerApi
import pyhid_usb_relay
import time
import pprint

# Connect to the databse
uri = "mongodb+srv://plakalovicdragisa:Savka0303Baba.@capstonecluster.pdmemg1.mongodb.net/?retryWrites=true&w=majority"
lightsClient = pymongo.MongoClient(uri,server_api=ServerApi('1'))
lightDB = lightsClient["lightActivity"]
lightColl = lightDB["activityCollection"]

# Get the current time
x = lightColl.find_one()
print(type(x))


if __name__ == "__main__":
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

    # If you have relay aliases defined in your config file, you can also refer
    # to them in place of the index:
    #relay["raspberrypi4"] = not relay["raspberrypi4"]
