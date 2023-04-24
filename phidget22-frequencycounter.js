var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22FrequencyCounterNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var frequencyCounter = new phidget22.FrequencyCounter();

        frequencyCounter.setChannel(config.channel);
        frequencyCounter.setDeviceSerialNumber(config.deviceSerialNumber);
        frequencyCounter.setHubPort(config.hubPort);

        frequencyCounter.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
  
            frequencyCounter.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });
            
            frequencyCounter.setFilterType(config.filterType).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setFilterType (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setFilterType (in onAttach) not supported");
                }
            });

            frequencyCounter.setFrequencyCutoff(config.frequencyCutoff);

            frequencyCounter.setInputMode(config.inputMode).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setInputMode (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setInputMode (in onAttach) not supported");
                }
            });

            frequencyCounter.setPowerSupply(config.powerSupply).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setPowerSupply (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setPowerSupply (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        frequencyCounter.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        frequencyCounter.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        frequencyCounter.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        frequencyCounter.onCountChange = function(counts,timeChange) {
            var msg = {topic: "CountChange", payload: {counts:counts, timeChange:timeChange}};
            node.send(msg);
        };

        frequencyCounter.onFrequencyChange = function(frequency) {
            var msg = {topic: "FrequencyChange", payload: {frequency: frequency}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {
                case "setEnabled":
                    frequencyCounter.setEnabled(msg.payload.enabled).then(function() {
                        if(config.debug) node.warn("setEnabled success");
                    }).catch(function (err) {
                        node.error("setEnabled failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    frequencyCounter.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setFilterType":
                    frequencyCounter.setFilterType(msg.payload.filterType).then(function() {
                        if(config.debug) node.warn("setFilterType success");
                    }).catch(function (err) {
                        node.error("setFilterType failed:" + err);
                    });
                    break;

                case "setFrequencyCutoff":
                    frequencyCounter.setFrequencyCutoff(msg.payload.frequencyCutoff).then(function() {
                        if(config.debug) node.warn("setFrequencyCutoff success");
                    }).catch(function (err) {
                        node.error("setFrequencyCutoff failed:" + err);
                    });
                    break;

                case "setInputMode":
                    frequencyCounter.setInputMode(msg.payload.inputMode).then(function() {
                        if(config.debug) node.warn("setInputMode success");
                    }).catch(function (err) {
                        node.error("setInputMode failed:" + err);
                    });
                    break;

                case "setPowerSupply":
                    frequencyCounter.setPowerSupply(msg.payload.powerSupply).then(function() {
                        if(config.debug) node.warn("setPowerSupply success");
                    }).catch(function (err) {
                        node.error("setPowerSupply failed:" + err);
                    });
                    break;

                case "reset":
                    frequencyCounter.reset().then(function() {
                        if(config.debug) node.warn("reset success");
                    }).catch(function (err) {
                        node.error("reset failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            frequencyCounter.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open FrequencyCounter (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        frequencyCounter.open(5000).then(function(){
            if(config.debug) node.warn("FrequencyCounter Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        
    }
    RED.nodes.registerType("phidget22-frequencycounter",Phidget22FrequencyCounterNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}