var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22DCMotorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var dcMotor = new phidget22.DCMotor();

        dcMotor.setChannel(config.channel);
        dcMotor.setDeviceSerialNumber(config.deviceSerialNumber);
        dcMotor.setHubPort(config.hubPort);

        dcMotor.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            dcMotor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            dcMotor.setBackEMFSensingState(config.backEMFSensingState).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setBackEMFSensingState (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setBackEMFSensingState (in onAttach) not supported");
                }
            });

            dcMotor.setAcceleration(config.acceleration).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setAcceleration (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setAcceleration (in onAttach) not supported");
                }
            });

            dcMotor.setCurrentLimit(config.currentLimit).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setCurrentLimit (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setCurrentLimit (in onAttach) not supported");
                }
            });

            dcMotor.setCurrentRegulatorGain(config.currentRegulatorGain).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setCurrentRegulatorGain (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setCurrentRegulatorGain (in onAttach) not supported");
                }
            });

            dcMotor.setTargetBrakingStrength(config.targetBrakingStrength).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setTargetBrakingStrength (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setTargetBrakingStrength (in onAttach) not supported");
                }
            });

            dcMotor.setFanMode(config.fanMode).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setFanMode (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setFanMode (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        dcMotor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        dcMotor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        dcMotor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        dcMotor.onBackEMFChange = function(backEMF) {
            var msg = {topic: "BackEMFChange", payload: {backEMF: backEMF}};
            node.send(msg);
        }

        dcMotor.onBrakingStrengthChange = function(brakingStrength) {
            var msg = {topic: "BrakingStrengthChange", payload: {brakingStrength: brakingStrength}};
            node.send(msg);
        }

        dcMotor.onVelocityUpdate = function(velocity) {
            var msg = {topic: "VelocityUpdate", payload: {velocity: velocity}};
            node.send(msg);
        }

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "getAcceleration":
                    var msg = {topic:"getAcceleration", _msgid: msg._msgid, payload: {Acceleration: dcMotor.getAcceleration()}};
                    node.send(msg);
                    break;

                case "setAcceleration":
                    dcMotor.setAcceleration(msg.payload.acceleration).then(function() {
                        if(config.debug) node.warn("setAcceleration success");
                    }).catch(function (err) {
                        node.error("setAcceleration failed:" + err);
                    });
                    break;

                case "getMinAcceleration":
                    var msg = {topic:"getMinAcceleration", _msgid: msg._msgid, payload: {MinAcceleration: dcMotor.getMinAcceleration()}};
                    node.send(msg);
                    break;

                case "getMaxAcceleration":
                    var msg = {topic:"getMaxAcceleration", _msgid: msg._msgid, payload: {MaxAcceleration: dcMotor.getMaxAcceleration()}};
                    node.send(msg);
                    break;

                case "getBackEMF":
                    var msg = {topic:"getBackEMF", _msgid: msg._msgid, payload: {BackEMF: dcMotor.getBackEMF()}};
                    node.send(msg);
                    break;

                case "getBackEMFSensingState":
                    var msg = {topic:"getBackEMFSensingState", _msgid: msg._msgid, payload: {BackEMFSensingState: dcMotor.getBackEMFSensingState()}};
                    node.send(msg);
                    break;

                case "setBackEMFSensingState":
                    dcMotor.setBackEMFSensingState(msg.payload.backEMFSensingState).then(function() {
                        if(config.debug) node.warn("setBackEMFSensingState success");
                    }).catch(function (err) {
                        node.error("setBackEMFSensingState failed:" + err);
                    });
                    break;

                case "getBrakingStrength":
                    var msg = {topic:"getBrakingStrength", _msgid: msg._msgid, payload: {BrakingStrength: dcMotor.getBrakingStrength()}};
                    node.send(msg);
                    break;

                case "getMinBrakingStrength":
                    var msg = {topic:"getMinBrakingStrength", _msgid: msg._msgid, payload: {MinBrakingStrength: dcMotor.getMinBrakingStrength()}};
                    node.send(msg);
                    break;

                case "getMaxBrakingStrength":
                    var msg = {topic:"getMaxBrakingStrength", _msgid: msg._msgid, payload: {MaxBrakingStrength: dcMotor.getMaxBrakingStrength()}};
                    node.send(msg);
                    break;

                case "getCurrentLimit":
                    var msg = {topic:"getCurrentLimit", _msgid: msg._msgid, payload: {CurrentLimit: dcMotor.getCurrentLimit()}};
                    node.send(msg);
                    break;

                case "setCurrentLimit":
                    dcMotor.setCurrentLimit(msg.payload.currentLimit).then(function() {
                        if(config.debug) node.warn("setCurrentLimit success");
                    }).catch(function (err) {
                        node.error("setCurrentLimit failed:" + err);
                    });
                    break;

                case "getMinCurrentLimit":
                    var msg = {topic:"getMinCurrentLimit", _msgid: msg._msgid, payload: {MinCurrentLimit: dcMotor.getMinCurrentLimit()}};
                    node.send(msg);
                    break;

                case "getMaxCurrentLimit":
                    var msg = {topic:"getMaxCurrentLimit", _msgid: msg._msgid, payload: {MaxCurrentLimit: dcMotor.getMaxCurrentLimit()}};
                    node.send(msg);
                    break;

                case "getCurrentRegulatorGain":
                    var msg = {topic:"getCurrentRegulatorGain", _msgid: msg._msgid, payload: {CurrentRegulatorGain: dcMotor.getCurrentRegulatorGain()}};
                    node.send(msg);
                    break;

                case "setCurrentRegulatorGain":
                    dcMotor.setCurrentRegulatorGain(msg.payload.currentRegulatorGain).then(function() {
                        if(config.debug) node.warn("setCurrentRegulatorGain success");
                    }).catch(function (err) {
                        node.error("setCurrentRegulatorGain failed:" + err);
                    });
                    break;

                case "getMinCurrentRegulatorGain":
                    var msg = {topic:"getMinCurrentRegulatorGain", _msgid: msg._msgid, payload: {MinCurrentRegulatorGain: dcMotor.getMinCurrentRegulatorGain()}};
                    node.send(msg);
                    break;

                case "getMaxCurrentRegulatorGain":
                    var msg = {topic:"getMaxCurrentRegulatorGain", _msgid: msg._msgid, payload: {MaxCurrentRegulatorGain: dcMotor.getMaxCurrentRegulatorGain()}};
                    node.send(msg);
                    break;

                case "getDataInterval":
                    var msg = {topic:"getDataInterval", _msgid: msg._msgid, payload: {DataInterval: dcMotor.getDataInterval()}};
                    node.send(msg);
                    break;

                case "setDataInterval":
                    dcMotor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "getMinDataInterval":
                    var msg = {topic:"getMinDataInterval", _msgid: msg._msgid, payload: {MinDataInterval: dcMotor.getMinDataInterval()}};
                    node.send(msg);
                    break;

                case "getMaxDataInterval":
                    var msg = {topic:"getMaxDataInterval", _msgid: msg._msgid, payload: {MaxDataInterval: dcMotor.getMaxDataInterval()}};
                    node.send(msg);
                    break;

                case "enableFailsafe":
                    dcMotor.enableFailsafe(msg.payload.failsafeTime).then(function() {
                        if(config.debug) node.warn("enableFailsafe success");
                    }).catch(function (err) {
                        node.error("enableFailsafe failed:" + err);
                    });
                    break;

                case "getMinFailsafeTime":
                    var msg = {topic:"getMinFailsafeTime", _msgid: msg._msgid, payload: {MinFailsafeTime: dcMotor.getMinFailsafeTime()}};
                    node.send(msg);
                    break;

                case "getMaxFailsafeTime":
                    var msg = {topic:"getMaxFailsafeTime", _msgid: msg._msgid, payload: {MaxFailsafeTime: dcMotor.getMaxFailsafeTime()}};
                    node.send(msg);
                    break;

                case "getFanMode":
                    var msg = {topic:"getFanMode", _msgid: msg._msgid, payload: {FanMode: dcMotor.getFanMode()}};
                    node.send(msg);
                    break;

                case "setFanMode":
                    dcMotor.setFanMode(msg.payload.fanMode).then(function() {
                        if(config.debug) node.warn("setFanMode success");
                    }).catch(function (err) {
                        node.error("setFanMode failed:" + err);
                    });
                    break;

                case "resetFailsafe":
                    dcMotor.resetFailsafe().then(function() {
                        if(config.debug) node.warn("resetFailsafe success");
                    }).catch(function (err) {
                        node.error("resetFailsafe failed:" + err);
                    });
                    break;

                case "getTargetBrakingStrength":
                    var msg = {topic:"getTargetBrakingStrength", _msgid: msg._msgid, payload: {TargetBrakingStrength: dcMotor.getTargetBrakingStrength()}};
                    node.send(msg);
                    break;

                case "setTargetBrakingStrength":
                    dcMotor.setTargetBrakingStrength(msg.payload.targetBrakingStrength).then(function() {
                        if(config.debug) node.warn("setTargetBrakingStrength success");
                    }).catch(function (err) {
                        node.error("setTargetBrakingStrength failed:" + err);
                    });
                    break;

                case "getTargetVelocity":
                    var msg = {topic:"getTargetVelocity", _msgid: msg._msgid, payload: {TargetVelocity: dcMotor.getTargetVelocity()}};
                    node.send(msg);
                    break;

                case "setTargetVelocity":
                    dcMotor.setTargetVelocity(msg.payload.targetVelocity).then(function() {
                        if(config.debug) node.warn("setTargetVelocity success");
                    }).catch(function (err) {
                        node.error("setTargetVelocity failed:" + err);
                    });
                    break;

                case "getVelocity":
                    var msg = {topic:"getVelocity", _msgid: msg._msgid, payload: {Velocity: dcMotor.getVelocity()}};
                    node.send(msg);
                    break;

                case "getMinVelocity":
                    var msg = {topic:"getMinVelocity", _msgid: msg._msgid, payload: {MinVelocity: dcMotor.getMinVelocity()}};
                    node.send(msg);
                    break;

                case "getMaxVelocity":
                    var msg = {topic:"getMaxVelocity", _msgid: msg._msgid, payload: {MaxVelocity: dcMotor.getMaxVelocity()}};
                    node.send(msg);
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            dcMotor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open DCMotor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        dcMotor.open(5000).then(function(){
            if(config.debug) node.warn("DCMotor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
    }
    RED.nodes.registerType("phidget22-dcmotor",Phidget22DCMotorNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}