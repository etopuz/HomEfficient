import { TransformControls } from "../../modules/TransformControls.js";
import {camera, controls, renderer, scene} from "../../globals.js";
import {getCasted} from "./raycastController.js";

export let isEditMode = false;
let tControl = new TransformControls( camera, renderer.domElement );

export function initTransformControls(){
    window.addEventListener( 'keydown', function ( event ) {
        switch ( event.code ) {
            case 'KeyE':
              isEditMode = !isEditMode;
                if(isEditMode){
                    let obj = getCasted();

                    if (obj !== null && obj !== undefined){
                        controls.disconnect();
                        controls.unlock();
                        tControl.attach(obj);
                        scene.add(tControl);
                    }

                    else
                        isEditMode = !isEditMode;

                }
                else{
                    controls.connect();
                    controls.lock();
                    tControl.detach(getCasted());
                    scene.remove(tControl);
                }
                // enable transforms
                break;

            case 'KeyR':
                tControl.setMode( 'rotate' );
                break;

            case 'KeyT':
                tControl.setMode( 'translate' );
                break;

            case 'KeyY':
                tControl.setMode( 'scale' );
                break;
        }
    });
}


