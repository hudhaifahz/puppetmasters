#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (9, OUTPUT) ;
  for (;;)
  {
    digitalWrite (9, HIGH) ; delay (500) ;
    digitalWrite (9,  LOW) ; delay (500) ;
  }
  return 0 ;
}
