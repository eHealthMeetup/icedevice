var serialport = require('serialport');
var request = require('request');
var portName = '/dev/ttyACM0';

var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);

var io = require('socket.io').listen(server);

server.listen(5000);


app.get('/', function (req, res) {
    console.log("Homepage");
    res.sendFile(__dirname + '/index.html');
});

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));
var sp = new serialport(portName,{
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});

// Send sensor data
sp.on('data', function (sensorData) {
    console.log(sensorData);
    io.on('connection', function (socket) {
        console.log("Sensor connected ...");
        socket.send(sensorData);
        socket.on('dataReceived', function (data) {
            console.log(data);
        });
    });

    // post the data to encapsia
    request({
        headers: {
            'Authorization': 'Bearer 42c3912000b849f1ab4028101653072d',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'https://ehealth.encapsia.com/v1/values',
        method: 'POST',
        json: [{
            'subject': '97ca76f7f67d4123bbe41e384cdd2ac1',
            'group': '', 'subgroup': '', 'repeat': '',
            'variable': 'BP',
            'value': sensorData
        }]
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });

});



// function getDateString() {
//     var time = new Date().getTime();
//     var datestr = new Date(time +32400000).toISOString().replace(/T/, ' ').replace(/Z/, '');
//     return datestr;
// }
