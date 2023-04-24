var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22VoltageRatioInputNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var voltageRatioInput = new phidget22.VoltageRatioInput();

        voltageRatioInput.setChannel(config.channel);
        voltageRatioInput.setDeviceSerialNumber(config.deviceSerialNumber);
        voltageRatioInput.setIsHubPortDevice(config.isHubPortDevice);
        voltageRatioInput.setHubPort(config.hubPort);

        voltageRatioInput.onAttach = function() {
            
            var msg = {topic: "Attach", payload: {}};

            voltageRatioInput.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            voltageRatioInput.setVoltageRatioChangeTrigger(config.voltageRatioChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVoltageRatioChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVoltageRatioChangeTrigger (in onAttach) not supported");
                }
            });

            voltageRatioInput.setSensorType(config.sensorType).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setSensorType (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setSensorType (in onAttach) not supported");
                }
            });

            voltageRatioInput.setBridgeGain(config.bridgeGain).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setBridgeGain (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setBridgeGain (in onAttach) not supported");
                }
            });
 
            node.send(msg);
        };

        voltageRatioInput.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        voltageRatioInput.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        voltageRatioInput.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        voltageRatioInput.onVoltageRatioChange = function(voltageRatio) {
            var msg = {topic: "VoltageratioChange", payload: {voltageRatio: voltageRatio}};
            node.send(msg);
        };

        voltageRatioInput.onSensorChange = function(sensorValue, sensorUnit) {
            var msg = {topic: "SensorChange", payload: {sensorValue: sensorValue, sensorUnit: sensorUnit}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setBridgeEnabled":
                    voltageRatioInput.setBridgeEnabled(msg.payload.bridgeEnabled).then(function() {
                        if(config.debug) node.warn("setBridgeEnabled success");
                    }).catch(function (err) {
                        node.error("setBridgeEnabled failed:" + err);
                    });
                    break;

                case "setBridgeGain":
                    voltageRatioInput.setBridgeGain(msg.payload.bridgeGain).then(function() {
                        if(config.debug) node.warn("setBridgeGain success");
                    }).catch(function (err) {
                        node.error("setBridgeGain failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    voltageRatioInput.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setSensorType":
                    voltageRatioInput.setSensorType(msg.payload.sensorType).then(function() {
                        if(config.debug) node.warn("setSensorType success");
                    }).catch(function (err) {
                        node.error("setSensorType failed:" + err);
                    });
                    break;

                    
                case "setSensorValueChangeTrigger":
                    voltageRatioInput.setSensorValueChangeTrigger(msg.payload.sensorValueChangeTrigger).then(function() {
                        if(config.debug) node.warn("setSensorValueChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setSensorValueChangeTrigger failed:" + err);
                    });
                    break;

                case "setVoltageRatioChangeTrigger":
                    voltageRatioInput.setVoltageRatioChangeTrigger(msg.payload.voltageRatioChangeTrigger).then(function() {
                        if(config.debug) node.warn("setVoltageRatioChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setVoltageRatioChangeTrigger failed:" + err);
                    });
                    break;
 
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            voltageRatioInput.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open VoltageRatioInput (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        voltageRatioInput.open(5000).then(function(){
            if(config.debug) node.warn("VoltageRatioInput Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-voltageratioinput",Phidget22VoltageRatioInputNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}