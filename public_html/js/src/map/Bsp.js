import * as THREE from "../../modules/three.module.js";
import {materials, randomProperty, scene} from "../../globals.js";
import {_Node} from "./_Node.js";
import {chunkSize, minOffset, RoomType, DoorDirection, TileType, NodeType} from "./mapGlobals.js";
import {GLTFLoader} from "../../modules/GLTFLoader.js";

const
    _tileEdge = 2,
    _tileHeight = 1,


    _splitType = {
        vertical: 0,
        horizontal: 1
    },

    geometry = new THREE.BoxGeometry(_tileEdge, _tileHeight, _tileEdge);

export class Bsp{

    tiles = [];
    tilePositions = [];
    leaveNodes = [];

    constructor(split) {
        this.isAnimationStopped = true;
        this.split = split;
        this.numberOfTilesOnEdge = chunkSize * Math.pow(2,split);
        this.root = new _Node(0, this.numberOfTilesOnEdge, 0, this.numberOfTilesOnEdge, NodeType.Root);
        this.generateAll(); // TODO: will run after get input
    }

    generateAll(){          // TODO: will run after get input
        this.createGrid();
        this.createBsp(this.root, 0, _splitType.vertical);
        this.setPossibleWays(this.root, 0);
        this.createRooms(this.root);
        if (this.split !== 0){
            this.createWays(this.root);
        }
        this.isAnimationStopped = false;
    }


    createGrid(){
        for(let x = 0; x < this.numberOfTilesOnEdge; x++){
            let tilesInAxisZ = [];
            for(let z = 0; z < this.numberOfTilesOnEdge; z++){
                let tile = new THREE.Mesh(geometry, materials.white);
                tile.name = TileType.Wall;
                scene.add(tile);

                let tilePosition = {
                    x: x * _tileEdge,
                    z: z * _tileEdge,
                    y: 0
                }

                // delete function below
                //debugTile(tile);

                this.tilePositions.push(tilePosition);
                tilesInAxisZ.push(tile);
            }
            this.tiles.push(tilesInAxisZ);
        }
    }

    createBsp(node, callTime, splitType){
        if (this.split> callTime) {
            if(splitType === _splitType.vertical){
                node.left = new _Node(node.startX, (node.startX+node.endX)/2, node.startZ, node.endZ, NodeType.Left);
                node.right = new _Node((node.startX+node.endX)/2, node.endX, node.startZ, node.endZ, NodeType.Right);
                this.createBsp(node.left, callTime, _splitType.horizontal);
                this.createBsp(node.right, callTime, _splitType.horizontal);
            }
            else{
                let up = node.nodeType  === NodeType.Left ? NodeType.UpLeft : NodeType.UpRight;
                let down = node.nodeType  === NodeType.Left ? NodeType.DownLeft : NodeType.DownRight;
                node.left = new _Node(node.startX, node.endX, node.startZ, (node.startZ+node.endZ)/2, up);      // up
                node.right = new _Node(node.startX, node.endX, (node.startZ+node.endZ)/2, node.endZ, down);    // bottom
                this.createBsp(node.left, callTime+1, _splitType.vertical);
                this.createBsp(node.right, callTime+1, _splitType.vertical);
            }
        }
    }


    setPossibleWays(node, height){

        if (node == null)
            return;

        if(node.isLeaf()){
            for(let x = node.startX; x < node.endX; x++){
                for(let z = node.startZ; z < node.endZ; z++){

                  this.tiles[x][z].position.x = (node.startX+node.endX) / 2 * _tileEdge ;
                    this.tiles[x][z].position.z = (node.startZ+node.endZ) / 2 * _tileEdge ;
                    this.tiles[x][z].position.y = -40;

                    if(x<node.startX+minOffset || z<node.startZ+minOffset || x>node.endX-(1+minOffset) || z>node.endZ-(1+minOffset)){
                        this.tiles[x][z].material = materials.white;
                        this.tiles[x][z].name = TileType.PossiblePath;
                    }

                    else{
                        this.tiles[x][z].material = materials.grey;
                        this.tiles[x][z].name = TileType.Wall;
                    }
                }
            }
            this.leaveNodes.push(node);
            node.id = this.leaveNodes.length;
        }

        node.height = height++;

        this.setPossibleWays(node.left, height);
        this.setPossibleWays(node.right, height);
    }

    createRooms(node){
        if (node == null)
            return;

        // get values below as input
        let offsetX = 0;
        let offsetZ = 0;
        let roomType = randomProperty(RoomType);
        /*let doorDirection = DoorDirection.Right*/
        let doorDirection = randomProperty(DoorDirection);

        if(node.isLeaf()){
            node.setRoom(offsetX,offsetZ, roomType, doorDirection);
            let room = node.room;

            for(let x = room.startX; x < room.endX; x++){
                for(let z = room.startZ; z < room.endZ; z++) {

                    if (x === room.startX ||x === room.endX-1 || z === room.startZ ||z === room.endZ-1){
                        this.tiles[x][z].material = materials.grey;
                        this.tiles[x][z].name = TileType.RoomWall;
                    }

                    else{
                        this.tiles[x][z].material = roomType.material;
                        this.tiles[x][z].name = TileType.Room;
                    }
                }
            }

            let doorTile = this.tiles[room.doorPosX][room.doorPosY];
            doorTile.material = roomType.material;
            doorTile.name = TileType.Door;
        }

        this.createRooms(node.left);

        this.createRooms(node.right);
    }



