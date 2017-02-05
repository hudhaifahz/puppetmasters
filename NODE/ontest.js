module.exports = function (i) {
  var exec = require('child_process').exec;
  
  console.log(i);
  exec( i , function(err, stdout, stderr) {
    if (err) throw err
    process.stdout.write(stdout)
    process.stderr.write(stderr)
    })
}

