"use strict";

//import TWEEN from "../lib/tween.js/src/Tween.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
//import * as TWEEN  from "https://cdn.jsdelivr.net/npm/es6-tween";
// import TWEEN from "https://cdn.jsdelivr.net/npm/tween@0.9.0/tween.min.js";
import Scene from "../lib/scene.js";
import { Water } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/objects/Water2.js";

const WIDTH = 400;
const HEIGHT = 200;
const DEPTH = 200;

const IDLEBALANCES = new THREE.Vector3(WIDTH * 1.25, HEIGHT * 2.5, 0)
const FOREIGNBALANCES = new THREE.Vector3(WIDTH * 1.25, - HEIGHT * 2.5, 0)
const TANSACTIONBALANCES = new THREE.Vector3(0, - HEIGHT * 5, 0)

let font, textMat, backgroundMat

export default class BlockchainModel extends Scene {

    constructor() {
        super()
    }

    init() {
        let blockchainModelObject3d = this.blockchainModel()
        this.getScene().add(blockchainModelObject3d)

        const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
        let chestahedronMesh = new THREE.Mesh(this.makeChestahedronGeom(), pipeMaterial)
        chestahedronMesh.position.set(0, HEIGHT * 5, 0)
        this.getScene().add(chestahedronMesh)

        // must read font first
        var fontLoader = new THREE.FontLoader();
        fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.117.1/examples/fonts/helvetiker_bold.typeface.json', (font) => {

            let text = 'This is a long text that wont fit on one line'

            var textMat = new THREE.MeshBasicMaterial({
                color: 0x006699,
                side: THREE.DoubleSide
            });
            var backgroundMat = new THREE.MeshBasicMaterial({
                color: 0x006699,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            let labelObj3d = this.getLabelObj3d(text, font, 200, 20, textMat, backgroundMat, textMat)
            labelObj3d.position.y = 200;
            this.getScene().add(labelObj3d);

        })

    }

    blockchainModel() {

        let blockchainModelObject3d = new THREE.Object3D();
        //scene.add(blockchainModelObject3d);

        let filmObj3d = this.getBlockchainFilm()
        //filmObj3d.position.set(TANSACTIONBALANCES.x, TANSACTIONBALANCES.y, TANSACTIONBALANCES.z)
        blockchainModelObject3d.add(filmObj3d);



        return blockchainModelObject3d


    }

