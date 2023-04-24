var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22CurrentInputNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var currentInput = new phidget22.CurrentInput();

        currentInput.setChannel(config.channel);
        currentInput.setDeviceSerialNumber(config.deviceSerialNumber);
        currentInput.setHubPort(config.hubPort);

        currentInput.onAttach = function() {

            var msg = {topic: "Attach", payload: {}};

            currentInput.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            currentInput.setCurrentChangeTrigger(config.currentChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setCurrentChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setCurrentChangeTrigger (in onAttach) not supported");
                }
            });

            if(config.powersupply != 1) {
                currentInput.setPowerSupply(config.powerSupply).catch(function (err) {
                    if(err.errorCode != 20) {
                        // Ignore error code 20: unsupported errors expected for some devices
                        node.error("setPowerSupply (in onAttach) failed:" + err);
                    }
                    else {
                        if(config.debug) node.warn("setPowerSupply (in onAttach) not supported");
                    }
                });
            }
            node.send(msg);
        };

        currentInput.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        currentInput.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        currentInput.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        currentInput.onCurrentChange = function(current) {
            var msg = {topic: "CurrentChange", payload: {current: current}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setCurrentChangeTrigger":
                    currentInput.setCurrentChangeTrigger(msg.payload.currentChangeTrigger).then(function() {
                        if(config.debug) node.warn("setCurrentChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setCurrentChangeTrigger failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    currentInput.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setPowerSupply":
                    currentInput.setPowerSupply(msg.payload.powerSupply).then(function() {
                        if(config.debug) node.warn("setPowerSupply success");
                    }).catch(function (err) {
                        node.error("setPowerSupply failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            currentInput.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open CurrentInput (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        currentInput.open(5000).then(function(){
            if(config.debug) node.warn("CurrentInput Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-currentinput",Phidget22CurrentInputNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}