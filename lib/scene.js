"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@v0.108.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@v0.108.0/examples/jsm/controls/OrbitControls.js";
import { Easing, Tween } from "https://cdn.jsdelivr.net/npm/tween@0.9.0/tween.min.js";

let camera, scene, renderer, controls, cube, axesHelper, skyBox

export default class Scene {

    getSkyBoxArray() {
        return ['islands/skybox_e.jpg', 'islands/skybox_w.jpg', 'islands/skybox_t.jpg', 'islands/skybox_b.jpg', 'islands/skybox_n.jpg', 'islands/skybox_s.jpg']
         //return ['dawnmountain/dawnmountain-xpos.png', 'dawnmountain/dawnmountain-xneg.png', 'dawnmountain/dawnmountain-ypos.png', 'dawnmountain/dawnmountain-yneg.png', 'dawnmountain/dawnmountain-zpos.png', 'dawnmountain/dawnmountain-zneg.png']
    }

    constructor() {

        renderer = new THREE.WebGLRenderer();

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
        this.raycaster = new THREE.Raycaster()

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

        cube = new THREE.Mesh(
            new THREE.BoxGeometry(200, 100, 100),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        scene.add(cube);

        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        controls.update();
        TWEEN.update()
        skyBox.position.set(camera.position.x, camera.position.y, camera.position.z) // keep skybox centred around the camera
        axesHelper.position.set(controls.target.x, controls.target.y, controls.target.z)
        renderer.render(scene, camera);

        cube.rotation.x += 0.01;
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
        this.raycaster.setFromCamera(mouse, camera)
        let intersects = this.raycaster.intersectObjects(this.selectableMeshArr)
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

    getRoundedRectShape(width, height, radius) {
        const roundedRect = (ctx, width, height, radius) => {
            const x = 0
            const y = 0
            ctx.moveTo(x, y + radius)
            ctx.lineTo(x, y + height - radius)
            ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
            ctx.lineTo(x + width - radius, y + height)
            ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
            ctx.lineTo(x + width, y + radius)
            ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
            ctx.lineTo(x + radius, y)
            ctx.quadraticCurveTo(x, y, x, y + radius)
        }
        // Rounded rectangle
        let roundedRectShape = new THREE.Shape()
        roundedRect(roundedRectShape, width, height, radius) // negative numbers not allowed
        return roundedRectShape
    }

    makeCanvasLabel(text, maxWidth, size, color, backgroundColor) {
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

    }
}