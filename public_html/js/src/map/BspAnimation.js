import {clamp, materials, scene} from "../../globals.js";
import {minOffset, TileType} from "./mapGlobals.js";
import {_Node} from "./_Node.js";


const
    _scaleIncreaseRate = 0.1,
    _radius = 0.01;

let _totalDelayedAnimation = 0,
    _delayTime = 500;

export function animationController(bsp, delay){
        _delayTime = clamp(delay, 100, 1500); // clamp between 100, 1500
        breadthFirst(bsp, bspCreationAnim);
        breadthFirst(bsp, createRoomsAnim);
        breadthFirst(bsp, removePossiblePathsAnim);
        breadthFirst(bsp, createPathsAnim);
        breadthFirst(bsp, createWallsAnim);
        deleteUnnecessaryWalls(bsp)
}



function breadthFirst(bsp, call){
    let queue = [];

    queue.push(bsp.root);

    while(queue.length !== 0) {

        let current = queue.shift();

        if (current.left !== null)
            queue.push(current.left);

        if (current.right !== null)
            queue.push(current.right);

        call(current, bsp);
    }
}


function bspCreationAnim(current, bsp){
    _totalDelayedAnimation++;
    sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
        let tweenDelay = bsp.numberOfTilesOnEdge / Math.max(current.endX-current.startX, current.endZ-current.startZ)
        for(let x = current.startX; x < current.endX; x++){
            for(let z = current.startZ; z < current.endZ; z++){
                if(x<current.startX+minOffset || z<current.startZ+minOffset || x>current.endX-(1+minOffset) || z>current.endZ-(1+minOffset)){
                    let tile = bsp.tiles[x][z];
                    let targetPos = bsp.tilePositions[x * bsp.tiles[x].length + z];
                    let tween = goToPosition(tile, targetPos, 10 * tweenDelay);
                    tween.start();
                }
            }
        }
    });
}

function createRoomsAnim(current, bsp) {
    if(current.isLeaf()){
        _totalDelayedAnimation += 1.5;
        sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
            let tweenDelay = bsp.numberOfTilesOnEdge / (current.room.endX - current.room.startX);
            for(let x = current.startX; x < current.endX; x++){
                for(let z = current.startZ; z < current.endZ; z++){
                    let tile = bsp.tiles[x][z];
                    if (tile.name === TileType.Room || tile.name === TileType.RoomWall || tile.name === TileType.Door){
                        let targetPos = bsp.tilePositions[x * bsp.tiles[x].length + z];
                        let tween = goToPosition(tile, targetPos, 13 * tweenDelay);
                        tween.start();
                    }
                }
            }
        });
    }
}

function removePossiblePathsAnim(current, bsp) {
    if(current.isLeaf()){
        _totalDelayedAnimation++;
        sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
            let middleX = (current.endX + current.startX)/2;
            let middleZ = (current.endZ + current.startZ)/2;
            let tweenDelay = bsp.numberOfTilesOnEdge / Math.max(current.endX-current.startX, current.endZ-current.startZ);
            for(let x = current.startX; x < current.endX; x++){
                for(let z = current.startZ; z < current.endZ; z++){
                    let tile = bsp.tiles[x][z];
                    if (tile.name === TileType.Path || tile.name === TileType.PossiblePath){
                        let targetPos = bsp.tilePositions[middleX * bsp.tiles[x].length + middleZ];
                        targetPos.y = -40;
                        let tween = goToPosition(tile, targetPos, 20 * tweenDelay);
                        tween.start();
                    }
                }
            }
        });
    }
}

function createPathsAnim(current, bsp){
    if(current.isLeaf()){
        _totalDelayedAnimation++;
        sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
            let tweenDelay = bsp.numberOfTilesOnEdge / Math.max(current.endX-current.startX, current.endZ-current.startZ);
            for(let x = current.startX; x < current.endX; x++){
                for(let z = current.startZ; z < current.endZ; z++){
                    let tile = bsp.tiles[x][z];

                    if (tile.name === TileType.Path){
                        tile.material = materials.cyan;
                        let targetPos = bsp.tilePositions[x * bsp.tiles[x].length + z];
                        let tween = goToPosition(tile, targetPos, 20 * tweenDelay);
                        tween.start();
                    }

                    else if(tile.name === TileType.PossiblePath){
                        tile.name = TileType.Wall;
                        tile.material = materials.grey;
                    }
                }
            }
        });
    }
}

