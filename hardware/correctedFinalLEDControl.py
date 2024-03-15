# The relay Vendor_id and Product_id
VENDOR_ID = 0x16C0
PRODUCT_ID = 0x05DF

# Status variables
isLEDonAlready = False
isLEDoffAlready = True

# usb.core.control message variables
USB_TYPE_CLASS = 0x20
USB_ENDPOINT_OUT = 0x00
USB_ENDPOINT_IN = 0x80
USB_RECIP_DEVICE = 0x00
GET_REPORT = 0x1
SET_REPORT = 0x9
USB_HID_REPORT_TYPE_FEATURE = 3
MAIN_REPORT = 0

# Define the exception to handle undetected devices
class RelayNotReadyError(Exception):
	pass

# We are using pyusb library for this
import usb.core
import usb.util
import array # For the array functions

# Load the USB relay
# The find() function is going to return an array of individual relays. There are eight of them
device = usb.core.find(idVendor=VENDOR_ID, idProduct=PRODUCT_ID)


# Check if the USB relay was successfully loaded
if device is None:
        raise RelayNotReadyError("Please check if the relay is connected to the JN")

# Function that turns ON the relay
def turnOnLEDs():
    # Get the current status of the lights
    isLEDonAlready = not isLEDoffAlready

    # Check if the lights are already on
    if isLEDonAlready == True:
        print("The lights are ON already")
        return # Just exit
    
    # Prepare a hex buffer to store control codes
    buf = array.array("B")
    relay_number = 1 # We are using only first relay, so let's specify this
    buf.append(0xFF) # Append hex code to change the relay behaviour depending on what action is asked
    buf.append(relay_number) # Add the relay number to indicate which one

    # Add the terminating characters for each relay
    buf = buf[:]
    while len(buf) < 8:
        buf.append(0x00)

    # Use usb.ctrl_transfer to send the control buffer to the device
    device.ctrl_transfer(
        USB_TYPE_CLASS | USB_RECIP_DEVICE | USB_ENDPOINT_OUT,
        SET_REPORT,
        (USB_HID_REPORT_TYPE_FEATURE << 8) | MAIN_REPORT,
        0, # Relay position index
        buf,# Control buffer
        5000,# Timeout (How long to wait for command to take effect)
    )

    # Change the status variable
    isLEDonAlready = True
    isLedOffAlready = False

# Function that turns OFF the relay
def turnOffLEDs():
    # Get the current status of the lights
    isLEDoffAlready = not isLEDonAlready

    # Check if the lights are already on
    if isLEDoffAlready == True:
        print("The lights are OFF already")
        return # Just exit
    
    # Prepare a hex buffer to store control codes
    buf = array.array("B")
    relay_number = 1 # We are using only first relay, so let's specify this
    buf.append(0xFF) # Append hex code to change the relay behaviour depending on what action is asked (OxFF just flips the relay)
    buf.append(relay_number) # Add the relay number to indicate which one

    # Add the terminating characters for each relay
    buf = buf[:]
    while len(buf) < 8:
        buf.append(0x00)

    # Use usb.ctrl_transfer to send the control buffer to the device
    device.ctrl_transfer(
        USB_TYPE_CLASS | USB_RECIP_DEVICE | USB_ENDPOINT_OUT,
        SET_REPORT,
        (USB_HID_REPORT_TYPE_FEATURE << 8) | MAIN_REPORT,
        0, # Relay position index
        buf,# Control buffer
        5000,# Timeout (How long to wait for command to take effect)
    )

    # Change the status variable
    isLEDoffAlready = True  
    isLEDonAlready = False

        
