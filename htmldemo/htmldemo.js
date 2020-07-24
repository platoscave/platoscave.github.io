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

        const testStr = await this.importHtml("./test.html")

        let labelObj3d1 = new HtmlObject3D(testStr, this.fonts, this.darkPageProps)
        labelObj3d1.rotateY = Math.PI / 6;
        labelObj3d1.updateMatrix();
        labelObj3d1.position.set (-1000, 0, 0 )
        this.scene.add(labelObj3d1);
        labelObj3d1.key = 'darkPage'
        this.selectableMeshArr.push(labelObj3d1.getBackgroundMesh())

        const wikiStr = await this.importHtml("https://en.wikipedia.org/api/rest_v1/page/summary/Three.js")
        var wikiObj = JSON.parse(wikiStr)
        let labelObj3d2 = new HtmlObject3D(wikiObj.extract_html, this.fonts, this.lightPageProps)
        labelObj3d2.rotateY = -Math.PI / 6;
        labelObj3d2.updateMatrix();
        labelObj3d2.position.set ( 1000, 0, 0 )
        this.scene.add(labelObj3d2);
        labelObj3d2.key = 'lightPage'
        this.selectableMeshArr.push(labelObj3d2.getBackgroundMesh())
 


        let txt3 = `<b>Simple Label</b><t>This callout points to a simple label.</t>`
        let labelObj3d3 = new HtmlObject3D(txt3, this.fonts, this.calloutProps)
        labelObj3d3.translateY(20)
        //labelObj3d3.rotateY = -Math.PI / 6;
        this.scene.add(labelObj3d3);
        labelObj3d3.key = 'callout'
        this.selectableMeshArr.push(labelObj3d3.getBackgroundMesh()) 


        let txt4 = `<b>Simple Label that spans Multiple Lines. <br>Simple Label that spans Multiple Lines</b>`
        let labelObj3d4 = new HtmlObject3D(txt4, this.fonts, this.labelProps)
        //labelObj3d3.position.set ( 1000, 0, 0 )
        //labelObj3d3.rotateY = -Math.PI / 6;
        this.scene.add(labelObj3d4);
        labelObj3d4.key = 'label'
        this.selectableMeshArr.push(labelObj3d4.getBackgroundMesh())


    }



}