var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22MotorPositionControllerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var motorPositionController = new phidget22.MotorPositionController();

        motorPositionController.setChannel(config.channel);
        motorPositionController.setDeviceSerialNumber(config.deviceSerialNumber);
        motorPositionController.setHubPort(config.hubPort);

        motorPositionController.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            motorPositionController.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });
            
            motorPositionController.setKp(config.kp).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setKp (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setKp (in onAttach) not supported");
                }
            });

            motorPositionController.setKi(config.ki).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setKi (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setKi (in onAttach) not supported");
                }
            });

            motorPositionController.setKd(config.kd).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setKd (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setKd (in onAttach) not supported");
                }
            });

            motorPositionController.setAcceleration(config.acceleration).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setAcceleration (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setAcceleration (in onAttach) not supported");
                }
            });

            motorPositionController.setVelocityLimit(config.velocityLimit).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVelocityLimit (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVelocityLimit (in onAttach) not supported");
                }
            });

            motorPositionController.setStallVelocity(config.stallVelocity).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setStallVelocity (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setStallVelocity (in onAttach) not supported");
                }
            });

            motorPositionController.setDeadBand(config.deadBand).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDeadBand (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDeadBand (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        motorPositionController.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        motorPositionController.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        motorPositionController.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        motorPositionController.onPositionChange = function(position) {
            var msg = {topic: "PositionChange", payload: {position: position}};
            node.send(msg);
        }

        motorPositionController.onDutyCycleUpdate = function(dutyCycle) {
            var msg = {topic: "DutyCycleUpdate", payload: {dutyCycle: dutyCycle}};
            node.send(msg);
        }

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "getAcceleration":
                    var msg = {topic:"getAcceleration", _msgid: msg._msgid, payload: {Acceleration: motorPositionController.getAcceleration()}};
                    node.send(msg);
                    break;

                case "setAcceleration":
                    motorPositionController.setAcceleration(msg.payload.acceleration).then(function() {
                        if(config.debug) node.warn("setAcceleration success");
                    }).catch(function (err) {
                        node.error("setAcceleration failed:" + err);
                    });
                    break;

                case "getMinAcceleration":
                    var msg = {topic:"getMinAcceleration", _msgid: msg._msgid, payload: {MinAcceleration: motorPositionController.getMinAcceleration()}};
                    node.send(msg);
                    break;

                case "getMaxAcceleration":
                    var msg = {topic:"getMaxAcceleration", _msgid: msg._msgid, payload: {MaxAcceleration: motorPositionController.getMaxAcceleration()}};
                    node.send(msg);
                    break;

                case "getCurrentLimit":
                    var msg = {topic:"getCurrentLimit", _msgid: msg._msgid, payload: {CurrentLimit: motorPositionController.getCurrentLimit()}};
                    node.send(msg);
                    break;

                case "setCurrentLimit":
                    motorPositionController.setCurrentLimit(msg.payload.currentLimit).then(function() {
                        if(config.debug) node.warn("setCurrentLimit success");
                    }).catch(function (err) {
                        node.error("setCurrentLimit failed:" + err);
                    });
                    break;

                case "getMinCurrentLimit":
                    var msg = {topic:"getMinCurrentLimit", _msgid: msg._msgid, payload: {MinCurrentLimit: motorPositionController.getMinCurrentLimit()}};
                    node.send(msg);
                    break;

                case "getMaxCurrentLimit":
                    var msg = {topic:"getMaxCurrentLimit", _msgid: msg._msgid, payload: {MaxCurrentLimit: motorPositionController.getMaxCurrentLimit()}};
                    node.send(msg);
                    break;

                case "getCurrentRegulatorGain":
                    var msg = {topic:"getCurrentRegulatorGain", _msgid: msg._msgid, payload: {CurrentRegulatorGain: motorPositionController.getCurrentRegulatorGain()}};
                    node.send(msg);
                    break;

                case "setCurrentRegulatorGain":
                    motorPositionController.setCurrentRegulatorGain(msg.payload.currentRegulatorGain).then(function() {
                        if(config.debug) node.warn("setCurrentRegulatorGain success");
                    }).catch(function (err) {
                        node.error("setCurrentRegulatorGain failed:" + err);
                    });
                    break;

                case "getMinCurrentRegulatorGain":
                    var msg = {topic:"getMinCurrentRegulatorGain", _msgid: msg._msgid, payload: {MinCurrentRegulatorGain: motorPositionController.getMinCurrentRegulatorGain()}};
                    node.send(msg);
                    break;

                case "getMaxCurrentRegulatorGain":
                    var msg = {topic:"getMaxCurrentRegulatorGain", _msgid: msg._msgid, payload: {MaxCurrentRegulatorGain: motorPositionController.getMaxCurrentRegulatorGain()}};
                    node.send(msg);
                    break;

                case "getDataInterval":
                    var msg = {topic:"getDataInterval", _msgid: msg._msgid, payload: {DataInterval: motorPositionController.getDataInterval()}};
                    node.send(msg);
                    break;

                case "setDataInterval":
                    motorPositionController.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "getMinDataInterval":
                    var msg = {topic:"getMinDataInterval", _msgid: msg._msgid, payload: {MinDataInterval: motorPositionController.getMinDataInterval()}};
                    node.send(msg);
                    break;

                case "getMaxDataInterval":
                    var msg = {topic:"getMaxDataInterval", _msgid: msg._msgid, payload: {MaxDataInterval: motorPositionController.getMaxDataInterval()}};
                    node.send(msg);
                    break;

                case "getDeadBand":
                    var msg = {topic:"getDeadBand", _msgid: msg._msgid, payload: {DeadBand: motorPositionController.getDeadBand()}};
                    node.send(msg);
                    break;

                case "setDeadBand":
                    motorPositionController.setDeadBand(msg.payload.deadBand).then(function() {
                        if(config.debug) node.warn("setDeadBand success");
                    }).catch(function (err) {
                        node.error("setDeadBand failed:" + err);
                    });
                    break;

                case "getDutyCycle":
                    var msg = {topic:"getDutyCycle", _msgid: msg._msgid, payload: {DutyCycle: motorPositionController.getDutyCycle()}};
                    node.send(msg);
                    break;

                case "getEngaged":
                    var msg = {topic:"getEngaged", _msgid: msg._msgid, payload: {Engaged: motorPositionController.getEngaged()}};
                    node.send(msg);
                    break;

                case "setEngaged":
                    motorPositionController.setEngaged(msg.payload.engaged).then(function() {
                        if(config.debug) node.warn("setEngaged success");
                    }).catch(function (err) {
                        node.error("setEngaged failed:" + err);
                    });
                    break;

                case "enableFailsafe":
                    motorPositionController.enableFailsafe(msg.payload.failsafeTime).then(function() {
                        if(config.debug) node.warn("enableFailsafe success");
                    }).catch(function (err) {
                        node.error("enableFailsafe failed:" + err);
                    });
                    break;

                case "getMinFailsafeTime":
                    var msg = {topic:"getMinFailsafeTime", _msgid: msg._msgid, payload: {MinFailsafeTime: motorPositionController.getMinFailsafeTime()}};
                    node.send(msg);
                    break;

                case "getMaxFailsafeTime":
                    var msg = {topic:"getMaxFailsafeTime", _msgid: msg._msgid, payload: {MaxFailsafeTime: motorPositionController.getMaxFailsafeTime()}};
                    node.send(msg);
                    break;

                case "getFanMode":
                    var msg = {topic:"getFanMode", _msgid: msg._msgid, payload: {FanMode: motorPositionController.getFanMode()}};
                    node.send(msg);
                    break;

                case "setFanMode":
                    motorPositionController.setFanMode(msg.payload.fanMode).then(function() {
                        if(config.debug) node.warn("setFanMode success");
                    }).catch(function (err) {
                        node.error("setFanMode failed:" + err);
                    });
                    break;

                case "getIOMode":
                    var msg = {topic:"getIOMode", _msgid: msg._msgid, payload: {IOMode: motorPositionController.getIOMode()}};
                    node.send(msg);
                    break;

                case "setIOMode":
                    motorPositionController.setEngaged(msg.payload.IOMode).then(function() {
                        if(config.debug) node.warn("setEngaged success");
                    }).catch(function (err) {
                        node.error("setEngaged failed:" + err);
                    });
                    break;

                case "getKd":
                    var msg = {topic:"getKd", _msgid: msg._msgid, payload: {Kd: motorPositionController.getKd()}};
                    node.send(msg);
                    break;

                case "setKd":
                    motorPositionController.setKd(msg.payload.kd).then(function() {
                        if(config.debug) node.warn("setKd success");
                    }).catch(function (err) {
                        node.error("setKd failed:" + err);
                    });
                    break;

                case "getKi":
                    var msg = {topic:"getKi", _msgid: msg._msgid, payload: {Ki: motorPositionController.getKi()}};
                    node.send(msg);
                    break;

                case "setKi":
                    motorPositionController.setKi(msg.payload.ki).then(function() {
                        if(config.debug) node.warn("setKi success");
                    }).catch(function (err) {
                        node.error("setKi failed:" + err);
                    });
                    break;

                case "getKp":
                    var msg = {topic:"getKp", _msgid: msg._msgid, payload: {Kp: motorPositionController.getKp()}};
                    node.send(msg);
                    break;

                case "setKp":
                    motorPositionController.setKp(msg.payload.kp).then(function() {
                        if(config.debug) node.warn("setKp success");
                    }).catch(function (err) {
                        node.error("setKp failed:" + err);
                    });
                    break;

                case "getPosition":
                    var msg = {topic:"getPosition", _msgid: msg._msgid, payload: {Position: motorPositionController.getPosition()}};
                    node.send(msg);
                    break;

                case "getMinPosition":
                    var msg = {topic:"getMinPosition", _msgid: msg._msgid, payload: {MinPosition: motorPositionController.getMinPosition()}};
                    node.send(msg);
                    break;

                case "getMaxPosition":
                    var msg = {topic:"getMaxPosition", _msgid: msg._msgid, payload: {MaxPosition: motorPositionController.getMaxPosition()}};
                    node.send(msg);
                    break;

                case "addPositionOffset":
                    motorPositionController.addPositionOffset(msg.payload.positionOffset);
                    break;

                case "getRescaleFactor":
                    var msg = {topic:"getRescaleFactor", _msgid: msg._msgid, payload: {RescaleFactor: motorPositionController.getRescaleFactor()}};
                    node.send(msg);
                    break;

                case "setRescaleFactor":
                    motorPositionController.setRescaleFactor(msg.payload.rescaleFactor);
                    break;

                case "resetFailsafe":
                    motorPositionController.resetFailsafe().then(function() {
                        if(config.debug) node.warn("resetFailsafe success");
                    }).catch(function (err) {
                        node.error("resetFailsafe failed:" + err);
                    });
                    break;

                case "getStallVelocity":
                    var msg = {topic:"getStallVelocity", _msgid: msg._msgid, payload: {StallVelocity: motorPositionController.getStallVelocity()}};
                    node.send(msg);
                    break;

                case "setStallVelocity":
                    motorPositionController.setStallVelocity(msg.payload.stallVelocity).then(function() {
                        if(config.debug) node.warn("setStallVelocity success");
                    }).catch(function (err) {
                        node.error("setStallVelocity failed:" + err);
                    });
                    break;

                case "getMinStallVelocity":
                    var msg = {topic:"getMinStallVelocity", _msgid: msg._msgid, payload: {MinStallVelocity: motorPositionController.getMinStallVelocity()}};
                    node.send(msg);
                    break;

                case "getMaxStallVelocity":
                    var msg = {topic:"getMaxStallVelocity", _msgid: msg._msgid, payload: {MaxStallVelocity: motorPositionController.getMaxStallVelocity()}};
                    node.send(msg);
                    break;

                case "getTargetPosition":
                        var msg = {topic:"getTargetPosition", _msgid: msg._msgid, payload: {TargetPosition: motorPositionController.getTargetPosition()}};
                        node.send(msg);
                        break;

                case "setTargetPosition":
                    motorPositionController.setTargetPosition(msg.payload.targetPosition).then(function() {
                        if(config.debug) node.warn("setTargetPosition success");
                    }).catch(function (err) {
                        node.error("setTargetPosition failed:" + err);
                    });
                    break;

                case "getVelocityLimit":
                    var msg = {topic:"getVelocityLimit", _msgid: msg._msgid, payload: {VelocityLimit: motorPositionController.getVelocityLimit()}};
                    node.send(msg);
                    break;

                case "setVelocityLimit":
                    motorPositionController.setVelocityLimit(msg.payload.velocityLimit).then(function() {
                        if(config.debug) node.warn("setVelocityLimit success");
                    }).catch(function (err) {
                        node.error("setVelocityLimit failed:" + err);
                    });
                    break;

                case "getMinVelocityLimit":
                    var msg = {topic:"getMinVelocityLimit", _msgid: msg._msgid, payload: {MinVelocityLimit: motorPositionController.getMinVelocityLimit()}};
                    node.send(msg);
                    break;

                case "getMaxVelocityLimit":
                    var msg = {topic:"getMaxVelocityLimit", _msgid: msg._msgid, payload: {MaxVelocityLimit: motorPositionController.getMaxVelocityLimit()}};
                    node.send(msg);
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            motorPositionController.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open MotorPositionController (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        motorPositionController.open(5000).then(function(){
            if(config.debug) node.warn("MotorPositionController Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
    }
    RED.nodes.registerType("phidget22-motorpositioncontroller",Phidget22MotorPositionControllerNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}