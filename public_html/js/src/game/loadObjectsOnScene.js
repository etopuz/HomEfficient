import {GLTFLoader} from "../../modules/GLTFLoader.js";
import {ceil, materials, renderer, scene} from "../../globals.js";
import * as THREE from "../../modules/three.module.js";
import {DoorDirection, RoomType} from "../map/mapGlobals.js";
import {_3DModel} from "./_3DModel.js";
import {lampLights} from "../controls/lightController.js";


const zeroVector = new THREE.Vector3(0,0,0);

let lampObj = new _3DModel('lamp', 'assets/gltf//lamp/');
let switchObj = new _3DModel('switch', 'assets/gltf//switch/');

let tvObj = new _3DModel('tv', 'assets/gltf//tv2/');
let sofaObj = new _3DModel('sofa', 'assets/gltf//sofa2/');
let coffeeTableObj = new _3DModel('coffeeTable', 'assets/gltf//coffee_table/');
let cupObj = new _3DModel('cup', 'assets/gltf//cup/');
let teaPotObj = new _3DModel('teaPot', 'assets/gltf//teapot2/');
let plateObj = new _3DModel('plate', 'assets/gltf//plate/');

let tiles;
let nodes;
let numberOfTilesOnEdge;

export let isSceneLoaded = false;
export let isSceneLoadCalled = false;

let numberOfRooms = 0;
let numberOfLivingRoom = 0;
let numberOfBathrooms = 0;
let numberOfKitchens = 0;
let numberOfBedrooms = 0;



export function setupScene(bsp){

    tiles = bsp.tiles;
    nodes = bsp.leaveNodes;
    numberOfTilesOnEdge = bsp.numberOfTilesOnEdge;

    renderer.shadowMap.enabled = true;
    isSceneLoadCalled = true;

    calculateNumberOfRooms();

    // ALL ROOMS
    loadGltfMesh(switchObj, numberOfRooms);
    loadGltfMesh(lampObj, numberOfRooms);

    // LIVING ROOM
    loadGltfMesh(sofaObj, numberOfLivingRoom * 2);
    loadGltfMesh(tvObj, numberOfLivingRoom);
    loadGltfMesh(coffeeTableObj, numberOfLivingRoom);
    loadGltfMesh(cupObj, numberOfLivingRoom);
    loadGltfMesh(teaPotObj, numberOfLivingRoom);
    loadGltfMesh(plateObj, numberOfLivingRoom);

    sleep(3000).then(r => {
        setupLivingRoom();
        setupSwitches();
        setupLights();
        addCeil();
    });



    /*
        isSceneLoaded = true;
        add to end of last call
    */

}



function createObject(object3D, scaleRatio, rotation, position, id){

    object3D.rotation.x = rotation.x;
    object3D.rotation.y = rotation.y;
    object3D.rotation.z = rotation.z;

    object3D.position.x = position.x;
    object3D.position.y = position.y;
    object3D.position.z = position.z;

    object3D.scale.set(scaleRatio,scaleRatio,scaleRatio);

    object3D.name = id;

    scene.add(object3D);
}


function loadGltfMesh(model, howMany) {
    let path = model.path;
    let object3DArray = model.models;

    const loader = new GLTFLoader().setPath(path);
    loader.load( 'scene.gltf', function ( gltf ) {
        const root=gltf.scene;

        for (let i = 0; i < howMany; i++) {
            object3DArray.push(root.clone());
        }

    } , function(xhr){
        console.log((xhr.loaded/xhr.total *100)+ "% loaded");
    } , function (error){
        console.log("An error occurred!")
    });
}


function setupSwitches() {
    for(let i = 0; i< nodes.length; i++) {
        let room = nodes[i].room;
        let position = tiles[room.doorPosX][room.doorPosZ].position.clone();
        let rotation = new THREE.Vector3(0,0,0);
        position.y += 2.5;

        switch (room.doorDirection){
            case DoorDirection.Left:
                position.z +=1;
                rotation.y = Math.PI;
                break;

            case DoorDirection.Right:
                position.z -=1;
                break;

            case DoorDirection.Up:
                rotation.y = Math.PI/2;
                position.x -=1;
                break;

            case DoorDirection.Down:
                rotation.y = -Math.PI/2;
                position.x +=1;
                break;
        }

        createObject(switchObj.models[i], 0.001, rotation , position, {type:switchObj.name, id:i});
    }
}


