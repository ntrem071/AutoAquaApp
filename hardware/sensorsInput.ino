#include "ph_grav.h"             
#include "rtd_grav.h"
#include <SoftwareSerial.h>  

#define rx 2                                         
#define tx 3 
#define waterLvlSensorPin A3 

SoftwareSerial myserial(rx, tx);
Gravity_RTD RTD = Gravity_RTD(A2);
Gravity_pH pH = Gravity_pH(A1);
int waterlvl = 0;

int water_lowEdge = 420;
int water_upperEdge = 520;
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
  myserial.begin(9600);                               
  inputstring.reserve(10);                       
  sensorstring.reserve(30);                             
  delay(200);
  Serial.println(F("Use commands \"pH-CAL,7\", \"pH-CAL,4\", and \"pH-CAL,10\" to calibrate the circuit to those respective values"));
  Serial.println(F("Use command \"pH-CAL,CLEAR\" to clear the pH calibration"));
  Serial.println(F("Use command \"TMP-CAL,nnn.n\" to calibrate the circuit to a specific temperature\n\"TMP-CAL,CLEAR\" clears the calibration"));
  
  if (pH.begin() && RTD.begin()) {                                     
    Serial.println("Loaded EEPROM");
  }
}

void serialEvent() {                                  
  inputstring = Serial.readStringUntil(13);           
  input_string_complete = true;                       
}

void loop() {

  if (Serial.available() > 0) {                                                      
    user_bytes_received = Serial.readBytesUntil(13, user_data, sizeof(user_data));   
  }

  if (user_bytes_received) {                                                      
    parse_cmd(user_data);                                                          
    user_bytes_received = 0;                                                        
    memset(user_data, 0, sizeof(user_data));                                         
  }

  if (input_string_complete) {                
    myserial.print(inputstring);                      
    myserial.print('\r');                             
    inputstring = "";                                 
    input_string_complete = false;                    
  }

  if (myserial.available() > 0) {                     
    char inchar = (char)myserial.read();              
    sensorstring += inchar;                           
    if (inchar == '\r') {                             
      sensor_string_complete = true;                  
    }
  }

  if (sensor_string_complete) {               
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
  
  Serial.println(pH.read_ph());
  Serial.println(RTD.read_RTD_temp_C());  

  waterlvl = analogRead(waterLvlSensorPin); 

  Serial.print("Current water level: ");
  Serial.println(waterlvl);

  if(waterlvl == 0){
    Serial.println("Water level: EMPTY");
  }
  else if(waterlvl > 0 && waterlvl <= 420){
    Serial.println("Water level: LOW");
  }
  else if(waterlvl > 420 && waterlvl <= 520){
    Serial.println("Water level: MEDIUM");
  }
  else if(waterlvl > 520){
    Serial.println("Water level: HIGH");
  }

  delay(1000);
}

void print_EC_data(void) {                             

  char sensorstring_array[30];                        
  char *EC,*TDS,*SAL,*GRAV;                              
  //float f_ec;                                         

  sensorstring.toCharArray(sensorstring_array, 30);    
  EC = strtok(sensorstring_array, ",");               
  TDS = strtok(NULL, ",");                            
  SAL = strtok(NULL, ",");                            
  GRAV = strtok(NULL, ",");                           

  Serial.print("EC:");                                
  Serial.println(EC);                                 

  Serial.print("TDS:");                               
  Serial.println(TDS);                              

  Serial.print("SAL:");                             
  Serial.println(SAL);                             

  Serial.print("GRAV:");                              
  Serial.println(GRAV);                       
  Serial.println();                             
  
}
