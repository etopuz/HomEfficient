import * as THREE from "../../modules/three.module.js";
import {camera, scene} from "../../globals.js";
import {turnOffLights} from "../game/lightManager.js";

let rayCaster = new THREE.Raycaster();
const zeroVector = new THREE.Vector2(0,0);

export function rayCastInit() {
    window.addEventListener( 'mousedown', function( event ) {

        rayCaster.setFromCamera(zeroVector, camera);

        let pos = new THREE.Vector3();
        let quat = new THREE.Quaternion();
        pos.copy( rayCaster.ray.direction );
        pos.add( rayCaster.ray.origin );
        quat.set( 0, 0, 0, 1 );
        pos.copy( rayCaster.ray.direction );

        const intersect = rayCaster.intersectObjects(scene.children)[0];
        let obj = intersect.object;


        while(!THREE.Group.prototype.isPrototypeOf(obj)){
            if(obj.parent === null)
                break;
            obj = obj.parent;
        }

        if (THREE.Group.prototype.isPrototypeOf(obj)){
            switch(obj.name.type){
                case 'switch':
                    turnOffLights(obj.name.id);
                    break;
            }
            console.log();
        }


    }, false );

}
