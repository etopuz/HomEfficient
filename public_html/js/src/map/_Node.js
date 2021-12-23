import {clamp} from "../../globals.js";
import {chunkSize, minOffset} from "./mapGlobals.js";
import {Room} from "./Room.js";

export class _Node{
    room;

    constructor(xStart, xEnd, zStart, zEnd) {
        this.isConnected = false;
        this.xStart = xStart;
        this.xEnd = xEnd;
        this.zStart = zStart;
        this.zEnd = zEnd;
        this.left = null;
        this.right = null;
    }

    setRoom(offsetX, offSetY, roomType, doorPosition){
        let x = clamp(this.xStart + offsetX, this.xStart, this.xEnd -(minOffset * 2 + roomType.size));
        let z = clamp(this.zStart + offsetX, this.zStart, this.zEnd -(minOffset * 2 + roomType.size));
        this.room = new Room(x+ minOffset, z+ minOffset, roomType, doorPosition);
    }

    isLeaf() {
       return this.right === null || this.left === null;
    }
}