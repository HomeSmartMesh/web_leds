import {Svg} from "../libs/svg_utils.js"
import {html,clear,send, defined, add_style_element} from "../libs/web-js-utils.js"
import {fetch_json} from "./utils.js"

let utl = new Svg()
let config
class Tile{
    constructor(parent_svg){
        this.svg = parent_svg
    }
    init(x,y){
        this.led_w = config.graphics.led.width_pixels
        this.led_h = config.graphics.led.height_pixels
        this.x = x
        this.y = y
        this.leds = []
        for(let j=0;j<8;j++){
            for(let i=0;i<8;i++){
                let x = this.x + i*this.led_w
                let y = this.y + j*this.led_h
                let rect = html(this.svg,
                /*html*/`<rect id="led_${x}_${y}" x="${x}" y="${y}" rx="4" width="${this.led_w}" height="${this.led_h}" stroke="black" fill="grey" stroke-width="1"/>`);
                this.leds.push(rect)
            }
        }
        html(this.svg,
            /*html*/`<rect x="${x}" y="${y}" rx="4" width="${this.led_w*8}" height="${this.led_h*8}" stroke="black" fill-opacity="0" stroke-width="4"/>`);
}

    update_colors(colors){
        let index = 0
        let length = colors.length
        for(let j=0;j<8;j++){
            for(let i=0;i<8;i++){
                let x = this.x + i*20
                let y = this.y + j*20
                let w = 20
                let h = 20
                console.log(colors[index])
                html(this.svg,
                /*html*/`<rect x="${x}" y="${y}" rx="3" width="${w}" height="${h}" stroke="black" stroke-width="0" fill="${colors[index]}" />`
                );
                index = index + 1
                if(index == length){
                    return
                }
            }
        }
    }

    update_canvas(context){
        let index = 0
        for(let j=0;j<8;j++){
            for(let i=0;i<8;i++){
                let x = this.x + (i+0.5)*this.led_w
                let y = this.y + (j+0.5)*this.led_h
                //console.log(`x=${x} ; y=${y}`)
                let cls = context.getImageData(x,y,1,1).data
                let css_color = `rgb(${cls[0]},${cls[1]},${cls[2]})`
                //console.log(css_color)
                this.leds[index].setAttributeNS(null,"fill",css_color)
                //console.log(this.leds[index])
                index = index + 1
            }
        }
    }

    extract(){

    }
}

class TileGroup{
    constructor(svg){
        this.svg = svg
    }
    async init(hostname){
        config = await fetch_json("./config.json")
        this.tiles = []
        config.tiles[hostname].forEach((tile_cfg)=>{
            let tile = new Tile(this.svg)
            tile.init(tile_cfg.x,tile_cfg.y)
            this.tiles.push(tile)
        })
    }
    update_canvas(context){
        this.tiles.forEach((tile)=>{
            tile.update_canvas(context)
        })
    }
}

export{
    TileGroup
}