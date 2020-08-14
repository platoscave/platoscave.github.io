//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
//import TWEEN from "../lib/tween.js/src/Tween.js";
//import * as TWEEN  from "https://cdn.jsdelivr.net/npm/es6-tween";
// import TWEEN from "https://cdn.jsdelivr.net/npm/tween@0.9.0/tween.min.js";
//import { WireframeGeometry2 } from './jsm/lines/WireframeGeometry2.js';
import Scene from "../lib/scene.js";
import HtmlObject3D from "../lib/htmlObject3d.js";


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

    async init() {

        // init will setup html styles and retreive fonts asynchronously
        await super.init()

        const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });
        let chestahedronGeom = this.makeChestahedronGeom()
        let chestahedronMesh = new THREE.Mesh(chestahedronGeom, pipeMaterial)
        chestahedronMesh.position.set(0, HEIGHT * 5, 0)
        let chestTween = new TWEEN.Tween().to(null, 10000);
        chestTween.easing(TWEEN.Easing.Quartic.InOut);//Quartic.InOut Sinusoidal.InOut
        chestTween.onUpdate(rad => {
            chestahedronMesh.rotation.y = rad * Math.PI * 2 / 3
        });
        chestTween.repeat(Infinity); // repeats forever
        chestTween.start();

        this.scene.add(chestahedronMesh)

        let blockchainModelObject3d = await this.blockchainModel()
        this.scene.add(blockchainModelObject3d)

    }

    async blockchainModel() {

        let blockchainModelObject3d = new THREE.Object3D();
        //scene.add(blockchainModelObject3d);

        let filmObj3d = await this.getBlockchainFilm()
        filmObj3d.translateZ(-DEPTH * 10)
        blockchainModelObject3d.add(filmObj3d);

        let serverObj3d = await this.getServerObj3d()
        blockchainModelObject3d.add(serverObj3d);

        let memoryObj3d = await this.getMemoryObj3d()
        memoryObj3d.translateX(- 1000)
        blockchainModelObject3d.add(memoryObj3d);


        let fibersObj3d = this.getFibersObj3d()
        blockchainModelObject3d.add(fibersObj3d);




        let filmCanvas = this.getPhotonCanvas()
        let texture = new THREE.Texture(filmCanvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 1);

        let material = new THREE.MeshBasicMaterial({
            map: texture,
            //linewidth: 5,
            transparent: true,
            color: 0xe0e0e0

        });
        let newTargetPos = new THREE.Vector2(-1, 0);
        new TWEEN.Tween(texture.offset).easing(TWEEN.Easing.Linear.None).to(newTargetPos, 1000).start().repeat(Infinity)

        let geo = new THREE.SphereGeometry(5000, 4, 3);

        var wireframe = new THREE.WireframeGeometry( geo );
        const vectorArray = wireframe.attributes.position.array;

        for (let i = 0; i < vectorArray.length; i += 6) {
            let points = []
            points.push(new THREE.Vector3(vectorArray[i], vectorArray[i + 1], vectorArray[i + 2]))
            points.push(new THREE.Vector3(vectorArray[i + 3], vectorArray[i + 4], vectorArray[i + 5]))

            let curve = new THREE.CatmullRomCurve3(points);
            let tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 8, false);
            let tubeMesh = new THREE.Mesh(tubeGeometry, material);
            this.scene.add(tubeMesh);
        }
        // Add a callouts

        // blockchain.html
        this.scene.add(await this.createPositionLabels( './blockchain.html', new THREE.Vector3( 0, 200, 0), Math.PI / 4 ))


        return blockchainModelObject3d


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

    async getBlockchainFilm(tet) {

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
        let holderMaterial = new THREE.MeshPhongMaterial({ color: 0x404040, side: THREE.DoubleSide });
        //let holderMaterialLight = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        let backHolderGeo = new THREE.PlaneGeometry(HEIGHT, HEIGHT, 1, 1)
        let backHolderMesh = new THREE.Mesh(backHolderGeo, holderMaterial);
        backHolderMesh.position.set(-HEIGHT / 2, 0, -5);
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
        frontHolderMesh.position.set(-HEIGHT / 2, 0, 5);
        filmObj3d.add(frontHolderMesh);



        // Add the film reel
        let reelMesh = await this.getReelGeo(filmCanvas)
        reelMesh.position.set(-HEIGHT * 6, 0, -HEIGHT * 2);
        filmObj3d.add(reelMesh);

        filmObj3d.translateX(100)


        // Trapezoid projector

        var geometry = new THREE.CylinderGeometry(0.1 / Math.sqrt(2), 1 / Math.sqrt(2), 1, 4, 1, true); // size of top can be changed
        geometry.rotateY(Math.PI / 4);
        geometry.rotateX(Math.PI / 2);
        geometry.computeFlatVertexNormals();
        let mesh = new THREE.Mesh(geometry, holderMaterial);
        mesh.scale.set(100, 100, 100);
        mesh.position.set(-100, 0, 200)
        filmObj3d.add(mesh);


        return filmObj3d
    }

    async getReelGeo(filmCanvas) {

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

        //  TODO
        let quaternion = new THREE.Quaternion();

        let reelTween = new TWEEN.Tween().to(null, 4000);
        reelTween.easing(TWEEN.Easing.Linear.None);//Quartic.InOut Sinusoidal.InOut
        reelTween.onUpdate(i => {
            let rad = 2 * Math.PI / 3
            let rotationZ = i * -rad
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), rotationZ );
            reelObj3d.quaternion.copy(quaternion)
        });
        reelTween.repeat(Infinity); // repeats forever
        reelTween.start();



        return reelObj3d

    }

    // Create a canvas that represents 35mm film
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
        //inner shape (hole for the exposed area), counter-clockwise
        ctx.moveTo(10, 40);
        ctx.lineTo(10, length - 40);
        ctx.lineTo(length - 10, length - 40);
        ctx.lineTo(length - 10, 40);
        ctx.closePath();

        //inner shape (holes for the perferations), counter-clockwise
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
    
    ////////////////////////////////////////////////////////////////////////
    // Draw three kinds of transparent memory
    //
    ////////////////////////////////////////////////////////////////////////
    async getMemoryObj3d() {
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


    ////////////////////////////////////////////////////////////////////////
    // Draw three fiberoptic cables
    //
    ////////////////////////////////////////////////////////////////////////
    getFibersObj3d() {

        let fiberObj3d = new THREE.Object3D();

        // Transactions in
        let points1 = []
        points1.push(new THREE.Vector3(-5000, 5000, 5000))
        points1.push(new THREE.Vector3(-350, 3000, 1200))
        points1.push(new THREE.Vector3(-350, 20, 1200))
        points1.push(new THREE.Vector3(-250, 20, 740))
        let fiberMesh1 = this.getFiberMesh(points1)
        fiberObj3d.add(fiberMesh1);

        // State queries in
        /* let points2 = []
        points2.push(new THREE.Vector3(5000, 5000, 5000))
        points2.push(new THREE.Vector3(350, 3000, 1200))
        points2.push(new THREE.Vector3(350, 20, 1200))
        points2.push(new THREE.Vector3(250, 20, 740))
        let fiberMesh2 = this.getFiberMesh(points2)
        fiberObj3d.add(fiberMesh2); */

        // State queries out
        let points3 = []
        points3.push(new THREE.Vector3(250, 20, 740))
        points3.push(new THREE.Vector3(350, 20, 1200))
        points3.push(new THREE.Vector3(350, 3000, 1200))
        points3.push(new THREE.Vector3(5000, 5000, 5000))
        let fiberMesh3 = this.getFiberMesh(points3)
        fiberObj3d.add(fiberMesh3);

        // blockchain write
        let points4 = []
        points4.push(new THREE.Vector3(0, 20, -740))
        points4.push(new THREE.Vector3(40, -40, -1000))
        points4.push(new THREE.Vector3(0, 0, -1750))
        let fiberMesh4 = this.getFiberMesh(points4)
        fiberObj3d.add(fiberMesh4);

        return fiberObj3d
    }

    getFiberMesh(points) {
        let curve = new THREE.CatmullRomCurve3(points);
        let length = curve.getLength()

        let filmCanvas = this.getPhotonCanvas()
        let texture = new THREE.Texture(filmCanvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(length / 200, 1);

        let material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            color: 0xe0e0e0

        });

        //console.log(legnth)
        let geometry = new THREE.TubeGeometry(curve, 100, 2, 8, false);
        let mesh = new THREE.Mesh(geometry, material);

        let newTargetPos = new THREE.Vector2(-1, 0);
        new TWEEN.Tween(texture.offset).easing(TWEEN.Easing.Linear.None).to(newTargetPos, 500).start().repeat(Infinity)
        return mesh
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


    ////////////////////////////////////////////////////////////////////////
    // Draw printed circuit board with cpu, ram chips and connectors
    //
    ////////////////////////////////////////////////////////////////////////
    async getServerObj3d() {

        let serverObj3d = new THREE.Object3D();
        //filmObj3d.key = getRandomKey()
        serverObj3d.name = 'Server'

        // Add CPU with two layers
        const cpuMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e0e0 });

        // bottom layer
        var extrudeSettings = { depth: WIDTH, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 5, bevelThickness: 5 };
        let cpuRectShape = this.getRoundedRectShape(WIDTH, 20, 5)
        var cpuGeometry = new THREE.ExtrudeBufferGeometry(cpuRectShape, extrudeSettings);
        cpuGeometry.center()
        let cpuMesh = new THREE.Mesh(cpuGeometry, cpuMaterial)
        serverObj3d.add(cpuMesh)

        // top layer TODO merge into bottom mesh
        var extrudeSettings2 = { depth: WIDTH - 100, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 5, bevelThickness: 5 };
        let cpuRectShape2 = this.getRoundedRectShape(WIDTH - 50, 20, 5)
        var cpuGeometry2 = new THREE.ExtrudeBufferGeometry(cpuRectShape2, extrudeSettings2);
        cpuGeometry2.center()
        let cpuMesh2 = new THREE.Mesh(cpuGeometry2, cpuMaterial)
        cpuMesh2.position.set(0, 12, 0)
        serverObj3d.add(cpuMesh2)

        // Add text to CPU

        let cpuMat = new THREE.MeshBasicMaterial({ color: 0x404040 });
        let cpuShape = this.fonts.boldFont.generateShapes('CPU', 30);
        let cpuTextGeo = new THREE.ShapeGeometry(cpuShape);
        //let cpuTextGeo = await this.makeTextLinesGeom('CPU', 'bold', 50, 40)
        let cpuTextMesh = new THREE.Mesh(cpuTextGeo, cpuMat)
        cpuTextMesh.rotateX(- Math.PI / 2)
        cpuTextMesh.position.set(-60, 35, -80)
        serverObj3d.add(cpuTextMesh)

        // Add 16 memory chips

        let memoryMaterial = new THREE.MeshPhongMaterial({ color: 0x404040 });
        var memoryExtrudeSettings = { depth: WIDTH / 5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 5, bevelThickness: 5 };
        let memoryectShape = this.getRoundedRectShape(WIDTH / 2, 20, 5)
        var memoryGeometry = new THREE.ExtrudeBufferGeometry(memoryectShape, memoryExtrudeSettings);
        let memoryMesh = new THREE.Mesh(memoryGeometry, memoryMaterial)

        // Add text to RAM
        let textMat = new THREE.MeshBasicMaterial({ color: 0x808080 });
        let memTextShape = this.fonts.boldFont.generateShapes('RAM 4GB', 10);
        let memTextGeo = new THREE.ShapeGeometry(memTextShape);
        //let memTextGeo = await this.makeTextLinesGeom('RAM 4GB', 'regular', 50, 15)
        let memTextMesh = new THREE.Mesh(memTextGeo, textMat)
        memTextMesh.rotateX(- Math.PI / 2)

        for (let i = -4; i < 4; i++) {
            let memoryMeshA = memoryMesh.clone()
            memoryMeshA.position.set(-WIDTH - 20, 0, i * 150)
            serverObj3d.add(memoryMeshA)

            let memTextMeshA = memTextMesh.clone()
            memTextMeshA.position.set(-WIDTH - 100, 18, i * 150 + 20)
            serverObj3d.add(memTextMeshA)

            let memoryMeshB = memoryMesh.clone()
            memoryMeshB.position.set(+WIDTH + 20, 0, i * 150)
            serverObj3d.add(memoryMeshB)

            let memTextB = memTextMesh.clone()
            memTextB.position.set(+WIDTH - 60, 18, i * 150 + 20)
            serverObj3d.add(memTextB)
        }

        // Add three connectors

        let connectorMaterial = new THREE.MeshPhongMaterial({ color: 0xD3D3D3 });
        var connectorExtrudeSettings = { depth: 40, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 5, bevelThickness: 5 };
        let connectorectShape = this.getRoundedRectShape(WIDTH / 4, 80, 5)
        var connectorGeometry = new THREE.ExtrudeBufferGeometry(connectorectShape, connectorExtrudeSettings);
        connectorGeometry.center()
        let connectorMesh = new THREE.Mesh(connectorGeometry, connectorMaterial)


        // connector front
        connectorMesh.position.set(-250, 20, 740)
        serverObj3d.add(connectorMesh)

        // connector front 2
        let connectorMesh2 = connectorMesh.clone()
        connectorMesh2.position.set(250, 20, 740)
        serverObj3d.add(connectorMesh2)

        // connector back
        let connectorMesh3 = connectorMesh.clone()
        connectorMesh3.position.set(0, 20, -740)
        serverObj3d.add(connectorMesh3)

        // The PCB

        let pcbMaterial = new THREE.MeshPhongMaterial({ color: 0x006600 });
        var pcbExtrudeSettings = { depth: WIDTH * 4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 5, bevelThickness: 5 };
        let pcbectShape = this.getRoundedRectShape(WIDTH * 3, 10, 5)
        var pcbGeometry = new THREE.ExtrudeBufferGeometry(pcbectShape, pcbExtrudeSettings);
        pcbGeometry.center()
        let pcbMesh = new THREE.Mesh(pcbGeometry, pcbMaterial)
        pcbMesh.position.set(0, -25, 0)
        serverObj3d.add(pcbMesh)

        //serverObj3d.rotateX( Math.PI )
        return serverObj3d
    }

}