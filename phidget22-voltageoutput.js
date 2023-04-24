var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22VoltageOutputNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var voltageOutput = new phidget22.VoltageOutput();

        voltageOutput.setChannel(config.channel);
        voltageOutput.setDeviceSerialNumber(config.deviceSerialNumber);
        voltageOutput.setHubPort(config.hubPort);

        voltageOutput.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            voltageOutput.setVoltageOutputRange(config.voltageOutputRange).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVoltageOutputRange (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVoltageOutputRange (in onAttach) not supported");
                }
            });
            node.send(msg);
        };

        voltageOutput.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        voltageOutput.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        voltageOutput.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {

                case "setEnabled":
                        voltageOutput.setEnabled(msg.payload.enabled).then(function() {
                        if(config.debug) node.warn("setEnabled success");
                    }).catch(function (err) {
                        node.error("setEnabled failed:" + err);
                    });
                    break;

                case "enableFailsafe":
                        voltageOutput.enableFailsafe(msg.payload.failsafeTime).then(function() {
                            if(config.debug) node.warn("enableFailsafe success");
                        }).catch(function (err) {
                            node.error("enableFailsafe failed:" + err);
                        });
                    break;

                case "resetFailsafe":
                        voltageOutput.resetFailsafe().then(function() {
                            if(config.debug) node.warn("resetFailsafe success");
                        }).catch(function (err) {
                            node.error("resetFailsafe failed:" + err);
                        });
                    break;

                case "setVoltage":
                        voltageOutput.setVoltage(msg.payload.voltage).then(function() {
                            if(config.debug) node.warn("setVoltage success");
                        }).catch(function (err) {
                            node.error("setVoltage failed:" + err);
                        });
                    break;
                    
                case "setVoltageOutputRange":
                        voltageOutput.setVoltageOutputRange(msg.payload.voltageOutputRange).then(function() {
                            config.outputrange = msg.payload;
                            if(config.debug) node.warn("setVoltageOutputRange success");
                        }).catch(function (err) {
                            node.error("setVoltageOutputRange failed:" + err);
                        });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            voltageOutput.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open VoltageOutput (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        voltageOutput.open(5000).then(function(){
            if(config.debug) node.warn("VoltageOutput Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        
    }
    RED.nodes.registerType("phidget22-voltageoutput",Phidget22VoltageOutputNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}