function setupLights(){

    let shadow = nodes.length < 5;
    for(let i = 0; i< nodes.length; i++) {
        let room = nodes[i].room;
        let middleTile = tiles[Math.floor((room.endX + room.startX)/2)][Math.floor((room.endZ + room.startZ)/2)];
        let position = new THREE.Vector3(middleTile.position.x, 4, middleTile.position.z);
        createObject(lampObj.models[i], 0.05, zeroVector , position, i);
        let light = new THREE.PointLight(0xFFFFFF, 1.0, 36, 1.5);
        light.position.set(position.x, position.y - 0.5, position.z);
        light.castShadow = shadow;
        scene.add(light);
        lampLights.push(light);

    }
}

function setupLivingRoom() {

    let j = -1;
    for(let i = 0; i< nodes.length; i++) {
        let room = nodes[i].room;
        if(room.roomType === RoomType.LivingRoom) {
            j++;

            let leftMid = tiles[room.startX][Math.floor((room.endZ + room.startZ)/2)].position;
            let rightMid = tiles[room.endX-1][Math.floor((room.endZ + room.startZ)/2)].position;
            let topMid = tiles[Math.floor((room.endX + room.startX)/2)][room.startZ].position;
            let downMid = tiles[Math.floor((room.endX + room.startX)/2)][room.endZ-1].position;
            let mid = tiles[Math.floor((room.endX + room.startX)/2)][Math.floor((room.endZ + room.startZ)/2)].position;

            let tvScale = 0.005;
            let sofaScale = 0.04;
            let coffeeTableScale = 0.8;
            let cupScale = 0.0008;
            let teaPotScale = 0.15;
            let plateScale = 0.08;

            let tvOffset = 2;
            let sofaOffset = 3.5;
            let coffeeTableOffSet = 1.1;

            let tvPosition = new THREE.Vector3(0,0,0);
            let tvRotation = new THREE.Vector3(0,0,0);

            let sofaPosition1 = new THREE.Vector3(0,0,0);
            let sofaRotation1 = new THREE.Vector3(0,0,0);

            let sofaPosition2 = new THREE.Vector3(0,0,0);
            let sofaRotation2 = new THREE.Vector3(0,0,0);

            let coffeeTablePosition = mid.clone();
            let coffeeTableRotation = new THREE.Vector3(0,0,0);

            let cupPosition = new THREE.Vector3(0,0,0);
            let teaPotPosition = new THREE.Vector3(0,0,0);
            let platePosition = new THREE.Vector3(0,0,0);

            if(room.doorDirection===DoorDirection.Right){
                tvPosition = leftMid.clone();
                tvPosition.x += tvOffset;
                tvRotation.y = Math.PI/2;

                sofaPosition1 = downMid.clone();
                sofaPosition1.z -= sofaOffset;
                sofaRotation1.y = Math.PI;

                sofaPosition2 = rightMid.clone();
                sofaPosition2.x -= sofaOffset;
                sofaRotation2.y = -Math.PI/2;

                coffeeTablePosition.x += coffeeTableOffSet
                coffeeTableRotation.y = Math.PI/2;
            }

            else if(room.doorDirection===DoorDirection.Left){
                tvPosition = rightMid.clone();
                tvPosition.x -= tvOffset;
                tvRotation.y = -Math.PI/2;

                sofaPosition1 = topMid.clone();
                sofaPosition1.z += sofaOffset;

                sofaPosition2 = leftMid.clone();
                sofaPosition2.x += sofaOffset;
                sofaRotation2.y = Math.PI/2;

                coffeeTablePosition.x -= coffeeTableOffSet
                coffeeTableRotation.y = Math.PI/2;

            }

            else if(room.doorDirection===DoorDirection.Up){
                tvPosition = downMid.clone();
                tvPosition.z -= tvOffset;
                tvRotation.y = Math.PI;

                sofaPosition1 = rightMid.clone();
                sofaPosition1.x -= sofaOffset;
                sofaRotation1.y = -Math.PI/2;

                sofaPosition2 = topMid.clone();
                sofaPosition2.z += sofaOffset;

                coffeeTablePosition.z -= coffeeTableOffSet

            }

            else if(room.doorDirection===DoorDirection.Down){
                tvPosition = topMid.clone();
                tvPosition.z += tvOffset;

                sofaPosition1 = leftMid.clone();
                sofaPosition1.x += sofaOffset;
                sofaRotation1.y = Math.PI/2;

                sofaPosition2 = downMid.clone();
                sofaPosition2.z -= sofaOffset;
                sofaRotation2.y = Math.PI;

                coffeeTablePosition.z += coffeeTableOffSet
            }

            tvPosition.y -= 0.5;

            sofaPosition1.y = 0;
            sofaPosition2.y = 0;

            coffeeTablePosition.y += 1.2;

            cupPosition = coffeeTablePosition.clone();
            cupPosition.y += 0.2;

            teaPotPosition = cupPosition.clone();
            teaPotPosition.x += 0.2

            platePosition = cupPosition.clone();
            platePosition.x -= 0.6;

            createObject(plateObj.models[j], plateScale, new THREE.Vector3(0,0,0), platePosition, {type:'movable', id:i});
            createObject(teaPotObj.models[j], teaPotScale, new THREE.Vector3(0,0,0), teaPotPosition, {type:'movable', id:i});
            createObject(cupObj.models[j], cupScale, new THREE.Vector3(0,0,0), cupPosition, {type:'movable', id:i});
            createObject(coffeeTableObj.models[j], coffeeTableScale, coffeeTableRotation, coffeeTablePosition, coffeeTableObj.name + j);
            createObject(tvObj.models[j], tvScale, tvRotation, tvPosition, tvObj.name + j);
            createObject(sofaObj.models[j], sofaScale, sofaRotation2, sofaPosition2, sofaObj.name + j);
            createObject(sofaObj.models[j + numberOfLivingRoom], sofaScale, sofaRotation1, sofaPosition1, sofaObj.name + (j + numberOfLivingRoom));
            // add rect area light

        }
    }
}


