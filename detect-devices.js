var SensorTag = require('sensortag');

function onDiscover(sensorTag) {
  console.log('discovered: ' + sensorTag);
  sensorTag.connectAndSetUp(function() {
    console.log('waiting for button press ...');

    sensorTag.on('simpleKeyChange', function(left, right, reedRelay) {
      console.log(this.id, this.uuid);
    });

    sensorTag.notifySimpleKey(function(e){
      console.log('notifySimpleKey.error', e);
    });
  });
}

SensorTag.discoverAll(onDiscover);

//SensorTag.stopDiscoverAll(onDiscover);