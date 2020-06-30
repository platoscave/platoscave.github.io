//"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js";
//import * as TWEEN  from "https://cdn.jsdelivr.net/npm/es6-tween";
//import TWEEN from "https://cdn.jsdelivr.net/npm/tween@0.9.0/tween.min.js";
//import { TWEEN } from "./tween.js/src/Tween.js";
//import fontJson from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/fonts/helvetiker_regular.typeface.json'
// import fontJson from './fonts/helvetiker_regular.typeface.json' // This is ony allowed if your're working with a built app


let camera, scene, renderer, controls, cube, axesHelper, skyBox, font
let selectableMeshArr = []

export default class Scene {

    getSkyBoxArray() {
        return ['islands/skybox_e.jpg', 'islands/skybox_w.jpg', 'islands/skybox_t.jpg', 'islands/skybox_b.jpg', 'islands/skybox_n.jpg', 'islands/skybox_s.jpg']
        //return ['dawnmountain/dawnmountain-xpos.png', 'dawnmountain/dawnmountain-xneg.png', 'dawnmountain/dawnmountain-ypos.png', 'dawnmountain/dawnmountain-yneg.png', 'dawnmountain/dawnmountain-zpos.png', 'dawnmountain/dawnmountain-zneg.png']
    }
    getScene() {
        return scene
    }
    pushSelectableMeshArr(tankMesh) {
        selectableMeshArr.push(tankMesh)
    }

    constructor() {

        renderer = new THREE.WebGLRenderer({ antialias: true });

        //this is to get the correct pixel detail on portable devices
        renderer.setPixelRatio(window.devicePixelRatio);

        //and this sets the canvas' size.
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(
            70,                                         //FOV
            window.innerWidth / window.innerHeight,     //aspect
            1,                                          //near clipping plane
            100000                                         //far clipping plane
        );
        camera.position.z = 4000

        // controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotateSpeed = 0.125
        controls.minPolarAngle = Math.PI / 4
        controls.maxPolarAngle = Math.PI / 1.5
        controls.screenSpacePanning = true;
        controls.enableDamping = true;

        // lights
        let light1 = new THREE.DirectionalLight(0xffffff)
        light1.position.set(-1, 1, 1).normalize()
        scene.add(light1)
        let light2 = new THREE.AmbientLight(0x404040)
        scene.add(light2)

        // raycaster
        //this.raycaster = new THREE.Raycaster()

        // skyBox
        let skyBoxArray = this.getSkyBoxArray()
        let loader = new THREE.TextureLoader();
        // See https://stemkoski.github.io/Three.js/Skybox.html
        if (skyBoxArray.length === 6) {
            let skyGeometry = new THREE.CubeGeometry(50000, 50000, 50000)
            let materialArray = []
            for (let i = 0; i < 6; i++) {
                materialArray.push(new THREE.MeshBasicMaterial({
                    map: loader.load('../resources/' + skyBoxArray[i]),
                    side: THREE.BackSide
                }))
            }
            skyBox = new THREE.Mesh(skyGeometry, materialArray)
            scene.add(skyBox)
        }


        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        window.addEventListener('click', this.onClick, false)

        // axesHelper
        axesHelper = new THREE.AxesHelper(100)
        scene.add(axesHelper)

        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        controls.update();
        TWEEN.update()
        skyBox.position.set(camera.position.x, camera.position.y, camera.position.z) // keep skybox centred around the camera
        axesHelper.position.set(controls.target.x, controls.target.y, controls.target.z)
        renderer.render(scene, camera);

    }

    getSceneIndexByKey(key) {
        for (let i = 0; i < this.scenes.length; i++) {
            if (this.scenes[i].key === key) {
                return i
            }
        }
        return -1
    }

