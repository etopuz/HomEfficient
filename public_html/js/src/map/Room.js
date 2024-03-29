import {RoomType, DoorDirection, TileType} from "./mapGlobals.js";

export class Room{
    constructor(startX, startZ, roomType, doorDirection) {
        this.roomType = roomType;
        this.startX = startX;
        this.startZ = startZ;
        this.endX = startX + roomType.size;
        this.endZ = startZ + roomType.size;
        this.doorDirection = doorDirection;
        this.setDoorPos();
    }

    setDoorPos(){
        switch (this.doorDirection){
            case DoorDirection.Up:
                this.doorPosX = this.startX+1;
                this.doorPosZ = this.startZ;
                break;

            case DoorDirection.Left:
                this.doorPosX = this.startX;
                this.doorPosZ = this.endZ-2;

                break;
            case DoorDirection.Down:
                this.doorPosX = this.endX-2;
                this.doorPosZ = this.endZ-1;
                break;

            case DoorDirection.Right:
                this.doorPosX = this.endX-1;
                this.doorPosZ = this.startZ+1;
                break;
        }
    }


}

