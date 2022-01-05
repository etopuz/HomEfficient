import {GLTFLoader} from "../../modules/GLTFLoader.js";
import {scene} from "../../globals.js";
import * as THREE from "../../modules/three.module.js";
import {DoorDirection, RoomType} from "../map/mapGlobals.js";
import {_3DModel} from "./_3DModel.js";


const zeroVector = new THREE.Vector3(0,0,0);

let lampObj = new _3DModel('lamp', 'assets/gltf//lamp/');
let tvObj = new _3DModel('tv', 'assets/gltf//tv2/');

let tiles;
let nodes;

export let isSceneLoaded = false;
export let isSceneLoadCalled = false;

let numberOfRooms = 0;
let numberOfLivingRoom = 0;
let numberOfBathrooms = 0;
let numberOfKitchens = 0;
let numberOfBedrooms = 0;

let buttons = [];
let lampLights = [];
let tvLights = [];

let delay = 1

export function setupScene(bsp){
    tiles = bsp.tiles;
    nodes = bsp.leaveNodes;
    isSceneLoadCalled = true;

    calculateNumberOfRooms();
    setupLights(delay);
    setupTvS(delay);

    /*
        isSceneLoaded = true;
        add to end of last call
    */

}

function createObject(object3D, scaleRatio, rotation, position, id){

    object3D.scale.set(scaleRatio,scaleRatio,scaleRatio);

    object3D.rotation.x = rotation.x;
    object3D.rotation.y = rotation.y;
    object3D.rotation.z = rotation.z;

    object3D.position.x = position.x;
    object3D.position.y = position.y;
    object3D.position.z = position.z;

    object3D.name = id;

    scene.add(object3D);
}


function loadGltfMesh(path, howMany, object3DArray) {
    const loader = new GLTFLoader().setPath(path);
    loader.load( 'scene.gltf', function ( gltf ) {
        const root=gltf.scene;

        for (let i = 0; i < howMany; i++) {
            object3DArray.push(root.clone());
        }

    } , function(xhr){
        console.log((xhr.loaded/xhr.total *100)+ "% loaded");
    } , function (error){
        console.log("An error occured")
    });
}



function setupLights(){
    loadGltfMesh(lampObj.path, numberOfRooms, lampObj.models);
    delay++;

    sleep(2000 * delay).then(r => {
        for(let i = 0; i< nodes.length; i++) {
            let room = nodes[i].room;
            let middleTile = tiles[Math.floor((room.endX + room.startX)/2)][Math.floor((room.endZ + room.startZ)/2)];
            let position = new THREE.Vector3(middleTile.position.x, 5, middleTile.position.z);
            createObject(lampObj.models[i], 0.05, zeroVector , position, i);
            let light = new THREE.AmbientLight(0x505050, 0.3);
            light.position.set(position.x, position.y, position.z);
            scene.add(light);
            lampLights.push(light);
        }
    });
}

function setupTvS(delay) {
    delay++;
    loadGltfMesh(tvObj.path, numberOfRooms, tvObj.models);

    sleep(2000 * delay).then(r => {
        let j = -1;
        for(let i = 0; i< nodes.length; i++) {
            let room = nodes[i].room;
            if(room.roomType===RoomType.LivingRoom) {
                j++;

                let ceil = 0;
                let scaleRatio = 0.007
                let position = new THREE.Vector3(0,0,0);
                let rotation = new THREE.Vector3(0,0,0);

                if(room.doorDirection===DoorDirection.Right){
                    let middleTile = tiles[room.startX][Math.floor((room.endZ + room.startZ)/2)];
                    position = middleTile.position.clone();
                    position.x +=1;
                    rotation.y = Math.PI/2;
                }

                else if(room.doorDirection===DoorDirection.Left){
                    let middleTile = tiles[room.endX-1][Math.floor((room.endZ + room.startZ)/2)];
                    position = middleTile.position.clone();
                    position.x -=1;
                    rotation.y = -Math.PI/2;
                }

                else if(room.doorDirection===DoorDirection.Up){
                    let middleTile = tiles[Math.floor((room.endX + room.startX)/2)][room.endZ-1];
                    position = middleTile.position.clone();
                    position.z -= 1;
                }

                else if(room.doorDirection===DoorDirection.Down){
                    let middleTile = tiles[Math.floor((room.endX + room.startX)/2)][room.startZ];
                    position = middleTile.position.clone();
                    position.z += 1;
                }

                createObject(tvObj.models[j], scaleRatio, rotation, position, tvObj.name+j);
                // add rect area light

            }
        }
    });

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

