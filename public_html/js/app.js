import * as THREE from './modules/three.module.js';
import {player, scene, renderer, camera, controls} from './globals.js'
import {cameraController} from "./src/controls/characterMovementController.js";
import {Bsp} from "./src/map/Bsp.js";

let bsp;

window.onload = function(){

    scene.add( controls.getObject() );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight );
    bsp = new Bsp(1);
    camera.position.set(227, 160, 420);
    camera.lookAt(227,10,300);
    animate();
}



function animate() {

    if(controls.isLocked){
        cameraController();
    }

    if(!bsp.isAnimationStopped){
        bsp.bspAnim();
    }

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}



