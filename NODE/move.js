module.exports = function (limb, speed, direction) {
  var pwmValue = 0;
  var pin;
  //input security check
  if(0<=limb<=17 && Number.isInteger(limb)){
  	if(speed === "fast" || speed === "mid" || speed === "slow"){
  	  if(direction === "up" || direction === "down"){

		  if(speed === 'fast'){
		  	pwmValue = 1023; 	//full speed
		  }
		  else if(speed === 'mid'){
		  	pwmValue = 600;
		  }
		  else{
		  	pwmValue = 200;
		  }

		  //TODO: Convert limb# into output pin, depends on limb# and direction and the wiring

		  //		Suppose for each motor we need 2 pins to control it: for example, for limb
		  //		#02 (right upper arm), we are using pin 2 and pin 3. In this case, to move
		  //		limb up we give pin 2 positive output and pin 3 0 (GND), and to move limb down
		  //		we give pin 2 0 (GND) and pin 3 positive output
		  
		  //TODO: Add timeout for moves, restrict each move to a certain amount of time (maybe
		  //		1 second). This is a safty feature.


		  if(direction === 'up'){
			  var exec = require('child_process').exec; 
			  exec('gpio pwm ' + pin + ' ' + pwmValue, function(err, stdout, stderr) {
			    if (err) throw err
			    process.stdout.write(stdout)
			    process.stderr.write(stderr)
			    })
		  }
		  else{
		  	  pin = pin + 1;
		  	  var exec = require('child_process').exec; 
			  exec('gpio pwm ' + pin + ' ' + pwmValue, function(err, stdout, stderr) {
			    if (err) throw err
			    process.stdout.write(stdout)
			    process.stderr.write(stderr)
			    })
		  }	    	
  	  }
  	}
  }
}
