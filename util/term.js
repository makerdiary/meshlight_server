var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var m = require('mraa');
console.log('MRAA Version: ' + m.getVersion());
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
u = new m.Uart(0);
var sp = new SerialPort(u.getDevicePath(), {
    baudrate: 38400,
    dataBits: 8,
    stopBtis: 1,
    parity: 'none',
    parser: serialport.parsers.readline("\r\n")
}, true);



sp.open(function (error) {
  if (error) {
    console.log('failed to open: ' + error);
  } else {
    console.log("open successfully!");
    sp.on('data', function(data) {
      var rxstr = data.toString().trim();
      console.log(rxstr);
      
      if(rxstr.substring(0,1)=='{' && rxstr.substring(rxstr.length-1)=='}') {
        var rxobj = JSON.parse(rxstr);
        console.log(rxobj.nodeId);
      }
    });
  }
});

rl.on('line', function (cmd) {
  sp.write(cmd.trim() + '\r');
});

//close uart when exiting.
process.on('SIGINT', function () {
  console.log('closing ' + u.getDevicePath());
  sp.close(function(error) {
    if(error) {
      console.log('Failed to close: ' + error);
    }
  });
  console.log('GoodBye');
  process.exit(0);
});

