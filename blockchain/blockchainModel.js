"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
//import TWEEN from "../lib/tween.js/src/Tween.js";
//import * as TWEEN  from "https://cdn.jsdelivr.net/npm/es6-tween";
// import TWEEN from "https://cdn.jsdelivr.net/npm/tween@0.9.0/tween.min.js";
import Scene from "../lib/scene.js";
import { Water } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/objects/Water2.js";
import { FaceNormalsHelper } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/helpers/FaceNormalsHelper.js';
import { VertexNormalsHelper } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/helpers/VertexNormalsHelper.js';

const WIDTH = 400;
const HEIGHT = 200;
const DEPTH = 200;

const IDLEBALANCES = new THREE.Vector3(WIDTH * 1.25, HEIGHT * 2.5, 0)
const FOREIGNBALANCES = new THREE.Vector3(WIDTH * 1.25, - HEIGHT * 2.5, 0)
const TANSACTIONBALANCES = new THREE.Vector3(0, - HEIGHT * 5, 0)

let font, labelTextMat, labelBackgroundMat, calloutBackgroundMat

export default class BlockchainModel extends Scene {

    constructor() {
        super()


        labelTextMat = new THREE.MeshBasicMaterial({
            color: 0x404040,
            side: THREE.DoubleSide
        });
        labelBackgroundMat = new THREE.MeshBasicMaterial({
            color: 0xD7DADD,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        calloutBackgroundMat = new THREE.MeshBasicMaterial({
            color: 0xF9E79F,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
    }

    init() {


        const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
        let chestahedronMesh = new THREE.Mesh(this.makeChestahedronGeom(), pipeMaterial)
        chestahedronMesh.position.set(0, HEIGHT * 5, 0)
        //chestahedronMesh.rotateZ(Math.PI/2);
        //new TWEEN.Tween(chestahedronMesh.rotateY).easing(TWEEN.Easing.Quadratic.Out).to(-Math.PI/6, 1000).start().repeat(Infinity)  
        let waterTween = new TWEEN.Tween(chestahedronMesh.rotation).to({ y: -Math.PI / 6 }, 1000);
        waterTween.easing(TWEEN.Easing.Quadratic.Out);
        /* waterTween.onUpdate(obj => {
            chestahedronMesh.rotation
            // console.log('tx', obj.tx)
            //console.log(reelObj3d.rotateY)
            //chestahedronMesh.rotateY = obj
            //chestahedronMesh.updateMatrix ()
        }); */
        waterTween.repeat(Infinity); // repeats forever
        waterTween.start();
        //chestahedronMesh.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/6);
        //chestahedronMesh.updateMatrix ()


        this.getScene().add(chestahedronMesh)

        // must read font first
        var fontLoader = new THREE.FontLoader();
        fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.117.1/examples/fonts/helvetiker_bold.typeface.json', (font2) => {

            font = font2

            let blockchainModelObject3d = this.blockchainModel()
            this.getScene().add(blockchainModelObject3d)


        })

    }

    blockchainModel() {

        let blockchainModelObject3d = new THREE.Object3D();
        //scene.add(blockchainModelObject3d);

        let filmObj3d = this.getBlockchainFilm()
        filmObj3d.translateZ( -DEPTH * 10)
        blockchainModelObject3d.add(filmObj3d);

        let fiberMesh = this.getFiberMesh()
        blockchainModelObject3d.add(fiberMesh);

        return blockchainModelObject3d


    }

    getBlockchainFilm(tet) {

        let filmObj3d = new THREE.Object3D();
        //filmObj3d.key = getRandomKey()
        filmObj3d.name = 'Film Strip'


        // Film exposed

        let filmCanvas = this.getFilmCanvas(true)
        let texture = new THREE.Texture(filmCanvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.set(6, 1);

        let filmMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
            //wireframe: true

        });
        let filmGeo = new THREE.PlaneGeometry(HEIGHT * 6, HEIGHT, 1, 1)
        let filmMesh = new THREE.Mesh(filmGeo, filmMaterial);
        filmMesh.position.set(-600, 0, 0);
        filmObj3d.add(filmMesh);

        let newTargetPos = new THREE.Vector2(1, 0);
        new TWEEN.Tween(texture.offset).easing(TWEEN.Easing.Quadratic.Out).to(newTargetPos, 1000).start().repeat(Infinity)


        // Film unexposed

        let filmCanvas2 = this.getFilmCanvas(false)
        let texture2 = new THREE.Texture(filmCanvas2);
        texture2.needsUpdate = true;
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.repeat.set(2, 1);

        let filmMaterial2 = new THREE.MeshBasicMaterial({
            map: texture2,
            side: THREE.DoubleSide,
            transparent: true
            //wireframe: true

        });
        let filmGeo2 = new THREE.PlaneGeometry(HEIGHT * 2, HEIGHT, 1, 1)
        let filmMesh2 = new THREE.Mesh(filmGeo2, filmMaterial2);
        filmMesh2.position.set(200, 0, 0);
        filmObj3d.add(filmMesh2);

        let newTargetPos2 = new THREE.Vector2(1, 0);
        new TWEEN.Tween(texture2.offset).easing(TWEEN.Easing.Quadratic.Out).to(newTargetPos2, 1000).start().repeat(Infinity)


        /* let vnh = new VertexNormalsHelper(tempMesh2, 50);
        filmObj3d.add(vnh); */

        // film holder back
        let holderMaterial = new THREE.MeshBasicMaterial({ color: 0x404040, side: THREE.DoubleSide });
        let backHolderGeo = new THREE.PlaneGeometry(HEIGHT, HEIGHT, 1, 1)
        let backHolderMesh = new THREE.Mesh(backHolderGeo, holderMaterial);
        backHolderMesh.position.set( -HEIGHT / 2, 0, -5);
        filmObj3d.add(backHolderMesh);

        // film holder front
        // Make shape with holes
        var frontHolderShape = new THREE.Shape()
            .moveTo(0, 0)
            .lineTo(HEIGHT, 0)
            .lineTo(HEIGHT, HEIGHT)
            .lineTo(0, HEIGHT)
        // square hole
        var holePath = new THREE.Path()
            .moveTo(10, 30)
            .lineTo(10, HEIGHT - 30)
            .lineTo(HEIGHT - 10, HEIGHT - 30)
            .lineTo(HEIGHT - 10, 30)
            frontHolderShape.holes.push(holePath);
        let frontHolderGeo = new THREE.ShapeGeometry(frontHolderShape);
        frontHolderGeo.center()
        let frontHolderMesh = new THREE.Mesh(frontHolderGeo, holderMaterial);
        frontHolderMesh.position.set( -HEIGHT / 2, 0, 5);
        filmObj3d.add(frontHolderMesh);



        // Add thr film reel
        let reelMesh = this.getReelGeo(filmCanvas)
        reelMesh.position.set(-HEIGHT * 6, 0, -HEIGHT * 2);
        filmObj3d.add(reelMesh);

        filmObj3d.translateX(100)
        return filmObj3d
    }

    getReelGeo(filmCanvas) {

        let reelObj3d = new THREE.Object3D();
        //filmObj3d.key = getRandomKey()
        reelObj3d.name = 'Film Reel'

        // wrap the film arround a cylinder
        let texture = new THREE.Texture(filmCanvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.set(14, 1);

        let filmMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
            //wireframe: true

        });
        var filmGeometry = new THREE.CylinderGeometry(400, 400, 200, 32, 1, true);
        let filmMesh = new THREE.Mesh(filmGeometry, filmMaterial);
        reelObj3d.add(filmMesh)

        // Fill the inside with a dark cylinder
        let innerMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
        var innerGeometry = new THREE.CylinderGeometry(390, 390, 200, 32, 1);
        let innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
        reelObj3d.add(innerMesh)




        // Reel

        // Make shape with holes
        var circleShape = new THREE.Shape()
            .moveTo(0, 0)
            .absarc(0, 0, 450, 0, Math.PI * 2, false);

        // center hole
        var holePath = new THREE.Path()
            .moveTo(0, 0)
            .absarc(0, 0, 20, 0, Math.PI * 2, true);
        circleShape.holes.push(holePath);

        // 6 holes arround
        for (let i = 1; i < 7; i++) {
            let rad = Math.PI * 2 / 6 * i
            let x = Math.sin(rad) * 275
            let y = Math.cos(rad) * 275
            let holePath = new THREE.Path()
                .moveTo(x, y)
                .absarc(x, y, 110, 0, Math.PI * 2, true);
            circleShape.holes.push(holePath);
        }

        // Make the Mesh
        var extrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var reelGeometry = new THREE.ExtrudeBufferGeometry(circleShape, extrudeSettings);
        const reelMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
        let reelMesh = new THREE.Mesh(reelGeometry, reelMaterial);
        reelMesh.rotation.x = Math.PI / 2;
        reelMesh.position.set(0, -103, 0)
        reelObj3d.add(reelMesh)

        // Copy the Mesh
        let reelMesh2 = reelMesh.clone()
        reelMesh2.position.set(0, 104, 0)
        reelObj3d.add(reelMesh2)




        /* reelObj3d.rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 0.1);
        //new TWEEN.Tween(reelObj3d.rotateY).easing(TWEEN.Easing.Quadratic.Out).to(-Math.PI/6, 1000).start().repeat(Infinity)
        return reelObj3d

        let waterTween = new TWEEN.Tween({ tx: 0 }).to({ tx: -Math.PI / 6 }, 1000);
        waterTween.easing(TWEEN.Easing.Quadratic.Out);
        waterTween.onUpdate(obj => {
            // console.log('tx', obj.tx)
            console.log(reelObj3d.rotateY)
            reelObj3d.rotateY = obj
        });
        waterTween.repeat(Infinity); // repeats forever
        waterTween.start(); */
        //labelTextMat, labelBackgroundMat, calloutBackgroundMat

        let text = 'All blocks, right back the very first Genisis block, are recorded as an immutable datastore. If you star tat the Genisis block and replay all the transactions in the same order, you will arrive at the same memory state'


        let labelObj3d = this.getLabelObj3d(text, font, 600, 20, labelTextMat, calloutBackgroundMat, labelTextMat, 'bottomRight')
        labelObj3d.position.y = 300;
        reelObj3d.add(labelObj3d);

        return reelObj3d

    }

