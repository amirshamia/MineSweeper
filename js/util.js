'use strict'
var gIntervalId = 0


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function reverseFlag() {
    gFlag = !gFlag
    document.querySelector('.flag').classList.toggle('mark')
}

function begginer() {
    gLevel = {
        SIZE: 4,
        MINES: 2

    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gCount = 0
}
function medium() {
    gLevel = {
        SIZE: 8,
        MINES: 14
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gCount = 0
}

function expert() {
    gLevel = {
        SIZE: 12,
        MINES: 32
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gCount = 0
}

function resetVars() {
    var hints = document.querySelectorAll('.hint')
    for (let i = 0; i < hints.length; i++) {
        console.log(hints[i]);
        hints[i].classList.remove('light')
        hints[i].classList.remove('hide')

    }
    document.querySelector('h2 .lives').innerText = gLives
    document.querySelector('.btn').innerText = '😄'
    document.querySelector('.flag').classList.add('hidden')
    gGame.secsPassed = 0
    clearInterval(gIntervalId)
}


function startStopwatch() {
    gIntervalId = setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
    gGame.secsPassed++;
    document.querySelector('.timer').innerText = gGame.secsPassed
}

