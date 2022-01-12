import * as THREE from "../../modules/three.module.js";

import {Shading} from "./Shading.js";
import {RoomType, TileType} from "../map/mapGlobals.js";
import {cyanTileTexture, woodFloorTexture, checkersTexture, wallTexture, materials, ceil} from "../../globals.js";

import {VST} from "../../../shaders/2_vertexShaderToon.js";
import {FST} from "../../../shaders/2_fragmentShaderToon.js";
import {FSG} from "../../../shaders/1_fragmentShaderGouraud.js";
import {VSG} from "../../../shaders/1_vertexShaderGouraud.js";
import {lampLights} from "../controls/lightController.js";


export let isShadersInitialized = false;

const shadingState = {
    phong: 0,
    gouraud: 1,
    toon: 2
}

let currentShading = shadingState.phong;

let middle;
let tiles;
let nodes;

export function setTileProperties(bsp){
    tiles = bsp.tiles;
    middle = bsp.numberOfTilesOnEdge;
    nodes = bsp.leaveNodes;
}

let uniformsGouraud = {
    Diffuse: {type: "v4", value: new THREE.Vector4(0.3, 0.3, 0.3, 1.0)},
    Specular: {type: "v4", value: new THREE.Vector4(0.3, 0.3, 0.3, 1.0)},
    Ambient: {type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)},
    LightPosition: {type: "v4", value: new THREE.Vector4(middle, 40.0, middle, 1.0)},
    shininess: {type: "f", value: 0.5},
    tex: {type: "t", value: wallTexture},
};


let uniformsToon = {
    LightPosition: {type: "v4", value: new THREE.Vector4(middle, 4.0, middle, 1.0)},
    inputColor: {type: "v4", value: new THREE.Vector4(0.0, 0.03, 0.1, 0.0)},
    tex: {type: "t", value: wallTexture},
    shade : {type: "b", value: true},
    showOutline : {type: "b", value: true}
};


export let itemMaterialGouraud = new THREE.ShaderMaterial({
    glslVersion: '300 es',
    uniforms: uniformsGouraud,
    vertexShader: VSG,
    fragmentShader: FSG,
});

export let itemMaterialToon = new THREE.ShaderMaterial({
    glslVersion: '300 es',
    uniforms: uniformsToon,
    vertexShader: VST,
    fragmentShader: FST,
});

const kitchenMaterials = {
    phong: materials.kitchen,
    toon : new Shading(itemMaterialToon, checkersTexture),
    gouraud : new Shading(itemMaterialGouraud, checkersTexture)
}

const bedRoomMaterials = {
    phong: materials.bedRoom,
    toon : new Shading(itemMaterialToon, woodFloorTexture),
    gouraud : new Shading(itemMaterialGouraud, woodFloorTexture)
}

const bathRoomMaterials = {
    phong: materials.bathRoom,
    toon : new Shading(itemMaterialToon, cyanTileTexture),
    gouraud : new Shading(itemMaterialGouraud, cyanTileTexture)
}

const corridorMaterials = {
    phong: materials.corridor,
    toon : new Shading(itemMaterialToon, checkersTexture),
    gouraud : new Shading(itemMaterialGouraud, checkersTexture)
}

const livingRoomMaterials = {
    phong: materials.livingRoom,
    toon : new Shading(itemMaterialToon, woodFloorTexture),
    gouraud : new Shading(itemMaterialGouraud, woodFloorTexture)
}

const wallMaterials = {
    phong: materials.wall,
    toon : new Shading(itemMaterialToon, wallTexture),
    gouraud : new Shading(itemMaterialGouraud, wallTexture)
}


