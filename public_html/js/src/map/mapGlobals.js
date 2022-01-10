import {materials} from "../../globals.js";

export const

    chunkSize = 14,  // every leaf will be 12x12 tiles
    minOffset = 2,

    NodeType = {
        Root: "Root",
        Left: "Left",
        Right: "Right",
        UpLeft: "UpLeft",
        UpRight: "UpRight",
        DownLeft: "DownLeft",
        DownRight: "DownRight"
    },

    DoorDirection = {
        Up: "Up",
        Down: "Down",
        Left: "Left",
        Right: "Right"
    },

    TileType = {
        Wall: "Wall",
        RoomWall: "RoomWall",
        Room: "Room",
        Door: "Door",
        PossiblePath: "PossiblePath",
        Path: "Path",
    },

    RoomType = {
        Bathroom : {
            size : 5,
            material : materials.blue
        },

        LivingRoom : {
            size : 9,
            material : materials.green
        },

        Kitchen: {
            size : 7,
            material : materials.yellow
        },

        Bedroom: {
            size : 7,
            material : materials.red
        },
    };
