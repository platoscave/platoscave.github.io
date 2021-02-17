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

        const testStr = await fetch('./test.html').then(response => response.text())
        let labelObj3d1 = new HtmlObject3D(testStr, this.fonts, this.darkPageProps)
        labelObj3d1.translateX (-1000)
        let quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 4 );
        labelObj3d1.quaternion.copy(quaternion)
        this.scene.add(labelObj3d1);
        labelObj3d1.key = 'darkPage'
        this.selectableMeshArr.push(labelObj3d1.backgroundMesh)

        const wikiObj = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Three.js').then(response => response.json())
        let labelObj3d2 = new HtmlObject3D(wikiObj.extract_html, this.fonts, this.lightPageProps)
        labelObj3d2.position.set ( 0, 500, 0 )
        this.scene.add(labelObj3d2);
        labelObj3d2.key = 'lightPage'
        this.selectableMeshArr.push(labelObj3d2.backgroundMesh)
 


        let txt3 = `<div><b>Simple Label</b> </div><div>This callout points to a simple label.</div>`
        let labelObj3d3 = new HtmlObject3D(txt3, this.fonts, this.calloutProps)
        labelObj3d3.translateY(20)
        this.scene.add(labelObj3d3);
        labelObj3d3.key = 'callout'
        this.selectableMeshArr.push(labelObj3d3.backgroundMesh) 


        let txt4 = `<div>Simple Label that spans Multiple Lines.</div>`
        let labelObj3d4 = new HtmlObject3D(txt4, this.fonts, this.labelProps)
        this.scene.add(labelObj3d4);
        labelObj3d4.key = 'label'
        this.selectableMeshArr.push(labelObj3d4.backgroundMesh)


        const options = {
            method : "POST",
            body: ' { "account_name": "eosio.token"} '
        }
        const accountsJson = await fetch('https://eos.greymass.com/v1/chain/get_account', options)
        .then(response => response.json())
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
        this.selectableMeshArr.push(labelObj3d5.backgroundMesh)




        // as xml
        var parser = new DOMParser();
        var node = parser.parseFromString('<p xmlns="http://www.w3.org/1999/xhtml" style="color: red">foo</p>', 'text/xml').firstChild;
        console.log('color', node.style.color)


        // fetch
        const fullDoc = await fetch('./fullDoc.html').then(response => response.text())
        var parser = new DOMParser();
        var node = parser.parseFromString(fullDoc, 'text/html');
        console.log('node', node)
        let h1El = node.querySelectorAll('h1');
        console.log('h1El', h1El[0])
        //console.log(window.getComputedStyle(h1El[0], null))
        //console.log('color', node.style.color)
        var head  = node.getElementsByTagName('head')[0];
        var link  = node.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'mystyle.css';
        link.onload = function() { 
            head.appendChild(link);
        }

        console.log(window.getComputedStyle(h1El[0], null))





        // https://stackoverflow.com/questions/25724166/acessing-the-render-tree
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'document';
        /* xhttp.onreadystatechange = function(e) {
            if (this.readyState == 4 && this.status == 200) {
                var document = e.target.response;
                var h2headings = document.querySelectorAll('h1');
                console.log(h2headings[0])
                console.log(window.getComputedStyle(h2headings[0], null))//htmlDoc.getComputedStyle
            }
        }; */
        xhttp.onload = function() {
            console.log(this.responseXML.title);
            var h2headings = this.responseXML.querySelectorAll('h1');
            console.log('new XMLHttpRequest()')
            console.log(h2headings[0])
            console.log(window.getComputedStyle(h2headings[0], null))//htmlDoc.getComputedStyle
          }
        xhttp.open("GET", "./test.html", true);
        xhttp.send();

        //var domfile = Services.appShell.hiddenDOMWindow.File('./test.html');
        /* var hiddenWindow = Components.classes["@mozilla.org/appshell/appShellService;1"].getService(Components.interfaces.nsIAppShellService).hiddenDOMWindow;
        hiddenWindow.document.location = './test.html';
        console.log(hiddenWindow)  */

        /* let win2 = window.open("about:blank","",
        "width=600,height=100%,scrollbars=0,resizable=0,toolbar=0,location=0,menubar=0,status=0,directories=0");
        win2.blur();
        window.focus()
        win2.document.location.href='./test.html'; */


        var htmlText= '<h1 style="color: red">foo</h1><';
        var divEl = document.createElement("div")
        divEl.innerHTML = htmlText
        //let header = temp.getElementBy("header")
        console.log('document.createElement("div")')
        console.log(divEl)
        console.log(window.getComputedStyle(divEl.firstChild, null))
        console.log('color', divEl.firstChild.style.color)


        var doc = document.cloneNode();

        doc.appendChild(doc.createElement('html'));
        let head1 = doc.createElement('head')
        doc.documentElement.appendChild(head1);
        head1.innerHTML += '<link rel="stylesheet" href="mystyle.css" type="text/css"/>';
        let body = doc.createElement('body')
        doc.documentElement.appendChild(body);
        body.appendChild(doc.createElement('h1'));

        console.log('document.cloneNode()')
        console.log(body)
        console.log(window.getComputedStyle(body.firstChild, null))


    }



}