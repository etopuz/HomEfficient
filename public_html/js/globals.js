import * as THREE from "./modules/three.module.js";
import {PointerLockControls} from "./modules/PointerLockControls.js";

export const

    player = {
        height: 1.5,
        speed: 15
    },

    materials = {
        black : new THREE.MeshPhongMaterial( { color: 0x000000, shadowSide:THREE.BackSide}),
        red : new THREE.MeshPhongMaterial( { color: 0xff0000, shadowSide:THREE.BackSide}),
        green:  new THREE.MeshPhongMaterial( { color: 0x00ff00, shadowSide:THREE.BackSide}),
        blue:  new THREE.MeshPhongMaterial( { color: 0x0000ff, shadowSide:THREE.BackSide}),
        yellow:  new THREE.MeshPhongMaterial( { color: 0xffff00, shadowSide:THREE.BackSide}),
        purple:  new THREE.MeshPhongMaterial( { color: 0xff00ff, shadowSide:THREE.BackSide}),
        cyan:  new THREE.MeshPhongMaterial( { color: 0x00ffff, shadowSide:THREE.BackSide}),
        white:  new THREE.MeshPhongMaterial( { color: 0xffffff, shadowSide:THREE.BackSide}),
        grey:  new THREE.MeshPhongMaterial( { color: 0x767676, shadowSide:THREE.BackSide})
    };


export let
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({precision: "mediump", antialias: true }),
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 300),
    character = new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25, player.height, 32), materials.white),
    mainLight = new THREE.AmbientLight(0xFFFFFF, 1.0),
    /*spotLight = new THREE.SpotLight(0xFFFFFF, 2.0, 100, 0.23);*/
    spotLight = new THREE.SpotLight(0xFFFFFF, 0.25, 50, 0.75, 1.0, 2);

document.body.appendChild(renderer.domElement);

scene.add(character);
character.position.set(7,2,7);
character.visible = false;

scene.add(mainLight);
mainLight.position.set(0,30,0);

scene.add(spotLight);




export let
    controls = new PointerLockControls(camera, renderer.domElement);

// HELPER FUNCTIONS

export const
    clamp = (num, min, max) => Math.min(Math.max(num, min), max),

    randomProperty = function (obj) {
        let keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    };
