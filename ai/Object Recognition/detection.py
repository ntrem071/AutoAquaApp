import jetson.inference
import jetson.utils
import cv2

net = jetson.inference.detectNet("ssd-mobilenet-v2", threshold=0.5) #more threshold deects less objects

cameraYX = jetson.utils.gstCamera(1280, 720, "/dev/video1") #to know where the camera will be, run comand in terminal v4l2-ctl --list-devices
                                                            #to know the resolution supported of the camera, run command v4l2-ctl --device /dev/video1 --list-formats-ext
#cameraYZ = jetson.utils.gstCamera(1280, 720, "/dev/video1") #to know where the camera will be, run comand in terminal v4l2-ctl --list-devices
                                                          #to know the resolution supported of the camera, run command v4l2-ctl --device /dev/video1 --list-formats-ext

display = jetson.utils.glDisplay()

######### Save video ##########

video = cv2.VideoCapture(0) 

if (video.isOpened() == False):  
    print("Error reading video file") 

frame_width = int(video.get(3)) 
frame_height = int(video.get(4)) 

size = (frame_width, frame_height) 

result = cv2.VideoWriter('filename.avi', cv2.VideoWriter_fourcc(*'MJPG'), 10, size) 

while(True): 
    ret, frame = video.read() 
  
    if ret == True:  
  
        # Write the frame into the 
        # file 'filename.avi' 
        result.write(frame) 
  
        # Display the frame 
        # saved in the file 
        cv2.imshow('Frame', frame) 
  
        # Press S on keyboard  
        # to stop the process 
        if cv2.waitKey(1) & 0xFF == ord('s'): 
            break
  
    # Break the loop 
    else: 
        break

video.release() 
result.release() 
    
cv2.destroyAllWindows() 
   
print("The video was successfully saved") 

######### End Video Save ###########

while display.IsOpen():

    imgYX, widthYX, heightYX = cameraYX.CaptureRGBA()
    detectionsYX = net.Detect(imgYX, widthYX, heightYX)
    display.RenderOnce(imgYX, widthYX, heightYX)
    display.SetTitle("Object Detection | Network {:.0f} FPS".format(net.GetNetwork()))

    imgYZ, widthYZ, heightYZ = cameraYZ.CaptureRGBA()
    detectionsYZ = net.Detect(imgYZ, widthYZ, heightYZ)
    display.RenderOnce(imgYZ, widthYZ, heightYZ)
    display.SetTitle("Object Detection | Network {:.0f} FPS".format(net.GetNetwork()))