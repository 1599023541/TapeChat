const int footPin = 11;

void next_line(int gear)
{

  if (gear == 7)
  {
    analogWrite(footPin, 200);
  }
  else
  {
    analogWrite(footPin, 255);
    delay(20);
  }
  analogWrite(footPin, 0);
}
