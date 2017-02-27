//sourced from: http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js

module.exports = function () {

'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var output;

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      //console.log(iface.address);
      output = iface.address;
    } else {
      // this interface has only one ipv4 adress
      //console.log(iface.address);
      output = iface.address;
    }
    ++alias;
  });
});

return output;
}
