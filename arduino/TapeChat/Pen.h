#include <Servo.h>
class Pen
{
  public:
    Servo servo;
    int start_degree;
    int end_degree;
    int step_;


    Pen(Servo s)
    {
      start_degree = 0;
      end_degree = 30;
      step_ = 5;
      servo = s;
      servo.write(0);
    }
    void write_round()
    {
      int now_degree = start_degree;
      while (now_degree != end_degree)
      {
        now_degree += step_;
        servo.write(now_degree);
        delay(30);

      }
      delay(200);// long dalay
      while (now_degree != start_degree)
      {
        now_degree += -step_;
        servo.write(now_degree);
        delay(30);

      }
      delay(1000);
    }

};
