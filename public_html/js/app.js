import {scene, renderer, camera, controls, spotLight, character} from './globals.js'
import {cameraController, setGodMode, stopMotion} from "./src/controls/characterMovementController.js";
import {Bsp} from "./src/map/Bsp.js";
import {animationController, isAnimationStopped} from "./src/map/BspAnimation.js";
import {clock, isCollisionSet, setCollision, updatePhysics} from "./src/controls/collisionDetectionController.js";
import {initRaycast} from "./src/controls/raycastController.js";
import {setupScene, isSceneLoaded, isSceneLoadCalled} from "./src/game/loadObjectsOnScene.js";
import {flashlightController, manageShadows} from "./src/controls/lightController.js";
import {isShadersInitialized, initShaders, setTilesForShading} from "./src/shaderManagement/shaderManager.js";
import {initTransformControls} from "./src/controls/objectTransformationController.js";
import {initUI, isGamePaused, isGameStarted, isGameEnd, split, mapVariables} from "./src/game/UI_Handler.js";
import {initScore} from "./src/game/ScoreManager.js";

let bsp;
let delay = 550;  // increase this for better animation
let time = 0;


initUI();
initRaycast();
initTransformControls();


window.onload = function(){

    scene.add(controls.getObject());
    setRenderer();
    setCamera();

    waitForStart();

}


function waitForStart(){

    if(isGameStarted) {
        bsp = new Bsp(split, mapVariables);
        camera.position.set(bsp.numberOfTilesOnEdge, 50, bsp.numberOfTilesOnEdge);
        camera.lookAt(bsp.numberOfTilesOnEdge,0,0);
        animationController(bsp, delay);
        initScore(bsp.leaveNodes.length);
        setTilesForShading(bsp);
        animate();
    }

    else{
        requestAnimationFrame(waitForStart);
    }
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

    if(!isGamePaused && !isGameEnd){
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

    requestAnimationFrame(game);

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
