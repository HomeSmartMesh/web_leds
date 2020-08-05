/** http://w3c.github.io/html-reference/input.color.html
 * 
 * sent events:
 * - mqtt_message
 * 
 * used events:
 * - mesh_click
 * - three_list
 */

import {fetch_json} from "./utils.js"


var client,textBox;

let config

var mqtt_pending_topics = {};
let mqtt_connected = false


function send_custom_event(event_name,data){
	var event = new CustomEvent(event_name, {detail:data});
	window.dispatchEvent(event);
}

// called when the client connects
function onConnect() {
  mqtt_connected = true;
  // Once a connection has been made, make a subscription and send a message.
  console.log("mqtt_app> onConnect() mqtt running");
  send_custom_event("three_param",{name:"MQTT",visible:false});
  for(let topic of config.mqtt.subscriptions){
    console.log(topic)
    client.subscribe(topic);
    console.log(`mqtt_app> - subscribed to ${topic}`);
  }
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
  mqtt_connected = false;
}

// called when a message arrives
function onMessageArrived(message) {
  console.log(`mqtt_app> ${message.destinationName}	=> ${message.payloadString}`);
  send_custom_event("mqtt_message",{topic:message.destinationName,payload:JSON.parse(message.payloadString)});
}

function mqtt_connect(){
    // Create a client instance
    const client_name = window.location.hostname + config.mqtt.client_id;
    client = new Paho.MQTT.Client(config.mqtt.host, Number(config.mqtt.port), client_name);
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect});
}


class Mqtt{
  async connect(){
    config = await fetch_json("./config.json")
    mqtt_connect();
  }
}



//----------------------------------------------------------------------------------
//example usage :  client.send("esp/curvy/panel",'{"action":"off"}');

export{Mqtt}
