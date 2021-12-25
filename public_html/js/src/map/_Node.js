import {clamp} from "../../globals.js";
import {chunkSize, minOffset} from "./mapGlobals.js";
import {Room} from "./Room.js";

export class _Node{

    constructor(startX, endX, startZ, endZ, nodeType) {
        this.startX = startX;
        this.endX = endX;
        this.startZ = startZ;
        this.endZ = endZ;
        this.left = null;
        this.right = null;
        this.isConnected = false;
        this.nodeType = nodeType;
    }

    setRoom(offsetX, offSetY, roomType, doorPosition){
        let x = clamp(this.startX + offsetX, this.startX, this.endX - (minOffset * 2 + roomType.size));
        let z = clamp(this.startZ + offsetX, this.startZ, this.endZ - (minOffset * 2 + roomType.size));
        this.room = new Room(x+ minOffset, z+ minOffset, roomType, doorPosition);
    }

    isLeaf() {
       return this.right === null || this.left === null;
    }

    isSquare() {
        return (this.startX - this.endX === this.startZ - this.endZ);
    }
}