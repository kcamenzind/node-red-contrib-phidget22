var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22BLDCMotorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var bldcMotor = new phidget22.BLDCMotor();

        bldcMotor.setChannel(config.channel);
        bldcMotor.setDeviceSerialNumber(config.deviceSerialNumber);
        bldcMotor.setHubPort(config.hubPort);

        bldcMotor.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            bldcMotor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }   
            });

            bldcMotor.setRescaleFactor(config.rescaleFactor);

            bldcMotor.setAcceleration(config.acceleration).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setAcceleration (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setAcceleration (in onAttach) not supported");
                }   
            });

            bldcMotor.setTargetBrakingStrength(config.targetBrakingStrength).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setTargetBrakingStrength (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setTargetBrakingStrength (in onAttach) not supported");
                }   
            });

            bldcMotor.setStallVelocity(config.stallVelocity).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setStallVelocity (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setStallVelocity (in onAttach) not supported");
                }   
            });


            node.send(msg);
        };

        bldcMotor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        bldcMotor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        bldcMotor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        bldcMotor.onPositionChange = function(position) {
            var msg = {topic: "PositionChange", payload: {position: position}};
            node.send(msg);
        }

        bldcMotor.onVelocityUpdate = function(velocity) {
            var msg = {topic: "VelocityUpdate", payload: {velocity: velocity}};
            node.send(msg);
        }

        bldcMotor.onBrakingStrengthChange = function(brakingStrength) {
            var msg = {topic: "BrakingStrengthChange", payload: {brakingStrength: brakingStrength}};
            node.send(msg);
        }

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setAcceleration":
                    bldcMotor.setAcceleration(msg.payload.acceleration).then(function() {
                        if(config.debug) node.warn("setAcceleration success");
                    }).catch(function (err) {
                        node.error("setAcceleration failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    bldcMotor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "enableFailsafe":
                    bldcMotor.enableFailsafe(msg.payload.failsafeTime).then(function() {
                        if(config.debug) node.warn("enableFailsafe success");
                    }).catch(function (err) {
                        node.error("enableFailsafe failed:" + err);
                    });
                    break;

                case "addPositionOffset":
                    bldcMotor.addPositionOffset(msg.payload.positionOffset);
                    break;

                case "setRescaleFactor":
                    bldcMotor.setRescaleFactor(msg.payload.rescaleFactor);
                    break;

                case "resetFailsafe":
                    bldcMotor.resetFailsafe().then(function() {
                        if(config.debug) node.warn("resetFailsafe success");
                    }).catch(function (err) {
                        node.error("resetFailsafe failed:" + err);
                    });
                    break;

                case "setStallVelocity":
                    bldcMotor.setStallVelocity(msg.payload.stallVelocity).then(function() {
                        if(config.debug) node.warn("setStallVelocity success");
                    }).catch(function (err) {
                        node.error("setStallVelocity failed:" + err);
                    });
                    break;

                case "setTargetBrakingStrength":
                    bldcMotor.setTargetBrakingStrength(msg.payload.targetBrakingStrength).then(function() {
                        if(config.debug) node.warn("setTargetBrakingStrength success");
                    }).catch(function (err) {
                        node.error("setTargetBrakingStrength failed:" + err);
                    });
                    break;

                case "setTargetVelocity":
                    bldcMotor.setTargetVelocity(msg.payload.targetVelocity).then(function() {
                        if(config.debug) node.warn("setTargetVelocity success");
                    }).catch(function (err) {
                        node.error("setTargetVelocity failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            bldcMotor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open BLDCMotor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        bldcMotor.open(5000).then(function(){
            if(config.debug) node.warn("BLDCMotor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
    }
    RED.nodes.registerType("phidget22-bldcmotor",Phidget22BLDCMotorNode);

}