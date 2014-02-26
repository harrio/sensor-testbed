#include <Servo.h> 

const int pingPin = 7;
// Angle between measurements in degrees.
int step = 10;
// Number of pings per step. As there's a lot of jitter in the ping results this is needed to get a sensible median.
int pings = 5;
// Delay between pings in milliseconds to allow the sensor to recover. Ping sensor datasheet states a 200 microsecond delay before next measurement, but better be on the safe side.
int pingDelay = 5;

Servo myservo;

void setup() {
  Serial.begin(14400);
  myservo.attach(9); 
  myservo.write(0);
}

// Ping and send the result on serial in the format "angle distance1, distance2, ... distancePings"
void pingAngle(int deg) { 
  myservo.write(deg);
  // Wait for rotation
  delay(6 * step);
  Serial.print(deg);
  Serial.print(" ");
  for (int i = 0; i < pings; i++) {
    int cm = ping();
    // Wait a bit or the sensor gives weird results. 
    delay(pingDelay);
    Serial.print(cm);
    Serial.print(",");
  }
  Serial.println();
}

// Make one sweep down. Send the start signal "b step" to let the client know what step we're using. Mark end by sending "e".
void sweepDown() {
  Serial.print("b");
  Serial.print(" ");
  Serial.print(step);
  Serial.println();
  for (int i = 180 / step - 1; i > -1; i--) {
    pingAngle(i * step);
  }
  Serial.print("e");
  Serial.println();
}

// Make one sweep up.
void sweepUp() {
  Serial.print("b");
  Serial.print(" ");
  Serial.print(step);
  Serial.println();
  for (int i = 0; i < 180 / step; i++) {
    pingAngle(i * step);
  }
  Serial.print("e");
  Serial.println();
}

// Read the configuration from serial at the beginning of each up-down sweep sequence.
void readConfig() {
  char inData[10]; // Allocate some space for the string
  char inChar=-1; // Where to store the character read
  byte index = 0; // Index into array; where to store the character
  int received = 0;
  while (Serial.available() > 0) {
    if (index < 10) // One less than the size of the array
    {
      inChar = Serial.read(); // Read a character
      inData[index] = inChar; // Store it
      index++; // Increment where to write next
      inData[index] = '\0'; // Null terminate the string
      received = 1;
    }
  }
  if (received) {
    parseConfig(inData);
  } 
}

// Parse the step, pings and pingDelay parameters. Received in the form "step ping pingDelay".
void parseConfig(char data[]) {
  char seps[] = " ";
  char* token;
  int var;
  int input[3];
  int i = 0;

  token = strtok(data, seps);
  while (token != NULL)
  {
    input[i++] = atoi(token);

    token = strtok(NULL, seps);
  }
  step = input[0];
  pings = input[1];
  pingDelay = input[2];
}

void loop()
{
  readConfig();
  sweepUp();
  sweepDown();
}


long ping() {
  long duration;

  // The PING))) is triggered by a HIGH pulse of 2 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(5);
  digitalWrite(pingPin, LOW);

  // The same pin is used to read the signal from the PING))): a HIGH
  // pulse whose duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(pingPin, INPUT);
  duration = pulseIn(pingPin, HIGH);

  return microsecondsToCentimeters(duration);
}

long microsecondsToCentimeters(long microseconds)
{
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the
  // object we take half of the distance travelled.
  return microseconds / 29 / 2;
}
