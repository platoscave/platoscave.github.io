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

export default class BlockchainModel extends Scene {

    constructor() {
        super()
    }

    init() {
        let blockchainModelObject3d = this.blockchainModel()
        this.getScene().add(blockchainModelObject3d)

        const pipeMaterial = new THREE.MeshPhongMaterial({color: 0xe0e0e0 });
        let chestahedronMesh = new THREE.Mesh(this.makeChestahedronGeom(), pipeMaterial)
        //chestahedronMesh.position.set(0, HEIGHT * 10, 0)
        this.getScene().add(chestahedronMesh)

        // font
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
            let labelMesh = this.getLabelMesh(text, font, 200, 20, textMat, backgroundMat, textMat)
            labelMesh.position.y = 150;
            this.getScene().add(labelMesh);


            //let LinesGeo = this.getLinesGeo(text, font, 200, 20)


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

        const filmMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            opacity: 0.5,
            side: THREE.DoubleSide,
            //depthWrite: false,
            //depthTest: false,
            transparent: true,
        });
        let units = 100
        let points = [];
        points.push(new THREE.Vector3(0, 0, 0))
        points.push(new THREE.Vector3(-units * 12, 0, 0))
        points.push(new THREE.Vector3(-units * 12, 0, -units * 4))
        points.push(new THREE.Vector3(-units * 8, 0, -units * 4))
        points.push(new THREE.Vector3(-units * 9, 0, -units))
        points.push(new THREE.Vector3(-units * 11, 0, -units))
        points.push(new THREE.Vector3(-units * 11, 0, -units * 3))


        let curve = new THREE.CatmullRomCurve3(points, false); //SplineCurve3
        let filmGeometry = new THREE.TubeGeometry(curve, 64, 30, 8, false);
        let filmMesh = new THREE.Mesh(filmGeometry, filmMaterial);

        filmObj3d.add(filmMesh);
        //this.pushSelectableMeshArr(filmMesh)

        let blockObj3D = this.getBlockObject3D(curve)
        filmObj3d.add(blockObj3D);



        // Reel

        const reelMaterial = new THREE.MeshPhongMaterial({
            color: 0xe0e0e0,
        });


        var circleShape = new THREE.Shape()
            .moveTo(50, 10)
            .absarc(10, 10, 400, 0, Math.PI * 2, false);

        var holePath = new THREE.Path()
            .moveTo(20, 10)
            .absarc(10, 10, 40, 0, Math.PI * 2, true);

        circleShape.holes.push(holePath);

        var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

        var reelGeometry = new THREE.ExtrudeBufferGeometry(circleShape, extrudeSettings);

        let reelMesh = new THREE.Mesh(reelGeometry, reelMaterial);
        reelMesh.position.set(-units * 10, -50, -units * 2);
        reelMesh.rotation.x = Math.PI / 2;

        filmObj3d.add(reelMesh);



        return filmObj3d
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