function addCeil() {
    let startPos = tiles[0][0].position.clone();
    let endPos = tiles[tiles.length-1][tiles.length-1].position.clone();
    let middlePos = endPos.add(startPos);
    middlePos = middlePos.multiplyScalar(0.5);
    middlePos.y += 3;
    ceil.position.set(middlePos.x, middlePos.y, middlePos.z);
    ceil.scale.set(numberOfTilesOnEdge, 1 , numberOfTilesOnEdge);
    scene.add(ceil);
}

function calculateNumberOfRooms() {
    for(let i = 0; i< nodes.length; i++) {
        let room = nodes[i].room;
        numberOfRooms++;
        switch (room.roomType){
            case RoomType.LivingRoom:
                numberOfLivingRoom++;
                break;

            case RoomType.Bedroom:
                numberOfBedrooms++;
                break;

            case RoomType.Kitchen:
                numberOfKitchens++;
                break;

            case RoomType.Bathroom:
                numberOfBathrooms++;
                break;
        }
    }
}



// helper

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/*function createObject(scaleRatio, object3D, rotation_x, position_x, position_y, position_z){
    console.log(object3D);
    object3D.scale.set(scaleRatio,scaleRatio,scaleRatio);
    object3D.rotation.set(scaleRatio,scaleRatio,scaleRatio);
    object3D.position.z=position_z  //Math.PI/0.5
    object3D.position.x=position_x  //Math.PI/0.5
    object3D.position.y=position_y  //Math.PI/0.75
    scene.add(object3D);
    const light= new THREE.DirectionalLight(0xffffff,1);
    light.position.set(position_x, position_y, position_z);
    scene.add(light)
}*/



/*createObjectInRooms(){
    this.createObject();
    let tiles=this.tiles;
    let nodes=this.leaveNodes;
    for(let i = 0; i< nodes.length; i++) {
        console.log("dervis1");
        let room = nodes[i].room;
        let middleX = tiles[(room.endX - room.startX)/2][(room.endZ - room.startZ)/2];
        let middleZ = tiles[(room.endX - room.startX)/2][(room.endZ - room.startZ)/2];
        let ceil = 5;
        console.log(middleX.position);
        scene.add(this.createObject(middleX.position.x, ceil, middleZ.position.z));
        console.log("dervis2");

        this.createObject(middleX.position.x, ceil, middleZ.position.z);
        console.log("dervis3");

    }
}*/

/*tv.load('scene.gltf',function (gltf){
    console.log(gltf)
    const root1=gltf.scene;
    root1.scale.set(0.005,0.005,0.005)
    root1.rotation.x=Math.PI/0.5
    root1.position.z=Math.PI/1
    root1.position.x=Math.PI/0.35
    root1.position.y=Math.PI/0.2
    scene.add(root1);
} , function(xhr){
    console.log((xhr.loaded/xhr.total *100)+ "% loaded")
} , function (error){
    console.log("An error occured")
});
scene.add(light)*/

