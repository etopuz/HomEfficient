import {scene, renderer, camera, controls} from './globals.js'
import {cameraController} from "./src/controls/characterMovementController.js";
import {Bsp} from "./src/map/Bsp.js";
import {animationController} from "./src/map/BspAnimation.js";

let bsp;
let split = 2;  // increase this for more nodes
let delay = 20; // increase this for better animation

window.onload = function(){
    scene.add(controls.getObject());
    setRenderer();
    setCamera();

    bsp = new Bsp(split);
    animationController(bsp, delay); 
    animate();
}

function animate() {

    requestAnimationFrame(animate);
    if(controls.isLocked && window.document.hasFocus()){
        cameraController();
    }
    TWEEN.update();
    renderer.render( scene, camera );

}

function setRenderer() {
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight);
}

function setCamera(){
    camera.position.set(82, 98, 82);
    camera.lookAt(0,0,0);
}

