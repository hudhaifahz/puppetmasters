var http = require('http');						//allows server
var exec = require('child_process').exec;		//allows terminal commands
//pinmap
var pinmap = {  '/?echo%2Fon=': 9, 
                '/?echo%2Foff=': 9, 
                '/': [9,'gpio write 9 1'] };

// Admin code
// For easy remembering: "ALICE" with each letter changed to the key above(left) it on standard keyboard
var adminCode = "QO8D3" 
// Default guest code, can be changed by admin
//var guestCode = require('./guestcode.js');
var Code = 0;

// Maps controller address and motor address to each limb
var addressMap = {
  headTilt:         128,
  headTurn:         128,
  armElbowLeft:     129,
  armHandOneLeft:   129,
  armHandTwoLeft:   130,
  armElbowRight:    130,
  armHandOneRight:  131,
  armHandTwoRight:  131,
  backShoulderLeft: 132,
  backShoulderRight:132,
  back:             133,
  legKneeLeft:      133,
  legKneeRight:     134,
  legHeelLeft:      134,
  legHeelRight:     135
};

var motorMap = {
  headTilt:         0,
  headTurn:         1,
  armElbowLeft:     0,
  armHandOneLeft:   1,
  armHandTwoLeft:   0,
  armElbowRight:    1,
  armHandOneRight:  0,
  armHandTwoRight:  1,
  backShoulderLeft: 0,
  backShoulderRight:1,
  back:             0,
  legKneeLeft:      1,
  legKneeRight:     0,
  legHeelLeft:      1,
  legHeelRight:     0
};

// for html test
var fs = require('fs');							//allows reading of file, only for test
fs.readFile('./index.html', function (err, html) {
  if (err) {
      throw err; 
  }

http.createServer(function(request, response) {				//starts server
//for html test
  response.writeHeader(200, {"Content-Type": "text/html"});		
 // response.write(html);
  response.end();

  request.on('error', function(err) {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', function(err) {
    console.error(err);
  });

  // URL format: http://puppet/XYE58/armElbowLeft/127    127 is the speed control input value
  // reqUrl format: ",XYE58,arm,right,127" 
  // Note: reqUrl[0]="" reqUrl[1]="XYE58" reqUrl[2]="armElbowLeft" reqUrl[3]=127

  var reqUrl = request.url.replace('%2F','/').split('/')
  console.log(reqUrl);
  console.log(reqUrl[0]);
  console.log(reqUrl[1]);
  console.log(reqUrl[1][1]);
  if (request.method === 'GET') { 
    if (reqUrl[1].length == 2){   
      //TODO: Default page, a form asking for the user's auth code
    console.log("length 0 url: " + reqUrl);
    } 
    else if (reqUrl.length == 2 && reqUrl[1] === adminCode){
      //TODO: Admin page, user gets another auth code that can be handed out to other 
      //      users, plus a button to generate another code.  This non-hardcoded auth 
      //      code is good for X minutes (needs to be configurable). Guest code should 
      //      go in a file that can be checked to see if it matches and if it is still valid.
      //      Call makeGuestCode() to generate a random five digit guestCode.
   
      // Default guest code, can be changed by admin
      var guestCode = require('./guestcode.js');
     // console.log("Code: " + Code);
      Code = guestCode();
      console.log(Code);
    }
    //else if (reqUrl.length == 2 && reqUrl[1] === Code){
    else if (reqUrl[1] === Code){
      console.log("guest: " + Code);
      //TODO: check length, if 5, it's probably an movement control command
      if (reqUrl.length == 4){
      // check if the guest authentication code is correct
        if(reqUrl[1] != Code){
          response.statusCode = 401;
          response.end();
	        return;
          //break;
        }
        //TODO: Add timeout.
        var controllerAddress = addressMap[reqUrl[2]];
        var motorAddress = motorMap[reqUrl[2]];
        var speed = parseInt(reqUrl[3]);
        console.log("guest: " + Code);
        console.log("controllerAddress: " + controllerAddress);
        console.log("motorAddress: " + motorAddress);
        console.log("speed: " + speed); 

        if(typeof controllerAddress != 'undefined' && typeof motorAddress != 'undefined'){
          var move = require('./move.js'); 
          move(controllerAddress, motorAddress, speed);
          response.end("MOVED\n");
        }
        else{
          response.statusCode = 404;
          response.end();
        }
      }
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
