var http = require('http');						      //allows server
var exec = require('child_process').exec;		//allows terminal commands

// Admin code
var adminCode = "ALICE";

// Default guest code, can be changed by admin
var storedCode = '';

var tokenFile = '/tmp/token';

var guestCode = '';

var timeoutHandles = [];

/*

OLD MAPPING INFO

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
  headTilt:         1,
  headTurn:         2,
  armElbowLeft:     1,
  armHandOneLeft:   2,
  armHandTwoLeft:   1,
  armElbowRight:    2,
  armHandOneRight:  1,
  armHandTwoRight:  2,
  backShoulderLeft: 1,
  backShoulderRight:2,
  back:             1,
  legKneeLeft:      2,
  legKneeRight:     1,
  legHeelLeft:      2,
  legHeelRight:     1,
};



*/



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
  legKneeLeft:      133,
  legKneeRight:     133,
  legHeelLeft:      134,
  legHeelRight:     134,
  back:             135,

};

var motorMap = {
  headTilt:         1,
  headTurn:         2,
  armElbowLeft:     1,
  armHandOneLeft:   2,
  armHandTwoLeft:   1,
  armElbowRight:    2,
  armHandOneRight:  1,
  armHandTwoRight:  2,
  backShoulderLeft: 1,
  backShoulderRight:2,
  legKneeLeft:      1,
  legKneeRight:     2,
  legHeelLeft:      1,
  legHeelRight:     2,
  back:             1,

};


http.createServer(function(request, response) {				//starts server
  
  var ip = require('./ip.js');
  var ip = ip();
  

  response.setHeader('Access-Control-Allow-Origin', 'http://puppet');

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
  // Note: reqUrl="" reqUrl[1]="XYE58" reqUrl[2]="armElbowLeft" reqUrl[3]=127
  var reqUrl = request.url;

  reqUrl = reqUrl.replace('%2F','/').split('/')
  var token      = reqUrl[1];
  var controller = reqUrl[2];
  var motion     = reqUrl[3];

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

  var fs   = require('fs');                   // allows file manipulation
  fs.exists(tokenFile, function(exists) {
    if (exists) {
      storedCode = fs.readFileSync(tokenFile, "utf8");
    }
  });

  // used to check to ensure the user has the valid token (avoid input errors)
  // token/validate/XXXXX
  if (token === 'token' && controller == 'validate'){
    // in this case, token is actually stored in a different place
    token = reqUrl[3];

    if (token === adminCode) {
      response.write('admin');
      response.statusCode = 200;
      response.end();
      return;
    } else if (token === storedCode) {
      response.statusCode = 200;
      response.end();
      return;
    }  // else falls out to next block
  }

  if (controller === 'token' && motion === 'generate') {
    if (token !== adminCode) {
      response.statusCode = 401;
      response.end();
      return;
    }

    var generateGuestCode = require('./guestcode.js');
    guestCode = generateGuestCode();
    console.log("guest: " + guestCode);

    var fs = require('fs');
    fs.writeFile("/tmp/token", guestCode, function(err) {
        if(err) {
          console.log(err);
          response.statusCode = 500;
          response.end();
          return;
        }
    });

    response.write(guestCode);
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
  if (!(controller in addressMap) || !(controller in motorMap)) {
    response.statusCode = 404;
    response.end();
    return;
  }

  // TODO: check motion range and return error if invalid

  var controllerAddress = addressMap[controller];
  var motorAddress      = motorMap[controller];
  var speed             = parseInt(motion);

  //TODO: Add timeout.
  console.log("guest: " + guestCode);
  console.log("controllerAddress: " + controllerAddress);
  console.log("motorAddress: " + motorAddress);
  console.log("speed: " + speed);
  
  if(controller in timeoutHandles){
    clearTimeout(timeoutHandles[controller]);
  }

  var move = require('./move.js');
  move(controllerAddress, motorAddress, speed);
  timeoutHandles[controller] = setTimeout(function(){  move(controllerAddress, motorAddress, 0);},7000);
  response.end("MOVED\n");

}).listen(8080);
