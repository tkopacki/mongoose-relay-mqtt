load('api_relay.js');
load('api_mqtt.js');

function init() {
    for(let idx in Chanels.chanels) {
        let chanel = Chanels.chanels[idx];
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