import * as THREE from "../../modules/three.module.js";
import {camera, scene} from "../../globals.js";
import {turnOffLights} from "./lightController.js";

let rayCaster = new THREE.Raycaster();
let rayCaster2 = new THREE.Raycaster();

const zeroVector = new THREE.Vector2(0,0);

export function initRaycast() {
    window.addEventListener( 'mousedown', function( event ) {

        rayCaster.setFromCamera(zeroVector, camera);

        let pos = new THREE.Vector3();
        let quat = new THREE.Quaternion();
        pos.copy( rayCaster.ray.direction );
        pos.add( rayCaster.ray.origin );
        quat.set( 0, 0, 0, 1 );
        pos.copy( rayCaster.ray.direction );

        let obj;
        const intersect = rayCaster.intersectObjects(scene.children)[0];

        if(intersect !== null && intersect !== undefined){
            obj = intersect.object;

            while(!THREE.Group.prototype.isPrototypeOf(obj)){
                if(obj.parent === null)
                    break;
                obj = obj.parent;
            }

            if (THREE.Group.prototype.isPrototypeOf(obj)){

                if(obj.name.type === 'switch'){
                    turnOffLights(obj.name.id);
                }
            }
        }




    }, false );

}

export function getCasted(){
    rayCaster.setFromCamera(zeroVector, camera);

    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();
    pos.copy( rayCaster.ray.direction );
    pos.add( rayCaster.ray.origin );
    quat.set( 0, 0, 0, 1 );
    pos.copy( rayCaster.ray.direction );

    let obj;
    const intersect = rayCaster.intersectObjects(scene.children)[0];

    if(intersect !== null && intersect !== undefined){
        obj = intersect.object;

        while(!THREE.Group.prototype.isPrototypeOf(obj)){
            if(obj.parent === null)
                break;
            obj = obj.parent;
        }

        if (THREE.Group.prototype.isPrototypeOf(obj)){

            if(obj.name.type === 'movable'){
                return intersect.object;
            }
            else
                return null;
        }

    }



}


