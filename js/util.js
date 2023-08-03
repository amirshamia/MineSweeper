'use strict'
var gIntervalId = 0


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function reverseFlag() {
    gFlag = !gFlag
    document.querySelector('.flag').classList.toggle('markflag')
}

function begginer() {
    onInit()
    gLevel = {
        SIZE: 4,
        MINES: 2

    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gClick = 0
}
function medium() {
    onInit()
    gLevel = {
        SIZE: 8,
        MINES: 14
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gClick = 0
}

function expert() {
    onInit()
    gLevel = {
        SIZE: 12,
        MINES: 32
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gClick = 0
}

function resetVars() {
    gSafeClick=3
    mineCount = gLevel.MINES
    FlagCount = 0
    gClick = 0
    gLives = 3
    var hints = document.querySelectorAll('.hint')
    for (let i = 0; i < hints.length; i++) {
        console.log(hints[i]);
        hints[i].classList.remove('light')
        hints[i].classList.remove('hide')

    }
    document.querySelector('.exterminate').classList.remove('hide')
    document.querySelector('.safeClick').innerText=gSafeClick
    document.querySelector('.safe').classList.remove('hide')
    document.querySelector('h2 .lives').innerText = gLives
    document.querySelector('.btn').innerText = '😄'
    document.querySelector('.flag').classList.add('hidden')
    gGame.secsPassed = 0
    clearInterval(gIntervalId)
    document.querySelector('.timer').innerText=0
}


function startStopwatch() {
    gIntervalId = setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
    gGame.secsPassed++;
    document.querySelector('.timer').innerText = gGame.secsPassed
}

function switchMode(){
document.querySelector('body').classList.toggle('dark')

}


