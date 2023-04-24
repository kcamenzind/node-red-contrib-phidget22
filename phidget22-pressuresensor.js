var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22PressureSensorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var pressureSensor = new phidget22.PressureSensor();

        pressureSensor.setChannel(config.channel);
        pressureSensor.setDeviceSerialNumber(config.deviceSerialNumber);

        pressureSensor.onAttach = function() {

            var msg = {topic: "Attach", payload: {}};

            pressureSensor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            pressureSensor.setPressureChangeTrigger(config.pressureChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setPressureChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setPressureChangeTrigger (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        pressureSensor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        pressureSensor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        pressureSensor.onPressureChange = function(pressure) {
            var msg = {topic: "PressureChange", payload: {pressure: pressure}};
            node.send(msg);
        };

        pressureSensor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setDataInterval":
                        pressureSensor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setPressureChangeTrigger":
                        pressureSensor.setPressureChangeTrigger(msg.payload.pressureChangeTrigger).then(function() {
                        if(config.debug) node.warn("setPressureChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setPressureChangeTrigger failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            pressureSensor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open PressureSensor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        pressureSensor.open(5000).then(function(){
            if(config.debug) node.warn("PressureSensor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-pressuresensor",Phidget22PressureSensorNode);
}