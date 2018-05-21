load('api_relay.js');
load('api_mqtt.js');

function init() {
    let enabledChanels = Cfg.get('relay.chanels.enabled');
    if(enabledChanels === undefined) {
        print('Relay configuration is missing !');
    } else {
        let enabledChanelsArray = StringUtils.split(enabledChanels, ',');
        for(let idx = 0 ; idx < enabledChanelsArray.length ; idx++) {
            Chanels.get(enabledChanelsArray[idx]).topic = Cfg.get('relay.chanels.' + enabledChanelsArray[idx] + '.topic');
        }
    }
}

function register() {
    for(let idx in Chanels.chanels) {
        let chanel = Chanels.chanels[idx];
        print("Registering chanel", idx, "on topic", chanel.topic);
        MQTT.sub(chanel.topic, function (connection, topic, message) {
            for(let idx in Chanels.chanels) {
                let chanel = Chanels.chanels[idx];
                if(chanel.topic === topic) {
                    print("Recieved new message(", message, ") for chanel", chanel.name);
                    if(message === "1") {
                        Chanels.on(chanel);
                    } else {
                        Chanels.off(chanel);
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