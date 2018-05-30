load('api_relay.js');
load('api_mqtt.js');

function init() {
    let enabledchannels = Cfg.get('relay.channels.enabled');
    if (enabledchannels === undefined) {
        print('Relay configuration is missing !');
    } else {
        let enabledchannelsArray = StringUtils.split(enabledchannels, ',');
        print('Enabled channels:', enabledchannelsArray.length);
        for (let idx = 0; idx < enabledchannelsArray.length; idx++) {
            print("Initialiazing channel", idx, "for mqtt transport");
            Channels.get(enabledchannelsArray[idx]).topic = Cfg.get('relay.channels.' + enabledchannelsArray[idx] + '.topic');
            print("MQTT transport for channel", idx, "initialized");
        }
    }
}

function registerMQTT() {
    for (let idx in Channels.channels) {
        let channel = Channels.channels[idx];
        print("Registering channel", idx, "on topic", channel.topic);
        MQTT.sub(channel.topic, function (connection, topic, message) {
            for (let idx in Channels.channels) {
                let channel = Channels.channels[idx];
                if (channel.topic === topic) {
                    print("Recieved new message(", message, ") for channel", channel.name);
                    sendCallback(topic, message, channel.name);
                    if (message === "1") {
                        Channels.on(idx);
                    } else {
                        Channels.off(idx);
                    }
                }
            }
        }, null);
    }
}

function sendCallback(topic, message, channelName) {
    let callbackEnabled = Cfg.get('relay.config.callback.enabled');
    if (callbackEnabled) {
        let callbackTopic = Cfg.get('relay.config.callback.topic');
        MQTT.pub(callbackTopic, {
            "topic": topic,
            "message": (message === "1" ? "ON" : "OFF"),
            "channel": channelName
        });
        print("Callback message sent");
    }
}

print("Registering relay on MQTT server...");
init();
registerMQTT();
print("Relay registration done.");