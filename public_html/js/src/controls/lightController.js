import {scene, camera, spotLight} from "../../globals.js";
import * as THREE from "../../modules/three.module.js";

export let
    lampLights = [],
    tvLights = [];

let changeOpenedLights = true;
let side = 1;

const maxDistance = 200;
const intensityIncreaseRate = 0.25;
const obj = new THREE.Object3D();
scene.add(obj);


export function turnOffLights(i){
    lampLights[i].intensity = 0;
}

function turnOffTv(i){
    scene.remove(tvLights[i]);
}


export function manageShadows(time){

    if(lampLights.length > 4 && Math.floor(time)%2 === 0){ // make changes in every 2 seconds

        if (camera.position.x > 57){
            for(let i = 0; i<lampLights.length/2; i++){
                lampLights[i].castShadow = false;
            }
            for(let i = lampLights.length/2; i<lampLights.length; i++){
                lampLights[i].castShadow = true;
            }
        }

        else if (camera.position.x < 57){
            for(let i = 0; i<lampLights.length/2; i++){
                lampLights[i].castShadow = true;
            }
            for(let i = lampLights.length/2; i<lampLights.length; i++){
                lampLights[i].castShadow = false;
            }
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




document.addEventListener("keydown", event => {

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
