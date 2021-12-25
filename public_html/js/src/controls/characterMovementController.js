import * as THREE from "../../modules/three.module.js";
import {camera, controls, player, renderer} from "../../globals.js";

const
    _NORMAL_SPEED = 150,
    _SPRINT_SPEED = 220,
    _NORMAL_FOV = camera.fov,
    _SPRINT_FOV = camera.fov + 6,
    _velocity = new THREE.Vector3(),
    _direction = new THREE.Vector3();

let
    _moveForward = false,
    _moveBackward = false,
    _moveLeft = false,
    _moveRight = false,
    _canJump = false,
    _flyEnabled = true,
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

            if (_flyEnabled)
                _velocity.y = 400;
            _canJump = false;
            break;

        case 'ControlLeft':
            if(_flyEnabled){
                _velocity.y = -200;
                _moveDown = true;
            }
            break;

        case 'ShiftLeft':
            _speedForward = _SPRINT_SPEED;
            camera.fov = _SPRINT_FOV;
            camera.updateProjectionMatrix();
            break;

        case 'F2':
            _flyEnabled = !_flyEnabled;
            break;

        case 'F3':
            console.log(camera.position);
            break;
    }

};

const _onKeyUp = function ( event ) {
    console.log(event.code);
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

    if(_flyEnabled && _velocity.y<0 && !_moveDown){
        _velocity.y = 0;
    }

    _direction.z = Number( _moveForward ) - Number( _moveBackward );
    _direction.x = Number( _moveRight ) - Number( _moveLeft );
    _direction.normalize(); // this ensures consistent movements in all directions

    if ( _moveForward || _moveBackward ) _velocity.z -= _direction.z * _speedForward * delta;
    if ( _moveLeft || _moveRight ) _velocity.x -= _direction.x * _speedRight * delta;

    controls.moveRight( - _velocity.x * delta );
    controls.moveForward( - _velocity.z * delta );

    controls.getObject().position.y += ( _velocity.y * delta )/5; // new behavior

    if ( controls.getObject().position.y < player.height && !_flyEnabled) {

        _velocity.y = 0;
        controls.getObject().position.y = player.height;
        _canJump = true;

    }
    _prevTime = time;
}


document.addEventListener( 'keydown', _onKeyDown );
document.addEventListener( 'keyup', _onKeyUp );
document.addEventListener( 'click', function () {controls.lock();} );
window.addEventListener('resize', _onWindowResize, false)






