var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22StepperNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var stepper = new phidget22.Stepper();

        stepper.setChannel(config.channel);
        stepper.setDeviceSerialNumber(config.deviceSerialNumber);
        stepper.setHubPort(config.hubPort);

        stepper.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            stepper.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            stepper.setAcceleration(config.acceleration).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setAcceleration (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setAcceleration (in onAttach) not supported");
                }
            });

            stepper.setVelocityLimit(config.velocityLimit).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVelocityLimit (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVelocityLimit (in onAttach) not supported");
                }
            });

            stepper.setCurrentLimit(config.currentLimit).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setCurrentLimit (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setCurrentLimit (in onAttach) not supported");
                }
            });

            stepper.setHoldingCurrentLimit(config.holdingCurrentLimit).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setHoldingCurrentLimit (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setHoldingCurrentLimit (in onAttach) not supported");
                }
            });

            stepper.setControlMode(config.controlMode).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setControlMode (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setControlMode (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        stepper.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        stepper.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        stepper.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        stepper.onPositionChange = function(position) {
            var msg = {topic: "PositionChange", payload: {position: position}};
            node.send(msg);
        }

        stepper.onVelocityChange = function(velocity) {
            var msg = {topic: "VelocityChange", payload: {velocity: velocity}};
            node.send(msg);
        }

        stepper.onStopped = function() {
            var msg = {topic: "Stopped", payload: {}};
            node.send(msg);
        }

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setAcceleration":
                    stepper.setAcceleration(msg.payload.acceleration).then(function() {
                        if(config.debug) node.warn("setAcceleration success");
                    }).catch(function (err) {
                        node.error("setAcceleration failed:" + err);
                    });
                    break;

                case "setControlMode":
                    stepper.setControlMode(msg.payload.controlMode).then(function() {
                        if(config.debug) node.warn("setControlMode success");
                    }).catch(function (err) {
                        node.error("setControlMode failed:" + err);
                    });
                    break;

                case "setCurrentLimit":
                    stepper.setCurrentLimit(msg.payload.currentLimit).then(function() {
                        if(config.debug) node.warn("setCurrentLimit success");
                    }).catch(function (err) {
                        node.error("setCurrentLimit failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    stepper.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setEngaged":
                    stepper.setEngaged(msg.payload.engaged).then(function() {
                        if(config.debug) node.warn("setEngaged success");
                    }).catch(function (err) {
                        node.error("setEngaged failed:" + err);
                    });
                    break;

                case "enableFailsafe":
                    stepper.enableFailsafe(msg.payload.failsafeTime).then(function() {
                        if(config.debug) node.warn("enableFailsafe success");
                    }).catch(function (err) {
                        node.error("enableFailsafe failed:" + err);
                    });
                    break;

                case "setHoldingCurrentLimit":
                    stepper.setHoldingCurrentLimit(msg.payload.holdingCurrent).then(function() {
                        if(config.debug) node.warn("setHoldingCurrentLimit success");
                    }).catch(function (err) {
                        node.error("setHoldingCurrentLimit failed:" + err);
                    });
                    break;

                case "addPositionOffset":
                    stepper.addPositionOffset(msg.payload.positionOffset);
                    break;

                case "setRescaleFactor":
                    stepper.setRescaleFactor(msg.payload.rescaleFactor);
                    break;

                case "resetFailsafe":
                    stepper.resetFailsafe().then(function() {
                        if(config.debug) node.warn("resetFailsafe success");
                    }).catch(function (err) {
                        node.error("resetFailsafe failed:" + err);
                    });
                    break;

                case "setTargetPosition":
                    stepper.setTargetPosition(msg.payload.targetPosition).then(function() {
                        if(config.debug) node.warn("setTargetPosition success");
                    }).catch(function (err) {
                        node.error("setTargetPosition failed:" + err);
                    });
                    break;

                case "setVelocityLimit":
                    stepper.setVelocityLimit(msg.payload.velocityLimit).then(function() {
                        if(config.debug) node.warn("setVelocityLimit success");
                    }).catch(function (err) {
                        node.error("setVelocityLimit failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            stepper.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Stepper (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        stepper.open(5000).then(function(){
            if(config.debug) node.warn("Stepper Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
    }
    RED.nodes.registerType("phidget22-stepper",Phidget22StepperNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}