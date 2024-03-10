#include <Servo.h>
#include "HX711.h"

//feed weight sensor https://randomnerdtutorials.com/arduino-load-cell-hx711/
const int LOADCELL_DOUT_PIN = 5;
const int LOADCELL_SCK_PIN = 4;
HX711 scale;
float calibration_factor = 805.9; // see seperate calibration factor code and methodology
float zero_factor = 175250; // relative weight of top scale piece (holding feed and slider)
float units;
bool empty_flag = 0; // starts full

//feed motor
Servo myServoObject;
int angle=0;
bool feedFlag =1;// true if one of user.time == jetson.time (check timezone) do check in jetson

void setup() {
  myServoObject.attach(9); // servo motor to pin 9

  Serial.begin(57600); //load cell baud rate
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
 

  scale.set_scale(calibration_factor); //callibrate scale
  scale.set_offset(zero_factor); //tare feed holder weight only (not feed itself)
}

void loop() {

  if(feedFlag){ 
    
    //servo rotates back/forth 180 pushing feed slider
      for(angle=0;angle<=180; angle+=1){
        myServoObject.write(angle);
        delay(5);
      }
      for(angle=180; angle>=0; angle-=1){
        myServoObject.write(angle);
        delay(5);
      }

    // weight sensor sets warning when feed close to empty
      units = scale.get_units(); //get scale reading
      if (units<0){units=0.00;} //eliminate negative readings
      Serial.print("Read average:\t");
      Serial.println(units); 

      if(units<=1.0){empty_flag=1;} //set feedflag to 1 if empty (<1 gram)
      else{empty_flag=0;}
      Serial.print("Flag:\t");
      Serial.println(empty_flag);

  }

}

