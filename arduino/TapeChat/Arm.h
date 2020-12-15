#include <Servo.h>
class Arm
{
  public:
    Servo servo;
    int now_gear;
    int gear_list[8] = {20, 45, 68, 88, 105, 120, 132, 148};
    int step_;

    Arm(Servo s)
    {
      servo = s;
      servo.write(25);
      now_gear = 0;
      step_ = 5;
      //      const int interval = 25;
    }
    void turn_gear(int dest_gear)
    {
      if (dest_gear > now_gear)
      {
        move_to(gear_list[dest_gear], 1);
      }
      else if (dest_gear < now_gear)
      {
        move_to(gear_list[dest_gear], -1);
      }
      now_gear = dest_gear;
    }

    void move_to(int dest_degree, int direction)
    {
      int now_degree = gear_list[now_gear];
      while ((dest_degree - now_degree) * direction > 0)
      {
        now_degree += step_ * direction;
        servo.write(now_degree);
        delay(30);
      }
      delay(500);
    }

};
