module.exports = function (outPin, speed) {
  var pwmValue = 0;
  var pin = outPin;

  if(speed>=0){	
  	  speed = Math.min(speed, 127);
  	  pwmValue = 1023 * (speed / 127);
	  var exec = require('child_process').exec; 
	  exec('gpio pwm ' + pin + ' ' + pwmValue, function(err, stdout, stderr) {
	    if (err) throw err
	    process.stdout.write(stdout)
	    process.stderr.write(stderr)
	    })
  }
  else{
  	//TODO: Decide what to do for negative input (move down) - see detail problem description in request.js
  	//		For now, temporarily putting a place holder that let it does the same as positive input
  	  speed = -1 * Math.max(speed, -127);
  	    	  pwmValue = 1023 * (speed / 127);
	  var exec = require('child_process').exec; 
  	  exec('gpio pwm ' + pin + ' ' + pwmValue, function(err, stdout, stderr) {
	    if (err) throw err
	    process.stdout.write(stdout)
	    process.stderr.write(stderr)
	    })
  }	


}
