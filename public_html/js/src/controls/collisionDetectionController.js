import {camera, character, materials, scene} from "../../globals.js";
import {moveLeftVector, moveForwardVector, godMode} from "./characterMovementController.js";
import * as THREE from "../../modules/three.module.js";

export let
    isCollisionSet=false,
    clock,
    characterBody;

let
    collisionConfiguration,
    dispatcher,
    broadphase,
    solver,
    physicsWorld,
    rigidBodies = [],
    margin = 0.05,
    transformAux1 = new Ammo.btTransform();

var mouseCoords = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );


export function setCollision(bsp){
    clock = new THREE.Clock();
    initPhysics();

    /*initInput();*/ // ray-casting drops ball :D

    characterBody = createParallellepiped(character, 1000);

    let tiles = bsp.tiles;
    let len = bsp.numberOfTilesOnEdge;
    for(let x = 0; x < len; x++){
        for(let z = 0; z < len; z++){
            let tile = tiles[x][z];
            if(tile.parent === scene){
                createParallellepiped(tile, 0);
            }
        }
    }
    isCollisionSet=true;
}

export function moveCharacterCollisionBox(){
    // set char body position to camera position
    /*_characterBody.position = Object.assign({}, camera.position);*/
}

function initPhysics() {
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, 0, 0));
}

function createParallellepiped(threeObject, mass) {

    let sx = threeObject.scale.x;
    let sy = threeObject.scale.y;
    let sz = threeObject.scale.z;
    let pos = threeObject.position;

    let shape = new Ammo.btBoxShape(new Ammo.btVector3(sx *0.75, sy * 0.75, sz * 0.75));      // create ammo shape
    shape.setMargin(margin);
    var quat = new THREE.Quaternion();
    quat.set(0, 0, 0, 1);
    return createRigidBody(threeObject, shape, mass, pos, quat);
}

function createRigidBody(threeObject, physicsShape, mass, pos, quat) {
    threeObject.position.copy(pos);
    threeObject.quaternion.copy(quat);

    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    var motionState = new Ammo.btDefaultMotionState(transform);

    var localInertia = new Ammo.btVector3(0, 0, 0);
    physicsShape.calculateLocalInertia(mass, localInertia);

    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    threeObject.userData.physicsBody = body;

    scene.add(threeObject);

    // if mass = 0 dont move

    if (mass > 0) {
        rigidBodies.push(threeObject);

        // Disable deactivation

        // Ammo.DISABLE_DEACTIVATION = 4
        body.setActivationState(4);
    }

    physicsWorld.addRigidBody(body);

    return body;
}


export function updatePhysics(deltaTime) {
    physicsWorld.stepSimulation(deltaTime);

    let x = 0;
    let y = 0;
    let z = 0;

    if (!godMode){
        x = moveForwardVector.x + moveLeftVector.x;
        z = moveForwardVector.z + moveLeftVector.z;
    }


    characterBody.setLinearVelocity( new Ammo.btVector3(x, y, z));
    for (var i = 0, iL = rigidBodies.length; i <iL; i++ ){
        var objThree = rigidBodies[i];

        var objPhys = objThree.userData.physicsBody;
        var ms = objPhys.getMotionState();
        if (ms) {
            ms.getWorldTransform(transformAux1);
            var p = transformAux1.getOrigin();
            var q = transformAux1.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            /*objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());*/
        }
    }
}


/*function initInput() {

    window.addEventListener( 'mousedown', function( event ) {

        mouseCoords.set(0,0);

        raycaster.setFromCamera(mouseCoords, camera );

        // Creates a ball and throws it
        var ballMass = 35;
        var ballRadius = 0.4;

        var ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 14, 10 ), ballMaterial );
        ball.castShadow = true;
        ball.receiveShadow = true;
        var ballShape = new Ammo.btSphereShape( ballRadius );
        ballShape.setMargin( margin );
        var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();
        pos.copy( raycaster.ray.direction );
        pos.add( raycaster.ray.origin );
        quat.set( 0, 0, 0, 1 );
        var ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat );

        pos.copy( raycaster.ray.direction );
        pos.multiplyScalar( 24 );
        ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) );

        const intersects = raycaster.intersectObjects( scene.children );
        //intersects[0].object.material = materials.yellow;



    }, false );

}*/
