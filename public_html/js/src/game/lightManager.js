import {scene, camera, mainLight, spotLight} from "../../globals.js";
import * as THREE from "../../modules/three.module.js";
import {direction} from "../controls/characterMovementController.js";

export let
    lampLights = [],
    tvLights = [];


const maxDistance = 200;
const intensityIncreaseRate = 0.25;
const obj = new THREE.Object3D();
scene.add(obj);


export function turnOffLights(i){
    scene.remove(lampLights[i]);
}

function turnOffTv(i){
    scene.remove(tvLights[i]);
}


export function detectNearestLights(){

    if(lampLights.length < 4){
        for(let i = 4; i<lampLights.length;i++){
            lampLights.castShadow = true;
        }
    }

    let nearest1 = lampLights[0];
    let nearest2 = lampLights[1];
    let nearest3 = lampLights[2];
    let nearest4 = lampLights[3];

    for(let i = 4; i<lampLights.length;i++){
        if(distanceFromCamera(nearest1) > distanceFromCamera(lampLights[i])){
            nearest1 = lampLights[i];

        }
    }
}


export function flashlightController(){


    var lookAtVector = new THREE.Vector3(0, 0, -1);
    lookAtVector.applyQuaternion(camera.quaternion);

    obj.position.x = camera.position.x + lookAtVector.x;
    obj.position.y = camera.position.y + lookAtVector.y;
    obj.position.z = camera.position.z + lookAtVector.z;

    spotLight.position.x = camera.position.x;
    spotLight.position.y = camera.position.y;
    spotLight.position.z = camera.position.z;

    spotLight.target = obj;


    /*console.log(spotLight.position);*/
}






function distanceFromCamera(light){
    return light.position.distanceToSquared(camera.position);
}


document.addEventListener("keydown", event => {

    if (event.code === 'KeyQ') {
        if(mainLight.parent === scene){
            scene.remove(mainLight);
        }
        else{
            scene.add(mainLight);
        }
    }

    if (event.code === 'KeyF') {

        if(spotLight.intensity >= 1.0){
            spotLight.intensity = 0;
        }
        else{
            spotLight.intensity += intensityIncreaseRate;
        }
    }
    // do something
});
