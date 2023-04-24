var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22AccelerometerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var accelerometer = new phidget22.Accelerometer();

        accelerometer.setChannel(config.channel);
        accelerometer.setDeviceSerialNumber(config.deviceSerialNumber);
        accelerometer.setHubPort(config.hubPort);

        accelerometer.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            accelerometer.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });
            accelerometer.setAccelerationChangeTrigger(config.accelerationChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setAccelerationChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setAccelerationChangeTrigger (in onAttach) not supported");
                }
            });
 
            node.send(msg);
        };

        accelerometer.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        accelerometer.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        accelerometer.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        accelerometer.onAccelerationChange = function(acceleration, timestamp) {
            var msg = {topic: "AccelerationChange", payload: {acceleration: acceleration, timestamp: timestamp}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setAccelerationChangeTrigger":
                    accelerometer.setAccelerationChangeTrigger(msg.payload.accelerationChangeTrigger).then(function() {
                        if(config.debug) node.warn("setAccelerationChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setAccelerationChangeTrigger failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    accelerometer.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            accelerometer.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Accelerometer (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        accelerometer.open(5000).then(function(){
            if(config.debug) node.warn("Accelerometer Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-accelerometer",Phidget22AccelerometerNode);
}