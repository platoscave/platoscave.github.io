"use strict";

//import TWEEN from "../lib/tween.js/src/Tween.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
import HtmlObject3D from "../lib/htmlObject3d.js";
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

export default class MacoeconomyModel extends Scene {

    constructor() {
        super()

    }

    async init() {

        // init will setup html styles and retreive fonts asynchronously
        await super.init()

        const pipeMaterial = new THREE.MeshPhongMaterial({color: 0xe0e0e0 });
        let chestahedronMesh = new THREE.Mesh(this.makeChestahedronGeom(), pipeMaterial)
        chestahedronMesh.position.set(0, HEIGHT * 10, 0)
        this.scene.add(chestahedronMesh)


        textMat = new THREE.MeshBasicMaterial({
            color: 0x404040,
            side: THREE.DoubleSide
        });
        backgroundMat = new THREE.MeshBasicMaterial({
            color: 0xD7DADD,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });

        // must read font first
        var fontLoader = new THREE.FontLoader();
        fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.117.1/examples/fonts/helvetiker_bold.typeface.json', newFont => {

            font = newFont

            let macroEconomicModelObject3d = this.macroEconomicModel()
            this.scene.add(macroEconomicModelObject3d)

        })

    }

    macroEconomicModel() {

        let macroEconomicModelObject3d = new THREE.Object3D();
        //scene.add(macroEconomicModelObject3d);

        let transBalObj3d = this.getTankObject3D('Transaction Balances')
        transBalObj3d.position.set(TANSACTIONBALANCES.x, TANSACTIONBALANCES.y, TANSACTIONBALANCES.z)
        macroEconomicModelObject3d.add(transBalObj3d);

        let idleBalObj3d = this.getTankObject3D('Idle Balances')
        idleBalObj3d.position.set(IDLEBALANCES.x, IDLEBALANCES.y, IDLEBALANCES.z)
        macroEconomicModelObject3d.add(idleBalObj3d);

        let forBalObj3d = this.getTankObject3D('Foreign Owned Balances')
        forBalObj3d.position.set(FOREIGNBALANCES.x, FOREIGNBALANCES.y, FOREIGNBALANCES.z)
        macroEconomicModelObject3d.add(forBalObj3d);



        // Pipe

        const pipeMaterial = new THREE.MeshPhongMaterial({
            color: 0x4040ff,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false,
            //depthTest: false,
            transparent: true,
        });





        // incomePipe pipe
        let incomePipeObject3D = this.getIncomePipeObject3D(pipeMaterial)
        macroEconomicModelObject3d.add(incomePipeObject3D);

        // Savings pipe
        let savingsPipeObject3D = this.getToRightPipeObject3D('Savings (S)', pipeMaterial)
        savingsPipeObject3D.position.set(IDLEBALANCES.x + 25, IDLEBALANCES.y, IDLEBALANCES.z)
        macroEconomicModelObject3d.add(savingsPipeObject3D);

        // Investment pipe
        let investmentsPipeObject3D = this.getToLeftPipeObject3D('Investments (I)', pipeMaterial)
        investmentsPipeObject3D.position.set(IDLEBALANCES.x + 25, IDLEBALANCES.y, IDLEBALANCES.z)
        macroEconomicModelObject3d.add(investmentsPipeObject3D);

        // Import pipe
        let importPipeObject3D = this.getToRightPipeObject3D('Import (M)', pipeMaterial)
        importPipeObject3D.position.set(FOREIGNBALANCES.x + 25, FOREIGNBALANCES.y, FOREIGNBALANCES.z)
        macroEconomicModelObject3d.add(importPipeObject3D);

        // Export pipe
        let exportPipeObject3D = this.getToLeftPipeObject3D('Export (X)', pipeMaterial)
        exportPipeObject3D.position.set(FOREIGNBALANCES.x + 25, FOREIGNBALANCES.y, FOREIGNBALANCES.z)
        macroEconomicModelObject3d.add(exportPipeObject3D);

        // Tax Government spending pipe
        let taxPipeObject3D = this.getTaxPipeObject3D(pipeMaterial)
        taxPipeObject3D.position.set(-25, IDLEBALANCES.y, 0)
        macroEconomicModelObject3d.add(taxPipeObject3D);

        return macroEconomicModelObject3d


    }

    getTankObject3D(text) {

        const getRandomKey = () => {
            // base32 encoded 64-bit integers. This means they are limited to the characters a-z, 1-5, and '.' for the first 12 characters.
            // If there is a 13th character then it is restricted to the first 16 characters ('.' and a-p).
            var characters = 'abcdefghijklmnopqrstuvwxyz12345'
            var randomKey = ''
            for (var i = 0; i < 12; i++) {
                randomKey += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            return randomKey
        }

        let tankObject3d = new THREE.Object3D();
        tankObject3d.key = getRandomKey()
        tankObject3d.name = text


        // Tank rectangle

        const tankMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            opacity: 0.2,
            side: THREE.DoubleSide,
            //depthWrite: false,
            //depthTest: false,
            transparent: true,
        });
        let materialTransparent = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, wireframe: true, side: THREE.DoubleSide });
        let materials = [tankMaterial, tankMaterial, materialTransparent, tankMaterial, tankMaterial, tankMaterial]
        let tankGeometry = new THREE.BoxBufferGeometry(WIDTH, HEIGHT, DEPTH);
        let tankMesh = new THREE.Mesh(tankGeometry, materials);

        tankObject3d.add(tankMesh);
        this.selectableMeshArr.push(tankMesh)




        // Water Body

        const waterMaterial = new THREE.MeshBasicMaterial({
            color: 0x4040ff,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false,
            //depthTest: true,
            transparent: true
        });


        let waterGeometry = new THREE.BoxBufferGeometry(WIDTH, HEIGHT / 2, DEPTH);
        let waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
        waterMesh.position.set(0, -HEIGHT / 4, 0);

        tankObject3d.add(waterMesh);

        let parser = new DOMParser()
        let labelDoc = parser.parseFromString('<p>'+text+'</p>', 'text/html');
        let labelObj3d = new HtmlObject3D(labelDoc.body, this.fonts, this.labelProps)
        //let labelObj3d = this.getLabelObj3d(text, font, WIDTH, 30, textMat, backgroundMat, textMat)
        labelObj3d.position.set(0, - HEIGHT / 4, DEPTH / 2 + 20)
        tankObject3d.add(labelObj3d);


        const frameMaterial = new THREE.MeshPhongMaterial({
            color: 0xe0e0e0,
        });

        let wireframe = new THREE.EdgesGeometry(tankGeometry);
        const vectorArray = wireframe.attributes.position.array;

        for (let i = 0; i < vectorArray.length; i += 6) {
            let points = []
            points.push(new THREE.Vector3(vectorArray[i], vectorArray[i + 1], vectorArray[i + 2]))
            points.push(new THREE.Vector3(vectorArray[i + 3], vectorArray[i + 4], vectorArray[i + 5]))

            let curve = new THREE.CatmullRomCurve3(points);
            let tubeGeometry = new THREE.TubeGeometry(curve, 10, 10, 8, false);
            let tubeMesh = new THREE.Mesh(tubeGeometry, frameMaterial);
            tankObject3d.add(tubeMesh);

            let geometry = new THREE.SphereGeometry(10, 32, 32);
            let sphereMesh = new THREE.Mesh(geometry, frameMaterial);
            sphereMesh.position.set(vectorArray[i], vectorArray[i + 1], vectorArray[i + 2]);
            tankObject3d.add(sphereMesh);
        }

        // water surface https://github.com/mrdoob/three.js/blob/master/examples/webgl_water.html
        // and https://jsfiddle.net/6ym08593/

        // TODO https://threejs.org/examples/?q=water#webgl_shaders_ocean

        let textureLoader = new THREE.TextureLoader();
        let waterSurfaceGeometry = new THREE.PlaneBufferGeometry(WIDTH, DEPTH);
        let flowMap = textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Flow.jpg');

        const water = new Water(waterSurfaceGeometry, {
            color: '#ffffff',
            scale: 4,
            flowDirection: new THREE.Vector2(1, 1),
            textureWidth: 1024,
            textureHeight: 1024,
            flowMap: flowMap,
            normalMap0: textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg'),
            normalMap1: textureLoader.load('https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg')
        });

        water.position.set(0, 2, 0);
        water.rotation.x = Math.PI * -0.5;
        tankObject3d.add(water);


        return tankObject3d
    }

    getIncomePipeObject3D(pipeMaterial) {
        let object3d = new THREE.Object3D();

        let TOP = IDLEBALANCES.y + HEIGHT * 4
        let BOTTOM = TANSACTIONBALANCES.y - HEIGHT * 1.5
        let LEFT = - WIDTH * 2

        let downPipe1 = this.getPipeObject3D(HEIGHT, pipeMaterial)
        downPipe1.rotateZ(-Math.PI / 2);
        downPipe1.position.set(0, TANSACTIONBALANCES.y - HEIGHT / 2, 0)
        object3d.add(downPipe1);

        let cornerDownPipe1 = this.getCornerObject3D()
        cornerDownPipe1.position.set(0, BOTTOM, 0)
        cornerDownPipe1.rotateZ(Math.PI);
        object3d.add(cornerDownPipe1);

        let leftPipe = this.getPipeObject3D(WIDTH * 2, pipeMaterial)
        leftPipe.rotateZ(-Math.PI);
        leftPipe.translateY(BOTTOM)
        leftPipe.position.set(0, BOTTOM, 0)
        object3d.add(leftPipe);

        let cornerLeftPipe = this.getCornerObject3D()
        cornerLeftPipe.position.set(LEFT, BOTTOM, 0)
        cornerLeftPipe.rotateZ(Math.PI / 2);
        object3d.add(cornerLeftPipe);

        let upPipe = this.getPipeObject3D(TOP - BOTTOM, pipeMaterial)
        upPipe.rotateZ(Math.PI / 2);
        upPipe.position.set(LEFT, BOTTOM, 0)
        object3d.add(upPipe);

        let cornerUpPipe = this.getCornerObject3D()
        cornerUpPipe.position.set(LEFT, TOP, 0)
        object3d.add(cornerUpPipe);

        let rightPipe = this.getPipeObject3D(WIDTH * 2, pipeMaterial)
        rightPipe.position.set(LEFT, TOP, 0)
        object3d.add(rightPipe);

        let cornerRightPipe = this.getCornerObject3D()
        cornerRightPipe.position.set(0, TOP, 0)
        cornerRightPipe.rotateZ(- Math.PI / 2);
        object3d.add(cornerRightPipe);

        let downPipe2 = this.getPipeObject3D(HEIGHT * 11, pipeMaterial)
        downPipe2.rotateZ(-Math.PI / 2);
        downPipe2.position.set(0, TOP, 0)
        object3d.add(downPipe2);

        // Add Labels

        let parser = new DOMParser()
        let incomeLabelDoc = parser.parseFromString('<p>Income (Y)</p>', 'text/html');
        let incomeLabelObj3d = new HtmlObject3D(incomeLabelDoc.body, this.fonts, this.labelProps)
        //let incomeTextMesh = this.getLabelObj3d('Income (Y)', font, WIDTH, 30, textMat, backgroundMat, textMat)
        incomeLabelObj3d.position.set(- WIDTH, TOP, 50)
        object3d.add(incomeLabelObj3d);

        let disposeLabelDoc = parser.parseFromString('<p>Disposable Income</p>', 'text/html');
        let disposeLabelObj3d = new HtmlObject3D(disposeLabelDoc.body, this.fonts, this.labelProps)     
        //let disposeTextMesh = this.getLabelObj3d('Disposable Income', font, WIDTH, 30, textMat, backgroundMat, textMat)
        disposeLabelObj3d.position.set(0, IDLEBALANCES.y + HEIGHT * 2, 50)
        object3d.add(disposeLabelObj3d);

        let consumptionLabelDoc = parser.parseFromString('<p>Consumption Spending (C)</p>', 'text/html');
        let consumptionLabelObj3d = new HtmlObject3D(consumptionLabelDoc.body, this.fonts, this.labelProps)
        //let consumptioTextMesh = this.getLabelObj3d('Consumption Spending (C)', font, WIDTH, 30, textMat, backgroundMat, textMat)
        consumptionLabelObj3d.position.set(0, IDLEBALANCES.y, 50)
        object3d.add(consumptionLabelObj3d);

        let domesticLabelDoc = parser.parseFromString('<p>Domestic Spending</p>', 'text/html');
        let domesticLabelObj3d = new HtmlObject3D(domesticLabelDoc.body, this.fonts, this.labelProps)
        //let domesticTextMesh = this.getLabelObj3d('Domestic Spending', font, WIDTH, 30, textMat, backgroundMat, textMat)
        domesticLabelObj3d.position.set(0, 0, 50)
        object3d.add(domesticLabelObj3d);

        let totalExpLabelDoc = parser.parseFromString('<p>Total Expenditures (AE)</p>', 'text/html');
        let totalExpLabelObj3d = new HtmlObject3D(totalExpLabelDoc.body, this.fonts, this.labelProps)
        //let totalExpTextMesh = this.getLabelObj3d('Total Expenditures (AE)', font, WIDTH, 30, textMat, backgroundMat, textMat)
        totalExpLabelObj3d.position.set(0, FOREIGNBALANCES.y, 50)
        object3d.add(totalExpLabelObj3d);

        return object3d
    }

    getPipeObject3D(length, pipeMaterial) {
        let object3d = new THREE.Object3D();

        let points = [];
        points.push(new THREE.Vector3(-length / 2, 0, 0));
        points.push(new THREE.Vector3(length / 2, 0, 0));

        let curve = new THREE.CatmullRomCurve3(points, false); //SplineCurve3
        let tubeGeometry = new THREE.TubeGeometry(curve, 500, 50, 8, false);
        let tubeMesh = new THREE.Mesh(tubeGeometry, pipeMaterial);
        tubeMesh.translateX(length / 2)
        object3d.add(tubeMesh);

        // Add currency
        let currenciesObj3d = this.getCurrenciesObject3D(curve)
        currenciesObj3d.translateX(length / 2)
        object3d.add(currenciesObj3d);

        return object3d
    }

    getCornerObject3D() {
        let object3d = new THREE.Object3D();

        const cornerMaterial = new THREE.MeshPhongMaterial({
            color: 0xe0e0e0
        });

        let sphereGeometry = new THREE.SphereBufferGeometry(52, 32, 32);
        let sphereMesh = new THREE.Mesh(sphereGeometry, cornerMaterial);
        object3d.add(sphereMesh);

        var rightCylGeo = new THREE.CylinderBufferGeometry(52, 52, 100, 8, 1, false);
        let rightCylMesh = new THREE.Mesh(rightCylGeo, cornerMaterial);
        rightCylMesh.position.set(50, 0, 0)
        rightCylMesh.rotateZ(-Math.PI / 2);
        object3d.add(rightCylMesh);

        var downCylGeo = new THREE.CylinderBufferGeometry(52, 52, 100, 8, 1, false);
        let downCylMesh = new THREE.Mesh(downCylGeo, cornerMaterial);
        downCylMesh.position.set(0, -50, 0)
        object3d.add(downCylMesh);

        return object3d
    }

    getToRightPipeObject3D(text, pipeMaterial) {
        let object3d = new THREE.Object3D();

        let points = [];
        points.push(new THREE.Vector3(-WIDTH * 1.25, HEIGHT * 1.5, 0))
        points.push(new THREE.Vector3(-WIDTH * 0.25 - 30, HEIGHT, 0))
        points.push(new THREE.Vector3(-WIDTH * 0.25, HEIGHT / 2, 0))


        let curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.30); //SplineCurve3
        let tubeGeometry = new THREE.TubeGeometry(curve, 64, 30, 8, false);
        let tubeMesh = new THREE.Mesh(tubeGeometry, pipeMaterial);
        object3d.add(tubeMesh);

        // Add currency
        let currenciesObj3d = this.getCurrenciesObject3D(curve)
        object3d.add(currenciesObj3d);

        // Add Labels


        let parser = new DOMParser()
        let labelDoc = parser.parseFromString('<p>'+text+'</p>', 'text/html');
        let labelObj3d = new HtmlObject3D(labelDoc.body, this.fonts, this.labelProps)
        //let textMesh = this.getLabelObj3d(text, font, WIDTH, 30, textMat, backgroundMat, textMat)
        labelObj3d.position.set(-WIDTH / 2, HEIGHT * 1.2, 50)
        object3d.add(labelObj3d);

        return object3d
    }

    getToLeftPipeObject3D(text, pipeMaterial) {
        let object3d = new THREE.Object3D();

        let points = [];
        points.push(new THREE.Vector3(-WIDTH * 0.25, - HEIGHT / 2, 0))
        points.push(new THREE.Vector3(-WIDTH * 0.25 - 30, - HEIGHT, 0))
        points.push(new THREE.Vector3(-WIDTH * 1.25, - HEIGHT * 1.5, 0))


        let curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.30); //SplineCurve3
        let tubeGeometry = new THREE.TubeGeometry(curve, 64, 30, 8, false);
        let tubeMesh = new THREE.Mesh(tubeGeometry, pipeMaterial);
        object3d.add(tubeMesh);

        // Add currency
        let currenciesObj3d = this.getCurrenciesObject3D(curve)
        object3d.add(currenciesObj3d);

        // Add Labels
        let parser = new DOMParser()
        let labelDoc = parser.parseFromString('<p>'+text+'</p>', 'text/html');
        let labelObj3d = new HtmlObject3D(labelDoc.body, this.fonts, this.labelProps)
        //let textMesh = this.getLabelObj3d(text, font, WIDTH, 30, textMat, backgroundMat, textMat)
        labelObj3d.position.set(-WIDTH / 2, - HEIGHT * 1.2, 50)
        object3d.add(labelObj3d);

        return object3d
    }

    getTaxPipeObject3D(pipeMaterial) {
        let object3d = new THREE.Object3D();

        let points = [];
        points.push(new THREE.Vector3(0, HEIGHT * 3, 0));
        points.push(new THREE.Vector3(-WIDTH, HEIGHT * 2.5, 0));
        points.push(new THREE.Vector3(-WIDTH, - HEIGHT * 1, 0));
        points.push(new THREE.Vector3(0, - HEIGHT * 1.5, 0));


        let curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.30); //SplineCurve3
        let tubeGeometry = new THREE.TubeGeometry(curve, 64, 30, 8, false);
        let tubeMesh = new THREE.Mesh(tubeGeometry, pipeMaterial);
        object3d.add(tubeMesh);

        // Add currency
        let currenciesObj3d = this.getCurrenciesObject3D(curve)
        object3d.add(currenciesObj3d);

        // Add Labels
        let parser = new DOMParser()
        let taxLabelDoc = parser.parseFromString('<p>Tax (T)</p>', 'text/html');
        let taxLabelObj3d = new HtmlObject3D(taxLabelDoc.body, this.fonts, this.labelProps)
        //let taxTextMesh = this.getLabelObj3d('Tax (T)', font, WIDTH, 30, textMat, backgroundMat, textMat)
        taxLabelObj3d.position.set(- WIDTH / 2, HEIGHT * 2.8, 50)
        object3d.add(taxLabelObj3d);

        let govLabelDoc = parser.parseFromString('<p>Government Spending (G)</p>', 'text/html');
        let govLabelObj3d = new HtmlObject3D(govLabelDoc.body, this.fonts, this.labelProps)
        //let govTextMesh = this.getLabelObj3d('Government Spending (G)', font, WIDTH, 30, textMat, backgroundMat, textMat)
        govLabelObj3d.position.set(- WIDTH / 2, - HEIGHT * 1.2, 50)
        object3d.add(govLabelObj3d);

        return object3d
    }

    getCurrenciesObject3D(curve) {
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