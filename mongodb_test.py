import random
import time
import pymongo
from pymongo.server_api import ServerApi

# Connect to the databse
uri = "mongodb+srv://plakalovicdragisa:Savka0303Baba.@capstonecluster.pdmemg1.mongodb.net/?retryWrites=true&w=majority"
testClient = pymongo.MongoClient(uri,server_api=ServerApi('1'))
testDB = testClient["testDatabase"]
testColl = testDB["testCollection"]

# Ask for number of random entries
x = int(input("Please enter the number of entries you want to generate: "))

date1 = input("Enter start datem (YYYY-MM-DD): ")
time1 = input("Enter start time (HH:MM) (24 hour format): ")
date2 = input("Enter end date (YYYY-MM-DD): ")
time2 = input("Enter start time (HH:MM) (24 hour format): ")

# Auxiliary functions
def format_date(arg):
    return [int(d) for d in arg.split("-") if d.isdigit()]

def format_time(arg):
    return [int(t) for t in arg.split(":") if t.isdigit()]

# Function to generate a random timestamp
def genRndTimeStamp(formatedDate1, formatedTime1, formatedDate2, formatedTime2):
    # Generate a random year
    rndYr = random.randint(formatedDate1[0], formatedDate2[0])

    # Generate a random month
    rndMt = 0
    if rndYr == formatedDate1[0]:
        rndMt = random.randint(formatedDate1[1], 12)
    elif rndYr == formatedDate2[0]:
        rndMt = random.randint(1, formatedDate2[1])
    else:
        if (formatedDate1[1] > formatedDate2[1]):
            rndMt = random.randint(formatedDate2[1], formatedDate1[1])
        else:
            rndMt = random.randint(formatedDate1[1], formatedDate2[1])

    # Generate a random day
    rndDay = 0
    check1 = ((rndYr == formatedDate1[0]) and (rndMt == formatedDate1[1]))
    check2 = ((rndYr == formatedDate2[0]) and (rndMt == formatedDate2[1]))

    # Don't generate a day that is before the first date or a day after the second date
    if check1:
        rndDay = random.randint(formatedDate1[2], 31)
    elif check2:
        rndDay = random.randint(0, formatedDate2[2])
    else:
        if (formatedDate1[2] > formatedDate2[2]):
            rndDay = random.randint(formatedDate2[2], formatedDate1[2])
        else:
            rndDay = random.randint(formatedDate1[2], formatedDate2[2])

    # Generate hour
    rndHr = 0
    hr_check1 = (((rndYr == formatedDate1[0]) and (rndMt == formatedDate1[1])) and (rndDay == formatedDate1[2]))
    hr_check2 = (((rndYr == formatedDate2[0]) and (rndMt == formatedDate2[1])) and (rndDay == formatedDate2[2]))

    # Don't generate a hour that is before the first date or a hour after the second date
    if hr_check1:
        rndHr = random.randint(formatedTime1[0], 23)
    elif hr_check2:
        rndHr = random.randint(0, formatedTime2[0])
    else:
        if (formatedTime1[0] > formatedTime2[0]):
            rndHr = random.randint(formatedTime2[0], formatedTime1[0])
        else:
            rndHr = random.randint(formatedTime1[0], formatedTime2[0])
        
    # Generate minute
    rndMin = 0
    min_check1 = (((rndYr == formatedDate1[0]) and (rndMt == formatedDate1[1])) and ((rndDay == formatedDate1[2]) and (rndHr == formatTime1[0])))
    min_check2 = (((rndYr == formatedDate2[0]) and (rndMt == formatedDate2[1])) and ((rndDay == formatedDate2[2]) and (rndHr == formatTime2[0])))

    # Don't generate a hour that is before the first date or a hour after the second date
    if min_check1:
        rndMin = random.randint(formatedTime1[1], 59)
    elif min_check2:
        rndMin = random.randint(0, formatedTime2[1])
    else:
        if (formatedTime1[1] > formatedTime2[1]):
            rndHr = random.randint(formatedTime2[1], formatedTime1[1])
        else:
            rndHr = random.randint(formatedTime1[1], formatedTime2[1])

    # Print the date
    randomTimeStamp = ' '.join((str(rndYr) + '/' + str(rndMt) + '/' + str(rndDay), ' ' + str(rndHr) + ':' + str(rndMin)))
    return randomTimeStamp


# Split the date and time into array of numbers
fmtDt1 = format_date("2000-01-01")
fmtTm1 = format_time("23:40")
fmtDt2 = format_date("2023-10-17")
fmtTm2 = format_time("06:00")

# A loop to create timestamps
for i in range(0, x):
    # Generate a random value reading
    r = random.uniform(6.7, 7.9)
    # Get a date
    ts = genRndTimeStamp(fmtDt1, fmtTm1, fmtDt2, fmtTm2)
    # Insert the (r,ts) into the database
    currDoc = {"Sensor Reading": r, "Timestamp": ts}
    currID = testColl.insert_one(currDoc)

# List the inserted documents
for each in testColl.find():
    print(each)
