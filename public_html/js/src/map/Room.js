import {RoomType, DoorDirection} from "./mapGlobals.js";

export class Room{
    constructor(xStart, zStart, roomType, doorDirection) {
        this.roomType = roomType;
        this.xStart = xStart;
        this.zStart = zStart;
        this.xEnd = xStart + roomType.size;
        this.zEnd = zStart + roomType.size;
        this.doorDirection = doorDirection;
    }
}