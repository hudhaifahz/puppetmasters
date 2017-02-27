module.exports = function (controllerAddress, motorAddress, speed) {
  var exec = require('child_process').exec; 
  exec('python motorcontrol.py ' + controllerAddress + ' ' + motorAddress + ' ' + speed, function(err, stdout, stderr) {
    if (err) throw err
    process.stdout.write(stdout)
    process.stderr.write(stderr)
    })
}
