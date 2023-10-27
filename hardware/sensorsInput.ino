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
  
  if (pH.begin() && RTD.begin()) {                                     
    Serial.println("Loaded EEPROM");
  }
}

void serialEvent() {                                  
  inputstring = Serial.readStringUntil(13);           
  input_string_complete = true;                       
}

void serialEvent3() {                                 
  sensorstring = Serial3.readStringUntil(13);         
  sensor_string_complete = true;                      
}

void loop() {

  if (user_bytes_received) {                                                      
    parse_cmd(user_data);                                                          
    user_bytes_received = 0;                                                        
    memset(user_data, 0, sizeof(user_data));                                         
  }

  if (input_string_complete == true) {                
    Serial3.print(inputstring);                       
    Serial3.print('\r');                              
    inputstring = "";                                 
    input_string_complete = false;                    
  }
  
  if (sensor_string_complete == true) {               
    if (isdigit(sensorstring[0]) == false) {          
      Serial.println(sensorstring);                   
    }
    else                                              
    {
      print_EC_data();                                
    }
    sensorstring = "";                                
    sensor_string_complete = false;                   
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
