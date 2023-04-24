var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22RCServoNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var rcServo = new phidget22.RCServo();

        rcServo.setChannel(config.channel);
        rcServo.setDeviceSerialNumber(config.deviceSerialNumber);
        rcServo.setHubPort(config.hubPort);

        rcServo.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            rcServo.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            rcServo.setAcceleration(config.acceleration).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setAcceleration (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setAcceleration (in onAttach) not supported");
                }
            });

            rcServo.setSpeedRampingState(config.speedRampingState).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setSpeedRampingState (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setSpeedRampingState (in onAttach) not supported");
                }
            });

            rcServo.setVelocityLimit(config.velocityLimit).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVelocityLimit (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVelocityLimit (in onAttach) not supported");
                }
            });

            rcServo.setVoltage(config.voltage).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVoltage (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVoltage (in onAttach) not supported");
                }
            });

            rcServo.setMinPulseWidth(config.minPulseWidth).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setMinPulseWidth (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setMinPulseWidth (in onAttach) not supported");
                }
            });

            rcServo.setMaxPulseWidth(config.maxPulseWidth).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setMaxPulseWidth (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setMaxPulseWidth (in onAttach) not supported");
                }
            });

            rcServo.setMinPosition(config.minPosition);
            rcServo.setMaxPosition(config.maxPosition);

            node.send(msg);
        };

        rcServo.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        rcServo.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        rcServo.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName}};
            node.send(msg);
        };

        rcServo.onPositionChange = function(position) {
            var msg = {topic: "PositionChange", payload: {position: position}};
            node.send(msg);
        }

        rcServo.onTargetPositionReached = function(position) {
            var msg = {topic: "TargetPositionReached", payload: {position: position}};
            node.send(msg);
        }

        rcServo.onVelocityChange = function(velocity) {
            var msg = {topic: "VelocityChange", payload: {velocity: velocity}};
            node.send(msg);
        }

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setAcceleration":
                        rcServo.setAcceleration(msg.payload.acceleration).then(function() {
                        if(config.debug) node.warn("setAcceleration success");
                    }).catch(function (err) {
                        node.error("setAcceleration failed:" + err);
                    });
                    break;

                case "setDataInterval":
                        rcServo.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setEngaged":
                        rcServo.setEngaged(msg.payload.engaged).then(function() {
                        if(config.debug) node.warn("setEngaged success");
                    }).catch(function (err) {
                        node.error("setEngaged failed:" + err);
                    });
                    break;

                case "enableFailsafe":
                        rcServo.enableFailsafe(msg.payload.failsafeTime).then(function() {
                        if(config.debug) node.warn("enableFailsafe success");
                    }).catch(function (err) {
                        node.error("enableFailsafe failed:" + err);
                    });
                    break;

                case "setMinPosition":
                    rcServo.setMinPosition(msg.payload.minPosition);
                    break;
                
                case "setMaxPosition":
                    rcServo.setMaxPosition(msg.payload.maxPosition);
                    break;

                case "setMinPulseWidth":
                        rcServo.setMinPulseWidth(msg.payload.minPulseWidth).then(function() {
                        if(config.debug) node.warn("setMinPulseWidth success");
                    }).catch(function (err) {
                        node.error("setMinPulseWidth failed:" + err);
                    });
                    break;

                case "setMaxPulseWidth":
                        rcServo.setMaxPulseWidth(msg.payload.maxPulseWidth).then(function() {
                        if(config.debug) node.warn("setMaxPulseWidth success");
                    }).catch(function (err) {
                        node.error("setMaxPulseWidth failed:" + err);
                    });
                    break;

                case "resetFailsafe":
                        rcServo.resetFailsafe().then(function() {
                        if(config.debug) node.warn("resetFailsafe success");
                    }).catch(function (err) {
                        node.error("resetFailsafe failed:" + err);
                    });
                    break;

                case "setSpeedRampingState":
                        rcServo.setSpeedRampingState(msg.payload.speedRampingState).then(function() {
                        if(config.debug) node.warn("setSpeedRampingState success");
                    }).catch(function (err) {
                        node.error("setSpeedRampingState failed:" + err);
                    });
                    break;

                case "setTargetPosition":
                        rcServo.setTargetPosition(msg.payload.targetPosition).then(function() {
                        if(config.debug) node.warn("setTargetPosition success");
                    }).catch(function (err) {
                        node.error("setTargetPosition failed:" + err);
                    });
                    break;

                case "setTorque":
                        rcServo.setTorque(msg.payload.torque).then(function() {
                        if(config.debug) node.warn("setTorque success");
                    }).catch(function (err) {
                        node.error("setTorque failed:" + err);
                    });
                    break;

                case "setVelocityLimit":
                        rcServo.setVelocityLimit(msg.payload.velocityLimit).then(function() {
                        if(config.debug) node.warn("setVelocityLimit success");
                    }).catch(function (err) {
                        node.error("setVelocityLimit failed:" + err);
                    });
                    break;

                case "setVoltage":
                        rcServo.setVoltage(msg.payload.voltage).then(function() {
                        if(config.debug) node.warn("setVoltage success");
                    }).catch(function (err) {
                        node.error("setVoltage failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            rcServo.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open RCServo (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        rcServo.open(5000).then(function(){
            if(config.debug) node.warn("RCServo Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
    }
    RED.nodes.registerType("phidget22-rcservo",Phidget22RCServoNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}