    getBlockchainFilm(text) {



        let filmObj3d = new THREE.Object3D();
        //filmObj3d.key = getRandomKey()
        filmObj3d.name = 'Film'


        // Film 

        const filmMaterialX = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            opacity: 0.5,
            side: THREE.DoubleSide,
            //depthWrite: false,
            //depthTest: false,
            transparent: true,
        });





        let units = 100
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-units * 12, 0, 0),
            new THREE.Vector3(-units * 12, 0, -units * 4),
            new THREE.Vector3(-units * 8, 0, -units * 4),
            new THREE.Vector3(-units * 9, 0, -units),
            new THREE.Vector3(-units * 11, 0, -units),
            new THREE.Vector3(-units * 11, 0, -units * 3)
        ]);
        curve.curveType = 'catmullrom';
        curve.closed = false;



        let curveLength = curve.getLength()

        let filmCanvas = this.makeFilmCanvas()


        let texture = new THREE.Texture(filmCanvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        //texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 14, 1 );
        let filmMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });


        var shape = new THREE.Shape()
        .moveTo( HEIGHT / 2, 0 )
        .lineTo( -HEIGHT / 2, 0 )
        .lineTo( -HEIGHT / 2, 20 )
        .lineTo( HEIGHT / 2, 20 )
        .lineTo( HEIGHT / 2, 0 )

        var extrudeSettings = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: curve
        };

        var filmGeometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

        //let filmGeometry = new THREE.TubeGeometry(curve, 64, 30, 8, false);
        let filmMesh = new THREE.Mesh(filmGeometry, filmMaterial);

        filmObj3d.add(filmMesh);
        //this.pushSelectableMeshArr(filmMesh)

        let blockObj3D = this.getBlockObject3D(curve)
        filmObj3d.add(blockObj3D); 








        let texture2 = new THREE.Texture(filmCanvas);
        texture2.needsUpdate = true;
        texture2.wrapS = THREE.RepeatWrapping;
        //texture.wrapT = THREE.RepeatWrapping;
        //texture.repeat.set( curveLength / 200, 1 );       
        texture2.repeat.set(2, 1);
        let filmMaterial2 = new THREE.MeshBasicMaterial({
            map: texture2,
            transparent: true
        });
        let tempMesh2 = new THREE.Mesh(new THREE.PlaneGeometry(HEIGHT * 2, HEIGHT, 10, 10), filmMaterial2);
        tempMesh2.position.set(0, -200, 0);
        filmObj3d.add(tempMesh2);












        // Reel

        const reelMaterial = new THREE.MeshPhongMaterial({
            color: 0xe0e0e0,
        });


        var circleShape = new THREE.Shape()
            .moveTo(0, 0)
            .absarc(0, 0, 400, 0, Math.PI * 2, false);

        var holePath = new THREE.Path()
            .moveTo(0, 0)
            .absarc(0, 0, 40, 0, Math.PI * 2, true);

        circleShape.holes.push(holePath);

        var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

        var reelGeometry = new THREE.ExtrudeBufferGeometry(circleShape, extrudeSettings);

        let reelMesh = new THREE.Mesh(reelGeometry, reelMaterial);
        reelMesh.position.set(-units * 10, -50, -units * 2);
        reelMesh.rotation.x = Math.PI / 2;

        filmObj3d.add(reelMesh);



        return filmObj3d
    }
    makeFilmCanvas(curveLength) {
        const length = 256
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.canvas.width = length;
        ctx.canvas.height = length;


        ctx.fillStyle = 'rgba(215, 219, 221, 0.3)';
        ctx.fillRect(10, 40, length - 20, length - 80);

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


    getBlockObject3D(curve) {
        let object3d = new THREE.Object3D();

        let coneMaterial = new THREE.MeshLambertMaterial({ color: 0xffdf00 });
        let coneGeometry = new THREE.CylinderGeometry(0, 10, 50, 40, 40, false);
        let coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);

        let t = 0;
        let matrix = new THREE.Matrix4();
        let up = new THREE.Vector3(0, 1, 0);
        let axis = new THREE.Vector3();
        let pt, radians, tangent;

        // set the marker position
        pt = curve.getPoint(t);
        coneMesh.position.set(pt.x, pt.y, pt.z);

        // get the tangent to the curve
        tangent = curve.getTangent(t).normalize();

        // calculate the axis to rotate around
        axis.crossVectors(up, tangent).normalize();

        // calcluate the angle between the up vector and the tangent
        radians = Math.acos(up.dot(tangent));

        // set the quaternion
        coneMesh.quaternion.setFromAxisAngle(axis, radians);
        object3d.add(coneMesh);

        let waterTween = new TWEEN.Tween({ tx: 0 }).to({ tx: 1 }, 8000);
        waterTween.easing(TWEEN.Easing.Linear.None);
        waterTween.onUpdate(obj => {
            // console.log('tx', obj.tx)
            // set the marker position
            pt = curve.getPoint(obj);
            coneMesh.position.set(pt.x, pt.y, pt.z);

            // get the tangent to the curve
            tangent = curve.getTangent(obj).normalize();

            // calculate the axis to rotate around
            axis.crossVectors(up, tangent).normalize();

            // calcluate the angle between the up vector and the tangent
            radians = Math.acos(up.dot(tangent));

            // set the quaternion
            coneMesh.quaternion.setFromAxisAngle(axis, radians);
        });
        waterTween.repeat(Infinity); // repeats forever
        waterTween.start();

        return object3d
    }


}