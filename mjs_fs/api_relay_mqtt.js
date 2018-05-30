load('api_relay.js');
load('api_mqtt.js');

function init() {
    let enabledchannels = Cfg.get('relay.channels.enabled');
    if(enabledchannels === undefined) {
        print('Relay configuration is missing !');
    } else {
        let enabledchannelsArray = StringUtils.split(enabledchannels, ',');
        print('Enabled channels:', enabledChannelsArray.length);
        for(let idx = 0 ; idx < enabledchannelsArray.length ; idx++) {
            print("Initialiazing channel", idx, "for mqtt transport");
            channels.get(enabledchannelsArray[idx]).topic = Cfg.get('relay.channels.' + enabledchannelsArray[idx] + '.topic');
            print("MQTT transport for channel", idx, "initialized");
        }
    }
}

function register() {
    for(let idx in channels.channels) {
        let channel = channels.channels[idx];
        print("Registering channel", idx, "on topic", channel.topic);
        MQTT.sub(channel.topic, function (connection, topic, message) {
            for(let idx in channels.channels) {
                let channel = channels.channels[idx];
                if(channel.topic === topic) {
                    print("Recieved new message(", message, ") for channel", channel.name);
                    if(message === "1") {
                        channels.on(idx);
                    } else {
                        channels.off(idx);
                    }
                }
            }
          }, null); 
    }
}

print("Registering relay on MQTT server...");
init();
register();
print("Relay registration done.");