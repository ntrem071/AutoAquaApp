import jetson.inference
import jetson.utils
import cv2
from roboflow import Roboflow #pip install roboflow

capture_height = 720
capture_width = 1280
frame_rate = 21
display_width = 860
display_height = 640
flip_method = 0

net = jetson.inference.detectNet("ssd-mobilenet-v2", threshold=0.5) #more threshold deects less objects

cameraYX = jetson.utils.gstCamera(1280, 720, "/dev/video1") #to know where the camera will be, run comand in terminal v4l2-ctl --list-devices
                                                            #to know the resolution supported of the camera, run command v4l2-ctl --device /dev/video1 --list-formats-ext

display = jetson.utils.glDisplay()

######### Save video ##########

gstr = ('nvarguscamerasrc ! video/x-raw(memory:NVMM),'
        'width=%s, height=%s,'
        'framerate= %s'
        'format=NV12 ! nvvidconv flip-method= %s ! video/x-raw,'   
        'width=%s, height=%s,'
        'format=BGRx ! videoconvert ! appsink'
        % (capture_width, capture_height, frame_rate, flip_method, 
        display_width, display_height))

video = cv2.VideoCapture(gstr, cv2.CAP_GSTREAMER) 

if (video.isOpened() == False):  
    print("Error reading video file") 

frame_width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH)) 
frame_height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT)) 

size = (frame_width, frame_height) 

result = cv2.VideoWriter('./output.avi', cv2.VideoWriter_fourcc(*'XVID'), float(frame_rate), size, True) 

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

rf = Roboflow(api_key="qZ8fLZkBFuZllwmCf6w9")
project = rf.workspace().project("fish-uyu9m")
model = project.version("4").model

job_id, signed_url, expire_time = model.predict_video(
    "YOUR_VIDEO.mp4",
    fps=5,
    prediction_type="batch-video",
)

results = model.poll_until_video_results(job_id)

print(results)


# while display.IsOpen():

#     imgYX, widthYX, heightYX = cameraYX.CaptureRGBA()
#     detectionsYX = net.Detect(imgYX, widthYX, heightYX)
#     display.RenderOnce(imgYX, widthYX, heightYX)
#     display.SetTitle("Object Detection | Network {:.0f} FPS".format(net.GetNetwork()))