    createWays(node){
        if (node === null)
            return;

        this.createWays(node.left);
        this.createWays(node.right);

        let isNodeOnRight = node.nodeType === NodeType.UpRight || node.nodeType === NodeType.DownRight || node.nodeType === NodeType.Right;
        let isNodeOnBottom = node.nodeType === NodeType.DownLeft || node.nodeType === NodeType.DownRight;

        let currentPathX = Math.floor((node.endX+node.startX)/2);
        let currentPathZ = Math.floor((node.endZ+node.startZ)/2);

        if(node.isLeaf()){
            let currentPathX = node.room.doorPosX;
            let currentPathZ = node.room.doorPosY;

            switch (node.room.doorDirection){
                case DoorDirection.Up:
                    currentPathZ-=1
                    break;
                case DoorDirection.Down:
                    currentPathZ+=1;
                    break;
                case DoorDirection.Right:
                    currentPathX+=1;
                    break;
                case DoorDirection.Left:
                    currentPathX-=1;
                    break;
            }

            let numberOfStepX = isNodeOnRight ? node.startX - currentPathX : node.endX - currentPathX - 1;
            let numberOfStepZ = isNodeOnBottom ? node.startZ - currentPathZ  : node.endZ - currentPathZ - 1;

            let firstGoZ =  (node.room.doorDirection === DoorDirection.Up && isNodeOnBottom)    ||
                            (node.room.doorDirection === DoorDirection.Down && !isNodeOnBottom) ||
                            (node.room.doorDirection === DoorDirection.Left && !isNodeOnRight)  ||
                            (node.room.doorDirection === DoorDirection.Right && isNodeOnRight);

            if(firstGoZ){
                currentPathZ = this.setPathUp(currentPathX, currentPathZ, numberOfStepZ);
                this.setPathRight(currentPathX, currentPathZ, numberOfStepX);
            }
            else{
                currentPathX = this.setPathRight(currentPathX, currentPathZ, numberOfStepX);
                this.setPathUp(currentPathX, currentPathZ, numberOfStepZ);
            }
        }

        else if(node.right.isLeaf() || node.right.right.isLeaf()){
            node.isConnected = true;
        }

        else if (!node.isSquare()){
            let step = Math.floor((node.endZ-node.startZ)/4);
            this.setPathUp(currentPathX, currentPathZ, step);
            this.setPathUp(currentPathX, currentPathZ, -step);
            this.setPathUp(currentPathX-1, currentPathZ, step);
            this.setPathUp(currentPathX-1, currentPathZ, -step);
        }

        else if (node.isSquare()){
            let step = Math.floor((node.endX-node.startX)/4);
            this.setPathRight(currentPathX, currentPathZ, step);
            this.setPathRight(currentPathX, currentPathZ, -step);
            this.setPathRight(currentPathX, currentPathZ-1, step);
            this.setPathRight(currentPathX, currentPathZ-1, -step);
        }
    }

    // |pathStartX|pathStartX+1|....|numberOfStep| --> set all tiles as path
    // if minus go left
    setPathRight(pathStartX, pathStartZ, numberOfStep){
        let lastX;
        if(numberOfStep<0){
            for(let x = 0; x >= numberOfStep; x--){
                /*this.tiles[pathStartX+x][pathStartZ].material = materials.cyan;*/
                this.tiles[pathStartX+x][pathStartZ].name = TileType.Path;
                lastX = pathStartX+x;
            }
        }
        else{
            for(let x = 0; x <= numberOfStep; x++){
                /*this.tiles[pathStartX+x][pathStartZ].material = materials.cyan;*/
                this.tiles[pathStartX+x][pathStartZ].name = TileType.Path;
                lastX = pathStartX+x;
            }
        }
        return lastX;
    }

    setPathUp(pathStartX, pathStartZ, numberOfStep){
        let lastZ;
        if(numberOfStep<0){
            for(let z = 0; z >= numberOfStep; z--){
                /*this.tiles[pathStartX][pathStartZ+z].material = materials.cyan;*/
                this.tiles[pathStartX][pathStartZ+z].name = TileType.Path;
                lastZ = pathStartZ+z;
            }
        }
        else{
            for(let z = 0; z <= numberOfStep; z++){
                /*this.tiles[pathStartX][pathStartZ+z].material = materials.cyan;*/
                this.tiles[pathStartX][pathStartZ+z].name = TileType.Path;
                lastZ = pathStartZ+z;
            }
        }
        return lastZ;
    }
}

// debugTiles, delete after all
function debugTile(tile){
    let geo = new THREE.EdgesGeometry( tile.geometry );
    let mat = new THREE.LineBasicMaterial( { color: 0x000000} );
    let wireframe = new THREE.LineSegments( geo, mat );
    wireframe.renderOrder = 1;
    wireframe.position.y += 0.01;
    tile.add( wireframe );
}
