import {scene, renderer, camera, controls, spotLight, character} from './globals.js'
import {cameraController, setGodMode, stopMotion} from "./src/controls/characterMovementController.js";
import {Bsp} from "./src/map/Bsp.js";
import {animationController, isAnimationStopped} from "./src/map/BspAnimation.js";
import {clock, isCollisionSet, setCollision, updatePhysics} from "./src/controls/collisionDetectionController.js";
import {initRaycast} from "./src/controls/raycastController.js";
import {setupScene, isSceneLoaded, isSceneLoadCalled} from "./src/game/loadObjectsOnScene.js";
import {flashlightController, manageShadows} from "./src/controls/lightController.js";
import {isShadersInitialized, initShaders, setTileProperties} from "./src/shaderManagement/shaderManager.js";
import {initTransformControls} from "./src/controls/objectTransformationController.js";

let bsp;
let split = 2;  // increase this for more nodes
let delay = 1; // increase this for better animation
let time = 0;

initRaycast();
initTransformControls();

window.onload = function(){
    scene.add(controls.getObject());
    setRenderer();
    setCamera();

    bsp = new Bsp(split);

    animationController(bsp, delay);
    setTileProperties(bsp);



    animate();
}

function animate() {
    if(controls.isLocked && window.document.hasFocus()){
        cameraController();
    }
    TWEEN.update();
    renderer.render( scene, camera );

    if(isAnimationStopped && !isCollisionSet)
        setCollision(bsp);

    if(isAnimationStopped && isCollisionSet){
        setGodMode(false);
        game();
    }

    else
        requestAnimationFrame(animate);
}

function game(){
    requestAnimationFrame(game);
    let deltaTime = clock.getDelta();

    if(!isSceneLoadCalled){
        setupScene(bsp);
    }

    if(!isShadersInitialized){
        initShaders();
    }

    if(controls.isLocked && window.document.hasFocus()){
        manageShadows(time);
        cameraController();
        updatePhysics(deltaTime);
        flashlightController();
    }

    else {
        stopMotion();
    }

    time += deltaTime;
    renderer.render( scene, camera);
}

function setRenderer() {
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight);
}

function setCamera(){
    camera.position.set(0, 20, 0);
    camera.lookAt(0,20,1);
}
