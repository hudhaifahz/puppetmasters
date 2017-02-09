var http = require('http');						//allows server
var exec = require('child_process').exec;				//allows terminal commands


//pinmap
var pinmap = {  '/?echo%2Fon=': 9, 
                '/?echo%2Foff=': 9, 
                '/': [9,'gpio write 9 1'] };

// Admin code
// For easy remembering: "ALICE" with each letter changed to the key above(left) it on standard keyboard
var adminCode = "QO8D3" 
// Default guest code, can be changed by admin
var guestCode = "00000"

// for html test
var fs = require('fs');							//allows reading of file, only for test

function makeGuestCode()
{
    var code = "";
    var dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 5; i++ )
        code += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    return code;
}

fs.readFile('./index.html', function (err, html) {
  if (err) {
      throw err; 
  }

http.createServer(function(request, response) {				//starts server
//for html test
  response.writeHeader(200, {"Content-Type": "text/html"});		
  response.write(html);
  response.end();

  request.on('error', function(err) {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', function(err) {
    console.error(err);
  });

  // URL format: http://puppet/XYE58/arm/right/127    127 is the speed control input value
  // reqUrl format: ",XYE58,arm,right,127" 
  // Note: reqUrl[0]="" reqUrl[1]="XYE58" reqUrl[2]="arm" reqUrl[3]="right" reqUrl[4]=127

  var reqUrl = request.url.replace('%2F','/').split('/')

  if (request.method === 'GET') { 
    if (reqUrl.length == 1){   
      //TODO: Default page, a form asking for the user's auth code
    }  
    else if (reqUrl.length == 2 && reqUrl[1] === adminCode){
      //TODO: Admin page, user gets another auth code that can be handed out to other 
      //      users, plus a button to generate another code.  This non-hardcoded auth 
      //      code is good for X minutes (needs to be configurable). Guest code should 
      //      go in a file that can be checked to see if it matches and if it is still valid.
      //      Call makeGuestCode() to generate a random five digit guestCode.
    }
    else if (reqUrl.length == 2 && reqUrl[1] === guestCode){
      //TODO: Guest logged in page (is this needed???)
    }
    else if (reqUrl.length == 5){
      // check if the guest authentication code is correct
      if(reqUrl[1] != guestCode){
        response.statusCode = 401;
        response.end();
        break;
      }
      //TODO: Movement control, map body parts to pin. Add timeout.
      //      Problem: Only 17 GPIO PWM pins and output is 0-1023. How to do move up/down?
      //               Use something else instead of PWM? Do motor relays support negative input?
      //               2 sets of Pi, switch 2 input/GND pins to make motor turn reverse?
      //A temporary design (until problem mentioned above is resolved):
      //    Head Right = pin 11     <---- why do we have head left and head right? what do they do?
      //    Head Left = 12
      //    ShoulderFront Right = 13
      //    ShoulderFront Left = 15
      //    ShoulderBack  Right = 16
      //    ShoulderBack  Left = 18
      //    Arm Right = 22 
      //    Arm Left = 29
      //    Hand Right = 31
      //    Hand Left = 32
      //    Fingers Right = 33
      //    Fingers Left = 35
      //    Hips = 7     <--- this will need a seperate else if condition
      //    Leg Right = 36
      //    Leg Left = 37
      //    Foot Right = 38
      //    Foot Left = 40
      var outPin = 29;  // default, least likely to cause safty problem in case of bug
      var speed = parseInt(reqUrl[4]);
      breakSwitch: switch(reqUrl[2]){
        //TODO: finish inplementation for the rest of the cases
        case "arm":
            switch(reqUrl[3]){
                case "right":
                    outPin = 22;
                    break breakSwitch;
                case "left":
                    outPin = 29;
                    break breakSwitch;
                default:  //invalid command  
                    response.statusCode = 404;
                    response.end();
                    break breakSwitch;
            }

        default:  //invalid command
                   response.statusCode = 404;
                   response.end();

      }
      var move = require('./move.js'); 
      //TODO: change implemenattion of move.js      
      move(outPin, speed);
      response.end("MOVED\n");


    }

    else {
      response.statusCode = 404;
      response.end();
    }

  }
  else {
    response.statusCode = 404;
    response.end();
  }
}).listen(8080);

});

