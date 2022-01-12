import {updateScore, winScreen} from "./UI_Handler.js";

let score;
let numberOfRoom;

export function initScore(number){
    score = 0;
    numberOfRoom = number;
}

function checkWin() {
    console.log(score);
    console.log(numberOfRoom);
    if (score === numberOfRoom){
        winScreen();

    }
}

export function increaseScore(){
    score++;
    updateScore(score);
    checkWin();
}
