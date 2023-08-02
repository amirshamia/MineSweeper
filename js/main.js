'use stirct'
var gBoard = []
const gCell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}
var gLevel = {
    SIZE: 8,
    MINES: 4
}
var gGame = {
    isOn: false,
    shownCount: 0, markedCount: 0, secsPassed: 0
}
const MINE = '💣'
var gCount = 0

var gLives = 3



function onInit() {
    document.querySelector('.btn').innerText='😄'
    gGame.isOn=true
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
    // for (let x = 0; x < gLevel.MINES; x++) {
    //     board[getRandomIntInclusive(0, gLevel.SIZE-1)][getRandomIntInclusive(0, gLevel.SIZE-1)].isMine = true
    // }
    // board[1][2].isMine = true
    // board[3][2].isMine = true
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
    console.log(board);
}


function renderBoard(board) {
    var strHTML = ''
    var cell
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                cell = MINE
                var className = `bomb hidden cell cell-${i}-${j}`
            }

            else {
                cell = board[i][j].minesAroundCount
                className = `hidden cell cell-${i}-${j}`
            }
            const elCell = document.querySelector(`.cell-${i}-${j}`)
            console.log(elCell);
            strHTML += `<td onclick="onCellClicked(this,${i},${j})" class="${className}">${cell}</td>`

        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
    //console.log(strHTML);
}

function onCellClicked(elCell, i, j) {
    if(gGame.isOn===false)return

    gCount++
    if (gCount === 1) {
        for (let x = 0; x < gLevel.MINES; x++) {
            gBoard[getRandomIntInclusive(0, gLevel.SIZE - 1)][getRandomIntInclusive(0, gLevel.SIZE - 1)].isMine = true
            setMinesNegsCount(gBoard)
            renderBoard(gBoard)
        }
    }
    console.log(elCell.innerText);
    if (elCell.innerText === '0') expandShown(gBoard, elCell, i, j)
    if (!gBoard[i][j].isMine) {
        elCell.classList.remove('hidden')
    }
    else{
        elCell.style.backgroundColor='red'
        elCell.classList.remove('hidden')
        gLives--
        if(gLives==0) gameOver()
    } 
document.querySelector('h2 .lives').innerText=gLives
}

// function onCellMarked(elCell)
function expandShown(board, elCell, rowIdx, colIdx) {
    var cells = []
    var checkcell = { i: 0, j: 0 }
    console.log('hi');
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].minesAroundCount !== 0) {
                const elCel = document.querySelector(`.cell-${i}-${j}`)
                console.log(elCel);
                elCel.classList.remove('hidden')
            }
            else {
                checkcell.i = i
                checkcell.j = j
                cells.push({ ...checkcell })
            }


        }
        // for (let x = 0; x < cells.length; x++) {
        //     i=cells[x].i
        //     j=cells[x].j
        //     expandShown(board, elCell, i, j)
        // }
    }
    console.log(cells);
}


function gameOver() {
    const elBomb = document.querySelectorAll('.bomb')
    for (let i = 0; i < elBomb.length; i++) {
        elBomb[i].classList.remove('hidden')
    }
    document.querySelector('.btn').innerText='😩'
    gGame.isOn=false
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}