    onClick(event) {
        // see https://threejs.org/docs/#api/core/Raycaster.setFromCamera
        event.preventDefault()

        // get 2D coordinates of the mouse, in normalized device coordinates (NDC)
        let box = event.target.getBoundingClientRect()
        let x = (event.offsetX / box.width) * 2 - 1
        let y = -(event.offsetY / box.height) * 2 + 1
        let mouse = new THREE.Vector2(x, y)

        // update the picking ray with the camera and mouse position
        let raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera)
        let intersects = raycaster.intersectObjects(this.selectableMeshArr)
        if (intersects.length > 0) {
            let selectedMesh = intersects[0].object
            // let normal = intersects[0].face.normal
            // console.log(normal)
            // let normalMatrix = new THREE.Matrix3().getNormalMatrix(selectedMesh.matrixWorld)
            // console.log(normal.clone().applyMatrix3(normalMatrix).normalize())
            this.$store.commit('SET_PAGE_STATE2', {
                level: this.level,
                selectedObjId: selectedMesh.parent.key
            })
        }
    }

    highlight(newVal, oldVal) {
        if (!this.heighlight) return
        let currentlySelected = this.glModelObject3D.getObjectByProperty('key', oldVal)
        if (currentlySelected) {
            currentlySelected.children[0].material = currentlySelected.getMaterial()
            currentlySelected.children[1].material = new THREE.MeshLambertMaterial({ color: 0xEFEFEF })
        }
        let newlySelected = this.glModelObject3D.getObjectByProperty('key', newVal)
        if (newlySelected) {
            newlySelected.children[0].material = new THREE.MeshLambertMaterial({ color: 0xEEEE00 })
            newlySelected.children[1].material = new THREE.MeshLambertMaterial({ color: 0x666666 })
        }
    }

    moveCameraToPos(key) {
        let selectedModelObj = this.glModelObject3D.getObjectByProperty('key', key)
        if (!selectedModelObj) return
        if (!sceen) return
        // console.log('selectedModelObj', selectedModelObj)
        sceen.updateMatrixWorld()
        let newTargetPos = new THREE.Vector3()
        newTargetPos.setFromMatrixPosition(selectedModelObj.matrixWorld)

        new TWEEN.Tween(controls.target).easing(TWEEN.Easing.Quadratic.Out).to(newTargetPos, 1500).start()

        let cameraPos = controls.object.position.clone()
        let newCameraPos = newTargetPos.clone()

        newCameraPos.setY(newCameraPos.y + 300)
        if (selectedModelObj.rotation.y > 0) newCameraPos.setX(newCameraPos.x + 2000)
        else newCameraPos.setZ(newCameraPos.z + 2000)

        let cameraTween = new TWEEN.Tween(cameraPos).to(newCameraPos, 1500)
        cameraTween.easing(TWEEN.Easing.Quadratic.Out)
        cameraTween.onUpdate(() => {
            // console.log('cameraPos', cameraPos)
            controls.object.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
        })
        cameraTween.start()
    }

    addLoadingText(text) {
        let textMaterial = new THREE.MeshLambertMaterial({ color: 0xEFEFEF })
        let text3d = new THREE.TextGeometry(text || 'Loading...', { size: 200, font: font })
        text3d.center()
        let textMesh = new THREE.Mesh(text3d, textMaterial)
        textMesh.name = 'Loading Message'
        textMesh.position.set(0, 400, 0)
        sceen.add(textMesh)
    }

    removeLoadingText() {
        let mesh = sceen.getObjectByName('Loading Message')

        sceen.remove(mesh)
    }

    async getLabelObj3d(text, fontName, maxWidth, size, textMat, backgroundMat, borderMat, callout) {

        let labelObj3d = new THREE.Object3D();

        let linesGeom = await this.makeTextLinesGeom(text, fontName, maxWidth, size)
        labelObj3d.add(new THREE.Mesh(linesGeom, textMat))

        linesGeom.computeBoundingBox();
        let width = linesGeom.boundingBox.max.x + size / 2
        let height = linesGeom.boundingBox.max.y + size / 2
        let roundedRectShape = this.getRoundedRectShape(width * 2, height * 2, size / 2, callout)

        let boundingBox = null
        if (backgroundMat) {

            let geometry = new THREE.ShapeGeometry(roundedRectShape);
            geometry.translate(0, 0, -1)
            labelObj3d.add(new THREE.Mesh(geometry, backgroundMat))
            linesGeom.computeBoundingBox();
            boundingBox = geometry.boundingBox
        }
        if (borderMat) {

            var points = roundedRectShape.getPoints();
            var geometryPoints = new THREE.BufferGeometry().setFromPoints(points);
            geometryPoints.translate(0, 0, -1)
            labelObj3d.add(new THREE.Line(geometryPoints, borderMat))
            geometryPoints.computeBoundingBox();
            boundingBox = geometryPoints.boundingBox
        }

        // console.log(boundingBox)
        // If there is a callout, center out obj3d arrounf the arrow point
        if (boundingBox) {
            if (callout === 'topLeft') labelObj3d.position.set(-boundingBox.min.x, -boundingBox.max.y, 0)
            if (callout === 'topRight') labelObj3d.position.set(-boundingBox.max.x, -boundingBox.max.y, 0)
            if (callout === 'bottomRight') labelObj3d.position.set(-boundingBox.max.x, -boundingBox.min.y, 0)
            if (callout === 'bottomLeft') labelObj3d.position.set(-boundingBox.min.x, -boundingBox.min.y, 0)
        }

        return labelObj3d
    }

    getRoundedRectShape(width, height, radius, callout) {
        const x = -width / 2
        const y = -height / 2
        const calloutWidth = width / 3 // the length of the callout point
        const calloutHeight = height / 2
        const calloutBaseLine = width / 3

        let ctx = new THREE.Shape()

        ctx.moveTo(x, y + radius) // bottom left
        ctx.lineTo(x, y + height - radius) // to top left
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
        if (callout === 'topLeft') {
            ctx.lineTo(x - calloutWidth, y + height + calloutHeight) // callout
            ctx.lineTo(x + calloutBaseLine, y + height) // return
        }
        if (callout === 'topRight') {
            ctx.lineTo(x + width - calloutBaseLine, y + height) // callout
            ctx.lineTo(x + width + calloutWidth, y + height + calloutHeight) // callout
        }
        ctx.lineTo(x + width - radius, y + height) // to top right
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        ctx.lineTo(x + width, y + radius) // to bottom right
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
        if (callout === 'bottomRight') {
            ctx.lineTo(x + width + calloutWidth, y - calloutHeight) // callout
            ctx.lineTo(x + width - calloutBaseLine, y) // return
        }
        if (callout === 'bottomLeft') {
            ctx.lineTo(x + calloutBaseLine, y) // callout
            ctx.lineTo(x - calloutWidth, y - calloutHeight) // callout
        }
        ctx.lineTo(x + radius, y) // to bottom left
        ctx.quadraticCurveTo(x, y, x, y + radius)

        return ctx
    }

    /* makeCanvasLabel(text, maxWidth, size, color, backgroundColor) {
        let canvas = document.createElement("canvas");
        let textCtx = canvas.getContext("2d");
        let lineHeight = size + 10
        textCtx.font = size + "pt Arial";

        //http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
        let words = text.split(' ');
        let line = '';
        let linesArr = []
        let canvasHeight = lineHeight + 8 + 20 // add margins
        let canvasWidth, curWidth
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = textCtx.measureText(testLine);
            let testWidth = metrics.width;
            curWidth = testWidth
            if (testWidth > maxWidth && n > 0) {
                linesArr.push(line.trim())
                line = words[n] + ' ';
                canvasHeight += lineHeight;
            }
            else {
                let width = textCtx.measureText(line.trim());
                canvasWidth = width > curWidth ? width : curWidth
                line = testLine;
            }
        }
        linesArr.push(line.trim())
        canvasWidth += 20 // add margins

        textCtx.canvas.width = canvasWidth;
        textCtx.canvas.height = canvasHeight;

        // Create a rounded rect background if required
        if (backgroundColor) {
            let radius = 20
            textCtx.fillStyle = backgroundColor;
            textCtx.beginPath();
            textCtx.moveTo(canvasWidth - radius, 0); // Create a starting point
            textCtx.arcTo(canvasWidth, 0, canvasWidth, radius, radius);
            textCtx.lineTo(canvasWidth, canvasHeight - radius);
            textCtx.arcTo(canvasWidth, canvasHeight, canvasWidth - radius, canvasHeight, radius);
            textCtx.lineTo(canvasWidth - radius, canvasHeight);
            textCtx.arcTo(0, canvasHeight, 0, canvasHeight - radius, radius);
            textCtx.lineTo(0, canvasHeight - radius);
            textCtx.arcTo(0, 0, radius, 0, radius);
            textCtx.closePath(); // Close it
            textCtx.fillStyle = backgroundColor;
            textCtx.fill() // Fill it
            textCtx.strokeStyle = 'grey';
            textCtx.lineWidth = 3;
            textCtx.stroke();// Draw it
        }

        textCtx.font = size + "pt Arial";
        textCtx.textAlign = "center"; // TODO left aligned
        textCtx.fillStyle = color;
        let y = lineHeight
        for (let n = 0; n < linesArr.length; n++) {
            textCtx.fillText(linesArr[n], textCtx.canvas.width / 2, y + 10);
            y += lineHeight;
        }

        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        let material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        return new THREE.Mesh(new THREE.PlaneGeometry(canvasWidth, canvasHeight, 10, 10), material);

    } */


    async makeTextLinesGeom(text, fontName, maxWidth, size) {

        const font = await this.importFont(fontName)
        const words = text.split(' ');
        let wordsNotProcessedYet = '';
        let linesArr = []
        let textWidth, lineHeight
        let wordsNotProcessedYetWidth = 0
        let textHeight = 0

        for (let n = 0; n < words.length; n++) {
            let testLine = wordsNotProcessedYet + words[n] + ' ';
            let shapes = font.generateShapes(testLine, size);
            let geometry = new THREE.ShapeGeometry(shapes);
            geometry.computeBoundingBox();
            let testWidth = geometry.boundingBox.max.x;
            lineHeight = geometry.boundingBox.max.y;
            if (testWidth > maxWidth) {  // test line is too long, use wordsNotProcessedYet as new line
                linesArr.push(wordsNotProcessedYet.trim()) // add line to lines arr
                wordsNotProcessedYet = words[n] + ' '; // reset wordsNotProcessedYet
                textHeight += lineHeight; // bump text height until now
                if (wordsNotProcessedYetWidth > textWidth) textWidth = wordsNotProcessedYetWidth;
            }
            else { // we can add this word to wordsNotProcessedYet, no sweat
                wordsNotProcessedYet = testLine;
                wordsNotProcessedYetWidth = geometry.boundingBox.max.x
            }
        }
        linesArr.push(wordsNotProcessedYet.trim()) // add line to lines arr


        var linesGeom = new THREE.Geometry();

        lineHeight += lineHeight * 0.3
        let y = 0
        for (let n = 0; n < linesArr.length; n++) {
            var shapes = font.generateShapes(linesArr[n], size);
            var geometry = new THREE.ShapeGeometry(shapes);
            geometry.translate(0, y, 0) // position it on the next line
            // We create a mesh without a texture, since it'll be ignored anyway, then merge it into labelGeo
            linesGeom.mergeMesh(new THREE.Mesh(geometry))
            y -= lineHeight;
        }

        return linesGeom.center()

    }

    importFont(fontName) {
        return new Promise((resolve, reject) => {
            var fontLoader = new THREE.FontLoader();
            fontLoader.load(`https://cdn.jsdelivr.net/npm/three@0.117.1/examples/fonts/helvetiker_${fontName}.typeface.json`,
                //fontLoader.load(`https://cdn.jsdelivr.net/npm/three@0.117.1/examples/fonts/droid/droid_sans_${fontName}.typeface.json`,
                font => {
                    resolve(font)
                },
                xhr => {
                    //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' )
                },
                err => {
                    reject(err)
                })
        })
    }

    importHtml(url) {
        return new Promise((resolve, reject) => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                    let txt = xmlhttp.responseText;
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(txt, 'text/html');

                    console.log(txt)
                    resolve(htmlDoc)
                }
                //else reject('error')
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        })
    }

    makeChestahedronGeom() {

        let baseline = 200
        let R = Math.tan(Math.PI / 6) * baseline * 0.75
        let S = Math.sin(Math.PI / 3) * baseline
        let T = Math.tan(Math.PI / 6) * baseline / 2


        let p1 = new THREE.Vector3(0, 0, 0)
        let p2 = new THREE.Vector3(baseline, 0, 0)
        let p3 = new THREE.Vector3(baseline / 2, 0, -S)
        let p4 = new THREE.Vector3(baseline / 2, S, 0)
        let p5 = new THREE.Vector3(baseline * 0.75, S, -R)
        let p6 = new THREE.Vector3(baseline * 0.25, S, -R)
        let p7 = new THREE.Vector3(baseline / 2, S + T, -T)

        let geometry = new THREE.Geometry();

        // bottom triangle
        geometry.mergeMesh(this.makeBeamGeom(p1, p2, 5))
        geometry.mergeMesh(this.makeBeamGeom(p1, p3, 5))
        geometry.mergeMesh(this.makeBeamGeom(p2, p3, 5))

        // upwrite triangles
        geometry.mergeMesh(this.makeBeamGeom(p1, p4, 5))
        geometry.mergeMesh(this.makeBeamGeom(p2, p4, 5))

        geometry.mergeMesh(this.makeBeamGeom(p2, p5, 5))
        geometry.mergeMesh(this.makeBeamGeom(p3, p5, 5))

        geometry.mergeMesh(this.makeBeamGeom(p1, p6, 5))
        geometry.mergeMesh(this.makeBeamGeom(p3, p6, 5))

        // beams to top
        geometry.mergeMesh(this.makeBeamGeom(p4, p7, 5))
        geometry.mergeMesh(this.makeBeamGeom(p5, p7, 5))
        geometry.mergeMesh(this.makeBeamGeom(p6, p7, 5))

        // add beam caps
        let sphereMeshP1 = new THREE.Mesh(new THREE.SphereGeometry(5))
        sphereMeshP1.position.set(p1.x, p1.y, p1.z)
        geometry.mergeMesh(sphereMeshP1)

        let sphereMeshP2 = new THREE.Mesh(new THREE.SphereGeometry(5))
        sphereMeshP2.position.set(p2.x, p2.y, p2.z)
        geometry.mergeMesh(sphereMeshP2)

        let sphereMeshP3 = new THREE.Mesh(new THREE.SphereGeometry(5))
        sphereMeshP3.position.set(p3.x, p3.y, p3.z)
        geometry.mergeMesh(sphereMeshP3)

        let sphereMeshP4 = new THREE.Mesh(new THREE.SphereGeometry(5))
        sphereMeshP4.position.set(p4.x, p4.y, p4.z)
        geometry.mergeMesh(sphereMeshP4)

        let sphereMeshP5 = new THREE.Mesh(new THREE.SphereGeometry(5))
        sphereMeshP5.position.set(p5.x, p5.y, p5.z)
        geometry.mergeMesh(sphereMeshP5)

        let sphereMeshP6 = new THREE.Mesh(new THREE.SphereGeometry(5))
        sphereMeshP6.position.set(p6.x, p6.y, p6.z)
        geometry.mergeMesh(sphereMeshP6)

        let sphereMeshP7 = new THREE.Mesh(new THREE.SphereGeometry(5))
        sphereMeshP7.position.set(p7.x, p7.y, p7.z)
        geometry.mergeMesh(sphereMeshP7)

        geometry.translate(-baseline / 2, 0, T)
        return geometry

    }

    makeBeamGeom(p1, p2, diameter) {
        // https://stackoverflow.com/questions/15139649/three-js-two-points-one-cylinder-align-issue/15160850#15160850
        let HALF_PI = Math.PI * 0.5
        let distance = p1.distanceTo(p2)
        let position = p2.clone().add(p1).divideScalar(2)
        let cylinder = new THREE.CylinderGeometry(diameter, diameter, distance, 10, 10, true)
        let orientation = new THREE.Matrix4()// a new orientation matrix to offset pivot
        let offsetRotation = new THREE.Matrix4()// a matrix to fix pivot rotation
        orientation.lookAt(p1, p2, new THREE.Vector3(0, 1, 0))// look at destination
        offsetRotation.makeRotationX(HALF_PI)// rotate 90 degs on X
        orientation.multiply(offsetRotation)// combine orientation with rotation transformations
        cylinder.applyMatrix4(orientation)
        let mesh = new THREE.Mesh(cylinder)
        mesh.position.set(position.x, position.y, position.z)
        return mesh
    }

    getRandomKey() {
        // base32 encoded 64-bit integers. This means they are limited to the characters a-z, 1-5, and '.' for the first 12 characters.
        // If there is a 13th character then it is restricted to the first 16 characters ('.' and a-p).
        var characters = 'abcdefghijklmnopqrstuvwxyz12345'
        var randomKey = ''
        for (var i = 0; i < 12; i++) {
            randomKey += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return randomKey
    }

    async getHTMLGeometry(url) {

        let blocksArray = []

        const processChildNodes = (parentNode, parentStyle) => {

            parentNode.childNodes.forEach(node => {

                if (node.nodeType === 1) { // Is it an Element node?

                    let elementStyle = {}, attrStyle = {}

                    if (node.attributes) {
                        let style = node.attributes.getNamedItem('style')
                        if (style) {
                            let styleAttrsArr = style.value.split(';')
                            styleAttrsArr.forEach(attrSet => {
                                let attrSetArr = attrSet.split(':')
                                let name = attrSetArr[0].trim()
                                let value = attrSetArr[1] ? attrSetArr[1].trim() : ''
                                value = value.replace('#', '0x');
                                if (name && value) attrStyle[name] = value
                            })
                            console.log(attrStyle)
                        }
                    }

                    switch (node.nodeName) {
                        case 'A':
                            elementStyle = {
                                'color': 'blue',
                                'text-decoration': 'underline',
                                'cursor': 'auto'
                            }
                            break;

                        case 'B':
                            elementStyle = {
                                'font-weight': 'bold'
                            }
                            break;

                        case 'BR':
                            break;

                        case 'CODE':
                            elementStyle = {
                                'font-family': 'monospace'
                            }
                            break;

                        case 'COL':
                            elementStyle = {
                                'display': 'table-column'
                            }
                            break;

                        case 'COLGROUP':
                            elementStyle = {
                                'display': 'table-column-group'
                            }
                            break;

                        case 'DEL':
                            elementStyle = {
                                'text-decoration': 'line-through'
                            }
                            break;

                        case 'DIV':
                            elementStyle = {
                                'display': 'block'
                            }
                            break;

                        case 'EM':
                            elementStyle = {
                                'font-style': 'bold'
                            }
                            break;

                        case 'STRONG':
                            elementStyle = {
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H1':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 2 * em,
                                'margin-top': 0.67 * em,
                                'margin-bottom': 0.67 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H2':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 1.5 * em,
                                'margin-top': 0.83 * em,
                                'margin-bottom': 0.83 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H3':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 1.17 * em,
                                'margin-top': 1 * em,
                                'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H4':
                            elementStyle = {
                                'display': 'block',
                                'font-size': 1 * em,
                                'margin-top': 1.33 * em,
                                'margin-bottom': 1.33 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H5':
                            elementStyle = {
                                'display': 'block',
                                'font-size': .83 * em,
                                'margin-top': 1.67 * em,
                                'margin-bottom': 1.67 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'H6':
                            elementStyle = {
                                'display': 'block',
                                'font-size': .67 * em,
                                'margin-top': 2.33 * em,
                                'margin-bottom': 2.33 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'font-weight': 'bold'
                            }
                            break;

                        case 'HR':
                            elementStyle = {
                                'display': 'block',
                                'margin-top': 0.5 * em,
                                'margin-bottom': 0.5 * em,
                                'margin-left': 'auto',
                                'margin-right': 'auto',
                                'border-style': 'inset',
                                'border-width': 1
                            }
                            break;

                        case 'I':
                            elementStyle = {
                                'font-style': 'italic'
                            }
                            break;

                        case 'IMG':
                            elementStyle = {
                                'display': 'inline-block'
                            }
                            break;

                        case 'INPUT':
                            break;

                        case 'LABEL':
                            elementStyle = {
                                'cursor': 'default'
                            }
                            break;

                        case 'LI':
                            elementStyle = {
                                'display': 'list-item'
                            }
                            break;

                        case 'OL':
                            elementStyle = {
                                'display': 'block',
                                'list-style-type': 'decimal',
                                'margin-top': 1 * em,
                                'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'padding-left': 40,
                            }
                            break;

                        case 'P':
                            elementStyle = {
                                'display': 'block',
                                'margin-top': 1 * em,
                                'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                            }
                            break;

                        case 'PRE':
                            elementStyle = {
                                'display': 'block',
                                'font=family': 'monospace',
                                'white-space': 'pre',
                                'margin': 1 * em,
                            }
                            break;

                        case 'SPAN':
                            break;

                        case 'STRONG':
                            elementStyle = {
                                'font-weight': 'bold'
                            }
                            break;

                        case 'TABLE':
                            elementStyle = {
                                'display': 'table',
                                'border-collapse': 'separate',
                                'border-spacing': 2,
                                'border-color': 'gray'
                            }
                            break;

                        case 'TBODY':
                            elementStyle = {
                                'display': 'table-row-group',
                                'vertical-align': 'middle',
                                'border-color': 'inherit'
                            }
                            break;

                        case 'TD':
                            elementStyle = {
                                'display': 'table-cell',
                                'vertical-align': 'inherit'
                            }
                            break;

                        case 'TH':
                            elementStyle = {
                                'display': 'table-cell',
                                'vertical-align': 'inherit',
                                'font-weight': 'bold',
                                textAlign: 'center',
                            }
                            break;

                        case 'TR':
                            elementStyle = {
                                'display': 'table-row',
                                'vertical-align': 'inherit',
                                'border-color': 'inherit'
                            }
                            break;

                        case 'U':
                            elementStyle = {
                                'text-decoration': 'underline'
                            }
                            break;

                        case 'UL':
                            elementStyle = {
                                'display': 'block',
                                'list-style-type': 'disc',
                                'margin-top': 1 * em,
                                'margin-bottom': 1 * em,
                                'margin-left': 0,
                                'margin-right': 0,
                                'padding-left': 40
                            }
                            break;

                        default:
                            console.log('Element ' + node.nodeName + ' not implemeted yet')
                            break;
                    }

                    let mergedStyle = Object.assign({}, parentStyle, elementStyle, attrStyle);

                    let newLineEls = ['block', 'list-item', 'table-row']
                    if (newLineEls.includes(elementStyle.display)) {
                        let blockDesc = {
                            tag: node.nodeName,
                            style: mergedStyle,
                            linesArr: [{
                                lineHeight: 0,
                                segmentsArr: []
                            }],
                        }
                        blocksArray.push(blockDesc)
                    }

                    processChildNodes(node, mergedStyle)

                }

                if (node.nodeType === 3) { // Is it a Text node?
                    var text = node.data.trim();
                    if (text.length > 0) { // Does it have non white-space text content?
                        // process text
                        addLineSegments(text, parentStyle)
                    }
                }
            })
        }


        const addLineSegments = (text, style) => {

            // Get the last block. This block was created by an Element with display: 'block'
            let blockNum = blocksArray.length - 1
            let currentBlock = blocksArray[blockNum]

            let lineNum = currentBlock.linesArr.length - 1
            let currentLine = currentBlock.linesArr[lineNum]
            /* const segmentWidthUntilNow = currentLine.segmentsArr //???? */
            const segmentWidthUntilNow = 0

            const words = text.split(/\s+/g);

            // Determine the width
            let width = style['width'] ? style['width'] : 500
            let paddingLeft = style['padding-left'] ? style['padding-left'] : 0
            let paddingRight = style['padding-right'] ? style['padding-right'] : 0
            width -= paddingLeft + paddingRight

            let fontSize = style['font-size'] ? style['font-size'] : 10

            let font = regularFont
            if (style['font-weight'] === 'bold') font = boldFont
            if (style['font-family'] === 'monospace') font = monoFont

            let wordsNotProcessedYet = '';
            let widthNotProcessedYet = 0
            let heightNotProcessedYet = 0

            for (let n = 0; n < words.length; n++) {

                let testLine = wordsNotProcessedYet + words[n] + ' ';
                let testShapes = font.generateShapes(testLine, fontSize);
                let testGeometry = new THREE.ShapeGeometry(testShapes);
                testGeometry.computeBoundingBox();
                let testWidth = testGeometry.boundingBox.max.x;
                let testHeight = testGeometry.boundingBox.max.y - testGeometry.boundingBox.min.y;

                if (segmentWidthUntilNow + testWidth > width) {  // test line is too long 

                    // Add wordsNotProcessedYet to currentLine segmentsArr. This will be the last segment on currentLine
                    let segmentDesc = {
                        text: wordsNotProcessedYet.trim(),
                        style: style,
                        segmentWidth: widthNotProcessedYet
                    }
                    currentLine.segmentsArr.push(segmentDesc)
                    if (currentLine.lineHeight < heightNotProcessedYet) currentLine.lineHeight = heightNotProcessedYet

                    // Add a new empty line to the current block, which will be our new current line
                    wordsNotProcessedYet = words[n] + ' '; // reset wordsNotProcessedYet
                    let lineDesc = {
                        lineHeight: 0,
                        segmentsArr: []
                    }
                    currentBlock.linesArr.push(lineDesc)
                    currentLine = lineDesc
                }
                else { // we can add this word to wordsNotProcessedYet, no sweat
                    wordsNotProcessedYet = testLine;
                    widthNotProcessedYet = testWidth;
                    heightNotProcessedYet = testHeight;
                }
            }
            let segmentDesc = {
                text: wordsNotProcessedYet.trim(),
                style: style,
                segmentWidth: widthNotProcessedYet
            }
            currentLine.segmentsArr.push(segmentDesc)
            if (currentLine.lineHeight < heightNotProcessedYet) currentLine.lineHeight = heightNotProcessedYet
        }

        const printLines = (htmlGeom) => {
            let lineY = 0
            let orderedListNum = 0

            blocksArray.forEach((block) => {

                let blokStyle = block.style
                let marginTop = blokStyle['margin-top'] ? blokStyle['margin-top'] : 0
                let marginBottom = blokStyle['margin-bottom'] ? blokStyle['margin-bottom'] : 0
                let paddingLeft = blokStyle['padding-left'] ? blokStyle['padding-left'] : 0
                let listStyleType = blokStyle['list-style-type'] ? blokStyle['list-style-type'] : ''
                if (block.tag === 'OL') orderedListNum = 0

                lineY -= marginTop

                block.linesArr.forEach(line => {

                    let segmentX = paddingLeft

                    line.segmentsArr.forEach(lineSegment => {

                        let text = lineSegment.text
                        let style = lineSegment.style

                        let color = style.color ? style.color : 0x404040
                        let textMaterial = new THREE.MeshBasicMaterial({
                            color: color,
                            side: THREE.DoubleSide
                        })


                        let fontSize = style['font-size'] ? style['font-size'] : 10

                        let font = regularFont
                        if (style['font-weight'] === 'bold') font = boldFont
                        //if (style['font-family'] === 'monospace') font = monoFont // TODO find the monoFont

                        let skew = 0
                        if (style['font-style'] === 'italic') skew = 20

                        let shapes = font.generateShapes(text, fontSize);
                        let geometry = new THREE.ShapeGeometry(shapes);
                        geometry.name = text
                        geometry.translate(segmentX, lineY, 0)
                        let mesh = new THREE.Mesh(geometry, textMaterial)
                        mesh.updateMatrix();
                        htmlGeom.merge(mesh.geometry)

                        if (listStyleType) {
                            let geometry
                            if (listStyleType === 'disc') {
                                geometry = new THREE.CircleGeometry(3, 32);
                                geometry.translate(segmentX - 20, lineY + 3, 0)
                            }
                            else {
                                let shape = font.generateShapes(orderedListNum + '.', fontSize);
                                geometry = new THREE.ShapeGeometry(shape);
                                geometry.translate(segmentX - 25, lineY, 0)
                            }
                            let mesh = new THREE.Mesh(geometry, textMaterial)
                            mesh.updateMatrix();
                            htmlGeom.merge(mesh.geometry)
                        }

                        // TODO add a line for strike through or underline

                        segmentX += lineSegment.segmentWidth + 5 // add space
                    })
                    lineY -= line.lineHeight * 1.1 // multiply by default line-height

                })
                lineY -= marginBottom
                orderedListNum++
            })
        }


        //https://stackoverflow.com/questions/31994303/threejs-merge-with-multiple-materials-applies-only-one-material

        let htmlGeom = new THREE.Geometry();
        htmlGeom.name = 'htmlGeom'



        let htmlDoc = await this.importHtml("./test.html")
        const boldFont = await this.importFont('bold')
        //const monoFont = await this.importFont('mono')
        const monoFont = null
        const regularFont = await this.importFont('regular')

        const em = 10
        const defaultStyle = {
            'font-size': 10,
            'width': 300
        }

        processChildNodes(htmlDoc.body, defaultStyle)
        console.log('blocksArray ', blocksArray)

        printLines(htmlGeom)
        console.log('htmlGeom ', htmlGeom)


        htmlGeom.center()
        return htmlGeom
    }

}