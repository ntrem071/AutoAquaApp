const int pump = 9;

String input;

void setup() {
  // put your setup code here, to run once:

  pinMode(pump, OUTPUT);
  Serial.begin(9600);
}

void loop() {

  while(Serial.available()){

    input = Serial.readString();
    String str1 = "ON";
    String str2 = "OFF";

    if(input == str1){
      digitalWrite(pump,HIGH);
      Serial.println(input);
    }else if(input == str2){
      digitalWrite(pump,LOW);
      Serial.println(input);
    }

  }
  // put your main code here, to run repeatedly:

  // for(int i = 0; i < 256; i+16){

  //   Serial.print("Flow: ");
  //   Serial.println(i);
  //   analogWrite(pump, i);
  //   delay(8000);

  // }

  // analogWrite(pump, 0);

  // Serial.println("Pin HIGH");

  // digitalWrite(pump,HIGH);

  // delay(5000);

  // Serial.println("Pin LOW");

  // digitalWrite(pump,LOW);

  // delay(10000);

}
