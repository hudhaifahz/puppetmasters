var http = require('http');						//allows server
var exec = require('child_process').exec;				//allows terminal commands


//pinmap
var pinmap = { '/?echo%2Fon=': 9, '/?echo%2Foff=': 9, '/': [9,'gpio write 9 1'] };

// for html test
var fs = require('fs');							//allows reading of file, only for test
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
  if (request.method === 'GET' && request.url === '/') {    
    var a = request.url;
    var i = pinmap[a];
    console.log(a);
    console.log(i);
	console.log(i[0]);
	console.log(i[1]);
    var ontest = require('./ontest.js');
    ontest(i[1]);
//  exec( './blink' , function(err, stdout, stderr) {
//  if (err) throw err
//  process.stdout.write(stdout)
//  process.stderr.write(stderr)
//  });
    response.end();
    

//    response.writeHeader(200, {"Content-Type": "text/html"});
//    response.write(html);
//    response.end();
//    request.pipe(response);
//    response.writeHead(200, {"Content-Type": "text/plain"});
//    response.end("Hello World\n");
  }
  else if (request.method === 'GET' && request.url === '/?echo%2Fon='){
      var on = require('./on.js');
      on();
//    exec('gpio write 9 1', function(err, stdout, stderr) {
//    if (err) throw err
//    process.stdout.write(stdout)
//    process.stderr.write(stderr)
//    })
    response.end("ON\n");
  }
  else if (request.method === 'GET' && request.url === '/?echo%2Foff='){
      var off = require('./off.js');
      off();
//    exec('gpio write 9 0', function(err, stdout, stderr) {
//    if (err) throw err
//   process.stdout.write(stdout)
//   process.stderr.write(stderr)
//    })
    response.end("OFF\n");
  } 
  else {
    response.statusCode = 404;
    response.end();
  }
}).listen(8080);

});

