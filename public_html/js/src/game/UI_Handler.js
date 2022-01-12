import {DoorDirection, RoomType} from "../map/mapGlobals.js";

let areControlsOpened = false;
export let isGameStarted = false;
export let isGamePaused = false;
export let isGameEnd = false;

export let split;

const roomChooser = {
    0: RoomType.LivingRoom,
    1: RoomType.Kitchen,
    2: RoomType.Bathroom,
    3: RoomType.Bedroom
}

const doorDirectionChooser = {
    0: DoorDirection.Left,
    1: DoorDirection.Right,
    2: DoorDirection.Up,
    3: DoorDirection.Down,
}


const labelPos  = {
    0: [0,0],
    1: [0,1],
    4: [0,2],
    5: [0,3],
    2: [1,0],
    3: [1,1],
    6: [1,2],
    7: [1,3],
    8: [2,0],
    9: [2,1],
    12: [2,2],
    13: [2,3],
    10: [3,0],
    11: [3,1],
    14: [3,2],
    15: [3,3],
}

export let mapVariables = {
    roomTypesQueue : [],
    doorDirectionsQueue : [],
    offSetXQueue : [],
    offSetZQueue : [],
    setRandom : false,
}

let scoreElement, winScreenElement, controlContext;

let canvas;
let controls = []
let nextGameButton;
let controlsButton;

let resumeButton;
let startButton;
let randomButton;

let easyButton, mediumButton, hardButton;
let roomTypeL, doorPosL, offSetXL, offSetZL;

let roomTypeLabels = [];
let doorPositionLabels = [];
let offSetXLabels = [];
let offSetZLabels = [];

export function winScreen(){
    winScreenElement.hidden = false;

    sleep(1500).then(r =>
    {
        isGameEnd = true;
        canvas.style.display = 'none';
    });


}


export function updateScore(s){
    scoreElement.innerHTML = 'Score: ' + s;
}


export function initUI(){
    canvas = document.getElementById("canvas");

    canvas.style.display = 'none'; // TODO: change it after all

    scoreElement = document.getElementById("Score");
    winScreenElement = document.getElementById("WinScreen");
    controlContext = document.getElementById("controlContext");

    nextGameButton = document.getElementById("nextgame");
    controlsButton = document.getElementById("controls");

    resumeButton = document.getElementById("resume");
    startButton = document.getElementById("start");
    randomButton = document.getElementById("setRandom");

    easyButton = document.getElementById("easy");
    mediumButton = document.getElementById("medium");
    hardButton = document.getElementById("hard");

    roomTypeL = document.getElementById("pickRoomType");
    doorPosL = document.getElementById("pickDoorPosition");
    offSetXL = document.getElementById("offSetX");
    offSetZL = document.getElementById("offSetZ");

    nextGameButton.addEventListener('click', function(e){
        nextGameHandler();
    })

    controlsButton.addEventListener('click', function(e){
        controlsHandler()
    })

    resumeButton.addEventListener('click', function(e){
        isGamePaused = false;
        closeE(resumeButton);
        closeE(controlsButton);
    })

    startButton.addEventListener('click', function(e){
        startHandler();
    })

    randomButton.addEventListener('click', function(e){
        mapVariables.setRandom = true;
    })


    document.addEventListener('keydown', function(e){
        switch ( event.code ) {
            case 'KeyP':
                pauseHandler();
                break;
        }
    });

    easyButton.addEventListener('click', function(e){
        setSplit(0);
    })

    mediumButton.addEventListener('click', function(e){
        setSplit(1);
    })

    hardButton.addEventListener('click', function(e){
        setSplit(2);
    })



}


function pauseHandler(){
    isGamePaused = !isGamePaused;

    if(isGamePaused){
        openE(resumeButton);
    }
    else{
        closeE(resumeButton);
    }

}

function controlsHandler(){
        controlContext.hidden = false;
}


function nextGameHandler(){

    controlContext.hidden = true;

    closeE(nextGameButton);
    closeE(controlsButton);

    openE(easyButton);
    openE(mediumButton);
    openE(hardButton);

    for(let i = 0; i < controls.length; i++){
        closeE(controls[i]);
    }
}


function setSplit(number) {
    split = number;

    closeE(easyButton);
    closeE(mediumButton);
    closeE(hardButton);

    setLabels();
}


function startHandler(){
    closeE(startButton);

    createArraysFromLabels();
    canvas.style.display = 'block';

    closeE(randomButton)
    closeAllLabels();
    isGameStarted = true;
    scoreElement.hidden = false;
}


function setLabels() {
    let t = Math.pow(4, split);

    let cX = 200;
    let cY = 220;

    for (let i = 0; i < t; i++){
        roomTypeLabels.push(cloneObject(roomTypeL)) ;
        doorPositionLabels.push(cloneObject(doorPosL));
        offSetXLabels.push(cloneObject(offSetXL));
        offSetZLabels.push(cloneObject(offSetZL));
    }


    for (let i = 0; i < t; i++){

        roomTypeLabels[i].style.left = labelPos[i][0] * cX + "px";
        roomTypeLabels[i].style.top = labelPos[i][1] * cY + "px";

        doorPositionLabels[i].style.left = labelPos[i][0] * cX  + "px";
        doorPositionLabels[i].style.top = labelPos[i][1] * cY + 45 + "px";

        offSetXLabels[i].style.left = labelPos[i][0] * cX + "px";
        offSetXLabels[i].style.top = labelPos[i][1] * cY  + 90 + "px";

        offSetZLabels[i].style.left = labelPos[i][0] * cX + "px";
        offSetZLabels[i].style.top = labelPos[i][1] * cY + 135 + "px";
    }


    openAllLabels();

    openE(startButton);
    openE(randomButton);
}


function createArraysFromLabels(){
    let t = Math.pow(4, split);
    for (let i = 0; i < t; i++){
        let r = roomTypeLabels[i].querySelectorAll('.select-selected')[0];
        let d = doorPositionLabels[i].querySelectorAll('.select-selected')[0];
        let oX = offSetXLabels[i].querySelectorAll('.select-selected')[0];
        let oY = offSetZLabels[i].querySelectorAll('.select-selected')[0];

        let rVal = r.options[r.options['selectedIndex']].value;
        let dVal = d.options[d.options['selectedIndex']].value;
        let oXVal = oX.options[oX.options['selectedIndex']].value;
        let oYVal = oY.options[oY.options['selectedIndex']].value;

        mapVariables.roomTypesQueue.push(roomChooser[rVal]);
        mapVariables.doorDirectionsQueue.push(doorDirectionChooser[dVal]);
        mapVariables.offSetXQueue.push(oXVal);
        mapVariables.offSetZQueue.push(oYVal);

    }
}


// helpers
function closeE(element){
    element.disabled = true;
    element.hidden = true;
}

function openE(element){
    element.disabled = false;
    element.hidden = false;
}

function cloneObject(elem){
    let cln = elem.cloneNode(true);
    document.body.appendChild(cln);
    return cln;
}

function openAllLabels(){
    let t = Math.pow(4, split);

    for (let i = 0; i < t; i++){
        roomTypeLabels[i].hidden = false;
        doorPositionLabels[i].hidden = false;
        offSetXLabels[i].hidden = false;
        offSetZLabels[i].hidden = false;
    }
}

function closeAllLabels(){
    let t = Math.pow(4, split);

    for (let i = 0; i < t; i++){
        roomTypeLabels[i].hidden = true;
        doorPositionLabels[i].hidden = true;
        offSetXLabels[i].hidden = true;
        offSetZLabels[i].hidden = true;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





