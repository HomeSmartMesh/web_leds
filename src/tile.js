import {Svg} from "../libs/svg_utils.js"
import {html,clear,send, defined, add_style_element} from "../libs/web-js-utils.js"

let utl = new Svg()

class Tile{
    constructor(parent_svg,x,y){
        this.svg = parent_svg
        this.x = x
        this.y = y
        for(let j=0;j<8;j++){
            for(let i=0;i<8;i++){
                let x = this.x + i*20
                let y = this.y + j*20
                let w = 20
                let h = 20
                html(this.svg,
                /*html*/`<rect x="${x}" y="${y}" rx="3" width="${w}" height="${h}" stroke="black" stroke-width="1" fill-opacity="0"/>`
                );
            }
        }
    }

    update(colors){
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
    extract(){

    }

}

export{
    Tile
}