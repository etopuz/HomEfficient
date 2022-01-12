import * as THREE from "../../modules/three.module.js";
import {camera, character, controls, player, renderer} from "../../globals.js";
import {isEditMode} from "./objectTransformationController.js";

export let
    moveLeftVector = new THREE.Vector3(),
    moveForwardVector = new THREE.Vector3(),
    godMode = true,
    direction = new THREE.Vector3();

const
    _NORMAL_SPEED = 150,
    _SPRINT_SPEED = 220,
    _NORMAL_FOV = camera.fov,
    _SPRINT_FOV = camera.fov + 6,
    _velocity = new THREE.Vector3();


let
    _moveForward = false,
    _moveBackward = false,
    _moveLeft = false,
    _moveRight = false,
    _canJump = false,

    _moveDown = false,
    _speedForward = _NORMAL_SPEED,
    _speedRight = _NORMAL_SPEED,
    _prevTime = performance.now();


const _onWindowResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const _onKeyDown = function ( event ) {
    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
            _moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            _moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            _moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            _moveRight = true;
            break;

        case 'Space':
            if ( _canJump === true)
                _velocity.y += 200;

            if (godMode)
                _velocity.y = 200;
            _canJump = false;
            break;

        case 'ControlLeft':
            if(godMode){
                _velocity.y = -100;
                _moveDown = true;
            }
            break;

        case 'ShiftLeft':
            _speedForward = _SPRINT_SPEED;
            camera.fov = _SPRINT_FOV;
            camera.updateProjectionMatrix();
            break;

        case 'F2':
            godMode = !godMode;
            break;

        case 'F3':
            console.log(camera.position);
            break;

    }
};

const _onKeyUp = function ( event ) {
    switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
            _moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            _moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            _moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            _moveRight = false;
            break;

        case 'ControlLeft':
        case 'KeyZ':
            _moveDown = false;
            break;

        case 'ShiftLeft':
            _speedForward = _NORMAL_SPEED;
            camera.fov = _NORMAL_FOV;
            camera.updateProjectionMatrix();
            break;
    }
};


export function cameraController(){
    const time = performance.now();
    const delta = ( time - _prevTime ) / 1000;
    _velocity.x -= _velocity.x * player.speed * delta;
    _velocity.z -= _velocity.z * player.speed * delta;
    _velocity.y -= 9.8 * 80.0 * delta;

    if(godMode && _velocity.y<0 && !_moveDown){
        _velocity.y = 0;
    }

    direction.z = Number( _moveForward ) - Number( _moveBackward );
    direction.x = Number( _moveRight ) - Number( _moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( _moveForward || _moveBackward ) _velocity.z -= direction.z * _speedForward * delta;
    if ( _moveLeft || _moveRight ) _velocity.x -= direction.x * _speedRight * delta;

    moveLeftVector = controls.moveRight( - _velocity.x /2);
    moveForwardVector = controls.moveForward( - _velocity.z);

    controls.getObject().position.y += ( _velocity.y * delta ) / 5; // new behavior

    if ( controls.getObject().position.y < player.height && !godMode) {

        _velocity.y = 0;
        controls.getObject().position.y = player.height;
        _canJump = true;

    }

    if(!godMode){
        setCharacterPosition();
    }

    else{
        camera.position.x += (moveForwardVector.x + moveLeftVector.x) * delta * 5;
        camera.position.z += (moveForwardVector.z + moveLeftVector.z) * delta * 5;
    }


    _prevTime = time;
}

export function setGodMode(bool){
    godMode = bool;
}

export function stopMotion(){
    moveLeftVector = new THREE.Vector3(0,0,0);
    moveForwardVector = new THREE.Vector3(0,0,0);
}


document.addEventListener( 'keydown', _onKeyDown );
document.addEventListener( 'keyup', _onKeyUp );
window.addEventListener('resize', _onWindowResize, false);
document.addEventListener( 'click', function () {
    if(!isEditMode)
        controls.lock();
} );


function setCharacterPosition(){
    camera.position.x = character.position.x;
    camera.position.y = character.position.y;
    camera.position.z = character.position.z;
}


function logAll(){
    console.log("px:" , controls.getObject().position.x);
    console.log("pz:" , controls.getObject().position.z);
    console.log("dx:" , direction.x);
    console.log("dz:" , direction.z);
    console.log("vx:" , _velocity.x);
    console.log("vz:" , _velocity.z);
}


