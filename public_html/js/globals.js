import * as THREE from "./modules/three.module.js";
import {PointerLockControls} from "./modules/PointerLockControls.js";

export const

    checkersTexture = new THREE.TextureLoader().load( 'assets/textures/checkers.png' ),
    woodFloorTexture = new THREE.TextureLoader().load( 'assets/textures/wood1.jpg' ),
    cyanTileTexture = new THREE.TextureLoader().load( 'assets/textures/cyanTile.jpg' ),
    wallTexture = new THREE.TextureLoader().load( 'assets/textures/wall.png' ),

    player = {
        height: 1.5,
        speed: 15
    },

    materials = {
        black : new THREE.MeshBasicMaterial( { color: 0x000000}),
        red : new THREE.MeshBasicMaterial( { color: 0xff0000}),
        green:  new THREE.MeshBasicMaterial( { color: 0x00ff00}),
        blue:  new THREE.MeshBasicMaterial( { color: 0x0000ff}),
        yellow:  new THREE.MeshBasicMaterial( { color: 0xffff00}),
        purple:  new THREE.MeshBasicMaterial( { color: 0xff00ff}),
        cyan:  new THREE.MeshBasicMaterial( { color: 0x00ffff}),
        white:  new THREE.MeshBasicMaterial( { color: 0xffffff}),
        grey:  new THREE.MeshBasicMaterial( { color: 0x808080}),

        bedRoom: new THREE.MeshPhongMaterial( { map: woodFloorTexture, shininess: 10}),
        bathRoom: new THREE.MeshPhongMaterial( { map: cyanTileTexture, shininess: 20}),
        kitchen: new THREE.MeshPhongMaterial( { map: checkersTexture, shininess: 15}),
        livingRoom: new THREE.MeshPhongMaterial( { map: woodFloorTexture, shininess: 10}),
        corridor: new THREE.MeshPhongMaterial( { map: checkersTexture, shininess: 15 }),
        wall: new THREE.MeshPhongMaterial({map: wallTexture, shininess: 2}),

        highlight : new THREE.MeshPhongMaterial( { color: 0x992222})

    };

export let
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({precision: "mediump", antialias: true }),
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 300),
    character = new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25, player.height, 32)),
    spotLight = new THREE.SpotLight(0xFFFFFF, 1.0, 40, 1.0, 1.0, 1.5),
    ceil = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), materials.wall);


document.body.appendChild(renderer.domElement);

scene.add(character);
character.position.set(7,2,7);
character.visible = false;


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
