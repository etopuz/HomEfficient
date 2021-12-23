import * as THREE from "../../modules/three.module.js";
import {materials, randomProperty, scene} from "../../globals.js";
import {_Node} from "./_Node.js";
import {chunkSize, minOffset, RoomType, DoorDirection, TileType} from "./mapGlobals.js";

const
    _tileEdge = 8,
    _tileHeight = 1,
    _scaleIncreaseRate = 0.1,

    _splitType = {
        vertical: 0,
        horizontal: 1
    };

export class Bsp{

    tiles = [];
    tilePositions = [];
    leaveNodes = [];


    constructor(split) {
        this.isAnimationStopped = true;
        this.split = split;
        this.numberOfTilesOnEdge = chunkSize * Math.pow(2,split);
        this.root = new _Node(0, this.numberOfTilesOnEdge, 0, this.numberOfTilesOnEdge);
        this.generateAll(); // TODO: will run after get input
    }

    generateAll(){
        this.createGrid();
        this.createBsp(this.root, 0, _splitType.vertical);
        this.setPossibleWays(this.root);
        this.createRooms(this.root);
        this.isAnimationStopped = false;
    }

    createBsp(root, callTime, splitType){
        if (this.split> callTime) {
            if(splitType === _splitType.vertical){
                root.left = new _Node(root.xStart, (root.xStart+root.xEnd)/2, root.zStart, root.zEnd);
                root.right = new _Node((root.xStart+root.xEnd)/2, root.xEnd, root.zStart, root.zEnd);
                this.createBsp(root.left, callTime, _splitType.horizontal);
                this.createBsp(root.right, callTime, _splitType.horizontal);
            }

            else{
                root.left = new _Node(root.xStart, root.xEnd, root.zStart, (root.zStart+root.zEnd)/2);      // up
                root.right = new _Node(root.xStart, root.xEnd, (root.zStart+root.zEnd)/2, root.zEnd);       // bottom
                this.createBsp(root.left, callTime+1, _splitType.vertical);
                this.createBsp(root.right, callTime+1, _splitType.vertical);
            }
        }
    }

    setPossibleWays(node){

        if (node == null)
            return;

        if(node.isLeaf()){
            console.log(node);
            for(let x = node.xStart; x < node.xEnd; x++){
                for(let z = node.zStart; z < node.zEnd; z++){
                    if(x<node.xStart+minOffset || z<node.zStart+minOffset || x>node.xEnd-(1+minOffset) || z>node.zEnd-(1+minOffset))
                        this.tiles[x][z].material = materials.white;
                    else{
                        this.tiles[x][z].material = materials.grey;
                    }

                }
            }
            this.leaveNodes.push(node);
        }

        this.setPossibleWays(node.left);

        this.setPossibleWays(node.right);



    }

    createGrid(){
        let geometry = new THREE.BoxGeometry(_tileEdge, _tileHeight, _tileEdge);

        for(let x = 0; x < this.numberOfTilesOnEdge; x++){
            let tilesInAxisZ = [];
            for(let z = 0; z < this.numberOfTilesOnEdge; z++){
                let tile = new THREE.Mesh(geometry, materials.white);
                scene.add(tile);

                let tilePosition = {
                    x: x * _tileEdge,
                    z: z * _tileEdge
                }

                tile.position.x = x * _tileEdge;    // TODO : will change to 0 or in circular shape
                tile.position.z = z * _tileEdge;

                let geo = new THREE.EdgesGeometry( tile.geometry );
                let mat = new THREE.LineBasicMaterial( { color: 0x000000} );
                let wireframe = new THREE.LineSegments( geo, mat );
                wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
                wireframe.position.y += 0.01; // make sure wireframes are rendered 2nd
                tile.add( wireframe );

                this.tilePositions.push(tilePosition);
                tilesInAxisZ.push(tile);
            }
            this.tiles.push(tilesInAxisZ);
        }
    }

    bspAnim(){
        for(let i = 0; i<this.tiles.length;i++){    // TODO: animation
            let innerLength = this.tiles[i].length;
            for(let j = 0; j<innerLength; j++){
                if(this.tiles[i][j].material.color.equals(materials["black"].color)){
                    this.tiles[i][j].scale.y += _scaleIncreaseRate;
                    this.tiles[i][j].position.y += _scaleIncreaseRate/2;
                    if(this.tiles[i][j].position.y>=15)
                        this.isAnimationStopped = true;
                }
            }
        }
    }


    createRooms(node){
        if (node == null)
            return;

        let offsetX = 0;
        let offsetZ = 0;
        let roomType = RoomType.LivingRoom;
        let doorDirection = DoorDirection.Left;

        if(node.isLeaf()){
            node.setRoom(offsetX,offsetZ, roomType, doorDirection);
            let room = node.room;
            for(let x = room.xStart; x < room.xEnd; x++){
                for(let z = room.zStart; z < room.zEnd; z++) {
                    if (x === room.xStart ||x === room.xEnd-1 || z === room.zStart ||z === room.zEnd-1){
                        this.tiles[x][z].material = materials.black;
                        this.tiles[x][z].name = TileType.Wall;
                    }
                    else{
                        this.tiles[x][z].material = roomType.material;
                        this.tiles[x][z].name = TileType.Room;
                    }
                }
            }

            let doorTile1, doorTile2;

            switch (doorDirection){
                case DoorDirection.Up:
                    doorTile1 = this.tiles[room.xStart+1][room.zStart];
                    doorTile2 = this.tiles[room.xStart+2][room.zStart];
                    break;
                case DoorDirection.Left:
                    doorTile1 = this.tiles[room.xStart][room.zEnd-2];
                    doorTile2 = this.tiles[room.xStart][room.zEnd-3];
                    break;
                case DoorDirection.Down:
                    doorTile1 = this.tiles[room.xEnd-3][room.zEnd-1]
                    doorTile2 = this.tiles[room.xEnd-2][room.zEnd-1]
                    break;
                case DoorDirection.Right:
                    doorTile1 = this.tiles[room.xEnd-2][room.zStart]
                    doorTile2 = this.tiles[room.xEnd-3][room.zStart]
                    break;
            }
            doorTile1.material = roomType.material;
            doorTile2.material = roomType.material;
            doorTile1.name = TileType.Door;
            doorTile2.name = TileType.Door;

        }

        this.createRooms(node.left);

        this.createRooms(node.right);
    }

/*
    createWays(){

    }
*/


}