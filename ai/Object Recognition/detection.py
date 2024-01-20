import jetson.inference
import jetson.utils

net = jetson.inference.detectNet("ssd-mobilenet-v2", threshold=0.5) #more threshold deects less objects

cameraYX = jetson.utils.gstCamera(1280, 720, "/dev/video1") #to know where the camera will be, run comand in terminal v4l2-ctl --list-devices
                                                            #to know the resolution supported of the camera, run command v4l2-ctl --device /dev/video1 --list-formats-ext
cameraYZ = jetson.utils.gstCamera(1280, 720, "/dev/video1") #to know where the camera will be, run comand in terminal v4l2-ctl --list-devices
                                                          #to know the resolution supported of the camera, run command v4l2-ctl --device /dev/video1 --list-formats-ext

display = jetson.utils.glDisplay()

while display.IsOpen():

    imgYX, widthYX, heightYX = cameraYX.CaptureRGBA()
    detectionsYX = net.Detect(imgYX, widthYX, heightYX)
    display.RenderOnce(imgYX, widthYX, heightYX)
    display.SetTitle("Object Detection | Network {:.0f} FPS".format(net.GetNetwork()))

    imgYZ, widthYZ, heightYZ = cameraYZ.CaptureRGBA()
    detectionsYZ = net.Detect(imgYZ, widthYZ, heightYZ)
    display.RenderOnce(imgYZ, widthYZ, heightYZ)
    display.SetTitle("Object Detection | Network {:.0f} FPS".format(net.GetNetwork()))