function createWallsAnim(current, bsp) {
    if(current.isLeaf()){
        _totalDelayedAnimation+=1.8;
        sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
            let tweenDelay = bsp.numberOfTilesOnEdge / Math.max(current.endX-current.startX, current.endZ-current.startZ);
            for(let x = current.startX; x < current.endX; x++){
                for(let z = current.startZ; z < current.endZ; z++){
                    let tile = bsp.tiles[x][z];
                    if (tile.name === TileType.Wall || tile.name === TileType.RoomWall){
                        let targetPos = bsp.tilePositions[x * bsp.tiles[x].length + z];
                        targetPos.y += 1.8;
                        let tween = goToPosition(tile, targetPos, 20 * tweenDelay);
                        let tweenS = goToScale(tile, 3.6, 20 * tweenDelay);
                        tween.start();
                        tweenS.start();
                    }
                }
            }
        });
    }
}


function deleteUnnecessaryWalls(bsp){
    _totalDelayedAnimation++;
    sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
        let tiles = bsp.tiles;

        for(let x = 1; x < bsp.numberOfTilesOnEdge-1; x++){
            for(let z = 1; z < bsp.numberOfTilesOnEdge-1; z++){
                let tile =  tiles[x][z];

                if(tile.position.y < 0){
                    tile.position.y = bsp.tilePositions[x * bsp.tiles[x].length + z];
                    tile.scale.y = 3.6;
                }

                let isUnnecessaryWall =
                    (tile.name === TileType.Wall) &&
                    (tiles[x-1][z].name === undefined || tiles[x-1][z].name === TileType.RoomWall || tiles[x-1][z].name === TileType.Wall ) &&
                    (tiles[x+1][z].name === undefined || tiles[x+1][z].name === TileType.RoomWall || tiles[x+1][z].name === TileType.Wall ) &&
                    (tiles[x][z-1].name === undefined || tiles[x][z-1].name === TileType.RoomWall || tiles[x][z-1].name === TileType.Wall ) &&
                    (tiles[x][z+1].name === undefined ||tiles[x][z+1].name === TileType.RoomWall || tiles[x][z+1].name === TileType.Wall );

                if(isUnnecessaryWall){
                    scene.remove(tiles[x][z]);
                }
            }
        }
    });
}




// helpers
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function goToPosition(tile, targetPos, delay){
    let tweenDelay = _delayTime * delay / Math.sqrt(clamp(Math.pow(tile.position.x-targetPos.x, 2) + Math.pow(tile.position.z-targetPos.z, 2), 100, 5000));
    return new TWEEN.Tween(tile.position).to(targetPos, tweenDelay).easing(TWEEN.Easing.Back.Out);
}

function goToScale(tile, targetScale, delay){
    let tweenDelay = _delayTime * delay / 100;
    return new TWEEN.Tween(tile.scale).to({y:targetScale}, tweenDelay).easing(TWEEN.Easing.Back.Out);
}


// i hate zombie codes -_- but maybe (?) i need them


/*export function bspAnim(bsp){
    for(let i = 0; i<bsp.leaveNodes.length;i++){
        let node = bsp.leaveNodes[i];
        sleep(_delayTime*i).then(r => {
            for(let x = node.startX; x < node.endX;x++){
                for(let z = node.startZ; z < node.endZ;z++){
                    let tile = bsp.tiles[x][z];
                    let targetPos = bsp.tilePositions[x * bsp.tiles[x].length + z];
                    goToPosition(tile, targetPos, 10);
                }
            }
        });
    }
}*/



/*function bspCreationAnim(node, bsp){

    if (node === null)
        return;

    sleep(_delayTime * _totalDelayedAnimation / 1.7).then(r => {
        let numberOfTiles = 0;
        for(let x = node.startX; x < node.endX; x++){
            for(let z = node.startZ; z < node.endZ; z++){
                if(x<node.startX+minOffset || z<node.startZ+minOffset || x>node.endX-(1+minOffset) || z>node.endZ-(1+minOffset)){
                    numberOfTiles++;
                    let tile = bsp.tiles[x][z];
                    let targetPos = bsp.tilePositions[x * bsp.tiles[x].length + z];
                    goToPosition(tile, targetPos, 5);
                }
            }
        }
    });
    _totalDelayedAnimation++;
    bspCreationAnim(node.left, bsp);
    bspCreationAnim(node.right, bsp);
}*/


/*let tile = bsp.tiles[x][z];
let targetPos = bsp.tilePositions[x * bsp.tiles[x].length + z]
let delayTime = _delayTime * 10 / Math.sqrt(clamp(Math.pow(tile.position.x-targetPos.x, 2) + Math.pow(tile.position.z-targetPos.z, 2), 100, 500));
let tween = new TWEEN.Tween(tile.position);
tween.to(targetPos, delayTime);
tween.start();*/

/*
    while (bsp.tiles[x][z].position.x !== bsp.tilePositions)
    bsp.tiles[x][z].position.y += _scaleIncreaseRate/2;
    bsp.tiles[x][z].position.x += Math.sin(x*z)*x*_radius;
    bsp.tiles[x][z].position.z += Math.cos(x*z)*z*_radius;
*/