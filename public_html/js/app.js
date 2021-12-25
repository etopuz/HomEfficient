import {scene, renderer, camera, controls} from './globals.js'
import {cameraController} from "./src/controls/characterMovementController.js";
import {Bsp} from "./src/map/Bsp.js";
import {bspAnim} from "./src/map/BspAnimation.js";

let bsp;

window.onload = function(){
    scene.add( controls.getObject() );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight );
    bsp = new Bsp(2);
    camera.position.set(42, 200, 82);
    camera.lookAt(40,10,40);

    animate();
}

function animate() {

    if(controls.isLocked && window.document.hasFocus()){
        cameraController();
    }

    if(!bsp.isAnimationStopped){
        bspAnim(bsp);
    }

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

