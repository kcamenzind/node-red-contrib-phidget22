var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22SpatialNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var spatial = new phidget22.Spatial();

        spatial.setChannel(config.channel);
        spatial.setDeviceSerialNumber(config.deviceSerialNumber);
        spatial.setHubPort(config.hubPort);

        spatial.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            spatial.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            if(config.algorithm != 0) {
            
                spatial.setAlgorithm(config.algorithm).catch(function (err) {
                    if(err.errorCode != 20) {
                        // Ignore error code 20: unsupported errors expected for some devices
                        node.error("setAlgorithm (in onAttach) failed:" + err);
                    }
                    else {
                        if(config.debug) node.warn("setAlgorithm (in onAttach) not supported");
                    }
                });

                spatial.setAlgorithmMagnetometerGain(config.algorithmMagnetometerGain).catch(function (err) {
                    if(err.errorCode != 20) {
                        // Ignore error code 20: unsupported errors expected for some devices
                        node.error("setAlgorithmMagnetometerGain (in onAttach) failed:" + err);
                    }
                    else {
                        if(config.debug) node.warn("setAlgorithmMagnetometerGain (in onAttach) not supported");
                    }
                });
            }
 
            node.send(msg);
        };

        spatial.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        spatial.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        spatial.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        spatial.onSpatialData = function(acceleration, angularRate, magneticField, timestamp) {
            var msg = {topic: "SpatialData", payload: {acceleration:acceleration, angularRate:angularRate, magneticField:magneticField, timestamp:timestamp}};
            node.send(msg);
        };

        spatial.onAlgorithmData = function(quaternion, timestamp) {
            var msg = {topic: "AlgorithmData", payload: {quaternion:quaternion, timestamp:timestamp}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setAlgorithm":
                    spatial.setAlgorithm(msg.payload.algorithm).then(function() {
                        if(config.debug) node.warn("setAlgorithm success");
                    }).catch(function (err) {
                        node.error("setAlgorithm failed:" + err);
                    });
                    break;

                case "setAlgorithmMagnetometerGain":
                    spatial.setAlgorithmMagnetometerGain(msg.payload.algorithmMagnetometerGain).then(function() {
                        if(config.debug) node.warn("setAlgorithmMagnetometerGain success");
                    }).catch(function (err) {
                        node.error("setAlgorithmMagnetometerGain failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    spatial.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setMagnetometerCorrectionParameters":
                    spatial.setMagnetometerCorrectionParameters(msg.payload.magneticField, msg.payload.offset0, msg.payload.offset1, msg.payload.offset2, msg.payload.gain0, msg.payload.gain1, msg.payload.gain2, msg.payload.T0, msg.payload.T1, msg.payload.T2, msg.payload.T3,msg.payload.T4,msg.payload.T5).then(function() {
                        if(config.debug) node.warn("setMagnetometerCorrectionParameters success");
                    }).catch(function (err) {
                        node.error("setMagnetometerCorrectionParameters failed:" + err);
                    });
                    break;

                case "resetMagnetometerCorrectionParameters":
                    spatial.resetMagnetometerCorrectionParameters().then(function() {
                        if(config.debug) node.warn("resetMagnetometerCorrectionParameters success");
                    }).catch(function (err) {
                        node.error("resetMagnetometerCorrectionParameters failed:" + err);
                    });
                    break;

                case "saveMagnetometerCorrectionParameters":
                    spatial.saveMagnetometerCorrectionParameters().then(function() {
                            if(config.debug) node.warn("saveMagnetometerCorrectionParameters success");
                        }).catch(function (err) {
                            node.error("saveMagnetometerCorrectionParameters failed:" + err);
                        });
                    break;

                case "zeroAlgorithm":
                        spatial.zeroAlgorithm().then(function() {
                            if(config.debug) node.warn("zeroAlgorithm success");
                        }).catch(function (err) {
                            node.error("zeroAlgorithm failed:" + err);
                        });
                    break;

                case "zeroGyro":
                        spatial.zeroGyro().then(function() {
                            if(config.debug) node.warn("zeroGyro success");
                        }).catch(function (err) {
                            node.error("zeroGyro failed:" + err);
                        });
                    break;
                    
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            spatial.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Spatial (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        spatial.open(5000).then(function(){
            if(config.debug) node.warn("Spatial Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-spatial",Phidget22SpatialNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}