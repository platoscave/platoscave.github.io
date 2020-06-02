"use strict";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@v0.108.0/build/three.module.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@v0.108.0/examples/jsm/controls/OrbitControls.js";

let container, stats;

let camera, scene, renderer, effect, gui, composer;
let particleLight;
let colorPass, pixelPass, params;
let tanModel, moveRight, moveLeft;

function init() {
    // HTML element containing the game window
    container = document.getElementById( 'game' );

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x555555 );

    // Camera
    camera = new THREE.PerspectiveCamera( 30, container.clientWidth / container.clientHeight, 1, 6000 );
    camera.position.set( 0.0, 0, 800 );

    // WebGL renderer
    renderer = new THREE.WebGLRenderer( { 
        alpha: false,
        antialias: false
    } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.clientWidth, container.clientHeight );
    renderer.autoClear = false;
    // renderer.setClearColor( 0xFFFFFF, 1.0 );
    // renderer.setClearAlpha( 0.0 );
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );


    // Orbital controls
    let controls = new OrbitControls( camera, renderer.domElement );

    // Handles resizing of windows
    window.addEventListener( 'resize', onWindowResize, false );

    // Lights
    // TODO: Add slider for lights
    scene.add( new THREE.AmbientLight( 0x222222 ) );

    let directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    directionalLight.position.set( 1, 1, 1 ).normalize();
    scene.add( directionalLight );

    cube = new THREE.Mesh(
        new THREE.BoxGeometry( 1, 1, 1 ),
        new THREE.MeshBasicMaterial()
       );
    scene.add( cube );
 
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth, container.clientHeight );
    composer.setSize( container.clientWidth, container.clientHeight );

    // Update resolution for pixelation effect
    pixelPass.uniforms[ "resolution" ].value.set( container.clientWidth, container.clientHeight ).multiplyScalar( window.devicePixelRatio );
}

function animate() {
    requestAnimationFrame( animate );

    stats.begin();
    if (moveLeft) {
        tanModel.translateX( -8 );
    }
    if (moveRight) {
        tanModel.translateX( 8 );
    }
    render();
    stats.end();
}

function render() {
    camera.lookAt( scene.position );

    if ( params.postprocessing ) {
        composer.render();
    } else {
        renderer.render( scene, camera );
    }
}

document.getElementById("left").ontouchstart = function() {
    moveLeft = true;
}
document.getElementById("left").ontouchend = function() {
    moveLeft = false;
}
document.getElementById("left").ontouchmove = function() {
}

document.getElementById("right").ontouchstart = function() {
    moveRight = true;
}
document.getElementById("right").ontouchend = function() {
    moveRight = false;
}
document.getElementById("right").ontouchmove = function() {
}

// TODO: Call these on load of models?
init();
animate();