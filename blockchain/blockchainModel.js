//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
//import TWEEN from "../lib/tween.js/src/Tween.js";
//import * as TWEEN  from "https://cdn.jsdelivr.net/npm/es6-tween";
// import TWEEN from "https://cdn.jsdelivr.net/npm/tween@0.9.0/tween.min.js";
//import { WireframeGeometry2 } from './jsm/lines/WireframeGeometry2.js';
import Scene from "../lib/scene.js";
import HtmlObject3D from "../lib/htmlObject3d.js";
import BCNodeObject3D from "./bcNodeObject3d.js";
import { VertexNormalsHelper } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/helpers/VertexNormalsHelper.js";
import { VertexTangentsHelper } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/helpers/VertexTangentsHelper.js';
import { BufferGeometryUtils } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/utils/BufferGeometryUtils.js';




const WIDTH = 400;
const HEIGHT = 200;
const DEPTH = 200;


export default class BlockchainModel extends Scene {

    constructor() {
        super()

    }

    async init() {

        // init will setup html styles and retreive fonts asynchronously
        await super.init()

        const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
        let chestahedronGeom = this.makeChestahedronGeom()
        let chestahedronMesh = new THREE.Mesh(chestahedronGeom, pipeMaterial)
        //chestahedronMesh.position.set(0, HEIGHT * 5, 0)
        let chestTween = new TWEEN.Tween().to(null, 10000);
        chestTween.easing(TWEEN.Easing.Quartic.InOut);//Quartic.InOut Sinusoidal.InOut
        chestTween.onUpdate(rad => {
            chestahedronMesh.rotation.y = rad * Math.PI * 2 / 3
        });
        chestTween.repeat(Infinity); // repeats forever
        chestTween.start();

        this.scene.add(chestahedronMesh)

/*         let bcNodeObject3D = new BCNodeObject3D(this.fonts, this.darkPageProps)
        this.scene.add(bcNodeObject3D) */


        let filmCanvas = this.getPhotonCanvas()
        let texture = new THREE.Texture(filmCanvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.rotation = Math.PI / 2
        texture.repeat.set(15, 1);

        let material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            color: 0xe0e0e0

        });
        let newTargetPos = new THREE.Vector2(-1, 0);
        new TWEEN.Tween(texture.offset).easing(TWEEN.Easing.Linear.None).to(newTargetPos,500).start().repeat(Infinity)

        let geo = new THREE.SphereGeometry(20000, 4, 3);

        var wireframe = new THREE.WireframeGeometry( geo );
        const vectorArray = wireframe.attributes.position.array;
console.log('wireframe',geo)
        for (let i = 0; i < vectorArray.length; i += 6) {

            let p1 = new THREE.Vector3(vectorArray[i], vectorArray[i + 1], vectorArray[i + 2])
            let p2 = new THREE.Vector3(vectorArray[i + 3], vectorArray[i + 4], vectorArray[i + 5])
            let mesh = this.makeBeamMesh(p1, p2, 3) 
            mesh.material = material
            this.scene.add(mesh);


        }

        const verticesArr = geo.vertices

        for (let i = 0; i < verticesArr.length; i ++) {



            let bcNodeObject3D = new BCNodeObject3D(this.fonts, this.darkPageProps)
            bcNodeObject3D.position.set(verticesArr[i].x, verticesArr[i].y, verticesArr[i].z)
            //let quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
            //bcNodeObject3D.quaternion.copy(quaternion)
            
            //bcNodeObject3D.up = new THREE.Vector3( 0, -1, 0 )
            //bcNodeObject3D.lookAt(0,0,0)
            
            //bcNodeObject3D.rotation.x += ( -Math.PI /2)

            //this.selectableMeshArr.push(obj3d.backgroundMesh)


            this.scene.add( bcNodeObject3D );

        }
        // Add a callouts




        // blockchain.html
        this.scene.add(await this.createPositionLabels( './blockchain.html', new THREE.Vector3( 0, 200, 0), Math.PI / 4 ))

        let memoryObj3d = this.getMemoryObj3d()
        memoryObj3d.translateX(- 1000)
        this.scene.add(memoryObj3d);

    }

    async createPositionLabels ( url, position, rad) {
        const doc = await fetch( url ).then(response => response.text())
        let obj3d = new HtmlObject3D(doc, this.fonts, this.calloutProps)
        obj3d.translateX(position.x);
        obj3d.translateY(position.y);
        obj3d.translateZ(position.z);
        let quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), rad );
        //obj3d.quaternion.copy(quaternion)
        this.selectableMeshArr.push(obj3d.backgroundMesh)
        return obj3d
    }

    
    ////////////////////////////////////////////////////////////////////////
    // Draw three kinds of transparent memory
    //
    ////////////////////////////////////////////////////////////////////////
    getMemoryObj3d() {
        let memmoryObj3d = new THREE.Object3D();

        const memmoryMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            opacity: 0.2,
            side: THREE.DoubleSide,
            transparent: true,
        });
        let accountsGeo = new THREE.PlaneGeometry(WIDTH * 2, HEIGHT * 20, 1, 1)
        let accountsMesh = new THREE.Mesh(accountsGeo, memmoryMaterial);
        //accountsMesh.position.set(- 1000, 0, 0)
        memmoryObj3d.add(accountsMesh)

        /* let key = this.getRandomKey()

        let keyTextGeo = await this.makeTextLinesGeom('key', 'regular', 100, 20)
        let keyTextMesh = new THREE.Mesh(keyTextGeo, this.labelTextMat)
        //keyTextMesh.position.set(WIDTH + 10, 0, 2)
        memmoryObj3d.add(keyTextMesh) */

        return memmoryObj3d
    }

    getPhotonCanvas() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.canvas.width = 128;
        ctx.canvas.height = 32;
        // Create gradient
        var grd = ctx.createLinearGradient(50, 0, 128, 0);
        grd.addColorStop(0, "rgba(64, 64, 255, .3)");
        grd.addColorStop(1, "rgba(255, 255, 255, 1)");
        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 200, 32);
        return canvas
    }

}