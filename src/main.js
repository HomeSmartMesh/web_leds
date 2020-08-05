import {html,clear,send, defined, add_style_element} from "../libs/web-js-utils.js"
import {fetch_json} from "./utils.js"
import {Tile} from "./tile.js"
import {Mqtt} from "./mqtt_app.js"

let tile

function onMqttMessage(e){
    const topic = e.detail.topic;
    const payload = e.detail.payload
    if(topic == "lifx/sim_tiles"){
        tile.update(payload.colors)
    }
}

function svg_to_image(svg){
    let clonedSvgElement = svg.cloneNode(true);
    let outerHTML = clonedSvgElement.outerHTML
    let blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    let URL = window.URL || window.webkitURL || window;
    let blobURL = URL.createObjectURL(blob);
    let image = new Image();
    image.onload = () => {
      
       let canvas = document.createElement('canvas');
       
       canvas.widht = 300;
       
       canvas.height = 300;
       let context = canvas.getContext('2d');
       // draw image in canvas starting left-0 , top - 0  
       context.drawImage(image, 0, 0, 300, 300 );
      //  downloadImage(canvas); need to implement
      let cls = context.getImageData(150,190,1,1).data
      console.log(cls)
      tile.update([`rgb(${cls[0]},${cls[1]},${cls[2]})`])
    };
    image.src = blobURL;
}

async function main(){
    console.log("main() start")

    let parent = document.body
    let [width,height] = [300,300]
    let svg = html(parent,/*html*/`<svg id="main_svg" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`);

    html(svg,
        /*html*/`<defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
        </defs>
        <rect x="50" y="50" rx="3" width="120" height="160" stroke="black" stroke-width="0" fill="url(#grad1)" />`
        );


    svg_to_image(svg)

    let sim_svg = html(parent,/*html*/`<svg id="main_svg" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`);


    tile = new Tile(sim_svg,0,0)
    //tile.update(["blue","red","green"])
    let colors = tile.extract()

    window.addEventListener( 'mqtt_message', onMqttMessage, false);

    let mqtt = new Mqtt()
    await mqtt.connect()

}

main()
.then(console.log("main() running"))
