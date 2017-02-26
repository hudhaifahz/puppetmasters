var http = require('http');						//allows server
var exec = require('child_process').exec;		//allows terminal commands
//pinmap
var pinmap = {  '/?echo%2Fon=': 9,
                '/?echo%2Foff=': 9,
                '/': [9,'gpio write 9 1'] };

// Admin code
var adminCode = ""
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
//  response.writeHeader(200, {"Content-Type": "text/html"});
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

  // URL format: http://puppet/XYE58/armElbowLeft/127    127 is the speed control input value
  // reqUrl format: ",XYE58,arm,right,127"
  // Note: reqUrl[0]="" reqUrl[1]="XYE58" reqUrl[2]="armElbowLeft" reqUrl[3]=127
  var token      = reqUrl[1];
  var controller = reqUrl[2];
  var motion     = reqUrl[3];

  var reqUrl = request.url;
  console.log(reqUrl);
  reqUrl = reqUrl[0].replace('%2F','/').split('/')
  console.log("reqUrl: " + reqUrl);
  console.log("reqUrl0: " + reqUrl[0]);
  console.log("reqUrl1: " + reqUrl[1]);
  console.log("reqUrl11: " + reqUrl[1][1]);
  console.log(reqUrl);
  console.log(reqUrl[0]);
  console.log(reqUrl[1]);
  console.log(reqUrl[1][1]);

  // exit early if it's not a GET request,
  // exit early if there's no access code (401 error),
  // exit if the access code is not (valid or admin),
  // handle the admin code (return a new code).

  if (request.method !== 'GET') {
    response.statusCode = 404;
    response.end();
    return;
  }

  // if token is not 5 digits
  if (token.length !== 5) {
    response.statusCode = 401;
    response.end();
    return;
  }

  // if admin code, generate a guest code and return it.
  if (token === adminCode) {
    var guestCode = require('./guestcode.js');
    Code = guestCode();

    // TODO: output guest code
  }

  // TODO: fetch current stored code here

  // used to check to ensure the user has the valid token (avoid input errors)
  // token/validate/XXXXX
  if (token === 'token' && controller == 'validate' && motion == storedCode) {
    response.statusCode = 200;
    response.end();
    return;
  }

  // ensure the token is valid
  if (token !== storedCode) {
    response.statusCode = 401;
    response.end();
    return;
  }

  // verify controller
  if (!(controller in addressMap) || !(controller in motorAddress)) {
    response.statusCode = 404;
    response.end();
    return;
  }

  // TODO: check motion range and return error if invalid

  var controllerAddress = addressMap[controller];
  var motorAddress      = motorMap[controlelr];
  var speed             = parseInt(motion);

  //TODO: Add timeout.
  console.log("guest: " + Code);
  console.log("controllerAddress: " + controllerAddress);
  console.log("motorAddress: " + motorAddress);
  console.log("speed: " + speed);

  var move = require('./move.js');
  move(controllerAddress, motorAddress, speed);
  response.end("MOVED\n");

}).listen(8080);

});
