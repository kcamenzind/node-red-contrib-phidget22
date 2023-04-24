var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22LightSensorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var lightSensor = new phidget22.LightSensor();

        lightSensor.setChannel(config.channel);
        lightSensor.setDeviceSerialNumber(config.deviceSerialNumber);

        lightSensor.onAttach = function() {

            var msg = {topic: "Attach", payload: {}};

            lightSensor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            lightSensor.setIlluminanceChangeTrigger(config.illuminanceChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setIlluminanceChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setIlluminanceChangeTrigger (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        lightSensor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        lightSensor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        lightSensor.onIlluminanceChange = function(illuminance) {
            var msg = {topic: "IlluminanceChange", payload: {illuminance: illuminance}};
            node.send(msg);
        };

        lightSensor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setDataInterval":
                    lightSensor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setIlluminanceChangeTrigger":
                    lightSensor.setIlluminanceChangeTrigger(msg.payload.illuminanceChangeTrigger).then(function() {
                        if(config.debug) node.warn("setIlluminanceChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setIlluminanceChangeTrigger failed:" + err);
                    });
                    break;
   
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            lightSensor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open LightSensor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        lightSensor.open(5000).then(function(){
            if(config.debug) node.warn("LightSensor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-lightsensor",Phidget22LightSensorNode);
}