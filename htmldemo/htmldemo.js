//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
//import TWEEN from "../lib/tween.js/src/Tween.js";
//import * as TWEEN  from "https://cdn.jsdelivr.net/npm/es6-tween";
// import TWEEN from "https://cdn.jsdelivr.net/npm/tween@0.9.0/tween.min.js";
import Scene from "../lib/scene.js";
import HtmlObject3D from "../lib/htmlObject3d.js";



let font, labelTextMat, labelBackgroundMat, calloutBackgroundMat

export default class HTMLDemo extends Scene {

    constructor() {

        super()

    }

    async init() {


        const htmlDoc = await this.importHtml("./test.html")

        let fonts = {
            regularFont: await this.importFont('regular'),
            boldFont: await this.importFont('bold'),
            monoFont: await this.importFont('regular')
            //monoFont: await this.importFont('mono')
        }
        let style = {     
            'color': 0xf0f0f0,
            'font-size': 10,
            'width': 600
        }

        let background = {
            backgroundColor: 0x121212,
            backgroundOpacity: 0.8,
            borderColor: 0x808080,
            callout: null
        }

        let labelObj3d1 = new HtmlObject3D(htmlDoc, fonts, style, background)
        //labelObj3d1.position.x = -500;
        this.getScene().add(labelObj3d1);




    }



}