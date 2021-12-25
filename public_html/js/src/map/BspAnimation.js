import {materials} from "../../globals.js";

const
    _scaleIncreaseRate = 0.1,
    _radius = 0.01;

export function bspAnim(bsp){
    for(let i = 0; i<bsp.tiles.length;i++){    // TODO: animation
        let innerLength = bsp.tiles[i].length;
        for(let j = 0; j<innerLength; j++){

/*            while (bsp.tiles[i][j].position.x !== bsp.tilePositions)
            bsp.tiles[i][j].position.y += _scaleIncreaseRate/2;
            bsp.tiles[i][j].position.x += Math.sin(i*j)*i*_radius;
            bsp.tiles[i][j].position.z += Math.cos(i*j)*j*_radius;

            if(bsp.tiles[i][j].position.y>=15)
                bsp.isAnimationStopped = true;*/

        }
    }
}

/*export function bspAnim(bsp){
    for(let i = 0; i<bsp.tiles.length;i++){
        let innerLength = bsp.tiles[i].length;
        for(let j = 0; j<innerLength; j++){
            if(bsp.tiles[i][j].material.color.equals(materials["purple"].color)){
                bsp.tiles[i][j].scale.y += _scaleIncreaseRate;
                bsp.tiles[i][j].position.y += _scaleIncreaseRate/2;
                if(bsp.tiles[i][j].position.y>=15)
                    bsp.isAnimationStopped = true;
            }
        }
    }
}*/


/*    for(let i = 0; i < bsp.leaveNodes.length; i++){
        let node = bsp.leaveNodes[i];
        for(let j = node.startX; j<node.endX;j++){
            for(let k = node.startZ; k<node.endZ;k++){
                if(bsp.tiles[j][k].material === materials.white){
                    scene.remove(bsp.tiles[j][k]);
                }
            }
        }
    }*/