import {clamp, materials, scene} from "../../globals.js";
import {minOffset, TileType} from "./mapGlobals.js";
import {_Node} from "./_Node.js";


const
    _scaleIncreaseRate = 0.1,
    _radius = 0.01;

let _totalDelayedAnimation = 0,
    _delayTime = 500;

export let isAnimationStopped = false;

export function animationController(bsp, delay, isAnimationStopped){
        _delayTime = clamp(delay, 10, 1500); // clamp between 100, 1500
        breadthFirst(bsp, bspCreationAnim);
        breadthFirst(bsp, createRoomsAnim);
        breadthFirst(bsp, removePossiblePathsAnim);
        breadthFirst(bsp, createPathsAnim);
        removeWalls(bsp);
        breadthFirst(bsp, createWallsAnim);
        set();
}


function set(){
    _totalDelayedAnimation+=7;
    sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
        isAnimationStopped = true;
    });
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
                        let targetPos = Object.assign({},  bsp.tilePositions[middleX * bsp.tiles[x].length + middleZ]);
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
        _totalDelayedAnimation+=2.0;
        sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
            let tweenDelay = bsp.numberOfTilesOnEdge / Math.max(current.endX-current.startX, current.endZ-current.startZ);
            for(let x = current.startX; x < current.endX; x++){
                for(let z = current.startZ; z < current.endZ; z++){
                    let tile = bsp.tiles[x][z];
                    if (tile.name === TileType.Wall || tile.name === TileType.RoomWall){
                        let targetPos = Object.assign({}, bsp.tilePositions[x * bsp.tiles[x].length + z]);
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

function removeWalls(bsp) {
    _totalDelayedAnimation++;
    sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
        let tiles = bsp.tiles;
        for(let x = 0; x < bsp.numberOfTilesOnEdge; x++){
            for(let z = 0; z < bsp.numberOfTilesOnEdge; z++){
                let tile =  tiles[x][z];

                let isUnnecessaryWall;

                if (x===0){
                    isUnnecessaryWall =
                        (tile.name === TileType.Wall) &&
                        (tiles[x+1][z].name === TileType.RoomWall || tiles[x+1][z].name === TileType.Wall );
                }
                else if (x === bsp.numberOfTilesOnEdge-1){
                    isUnnecessaryWall =
                        (tile.name === TileType.Wall) &&
                        (tiles[x-1][z].name === TileType.RoomWall || tiles[x-1][z].name === TileType.Wall );
                }

                else if (z===0){
                    isUnnecessaryWall =
                        (tile.name === TileType.Wall) &&
                        (tiles[x][z].name === TileType.RoomWall || tiles[x][z+1].name === TileType.Wall );
                }
                else if (z === bsp.numberOfTilesOnEdge-1){
                    isUnnecessaryWall =
                        (tile.name === TileType.Wall) &&
                        (tiles[x][z].name === TileType.RoomWall || tiles[x][z-1].name === TileType.Wall );
                }

                else {
                    isUnnecessaryWall =
                        (tile.name === TileType.Wall) &&
                        (tiles[x-1][z].name === TileType.RoomWall || tiles[x-1][z].name === TileType.Wall ) &&
                        (tiles[x+1][z].name === TileType.RoomWall || tiles[x+1][z].name === TileType.Wall ) &&
                        (tiles[x][z-1].name === TileType.RoomWall || tiles[x][z-1].name === TileType.Wall ) &&
                        (tiles[x][z+1].name === TileType.RoomWall || tiles[x][z+1].name === TileType.Wall );
                }


                if(isUnnecessaryWall)
                    scene.remove(tiles[x][z]);
            }
        }
    });
}


/*function removeWalls(bsp) {
    _totalDelayedAnimation++;
    sleep(_delayTime * _totalDelayedAnimation * 1.2).then(r => {
        let tiles = bsp.tiles;
        for(let x = 1; x < bsp.numberOfTilesOnEdge-1; x++){
            for(let z = 1; z < bsp.numberOfTilesOnEdge-1; z++){
                let tile =  tiles[x][z];

                let isUnnecessaryWall =
                    (tile.name === TileType.Wall) &&
                    (tiles[x-1][z].name === TileType.PossiblePath || tiles[x-1][z].name === TileType.RoomWall || tiles[x-1][z].name === TileType.Wall ) &&
                    (tiles[x+1][z].name === TileType.PossiblePath || tiles[x+1][z].name === TileType.RoomWall || tiles[x+1][z].name === TileType.Wall ) &&
                    (tiles[x][z-1].name === TileType.PossiblePath || tiles[x][z-1].name === TileType.RoomWall || tiles[x][z-1].name === TileType.Wall ) &&
                    (tiles[x][z+1].name === TileType.PossiblePath ||tiles[x][z+1].name === TileType.RoomWall || tiles[x][z+1].name === TileType.Wall );

                if(isUnnecessaryWall){
                    scene.remove(tiles[x][z]);
                }
            }
        }
    });
}*/




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
