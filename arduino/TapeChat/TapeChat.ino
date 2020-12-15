//引入ESP8266.h头文件，建议使用教程中修改后的文件
#include "ESP8266.h"
#include "SoftwareSerial.h"
#include "Arm.h"
#include "Pen.h"
#include "Foot.h"


//配置ESP8266WIFI设置
#define SSID "wifi0314"    //填写2.4GHz的WIFI名称，不要使用校园网
#define PASSWORD "******"//填写自己的WIFI密码
#define HOST_NAME "api.heclouds.com"  //API主机名称，连接到OneNET平台，无需修改
#define DEVICE_ID "651971616"       //填写自己的OneNet设备ID
#define HOST_PORT (80)                //API端口，连接到OneNET平台，无需修改
String APIKey = "******"; //与设备绑定的APIKey


//定义ESP8266所连接的软串口
/*********************
   该实验需要使用软串口
   Arduino上的软串口RX定义为D3,
   接ESP8266上的TX口,
   Arduino上的软串口TX定义为D2,
   接ESP8266上的RX口.
   D3和D2可以自定义,
   但接ESP8266时必须恰好相反
 *********************/
SoftwareSerial mySerial(3, 2);
ESP8266 wifi(mySerial);


int last_time = 0;
Servo myservo1;
Servo myservo2;

Arm arm(myservo1);
Pen pen(myservo2);
void setup()
{
  mySerial.begin(115200); //初始化软串口
  Serial.begin(9600);     //初始化串口
  Serial.print("setup begin\r\n");

  //以下为ESP8266初始化的代码
  Serial.print("FW Version: ");
  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStation())
  {
    Serial.print("to station ok\r\n");
  }
  else
  {
    Serial.print("to station err\r\n");
  }

  //ESP8266接入WIFI
  if (wifi.joinAP(SSID, PASSWORD))
  {
    Serial.print("Join AP success\r\n");
    Serial.print("IP: ");
    Serial.println(wifi.getLocalIP().c_str());
  }
  else
  {
    Serial.print("Join AP failure\r\n");
  }


  mySerial.println("AT+UART_CUR=9600,8,1,0,0");
  mySerial.begin(9600);
  Serial.println("setup end\r\n");

  // following
  myservo1.attach(5);
  myservo2.attach(10);

}

void loop()
{
  if (wifi.createTCP(HOST_NAME, HOST_PORT))
  {
    //建立TCP连接，如果失败，不能发送该数据
    Serial.print("create tcp ok\r\n");
    char buf[10];


    //拼接POST请求字符串
    String postString = "GET /devices/";
    postString += DEVICE_ID;
    postString += "/datapoints?datastream_id=message&limit=1 HTTP/1.1";
    postString += "\r\n";
    postString += "api-key:";
    postString += APIKey;
    postString += "\r\n";
    postString += "Host:api.heclouds.com\r\n";
    postString += "Connection:close\r\n";
    postString += "\r\n";
    postString += "\r\n";

    const char *postArray = postString.c_str(); //将str转化为char数组

    Serial.println(postArray);
    wifi.send((const uint8_t *)postArray, strlen(postArray)); //send发送命令，参数必须是这两种格式，尤其是(const uint8_t*)
    uint8_t buffer[512] = {};
    uint32_t len = wifi.recv(buffer, sizeof(buffer), 10000);

    // String raw_data = "";
    for (uint32_t i = 192; i < len; i++)
    {
      char ch = (char)buffer[i];
      Serial.print(ch);

    }


    // extract
    int now_time = 0;

    Serial.print("\nthe len is ");
    Serial.print(len);
    Serial.print("\n");

    for (uint32_t i = 192; i < len; i++)
    {
      char ch = (char)buffer[i];
      if (ch == 'a' && (char)buffer[i + 1] == 't')
      {
        now_time += (char)buffer[i + 22];
        now_time += (char)buffer[i + 23];
        now_time += (char)buffer[i + 25];
        now_time += (char)buffer[i + 26];
        break;
      }
    }

    Serial.println("\n");
    Serial.println(now_time);
    if (now_time == last_time)
    {
      Serial.println(now_time);
    }
    else
    {

      int head = 0;
      for (int i = 0; i < len; i++)// may problem
      {
        if ((char)buffer[i-4] == 'e' && (char)buffer[i - 3] == '\"')
        {
          head = i;
          break;
        }
      }


      Serial.println(head);
      int tail = len;

      for (int i = 0; i < len; i++)
      {
        if (buffer[i] == '\"' && buffer[i + 5] == 'i')
        {
          tail = i;
          break;
        }
      }
      Serial.println("head: ");
      Serial.println(head);
      Serial.println("tail: ");
      Serial.println(tail);
      
      for (int i = 0; i < (tail - head) / 16; i++)
      {
        for (int j = 0; j < 8; j++)
        {
          for (int k = 0; k < 2; k++)
          {
            char ch = (char)buffer[head + 16 * i + j * 2 + k];
            if (ch < 'A')
            {
              int num = ch - '0';
              int list[4] = {};
              for (int l = 0; l < 4; l++)
              {
                int remainder = num % 2;
                num = num / 2;
                list[3 - l] = remainder;
              }
              for (int l = 0; l < 4; l++)
              {
                arm.turn_gear(4 * k + l);
                if (list[l])
                {
                  Serial.print('1');//
                  pen.write_round();
                }
                else
                {
                  Serial.print('0');//
                }

              }
            }
            else
            {
              int num = ch - 'A' + 10;
              int list[4] = {};
              for (int l = 0; l < 4; l++)
              {
                int remainder = num % 2;
                num = num / 2;
                list[3 - l] = remainder;
              }
              for (int l = 0; l < 4; l++)
              {
                arm.turn_gear(4 * k + l);
                if (list[l])
                {
                  Serial.print('1');//
                  pen.write_round();
                }
                else
                {
                  Serial.print('0');//
                }

              }
            }

          }
          next_line();
          Serial.print('\n');
        }
      }

      last_time = now_time;
    }


    Serial.println("send success");
    if (wifi.releaseTCP())   //释放TCP连接
    {
      Serial.print("release tcp ok\r\n");
    }
    else
    {
      Serial.print("release tcp err\r\n");
    }
    postArray = NULL; //清空数组，等待下次传输数据
  }
  else
  {
    Serial.print("create tcp err\r\n");
  }

  Serial.println("");
  delay(10000);
}