    getFilmCanvas(exposed) {
        const length = 256
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.canvas.width = length;
        ctx.canvas.height = length;


        ctx.fillStyle = 'rgba(215, 219, 221, 0.3)';
        ctx.fillRect(10, 40, length - 20, length - 80);

        if (exposed) {
            ctx.font = "8pt Courier New";
            //ctx.fillStyle = 'rgb(256, 256, 256)';
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('block_num: 117936163', 10, 50);
            ctx.fillText('timestamp: 2020-04-28T21:14:54.500', 10, 60);
            ctx.fillText('previous: "07079022384a78b8ca426174fbb65dcced0e71e54defea00b257454b27e0ce6a"', 10, 70);
            ctx.fillText('transactions: [', 10, 80);
            ctx.fillText('cpu_usage_us: 5732', 20, 90);
            ctx.fillText('net_usage_words: 12', 20, 100);
            ctx.fillText('trx: {', 20, 110);
            ctx.fillText('signatures: [', 30, 120);
            ctx.fillText('"SIG_K1_KXYrzRFDmRfkQo7MK6B9BRoq3oaDFQgGPsQgTGWGDyngzUPJEoh5eNXxT3FsNuH6ZYpYhivoRRSLYaShXRjL6inF2WPDv6"', 40, 130);
            ctx.fillText(']', 30, 140);
            ctx.fillText('transaction: {', 30, 150);
            ctx.fillText('actions: [', 40, 160);
            ctx.fillText('{', 50, 170);
            ctx.fillText('account: "pptqipaelyog"', 60, 180);
            ctx.fillText('authorization: [', 60, 190);
            ctx.fillText('{', 70, 200);
            ctx.fillText('actor: "izcv2brw3sqe"', 80, 210);
        }

        // path
        ctx.beginPath();
        //outer shape, clockwise
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.lineTo(length, length);
        ctx.lineTo(0, length);
        ctx.closePath();
        //inner shape (hole), counter-clockwise
        ctx.moveTo(10, 40);
        ctx.lineTo(10, length - 40);
        ctx.lineTo(length - 10, length - 40);
        ctx.lineTo(length - 10, 40);
        ctx.closePath();

        //inner shape (hole), counter-clockwise
        let y = 10
        for (let i = 0; i < 8; i++) {
            let x = i * length / 8 + 10
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 20);
            ctx.lineTo(x + 10, y + 20);
            ctx.lineTo(x + 10, y);
            ctx.closePath();
        }
        y = 226
        for (let i = 0; i < 8; i++) {
            let x = i * length / 8 + 10
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 20);
            ctx.lineTo(x + 10, y + 20);
            ctx.lineTo(x + 10, y);
            ctx.closePath();
        }

        //fill
        ctx.fillStyle = "#696969";
        ctx.fill();

        return canvas
    }

    getFiberMesh() {
        let points = []
        points.push(new THREE.Vector3(-5000, 5000, -5000))
        points.push(new THREE.Vector3(-300, 3000, -2000))
        points.push(new THREE.Vector3(-500, 500, -500))


        let filmCanvas = this.getElectronCanvas()
        let texture = new THREE.Texture(filmCanvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(50, 1);

        let material = new THREE.MeshBasicMaterial({
            map: texture,
            //side: THREE.DoubleSide,
            transparent: true,
            //wireframe: true
            color: 0xe0e0e0

        });

        let curve = new THREE.CatmullRomCurve3(points);
        let geometry = new THREE.TubeGeometry(curve, 10, 2, 8, false);
        let mesh = new THREE.Mesh(geometry, material);

        let newTargetPos = new THREE.Vector2(-1, 0);
        new TWEEN.Tween(texture.offset).easing(TWEEN.Easing.Linear.None).to(newTargetPos, 500).start().repeat(Infinity)
        return mesh

    }
    getElectronCanvas() {
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