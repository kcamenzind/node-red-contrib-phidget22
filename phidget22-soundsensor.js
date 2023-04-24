var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22SoundSensorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var soundSensor = new phidget22.SoundSensor();

        soundSensor.setChannel(config.channel);
        soundSensor.setDeviceSerialNumber(config.deviceSerialNumber);
        soundSensor.setHubPort(config.hubPort);

        soundSensor.onAttach = function() {

            var msg = {topic: "Attach", payload: {}};

            soundSensor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            soundSensor.setSPLChangeTrigger(config.SPLChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setSPLChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setSPLChangeTrigger (in onAttach) not supported");
                }
            });

            soundSensor.setSPLRange(config.SPLRange).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setSPLRange (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setSPLRange (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        soundSensor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        soundSensor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        soundSensor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        soundSensor.onSPLChange = function(dB,dBA,dBC,octaves) {
            var msg = {topic: "SPLChange", payload: {dB:dB, dBA:dBA, dBC:dBC, octaves:octaves}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setDataInterval":
                    soundSensor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setSPLChangeTrigger":
                    soundSensor.setSPLChangeTrigger(msg.payload.SPLChangeTrigger).then(function() {
                        if(config.debug) node.warn("setSPLChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setSPLChangeTrigger failed:" + err);
                    });
                    break;

                case "setSPLRange":
                        soundSensor.setSPLRange(msg.payload.SPLRange).then(function() {
                            if(config.debug) node.warn("setSPLRange success");
                        }).catch(function (err) {
                            node.error("setSPLRange failed:" + err);
                        });
                        break;
     
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            soundSensor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open SoundSensor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        soundSensor.open(5000).then(function(){
            if(config.debug) node.warn("SoundSensor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-soundsensor",Phidget22SoundSensorNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}