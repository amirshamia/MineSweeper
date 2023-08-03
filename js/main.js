'use stirct'
// summery:
// first click wont show if i clicked a Number only empty slot
// couldnt save the global data without reseting it every time the code Rane
// couldnt set a right click so i set a flag button
// the exterminate renders a new table so the progress doesnt save
// undo and mega hint are beyond my understanding 


var gBoard = []

const gCell = {
    minesAroundCount: 0,
    isMine: false,
    isMarked: false,
    isChecked: false,
    isShown: false,
    location_i: 0,
    location_j: 0
}
var gLevel = {
    SIZE: 8,
    MINES: 14
}
var gGame = {
    isOn: false,
    shownCount: 0, markedCount: 0, secsPassed: 0
}
const MINE = '💣'
var gClick = 0

var gLives = 3
var gFlag = false
var FlagCount = 0
var mineCount = 0
var gHint = false
var gelHint
var bestScore = Infinity
localStorage.bestScore = bestScore
var gSafeClick = 3



function onInit() {

    resetVars()
    gGame.isOn = true

    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = { ...gCell }

        }
    }
    return board
}

function setMinesNegsCount(board) {
    for (let a = 0; a < board.length; a++) {
        for (let b = 0; b < board.length; b++) {
            var count = 0
            for (var i = a - 1; i <= a + 1; i++) {
                if (i < 0 || i > board.length - 1) continue
                for (var j = b - 1; j <= b + 1; j++) {
                    if (j < 0 || j > gBoard[0].length - 1) continue
                    if (i === a && j === b) continue
                    var curCell = board[i][j]
                    if (curCell.isMine) count++
                }
                board[a][b].minesAroundCount = count
            }
        }
    }
}

function renderBoard(board) {
    var strHTML = ''
    var cell
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].location_i = i
            board[i][j].location_j = j
            if (board[i][j].isMine) {
                cell = MINE
                var className = `bomb hidden cell cell-${i}-${j}`
            }
            else {
                cell = board[i][j].minesAroundCount
                if (cell === 0) cell = ''
                className = `hidden cell cell-${i}-${j}`
            }
            strHTML += `<td id="rightClickElement-${i}-${j}" onclick="onCellClicked(this,${i},${j})" class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
    // console.log(board);
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    gClick++
    if (gClick === 1) {
        startStopwatch()
        for (let x = 0; x < gLevel.MINES; x++) {
            gBoard[getRandomIntInclusive(0, gLevel.SIZE - 1)][getRandomIntInclusive(0, gLevel.SIZE - 1)].isMine = true
            document.querySelector('.flag').classList.remove('hidden')
        }
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
    }
    if (gHint) Hint(i, j, gBoard)
    else {
        if (gFlag) {
            onCellMarked(elCell, i, j)
            return
        }
        else {
            if (gBoard[i][j].isMarked) return
            if (elCell.innerText === '' && gBoard[i][j].minesAroundCount === 0) expandShown(gBoard, i, j)
            if (!gBoard[i][j].isMine) {
                elCell.classList.remove('hidden')
                gBoard[i][j].isShown = true
            }
            else {
                mineCount--
                elCell.style.backgroundColor = 'red'
                elCell.classList.remove('hidden')
                gLives--
                if (gLives === 0) gameOver()
            }
            document.querySelector('h2 .lives').innerText = gLives
        }
    }
}

function onCellMarked(elCell, i, j) {
    if (!gBoard[i][j].isMarked) {
        elCell.classList.remove('hidden')
        elCell.innerText = '🚩'
        gBoard[i][j].isMarked = true
        FlagCount++
    }
    else {
        elCell.classList.add('hidden')
        if (gBoard[i][j].isMine) elCell.innerText = '💣'
        else elCell.innerText = gBoard[i][j].minesAroundCount ? gBoard[i][j].minesAroundCount : ''
        gBoard[i][j].isMarked = false
        FlagCount--
    }
    checkVictory(gBoard)
}
function expandShown(board, rowIdx, colIdx) {
    board[rowIdx][colIdx].isChecked = true
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].minesAroundCount !== 0 && !board[i][j].isMine) {
                gBoard[i][j].isShown = true
                const elCel = document.querySelector(`.cell-${i}-${j}`)
                elCel.classList.remove('hidden')
            }
            else if (!board[i][j].isChecked) expandShown(board, i, j);
            else {
                document.querySelector(`.cell-${rowIdx}-${colIdx}`).classList.add('checked')
                document.querySelector(`.cell-${i}-${j}`).classList.add('checked')
            }
        }
    }

}



function checkVictory(board) {
    var currScore = 0
    var Markcount = 0
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) Markcount++
        }
    }
    if (FlagCount === Markcount && FlagCount === mineCount) {
        document.querySelector('.btn').innerText = '😎'
        gGame.isOn = false
        clearInterval(gIntervalId)
        currScore = gGame.secsPassed
        if (currScore < bestScore) localStorage.bestScore = currScore
        // localStorage.getItem("bestScore")
        document.querySelector('.score').innerText = localStorage.getItem("bestScore");
    }
}


function gameOver() {
    const elBomb = document.querySelectorAll('.bomb')
    for (let i = 0; i < elBomb.length; i++) {
        elBomb[i].classList.remove('hidden')
    }
    clearInterval(gIntervalId)
    document.querySelector('.btn').innerText = '😩'
    gGame.isOn = false
}


function getHint(elHint) {
    gHint = true
    gelHint = elHint
    gelHint.classList.add('light')
}

function Hint(rowIdx, colIdx, board) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue

            const elCel = document.querySelector(`.cell-${i}-${j}`)
            elCel.classList.remove('hidden')
        }
    }
    setTimeout(() => {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i > board.length - 1) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j > gBoard[0].length - 1) continue
                const elCel = document.querySelector(`.cell-${i}-${j}`)
                elCel.classList.add('hidden')
            }
        }
        gelHint.classList.add('hide')
    }, 1000);
    gHint = false
}


function safeClick() {
    gSafeClick--
    document.querySelector('.safeClick').innerText = gSafeClick
    if (gSafeClick === 0) document.querySelector('.safe').classList.add('hide')
    var safeCells = []
    var markCell
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            gBoard[i][j].location_i = i
            gBoard[i][j].location_j = j
            if (!gBoard[i][j].isMine && !gBoard[i][j].isChecked && !gBoard[i][j].isShown) safeCells.push(gBoard[i][j])
            // if(!gBoard[i][j].isShown)safeCells.push(gBoard[i][j])
        }
    }
    markCell = safeCells[getRandomIntInclusive(0, safeCells.length)]
    console.log(markCell);
    const elMark = document.querySelector(`.cell-${markCell.location_i}-${markCell.location_j}`)
    elMark.classList.add('mark')
    setTimeout(() => {
        elMark.classList.remove('mark')
    }, 2000);
}

function exterminate() {
    var mineCells = []
    var removeCell
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) mineCells.push(gBoard[i][j])
        }
    }
    for (let x = 0; x < 3; x++) {
        removeCell = mineCells[getRandomIntInclusive(0, mineCells.length)]
        gBoard[removeCell.location_i][removeCell.location_j].isMine = false
    }
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.log(gBoard);
    document.querySelector('.exterminate').classList.add('hide')
}