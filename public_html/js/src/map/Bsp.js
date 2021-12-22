import * as THREE from "../../modules/three.module.js";
import {randomProperty, scene} from "../../globals.js";
import {_Node} from "./_Node.js";

const
    _tileEdge = 8,
    _tileHeight = 1,
    _scaleIncreaseRate = 0.1,
    _chunkSize = 10,  // every leaf will be 8x8 tiles

    _splitType = {
        vertical: 0,
        horizontal: 1

    },

    _materials = {
        black : new THREE.MeshBasicMaterial( { color: 0x000000}),
        red : new THREE.MeshBasicMaterial( { color: 0xff0000}),
        green:  new THREE.MeshBasicMaterial( { color: 0x00ff00}),
        blue:  new THREE.MeshBasicMaterial( { color: 0x0000ff}),
        yellow:  new THREE.MeshBasicMaterial( { color: 0xffff00}),
        purple:  new THREE.MeshBasicMaterial( { color: 0xff00ff}),
        cyan:  new THREE.MeshBasicMaterial( { color: 0x00ffff}),
        white:  new THREE.MeshBasicMaterial( { color: 0xffffff}),
        grey:  new THREE.MeshBasicMaterial( { color: 0x767676})
    };



export class Bsp{

    tiles = [];
    rooms = [];
    tilePositions = [];

    constructor(split) {
        this.isAnimationStopped = true;
        this.split = split;
        this.numberOfTilesOnEdge = _chunkSize * Math.pow(2,split);
        this.root = new _Node(0, this.numberOfTilesOnEdge, 0, this.numberOfTilesOnEdge);
        this.generateAll(); // TODO: will run after get input
    }

    generateAll(){
        this.createGrid();
        this.createBsp(this.root, 0, _splitType.vertical);
        this.traverse(this.root);
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
                root.left = new _Node(root.xStart, root.xEnd, root.zStart, (root.zStart+root.zEnd)/2);        // up
                root.right = new _Node(root.xStart, root.xEnd, (root.zStart+root.zEnd)/2, root.zEnd);     // bottom
                this.createBsp(root.left, callTime+1, _splitType.vertical);
                this.createBsp(root.right, callTime+1, _splitType.vertical);
            }
        }
    }

    traverse(node){

        if (node == null)
            return;

        if(node.isLeaf){
            let randomMaterial = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff });
            for(let x = node.xStart; x < node.xEnd; x++){
                for(let z = node.zStart; z < node.zEnd; z++){
                    if(x===node.xStart || z===node.zStart || x===node.xEnd-1 || z===node.zEnd-1)
                        this.tiles[x][z].material = _materials.white;
                    else
                        this.tiles[x][z].material = _materials.grey;
                }
            }
        }

        this.traverse(node.left);

        this.traverse(node.right);



    }

    createGrid(){
        let geometry = new THREE.BoxGeometry(_tileEdge, _tileHeight, _tileEdge);

        for(let x = 0; x < this.numberOfTilesOnEdge; x++){
            let tilesInAxisZ = [];
            for(let z = 0; z < this.numberOfTilesOnEdge; z++){
                let tile = new THREE.Mesh(geometry, _materials["red"]);
                scene.add(tile);

                let tilePosition = {
                    x: x * _tileEdge,
                    z: z * _tileEdge
                }

                tile.position.x = x * _tileEdge;    // TODO : will change to 0 or in circular shape
                tile.position.z = z * _tileEdge;

                let geo = new THREE.EdgesGeometry( tile.geometry );
                let mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 10 } );
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
                if(this.tiles[i][j].material.color.equals(_materials["red"].color)){
                    this.tiles[i][j].scale.y += _scaleIncreaseRate;
                    this.tiles[i][j].position.y += _scaleIncreaseRate/2;
                    if(this.tiles[i][j].position.y>=15)
                        this.isAnimationStopped = true;
                }
            }
        }
    }


}