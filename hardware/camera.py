import cv2
from roboflow import Roboflow

rf = Roboflow(api_key="qZ8fLZkBFuZllwmCf6w9")
project = rf.workspace().project("fish-uyu9m")
model = project.version("4").model

def gstreamer_pipeline(
    sensor_id=0,
    capture_width=1920,
    capture_height=1080,
    display_width=960,
    display_height=540,
    framerate=30,
    flip_method=0,):

    return (
        "nvarguscamerasrc sensor-id=%d ! "
        "video/x-raw(memory:NVMM), width=(int)%d, height=(int)%d, framerate=(fraction)%d/1 ! "
        "nvvidconv flip-method=%d ! "
        "video/x-raw, width=(int)%d, height=(int)%d, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink"
        % (
            sensor_id,
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )


def objectRecognitionModel():
	job_id, signed_url, expire_time = model.predict_video("./output.avi", fps=5, prediction_type="batch-video")
	results = model.poll_until_video_results(job_id)
	print(results)
	return results


def show_camera():
	window_title = "CSI Camera"

	print(gstreamer_pipeline(flip_method=2))
	video_capture = cv2.VideoCapture(gstreamer_pipeline(flip_method=2), cv2.CAP_GSTREAMER)
	if video_capture.isOpened():
		try:
			frame_width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
			frame_height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
			size = (frame_width, frame_height)
			result = cv2.VideoWriter('./output.avi', cv2.VideoWriter_fourcc(*'XVID'), 						21.0, size, True)
			window_handle = cv2.namedWindow(window_title, cv2.WINDOW_AUTOSIZE)
			while True:
				ret_val, frame = video_capture.read()
				if cv2.getWindowProperty(window_title, cv2.WND_PROP_AUTOSIZE) >= 0:
					cv2.imshow(window_title, frame)
					result.write(frame)

				else:
					break 
				keyCode = cv2.waitKey(10) & 0xFF
				if keyCode == 27 or keyCode == ord('q'):
 					break
		finally:
            		video_capture.release()
			cv2.destroyAllWindows()
	else:
		print("Error: Unable to open camera")


if __name__ == "__main__":
    show_camera()
