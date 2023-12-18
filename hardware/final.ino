/*
 * 
 * Arduino Sketch for Allegro ACS712 Current Sensor 
 * this sensor can measure current at range of up to 30A
 * It operates with 5V
 * Please watch video instruction and explanation for this code.
 * 
 * Written by Ahmad Shamshiri on Sunday Jun 17, 2018 at 22:06 at Ajax, Ontario, Canada
 * for Robojax.com
 * View the video instruction at https://youtu.be/DVp9k3xu9IQ
 * This code has been downloaded from Robojax.com
 */
#define VINs1 A0
#define VINs2 A1 // define the Arduino pin A0 as voltage input (V in)
const float VCC   = 5.0;// supply voltage is from 4.5 to 5.5V. Normally 5V.
const int model = 2;   // enter the model number (see below)

float cutOffLimit = 0.5;// set the current which below that value, doesn't matter. Or set 0.5

/*
          "ACS712ELCTR-05B-T",// for model use 0
          "ACS712ELCTR-20A-T",// for model use 1
          "ACS712ELCTR-30A-T"// for model use 2  
sensitivity array is holding the sensitivy of the  ACS712
current sensors. Do not change. All values are from page 5  of data sheet          
*/
float sensitivity[] ={
          0.185,// for ACS712ELCTR-05B-T
          0.100,// for ACS712ELCTR-20A-T
          0.066// for ACS712ELCTR-30A-T
     
         }; 


const float QOV =   0.5 * VCC;// set quiescent Output voltage of 0.5V
float voltage_s1;// internal variable for voltage
float voltage_s2;// internal variable for voltage

void setup() {
    //Robojax.com ACS712 Current Sensor 
    Serial.begin(9600);// initialize serial monitor
    //Serial.println("Robojax Tutorial");
    Serial.println("ACS712 Current Sensor");
}

void loop() {
  
  //Robojax.com ACS712 Current Sensor 
  float voltage_raw_s1 =   (5.0 / 1023.0)* analogRead(VINs1);// Read the voltage from sensor
  voltage_s1 =  voltage_raw_s1 - QOV + 0.012 ;// 0.000 is a value to make voltage zero when there is no current
  float current_s1 = voltage_s1 / sensitivity[model];
 
  float voltage_raw_s2 =   (5.0 / 1023.0)* analogRead(VINs2);// Read the voltage from sensor
  voltage_s2 =  voltage_raw_s2 - QOV + 0.012 ;// 0.000 is a value to make voltage zero when there is no current 
  float current_s2 = voltage_s2 / sensitivity[model];

  if(abs(current_s1 && current_s2) > cutOffLimit ){
    Serial.print("Voltage of sensor 1: ");
    Serial.print(voltage_s1,2);// print voltage with 3 decimal places
    Serial.print("V, I: ");
    Serial.print(current_s1,2); // print the current with 2 decimal places
    Serial.println("A");
    Serial.print("Voltage of sensor 2: ");
    Serial.print(voltage_s2,2);// print voltage with 3 decimal places
    Serial.print("V, I: ");
    Serial.print(current_s2,2); // print the current with 2 decimal places
    Serial.println("A");
  }else{
    Serial.println("No Current");
  }
  delay(500);
} 