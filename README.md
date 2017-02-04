# puppetmasters
Giant Puppet Robot Project using RaspberryPi

Using RaspberryPi 3
LED on physical pin 5 = GPIO pin 3 = wiringPi pin 9

Node.js and dependencies come installed on Raspbian, as does wiringPi.

1. update everything:
sudo apt-get update

2. download the file
wget https://github.com/hudhaifahz/puppetmasters/raw/master/NODE.zip

3. unzip the file
note: zip may need to be installed: sudo apt-get install zip
unzip NODE

4. run program
get into directory: cd NODE
node request.js

5. visit your Pi localhost or home ip at port 8080
eg. 127.0.0.1:8080 OR 192.168.1.73:8080
