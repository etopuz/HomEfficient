import {materials} from "../../globals.js";

export const

    chunkSize = 14,  // every leaf will be 12x12 tiles
    minOffset = 2,

    DoorDirection = {
        Up: "Up",
        Down: "Down",
        Left: "Left",
        Right: "Right"
    },

    TileType = {
        Wall: "Wall",
        Door: "Door",
        Room: "Room",
        Corridor: "Corridor"
    },

    RoomType = {
        Bathroom : {
            size : 6,
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