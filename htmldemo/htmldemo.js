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
        labelObj3d1.translateX (-1000)
        let quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 4 );
        labelObj3d1.quaternion.copy(quaternion)
        this.scene.add(labelObj3d1);
        labelObj3d1.key = 'darkPage'
        this.selectableMeshArr.push(labelObj3d1.getBackgroundMesh())

        const wikiStr = await this.importHtml("https://en.wikipedia.org/api/rest_v1/page/summary/Three.js")
        var wikiObj = JSON.parse(wikiStr)
        let labelObj3d2 = new HtmlObject3D(wikiObj.extract_html, this.fonts, this.lightPageProps)
        labelObj3d2.position.set ( 0, 500, 0 )
        this.scene.add(labelObj3d2);
        labelObj3d2.key = 'lightPage'
        this.selectableMeshArr.push(labelObj3d2.getBackgroundMesh())
 


        let txt3 = `<div><b>Simple Label</b> </div><div>This callout points to a simple label.</div>`
        let labelObj3d3 = new HtmlObject3D(txt3, this.fonts, this.calloutProps)
        labelObj3d3.translateY(20)
        this.scene.add(labelObj3d3);
        labelObj3d3.key = 'callout'
        this.selectableMeshArr.push(labelObj3d3.getBackgroundMesh()) 


        let txt4 = `<div>Simple Label that spans Multiple Lines.</div>`
        let labelObj3d4 = new HtmlObject3D(txt4, this.fonts, this.labelProps)
        this.scene.add(labelObj3d4);
        labelObj3d4.key = 'label'
        this.selectableMeshArr.push(labelObj3d4.getBackgroundMesh())


        const url = 'https://eos.greymass.com/v1/chain/get_account';
        const options = {
            method : "POST",
            body: ' { "account_name": "eosio.token"} '
        }
        const accountsJson = await fetch(url, options)
        .then(response => response.json()) // .text(), etc.
        .catch((e) => {})

        const accountStr = JSON.stringify(accountsJson, null, 4)
        const accountHTML = '<div><pre>' + accountStr + '</pre></div>'

        let labelObj3d5 = new HtmlObject3D(accountHTML, this.fonts, this.darkPageProps)
        labelObj3d5.translateX (1000)
        var quaternion1 = new THREE.Quaternion();
        quaternion1.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -Math.PI / 4 );
        labelObj3d5.quaternion.copy(quaternion1)
        this.scene.add(labelObj3d5);
        labelObj3d5.key = 'accounts'
        this.selectableMeshArr.push(labelObj3d5.getBackgroundMesh())
    }



}