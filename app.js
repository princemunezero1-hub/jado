// HiveMQ Public Broker WebSocket Details
const MQTT_HOST = "broker.hivemq.com";
const MQTT_PORT = 8000; // WebSocket port for public broker
const CLIENT_ID = "web_dashboard_" + Math.random().toString(16).substr(2, 8);

// Create Paho MQTT Client instance with explicit WebSocket path
const client = new Paho.MQTT.Client(MQTT_HOST, MQTT_PORT, "/mqtt", CLIENT_ID);

// Callback when client loses connection
client.onConnectionLost = function (responseObject) {
    const statusElem = document.getElementById("connection-status");
    statusElem.textContent = "Disconnected";
    statusElem.className = "status-disconnected";
    console.log("Connection lost: " + responseObject.errorMessage);
};

// Callback when message arrives from ESP32
client.onMessageArrived = function (message) {
    const topic = message.destinationName;
    const payload = message.payloadString;

    console.log(`Topic: ${topic} | Payload: ${payload}`);

    if (topic === "esp32/sensor/temperature") {
        document.getElementById("temp-val").textContent = payload;
    } 
    else if (topic === "esp32/sensor/humidity") {
        document.getElementById("hum-val").textContent = payload;
    } 
    else if (topic === "esp32/led/red") {
        const redLed = document.getElementById("red-led");
        const redText = document.getElementById("red-led-text");
        if (payload === "1") {
            redLed.className = "led-circle red-on";
            redText.textContent = "ON";
        } else {
            redLed.className = "led-circle led-off";
            redText.textContent = "OFF";
        }
    } 
    else if (topic === "esp32/led/green") {
        const greenLed = document.getElementById("green-led");
        const greenText = document.getElementById("green-led-text");
        if (payload === "1") {
            greenLed.className = "led-circle green-on";
            greenText.textContent = "ON";
        } else {
            greenLed.className = "led-circle led-off";
            greenText.textContent = "OFF";
        }
    }
};

// Connect options
const connectOptions = {
    onSuccess: onConnect,
    onFailure: function (message) {
        console.log("Connect failed: " + message.errorMessage);
        document.getElementById("connection-status").textContent = "Connection Failed";
    }
};

// Connect to broker
client.connect(connectOptions);

function onConnect() {
    const statusElem = document.getElementById("connection-status");
    statusElem.textContent = "Connected";
    statusElem.className = "status-connected";

    // Subscribe to all 4 topics
    client.subscribe("esp32/sensor/temperature");
    client.subscribe("esp32/sensor/humidity");
    client.subscribe("esp32/led/red");
    client.subscribe("esp32/led/green");
}