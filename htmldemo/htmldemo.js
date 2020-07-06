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

        // init will setup html styles and retreive fonts asynchronously
        await super.init()

        const testDoc = await this.importHtml("./test.html")

        let labelObj3d1 = new HtmlObject3D(testDoc, this.fonts, this.darkPageProps)
        labelObj3d1.rotateY = Math.PI / 6;
        labelObj3d1.updateMatrix();
        labelObj3d1.position.set (-1000, 0, 0 )
        this.getScene().add(labelObj3d1);


        let labelObj3d2 = new HtmlObject3D(testDoc, this.fonts, this.lightPageProps)
        labelObj3d2.rotateY = -Math.PI / 6;
        labelObj3d2.updateMatrix();
        labelObj3d2.position.set ( 1000, 0, 0 )
        this.getScene().add(labelObj3d2);
 

        let parser = new DOMParser();

        let txt3 = `<h3>Simple Label</h3><p>This callout points to a simple label.</p>`
        let calloutDoc = parser.parseFromString(txt3, 'text/html');
        let labelObj3d3 = new HtmlObject3D(calloutDoc, this.fonts, this.calloutProps)
        //labelObj3d3.position.set ( 0, 100, 0 )
        //labelObj3d3.rotateY = -Math.PI / 6;
        this.getScene().add(labelObj3d3);


        let txt4 = `<p><b>Simple Label that spans Multiple Lines</b></p>`
        let labelDoc = parser.parseFromString(txt4, 'text/html');
        let labelObj3d4 = new HtmlObject3D(labelDoc, this.fonts, this.labelProps)
        //labelObj3d3.position.set ( 1000, 0, 0 )
        //labelObj3d3.rotateY = -Math.PI / 6;
        this.getScene().add(labelObj3d4);


    }



}