import {html,clear,send, defined, add_style_element} from "../libs/web-js-utils.js"
import {fetch_json} from "./utils.js"
import {TileGroup} from "./tile.js"
import {Mqtt} from "./mqtt_app.js"

let tg

function onMqttMessage(e){
    const topic = e.detail.topic;
    const payload = e.detail.payload
    if(topic == "lifx/sim_tiles"){
        //tile.update(payload.colors)
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
       
       let w = svg.width.baseVal.value
       let h = svg.height.baseVal.value
       console.log(`w=${w} ; h=${h}`)
       canvas.width = w;
       canvas.height = h;
       //console.log(`canvas w=${canvas.width} ; h=${canvas.height}`)

       let context = canvas.getContext('2d');
       // draw image in canvas starting left-0 , top - 0  
       context.drawImage(image, 0, 0, w, h );
      //  downloadImage(canvas); need to implement
      //console.log("301,190")
      //cls = context.getImageData(299,100,3,1).data
      //console.log(cls)
      //tile.update([`rgb(${cls[0]},${cls[1]},${cls[2]})`])
      tg.update_canvas(context)
      //document.body.appendChild(image)
    };
    image.src = blobURL;
}

async function main(){
    console.log("main() start")

    let parent = document.body
    let [width,height] = [parent.offsetWidth,260]
    let svg = html(parent,/*html*/`<svg id="main_svg" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`);
    
    html(svg,/*html*/`<rect x="0" y="0" width="${width}" height="${height}" stroke="black" stroke-width="1" fill="green" fill-opacity="1" />`);
    
    html(svg,
        /*html*/`<defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
        </defs>
        <rect x="50" y="50" rx="3" width="120" height="160" stroke="black" stroke-width="0" fill="url(#grad1)" />`
        );


    let sim_svg = html(parent,/*html*/`<svg id="sim_svg" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`);
    html(sim_svg,/*html*/`<rect x="0" y="0" width="${width}" height="${height}" stroke="black" stroke-width="1" fill="grey" fill-opacity="1" />`);


    tg = new TileGroup(sim_svg)
    await tg.init("host_1")
    //tile = new Tile(sim_svg)
    //await tile.init(0,0)
    //tile.update(["blue","red","green"])
    //let colors = tile.extract()

    window.addEventListener( 'mqtt_message', onMqttMessage, false);

    let mqtt = new Mqtt()
    await mqtt.connect()

    svg_to_image(svg)

}

main()
.then(console.log("main() running"))
