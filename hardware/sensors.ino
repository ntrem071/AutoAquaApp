#include "ph_grav.h"             
#include "rtd_grav.h"
#include <SoftwareSerial.h> 

#define waterLvlSensorPin A3 

Gravity_RTD RTD = Gravity_RTD(A2);
Gravity_pH pH = Gravity_pH(A1);
int waterlvl = 0;

const char endMSG = '|';
int water_lowEdge = 240;
int water_upperEdge = 280;
uint8_t user_bytes_received = 0;                
const uint8_t bufferlen = 32;                   
char user_data[bufferlen];  

String inputstring = "";                              
String sensorstring = "";                             
boolean input_string_complete = false;                
boolean sensor_string_complete = false;               


void parse_cmd(char* string) {                   
  strupr(string); 
  String cmd = String(string);
  if(cmd.startsWith("TMP")){
    if(cmd.startsWith("CAL")){
      int index = cmd.indexOf(',');
      if(index != -1){
        String param = cmd.substring(index+1, cmd.length());
        if(param.equals("CLEAR")){
          RTD.cal_clear();
          Serial.println("CALIBRATION CLEARED");
        }else {
          RTD.cal(param.toFloat());
          Serial.println("RTD CALIBRATED");
        }
      }
    } 
  }
  else if(cmd.startsWith("pH")){

    if (strcmp(string, "CAL,7") == 0) {       
      pH.cal_mid();                                
      Serial.println("MID CALIBRATED");
    }
    else if (strcmp(string, "CAL,4") == 0) {            
      pH.cal_low();                                
      Serial.println("LOW CALIBRATED");
    }
    else if (strcmp(string, "CAL,10") == 0) {      
      pH.cal_high();                               
      Serial.println("HIGH CALIBRATED");
    }
    else if (strcmp(string, "CAL,CLEAR") == 0) { 
      pH.cal_clear();                              
      Serial.println("CALIBRATION CLEARED");
    }
  }                           

}

void setup() {
  Serial.begin(9600); 
  Serial3.begin(9600);
  //while(!Serial);
                              
  inputstring.reserve(10);                       
  sensorstring.reserve(30);                             
  delay(200);
  Serial.println(F("Use commands \"pH-CAL,7\", \"pH-CAL,4\", and \"pH-CAL,10\" to calibrate the circuit to those respective values"));
  Serial.println(F("Use command \"pH-CAL,CLEAR\" to clear the pH calibration"));
  Serial.println(F("Use command \"TMP-CAL,nnn.n\" to calibrate the circuit to a specific temperature\n\"TMP-CAL,CLEAR\" clears the calibration"));
  
  // if (pH.begin() && RTD.begin()) {                                     
  //   Serial.println("Loaded EEPROM");
  // }
}

void serialEvent() {                                  
  inputstring = Serial.readStringUntil(13);           
  input_string_complete = true;                       
}

void serialEvent3() {                                 //if the hardware serial port_3 receives a char
  sensorstring = Serial3.readStringUntil(13);         //read the string until we see a <CR>
  sensor_string_complete = true;                      //set the flag used to tell if we have received a completed string from the PC
}

void loop() {

  if (user_bytes_received) {                                                      
    parse_cmd(user_data);                                                          
    user_bytes_received = 0;                                                        
    memset(user_data, 0, sizeof(user_data));                                         
  }

  if (input_string_complete == true) {                //if a string from the PC has been received in its entirety
    Serial3.print(inputstring);                       //send that string to the Atlas Scientific product
    Serial3.print('\r');                              //add a <CR> to the end of the string
    inputstring = "";                                 //clear the string
    input_string_complete = false;                    //reset the flag used to tell if we have received a completed string from the PC
  }
 print_EC_data(); 
  if (sensor_string_complete == true) {               //if a string from the Atlas Scientific product has been received in its entirety
    if (isdigit(sensorstring[0]) == false) {          //if the first character in the string is a digit
      Serial.println(sensorstring);                   //send that string to the PC's serial monitor
    }
    else                                              //if the first character in the string is NOT a digit
    {
      print_EC_data();                                //then call this function
    }
    sensorstring = "";                                //clear the string
    sensor_string_complete = false;                   //reset the flag used to tell if we have received a completed string from the Atlas Scientific product
  }
  
  Serial.print("pH: ");
  Serial.println(pH.read_ph());
  Serial.print("Temperature: ");
  Serial.println(RTD.read_RTD_temp_C());  

  waterlvl = analogRead(waterLvlSensorPin); 

  Serial.print("Current water level: ");
  Serial.println(waterlvl);

  if(waterlvl == 0){
    Serial.println("Water level: EMPTY");
  }
  else if(waterlvl > 0 && waterlvl <= water_lowEdge){
    Serial.println("Water level: LOW");
  }
  else if(waterlvl > water_lowEdge && waterlvl <= water_upperEdge){
    Serial.println("Water level: MEDIUM");
  }
  else if(waterlvl > water_upperEdge){
    Serial.println("Water level: HIGH");
  }

  delay(5000);
}

void print_EC_data(void) {                             

  char sensorstring_array[30];                        
  char *EC;                                            

  sensorstring.toCharArray(sensorstring_array, 30);    
  EC = strtok(sensorstring_array, ",");                         

  Serial.print("EC:");                                
  Serial.println(EC);                    
  Serial.println();                             
  
}
