var io = require('socket.io')();
var SensorTag = require('sensortag');
var Sensor = require('./sensor');
var logger = require('./logger');

var sensors = [];

function updateSensors(target) {
  target.emit('UPDATE_SENSORS', sensors.map(sensor => sensor.getId()));
}
function updateButton(target, sensor) {
  target.emit('BUTTON_PRESS', sensor.getId());
}
function updateAccelerometerChange(target, sensor, x, y, z) {
  target.emit('ACCELEROMETER_CHANGE', {
    sensorId: sensor.getId(),
    x,
    y,
    z
  });
}

function onDiscover(sensorTag) {
  console.log('onDiscover:', sensorTag.uuid);
  sensorTag.connectAndSetUp(function() {
    logger.info('on connectAndSetUp: ', sensorTag.uuid);
    var sensor = new Sensor(sensorTag);
    sensors.push(sensor);
    updateSensors(io);

    sensor.start();
    sensor.on('accelerometerChange', (x, y, z) => {
      logger.debug('accelerometerChange', x, y, z);
      updateAccelerometerChange(io, sensor, x, y, z);
    });
    sensor.on('buttonPress', () => {
      logger.debug('buttonPress');
      updateButton(io, sensor);
    });
    
  });
}

SensorTag.discoverAll(onDiscover);

io.on('connection', socket => {
  logger.info('Socket client connected');
  socket.emit('test', 'foo');
  updateSensors(socket);
  socket.on('test-send', (msg) => {
    logger.info('Socket ping', msg);
    socket.emit('ping', msg)
  });
});

io.listen(3000);