function changeShading() {

    for(let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        let roomType = node.room.roomType;
        let roomMaterials;
        let roomMaterial;
        let corridorMaterial;
        let wallMaterial;

        switch(roomType){
            case RoomType.LivingRoom:
                roomMaterials = livingRoomMaterials;
                break;
            case RoomType.Bedroom:
                roomMaterials = bedRoomMaterials;
                break;

            case RoomType.Bathroom:
                roomMaterials = bathRoomMaterials;
                break;

            case RoomType.Kitchen:
                roomMaterials = kitchenMaterials;
                break;
        }

        switch (currentShading){
            case shadingState.phong:
                roomMaterial = roomMaterials.phong;
                corridorMaterial = corridorMaterials.phong;
                wallMaterial = wallMaterials.phong;
                break;

            case shadingState.gouraud:
                roomMaterial = roomMaterials.gouraud.material;
                corridorMaterial = corridorMaterials.gouraud.material;
                wallMaterial = wallMaterials.gouraud.material;
                break;

            case shadingState.toon:
/*                let lightPos = new THREE.Vector4(lampLights[i].position.x, 3, lampLights[i].position.z, 1.0);*/
                roomMaterial = roomMaterials.toon.material.clone();
                corridorMaterial = corridorMaterials.toon.material.clone();
                wallMaterial = wallMaterials.toon.material.clone();

                let tempUniformsRoom = {
                    LightPosition: {type: "v4", value: new THREE.Vector4(lampLights[i].position.x, 3, lampLights[i].position.z, 1.0)},
                    inputColor: {type: "v4", value: new THREE.Vector4(0.0, 0.03, 0.1, 0.0)},
                    tex: {type: "t", value: roomMaterials.toon.texture},
                    shade : {type: "b", value: true},
                    showOutline : {type: "b", value: false}
                };
                let tempUniformsWall = {
                    LightPosition: {type: "v4", value: new THREE.Vector4(lampLights[i].position.x, 3, lampLights[i].position.z, 1.0)},
                    inputColor: {type: "v4", value: new THREE.Vector4(0.0, 0.03, 0.1, 0.0)},
                    tex: {type: "t", value: wallTexture},
                    shade : {type: "b", value: true},
                    showOutline : {type: "b", value: false}
                };

                let tempUniformsCorridor = {
                    LightPosition: {type: "v4", value: new THREE.Vector4(lampLights[i].position.x, 3, lampLights[i].position.z, 1.0)},
                    inputColor: {type: "v4", value: new THREE.Vector4(0.0, 0.03, 0.1, 0.0)},
                    tex: {type: "t", value: checkersTexture},
                    shade : {type: "b", value: true},
                    showOutline : {type: "b", value: false}
                };

                roomMaterial.uniforms = tempUniformsRoom;
                corridorMaterial.uniforms = tempUniformsCorridor;
                wallMaterial.uniformse = tempUniformsWall;


                break;
        }

        for(let x = node.startX; x<node.endX; x++){
            for(let z = node.startZ; z<node.endZ; z++){
                let tile = tiles[x][z];

                switch (tile.name){

                    case TileType.Wall:
                    case TileType.RoomWall:
                        tile.material = wallMaterial;
                        break;

                    case TileType.Room:
                    case TileType.Door:
                        tile.material = roomMaterial;
                        break;

                    case TileType.Path:
                        tile.material = corridorMaterial;
                        break;
                }
            }
        }
    }

    switch (currentShading) {
        case shadingState.phong:
            ceil.material = wallMaterials.phong
            break;

        case shadingState.gouraud:
            ceil.material = wallMaterials.gouraud.material;
            break;

        case shadingState.toon:
            ceil.material = wallMaterials.toon.material;
            break;
    }

}


export function initShaders(){
    currentShading = shadingState.phong;
    isShadersInitialized = true;
    changeShading();
    document.addEventListener("keydown", event => {
        if (event.code === 'KeyQ') {
            currentShading = (currentShading + 1) % 3;
            changeShading();
        }
    });
}




/*uniformPVS.tex.value.wrapS = uniformPVS.tex.value.wrapT = THREE.RepeatWrapping;
uniformsToon.tex.value.wrapS = uniformsToon.tex.value.wrapT = THREE.RepeatWrapping;*/



