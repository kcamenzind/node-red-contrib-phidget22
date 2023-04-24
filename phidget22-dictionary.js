var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22DictionaryNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var dictionary = new phidget22.Dictionary();

        if(config.label !== "")
            dictionary.setDeviceLabel(config.label);
        if(config.deviceSerialNumber !== -1)
            dictionary.setDeviceSerialNumber(config.deviceSerialNumber);

        dictionary.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            node.send(msg);
        };

        dictionary.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        dictionary.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        dictionary.onAdd = function(key,value) {
            var msg = {topic: "Add", payload: {key:key, value:value}};
            node.send(msg);
        };

        dictionary.onRemove = function(key) {
            var msg = {topic: "Remove", payload: {key:key}};
            node.send(msg);
        };

        dictionary.onUpdate = function(key,value) {
            var msg = {topic: "Update", payload: {key:key, value:value}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "add":
                    dictionary.add(msg.payload.key, msg.payload.value).then(function() {
                        if(config.debug) node.warn("add success");
                    }).catch(function (err) {
                        node.error("add failed:" + err);
                    });
                    break;

                case "removeAll":
                    dictionary.removeAll().then(function() {
                        if(config.debug) node.warn("removeAll success");
                    }).catch(function (err) {
                        node.error("removeAll failed:" + err);
                    });
                    break;

                case "get":

                    if(msg.payload.def !== undefined) {

                        dictionary.get(msg.payload.key, msg.payload.def).then(function(value) {
                            var msg = {topic: "get", payload:{value: value}};
                            node.send(msg);
                            if(config.debug) node.warn("get success");
                        }).catch(function (err) {
                            node.error("get failed:" + err);
                        });
                    }
                    else {

                        dictionary.get(msg.payload.key).then(function(value) {
                            var msg = {topic: "get", payload:{value: value}};
                            node.send(msg);
                            if(config.debug) node.warn("get success");
                        }).catch(function (err) {
                            node.error("get failed:" + err);
                        });
                    }
                    break;

                case "remove":
                    dictionary.remove(msg.payload.key).then(function() {
                        if(config.debug) node.warn("remove success");
                    }).catch(function (err) {
                        node.error("remove failed:" + err);
                    });
                    break;

                case "scan":
                    dictionary.scan(msg.payload.start).then(function(keyList) {
                        var msg = {topic: "scan", payload:{keyList: keyList}}
                        node.send(msg);
                        if(config.debug) node.warn("scan success");
                    }).catch(function (err) {
                        node.error("scan failed:" + err);
                    });
                    break;

                case "set":
                    dictionary.set(msg.payload.key, msg.payload.value).then(function() {
                        if(config.debug) node.warn("set success");
                    }).catch(function (err) {
                        node.error("set failed:" + err);
                    });
                    break;

                case "update":
                    dictionary.update(msg.payload.key, msg.payload.value).then(function() {
                        if(config.debug) node.warn("update success");
                    }).catch(function (err) {
                        node.error("update failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            dictionary.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Dictionary");
        
        dictionary.open(5000).then(function(){
            if(config.debug) node.warn("Dictionary Opened");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
    }
    RED.nodes.registerType("phidget22-dictionary",Phidget22DictionaryNode);
}