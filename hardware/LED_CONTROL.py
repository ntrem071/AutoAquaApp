VENDOR_ID = 0x16C0
PRODUCT_ID = 0x05DF

def _get_backend():
    import os

    if os.name != "nt":
        return None

    import usb.backend.libusb1
    import libusb
    import pathlib

    # Manually find the libusb DLL and create a backend using it. I don't know
    # why Python can't find this on its own
    libpath = next(pathlib.Path(libusb.__file__).parent.rglob("x64/libusb-1.0.dll"))
    return usb.backend.libusb1.get_backend(find_library=lambda x: str(libpath))


def find(*, find_all=False, serial=None, bus=None, address=None):
    class match_relay(object):
        def __call__(self, device):
            manufacturer = usb.util.get_string(device, device.iManufacturer)
            product = usb.util.get_string(device, device.iProduct)
            if manufacturer != "www.dcttech.com":
                return False

            if not product.startswith("USBRelay"):
                return False

            if serial is not None:
                c = Controller(device)
                if c.serial != serial:
                    return False

            if bus is not None and device.bus != bus:
                return False

            if address is not None and device.address != address:
                return False

            return True

    devices = usb.core.find(
        backend=_get_backend(),
        find_all=find_all,
        idVendor=VENDOR_ID,
        idProduct=PRODUCT_ID,
        custom_match=match_relay(),
    )

    if devices is None:
        raise DeviceNotFoundError("No device found")

    if find_all:
        devices = [Controller(d) for d in devices]
    else:
        devices = Controller(devices)

    return devices

def onoff(state):
    if state:
        return "on"
    return "off"

def print_status(d):
    print("Board ID=[%s] State: %02x" % (d.serial, d.state))

def pulse_sleep(d, relay):
    time.sleep(d.get_property(relay, "pulse-time", 1.0))

def set_relay(args, value):
    device = find(serial=args.serial)

    device[args.relay] = value

    if args.pulse:
        pulse_sleep(device, args.relay)
        device[args.relay] = not value

def relay_enum(args):
    devices = find(find_all=True)
    if devices is not None:
        for d in devices:
            print_status(d)

def relay_state(args):
    device = find(serial=args.serial)

    print_status(device)
    for i in range(1, device.num_relays + 1):
        print("%d: %s" % (i, onoff(device[i])))
    for a in device.aliases.keys():
        print("%s: %s" % (a, onoff(device[a])))

def relay_on(args):
    set_relay(args, True)

def relay_off(args):
    set_relay(args, False)

def relay_get(args):
    device = find(serial=args.serial)
    print(onoff(device[args.relay]))




