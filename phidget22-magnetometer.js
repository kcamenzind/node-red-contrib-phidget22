var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22MagnetometerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var magnetometer = new phidget22.Magnetometer();

        magnetometer.setChannel(config.channel);
        magnetometer.setDeviceSerialNumber(config.deviceSerialNumber);
        magnetometer.setHubPort(config.hubPort);

        magnetometer.onAttach = function() {

            var msg = {topic: "Attach", payload: {}};

            magnetometer.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            magnetometer.setMagneticFieldChangeTrigger(config.magneticFieldChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setMagneticFieldChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setMagneticFieldChangeTrigger (in onAttach) not supported");
                }
            });

            if(config.setparams === true) {
                magnetometer.setCorrectionParameters(config.magneticField, config.offset0, config.offset1, config.offset2, config.gain0, config.gain1, config.gain2, config.T0, config.T1, config.T2, config.T3, config.T4, config.T5).catch(function(err){
                    if(err.errorCode != 20) {
                        // Ignore error code 20: unsupported errors expected for some devices
                        node.error("setCorrectionParameters (in onAttach) failed:" + err);
                    }
                    else {
                        if(config.debug) node.warn("setCorrectionParameters (in onAttach) not supported");
                    }
                });
            }
            
            node.send(msg);
        };

        magnetometer.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        magnetometer.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        magnetometer.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        magnetometer.onMagneticFieldChange = function(magneticField, timestamp) {
            var msg = {topic: "MagneticFieldChange", payload: {magneticField: magneticField, timestamp: timestamp}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setCorrectionParameters":
                    magnetometer.setCorrectionParameters(msg.payload.magneticField, msg.payload.offset0, msg.payload.offset1, msg.payload.offset2, msg.payload.gain0, msg.payload.gain1, msg.payload.gain2, msg.payload.T0, msg.payload.T1, msg.payload.T2, msg.payload.T3,msg.payload.T4,msg.payload.T5).then(function() {
                        if(config.debug) node.warn("setCorrectionParameters success");
                    }).catch(function (err) {
                        node.error("setCorrectionParameters failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    magnetometer.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setMagneticFieldChangeTrigger":
                    magnetometer.setMagneticFieldChangeTrigger(msg.payload.magneticFieldChangeTrigger).then(function() {
                        if(config.debug) node.warn("setMagneticFieldChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setMagneticFieldChangeTrigger failed:" + err);
                    });
                    break;

                case "resetCorrectionParameters":
                    magnetometer.resetCorrectionParameters().then(function() {
                        if(config.debug) node.warn("resetCorrectionParameters success");
                    }).catch(function (err) {
                        node.error("resetCorrectionParameters failed:" + err);
                    });
                    break;

                case "saveCorrectionParameters":
                        magnetometer.saveCorrectionParameters().then(function() {
                            if(config.debug) node.warn("saveCorrectionParameters success");
                        }).catch(function (err) {
                            node.error("saveCorrectionParameters failed:" + err);
                        });
                    break;
   
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            magnetometer.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Magnetometer (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        magnetometer.open(5000).then(function(){
            if(config.debug) node.warn("Magnetometer Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-magnetometer",Phidget22MagnetometerNode);
}