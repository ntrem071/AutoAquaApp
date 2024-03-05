import tkinter as tk
import tkinter.font as tkFont
import socket
import atexit
import pymongo
from pymongo.server_api import ServerApi

# Hardcoded instances
fishTankID = "0001"
lightsActive = "OFF"

# Connect to the databse
uri = "mongodb+srv://plakalovicdragisa:Savka0303Baba.@capstonecluster.pdmemg1.mongodb.net/?retryWrites=true&w=majority"
lightsClient = pymongo.MongoClient(uri,server_api=ServerApi('1'))
lightDB = lightsClient["lightActivity"]
testColl = lightDB["activityCollection"]

def ApplyButton_command():
    # Fetch time range
    startDate = StartDateEnter.get()
    startTime = StartTimeEnter.get()
    endDate = EndDateEnter.get()
    endTime = EndTimeEnter.get()

    # Insert the time range into the database
    currDoc = {"Start Date": startDate, "Start Time": startTime, "End Date": startDate, "End Time": startTime}
    currID = testColl.insert_one(currDoc)
   
# Start TKinter
root = tk.Tk()

#setting title
root.title("Automated Aquaponics Growth Lights Control")

#setting window size
width=456
height=290
screenwidth = root.winfo_screenwidth()
screenheight = root.winfo_screenheight()
alignstr = '%dx%d+%d+%d' % (width, height, (screenwidth - width) / 2, (screenheight - height) / 2)
root.geometry(alignstr)
root.resizable(width=False, height=False)

# Fish Tank ID Descriptor
FishTankIDDesc=tk.Label(root)
FishTankIDDesc["bg"] = "#1e20eb"
ft = tkFont.Font(family='Times',size=16)
FishTankIDDesc["font"] = ft
FishTankIDDesc["fg"] = "#ffffff"
FishTankIDDesc["justify"] = "center"
FishTankIDDesc["text"] = "Fishtank ID"
FishTankIDDesc.place(x=20,y=30,width=99,height=30)

# Fish Tank ID Actual
FishTankIDActual=tk.Label(root)
FishTankIDActual["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=16)
FishTankIDActual["font"] = ft
FishTankIDActual["fg"] = "#0300ff"
FishTankIDActual["justify"] = "center"
FishTankIDActual["text"] = fishTankID
FishTankIDActual.place(x=130,y=30,width=78,height=33)

# Label the field for light activity
LightActivityPrompt=tk.Label(root)
LightActivityPrompt["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=10)
LightActivityPrompt["font"] = ft
LightActivityPrompt["fg"] = "#333333"
LightActivityPrompt["justify"] = "center"
LightActivityPrompt["text"] = "Growth Lights currently active?"
LightActivityPrompt.place(x=20,y=80,width=185,height=30)

# Light Activity
LightActivityIndicator=tk.Label(root)
LightActivityIndicator["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=16)
LightActivityIndicator["font"] = ft
LightActivityIndicator["fg"] = "#333333"
LightActivityIndicator["justify"] = "center"
LightActivityIndicator["text"] = lightsActive
LightActivityIndicator.place(x=210,y=80,width=73,height=30)

# Prompt the user to enter time range for lights to be active
AskForTimeRange=tk.Label(root)
AskForTimeRange["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=10)
AskForTimeRange["font"] = ft
AskForTimeRange["fg"] = "#333333"
AskForTimeRange["justify"] = "center"
AskForTimeRange["text"] = "Enter date and time ranges for your lights to be on"
AskForTimeRange.place(x=20,y=120,width=352,height=30)

# Start Date Prompt and Enter
StartDatePrompt=tk.Label(root)
StartDatePrompt["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=10)
StartDatePrompt["font"] = ft
StartDatePrompt["fg"] = "#333333"
StartDatePrompt["justify"] = "center"
StartDatePrompt["text"] = "Start Date (Y/M/D)"
StartDatePrompt.place(x=20,y=160,width=108,height=30)

StartDateEnter=tk.Entry(root)
StartDateEnter["bg"] = "#ffffff"
StartDateEnter["borderwidth"] = "1px"
ft = tkFont.Font(family='Times',size=10)
StartDateEnter["font"] = ft
StartDateEnter["fg"] = "#333333"
StartDateEnter["justify"] = "center"
StartDateEnter["text"] = ""
StartDateEnter.place(x=140,y=160,width=81,height=30)

# Start Time Prompt and Enter
StartTimePrompt=tk.Label(root)
StartTimePrompt["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=10)
StartTimePrompt["font"] = ft
StartTimePrompt["fg"] = "#333333"
StartTimePrompt["justify"] = "center"
StartTimePrompt["text"] = "Start Time (H:M:S)"
StartTimePrompt.place(x=20,y=200,width=107,height=30)

StartTimeEnter=tk.Entry(root)
StartTimeEnter["bg"] = "#ffffff"
StartTimeEnter["borderwidth"] = "1px"
ft = tkFont.Font(family='Times',size=10)
StartTimeEnter["font"] = ft
StartTimeEnter["fg"] = "#333333"
StartTimeEnter["justify"] = "center"
StartTimeEnter["text"] = ""
StartTimeEnter.place(x=140,y=200,width=81,height=30)

# End Date Prompt and Enter
EndDatePrompt=tk.Label(root)
EndDatePrompt["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=10)
EndDatePrompt["font"] = ft
EndDatePrompt["fg"] = "#333333"
EndDatePrompt["justify"] = "center"
EndDatePrompt["text"] = "End Date (Y/M/D)"
EndDatePrompt.place(x=230,y=160,width=113,height=30)

EndDateEnter=tk.Entry(root)
EndDateEnter["bg"] = "#ffffff"
EndDateEnter["borderwidth"] = "1px"
ft = tkFont.Font(family='Times',size=10)
EndDateEnter["font"] = ft
EndDateEnter["fg"] = "#333333"
EndDateEnter["justify"] = "center"
EndDateEnter["text"] = ""
EndDateEnter.place(x=350,y=160,width=83,height=30)

EndTimePrompt=tk.Label(root)
EndTimePrompt["bg"] = "#ffffff"
ft = tkFont.Font(family='Times',size=10)
EndTimePrompt["font"] = ft
EndTimePrompt["fg"] = "#333333"
EndTimePrompt["justify"] = "center"
EndTimePrompt["text"] = "End Time (H:M:S)"
EndTimePrompt.place(x=230,y=200,width=112,height=30)

# End Time Prompt and Enter
EndTimeEnter=tk.Entry(root)
EndTimeEnter["bg"] = "#ffffff"
EndTimeEnter["borderwidth"] = "1px"
ft = tkFont.Font(family='Times',size=10)
EndTimeEnter["font"] = ft
EndTimeEnter["fg"] = "#333333"
EndTimeEnter["justify"] = "center"
EndTimeEnter["text"] = ""
EndTimeEnter.place(x=350,y=200,width=84,height=30)

# Apply Button
ApplyButton=tk.Button(root)
ApplyButton["bg"] = "#f0f0f0"
ft = tkFont.Font(family='Times',size=10)
ApplyButton["font"] = ft
ApplyButton["fg"] = "#000000"
ApplyButton["justify"] = "center"
ApplyButton["text"] = "Apply"
ApplyButton.place(x=190,y=250,width=70,height=25)
ApplyButton["command"] = ApplyButton_command

root.mainloop()
    
