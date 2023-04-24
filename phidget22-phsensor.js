var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22PHSensorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var phSensor = new phidget22.PHSensor();

        phSensor.setChannel(config.channel);
        phSensor.setDeviceSerialNumber(config.deviceSerialNumber);

        phSensor.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            phSensor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            phSensor.setPHChangeTrigger(config.PHChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setPHChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setPHChangeTrigger (in onAttach) not supported");
                }
            });

            phSensor.setCorrectionTemperature(config.correctionTemperature).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setCorrectionTemperature (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setCorrectionTemperature (in onAttach) not supported");
                }
            });
            
            node.send(msg);
        };

        phSensor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        phSensor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        phSensor.onPHChange = function(PH) {
            var msg = {topic: "PHChange", payload: {PH: PH}};
            node.send(msg);
        };

        phSensor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {

                case "setCorrectionTemperature":
                    phSensor.setCorrectionTemperature(msg.payload.correctionTemperature).then(function() {
                        if(config.debug) node.warn("setCorrectionTemperature success");
                    }).catch(function (err) {
                        node.error("setCorrectionTemperature failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    phSensor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setPHChangeTrigger":
                    phSensor.setPHChangeTrigger(msg.payload.PHChangeTrigger).then(function() {
                        if(config.debug) node.warn("setPHChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setPHChangeTrigger failed:" + err);
                    });
                    break;
       
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            phSensor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open PHSensor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        phSensor.open(5000).then(function(){
            if(config.debug) node.warn("PHSensor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-phsensor",Phidget22PHSensorNode);
}