import {GLTFLoader} from "../../modules/GLTFLoader.js";
import {scene} from "../../globals.js";
import * as THREE from "../../modules/three.module.js";

export let isSceneLoaded = false;

export function createObjectInRooms(bsp){
    console.log("x");
    let tiles= bsp.tiles;
    let nodes= bsp.leaveNodes;

    for(let i = 0; i< nodes.length; i++) {
        let room = nodes[i].room;
        let middleTile = tiles[Math.floor((room.endX + room.startX)/2)][Math.floor((room.endZ + room.startZ)/2)];
        let ceil = 5;
        console.log (middleTile.position);
        createObject(Math.PI/0.5, middleTile.position.x, ceil, middleTile.position.z);
    }

    isSceneLoaded = true;
    // load screen maybe
}

function createObject(rotation_x,position_x, position_y, position_z){
    
    // webstormda onune "../../" getirmek gerekiyor
    // netbeansda gerek yok
    
    const lamp = new GLTFLoader().setPath( 'assets/gltf//lamp/' );
    //const tv= new GLTFLoader().setPath( '../../assets/gltf/tv/')
    lamp.load( 'scene.gltf', function ( gltf ) {
        console.log(gltf);
        const root=gltf.scene;
        root.scale.set(0.07,0.07,0.07);
        root.rotation.x=rotation_x  //Math.PI/0.5
        root.position.z=position_z  //Math.PI/0.5
        root.position.x=position_x  //Math.PI/0.5
        root.position.y=position_y  //Math.PI/0.75
        scene.add(root);
    } , function(xhr){
        console.log((xhr.loaded/xhr.total *100)+ "% loaded");
    } , function (error){
        console.log("An error occured")
    });

    const light= new THREE.DirectionalLight(0xffffff,1);
    light.position.set(position_x,position_y,position_z);
    scene.add(light)
}

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

