module.exports = function () {
  var exec = require('child_process').exec;
  exec('gpio write 9 0', function(err, stdout, stderr) {
    if (err) throw err
    process.stdout.write(stdout)
    process.stderr.write(stderr)
    })
}