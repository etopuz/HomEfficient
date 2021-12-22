import * as THREE from "./modules/three.module.js";
import {PointerLockControls} from "./modules/PointerLockControls.js";

export const

    player = {
        height: 10,
        speed: 40
    },

    randomProperty = function (obj) {
        let keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    };

export let
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer(),
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.3, 1000 );


document.body.appendChild(renderer.domElement);

export let
    controls = new PointerLockControls(camera, renderer.domElement);
