const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
const gridSize = 5
const FPS = 120
const gameSpeed = 400
let selected = null
setSelected('sand')
let grid = generateSpecGrid()
let isMouseOver = false
const rainbowColourArray = makeRainbowArray()
let performanceMeasure = {
    value: 0,
    needUpdate: true,
    array: [],
    average: 0,
    averageArray: []
}
let showPerformance = false
let isPaused = false

//average performance over time

document.addEventListener('mousedown', mouseDown);
document.addEventListener('mousemove', mouseMove);

function mouseDown(e) {
    if (!isMouseOver) return
    console.log(mouseToCoord(truePosition(e).x, truePosition(e).y))
    makeParticle(selected, mouseToCoord(truePosition(e).x, truePosition(e).y))
}

function mouseMove(e) {
    if (!isMouseOver) return

    //update cursor
    //TODO this is bad!
    cursor.x = truePosition(e).x
    cursor.y = truePosition(e).y

    if (e.buttons !== 1) return;
    makeParticle(selected, mouseToCoord(truePosition(e).x, truePosition(e).y))
}

function handleMouseOver() {
    isMouseOver = true
}

function handleMouseOut() {
    isMouseOver = false
}

function makeRainbowArray() {
    let array = []
    const inc = 2
    for (let i = 0; i < 360; i += inc) {
        array.push(hslToHex(i, 100, 50))
    }
    return array
}

function hslToHex(h, s, l) {
    //https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function makeParticle(particle, coords) {

    function addParticleToGrid(particleFunc, coords) {
        const x = coords.x
        const y = coords.y

        grid[x][y] = particleFunc()
        grid[x - 1][y - 1] = particleFunc()
        grid[x - 1][y + 1] = particleFunc()
        grid[x - 2][y] = particleFunc()
    }

    switch (particle) {
        case 'sand':
            addParticleToGrid(createSand, coords)
            break;
        case 'blueSand':
            addParticleToGrid(createBlueSand, coords)
            break;
        case 'rainbowSand':
            addParticleToGrid(createRainbowSand, coords)
            break;
        case 'wall':
            addParticleToGrid(createWall, coords)
            break;
        case 'water':
            addParticleToGrid(createWater, coords)
            break;
        case 'smoke':
            addParticleToGrid(createSmoke, coords)
            break;
    }
}

function setSelected(n) {
    selected = n
    clearButtonClass()
    toggleButtonClass(n + "Btn")
}

function clearButtonClass() {
    const buttons = document.getElementsByClassName("activeButton")
    for (let button of buttons) {
        button.classList.remove('activeButton')
    }
}

function toggleButtonClass(id) {
    document.getElementById(id).classList.toggle('activeButton')
}

function handleCheckPerformance(event) {
    showPerformance = event.checked
}


function changePause(bool) {
    isPaused = bool
}

function truePosition(e) {
    const canvRect = canvas.getBoundingClientRect()
    return {
        x: e.clientX - canvRect.left,
        y: e.clientY - canvRect.top
    }
}

const cursor = {
    x: 0,
    y: 0,
    colour: null
}

function generateGrid(x, y) {
    const arr = Array(x).fill(null)
    return arr.map(e => Array(y).fill('empty'))
}

function generateSpecGrid() {
    return generateGrid(canvas.width / gridSize, canvas.height / gridSize)
}

//-- new create particles functions 

function createSand() {
    const colours = ['#ab8f43', '#bd7f46', '#d9bb50', '#ad8540']
    return {
        type: 'sand',
        colour: getRandom(colours),
        density: 20,
        fluid: false,
        acc: 0,
        fixed: false
    }
}

function createSmoke() {
    const colours = ['#a0a0a0']
    return {
        type: 'smoke',
        colour: getRandom(colours)
    }
}

function createRainbowSand() {
    return {
        type: 'sand',
        colour: rainbowColourArray[0],
        density: 20,
        fluid: false,
        acc: 0,
        fixed: false,
        colourIndex: 0, //if we keep track of the index, we don't need to find the index
        flashing: true
    }
}

function createBlueSand() {
    const colours = ['#3366ff', '#0000ff', '#6699ff', '#3399ff']
    return {
        type: 'sand',
        colour: getRandom(colours),
        density: 20,
        fluid: false,
        acc: 0,
        fixed: false
    }
}

function createWall() {
    const colours = ['#606060']
    return {
        type: 'wall',
        colour: getRandom(colours),
        density: 50,
        fluid: false,
        acc: 0,
        fixed: true
    }
}

function createWater() {
    const colours = ['#0099ff', '#00ffff', '#66ffff'] //water can sparkle, change colour of pixels
    return {
        type: 'water',
        colour: getRandom(colours),
        density: 10,
        fluid: true,
        acc: 0,
        fixed: false,
        direction: 1,
        flowDir: 'left'
    }
}



function unused() {
    // ----- make functions
    //make functions should be replaces by functions that just return a particle object
    //placing them on a grid should be done elsewhere

    function makeSand(coords) {
        const colours = ['#ab8f43', '#bd7f46', '#d9bb50', '#ad8540']
        grid[coords.x][coords.y] = {
            type: 'sand',
            colour: getRandom(colours),
            density: 20,
            fluid: false,
            acc: 0,
            fixed: false
        }

        grid[coords.x][coords.y + 1] = {
            type: 'sand',
            colour: getRandom(colours),
            density: 20,
            fluid: false,
            acc: 0,
            fixed: false
        }

        grid[coords.x + 1][coords.y + 1] = {
            type: 'sand',
            colour: getRandom(colours),
            density: 20,
            fluid: false,
            acc: 0,
            fixed: false
        }
    }

    function makeSmoke(coords) {
        const colours = ['#a0a0a0']
        grid[coords.x][coords.y] = {
            type: 'smoke',
            colour: getRandom(colours)
        }
    }

    function makeBlueSand(coords) {
        const colours = ['#3366ff', '#0000ff', '#6699ff', '#3399ff']
        grid[coords.x][coords.y] = {
            type: 'sand',
            colour: getRandom(colours),
            density: 20,
            fluid: false,
            acc: 0,
            fixed: false
        }
    }

    function makeRainbowSand(coords) {
        grid[coords.x][coords.y] = {
            type: 'sand',
            colour: rainbowColourArray[0],
            density: 20,
            fluid: false,
            acc: 0,
            fixed: false,
            colourIndex: 0, //if we keep track of the index, we don't need to find the index
            flashing: true
        }
    }

    function makeWall(coords) {
        const colours = ['#606060']
        grid[coords.x][coords.y] = {
            type: 'wall',
            colour: getRandom(colours),
            density: 50,
            fluid: false,
            acc: 0,
            fixed: true
        }
    }

    function makeWater(coords) {
        const colours = ['#0099ff', '#00ffff', '#66ffff'] //water can sparkle, change colour of pixels
        grid[coords.x][coords.y] = {
            type: 'water',
            colour: getRandom(colours),
            density: 10,
            fluid: true,
            acc: 0,
            fixed: false,
            direction: 1,
            flowDir: 'left'
        }
    }

}


function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

//turn click into grid coord
function mouseToCoord(x, y) {
    const gridX = Math.floor(x / gridSize)
    const gridY = Math.floor(y / gridSize)
    return {
        x: gridX,
        y: gridY
    }
}

function round(n) {
    const factor = gridSize
    return Math.round(n / factor) * factor
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //render grid
    grid.forEach((x, xi) => {
        x.forEach((y, yi) => {
            if (y === 'empty') return
            //if (y.type === 'sand') {
            ctx.fillStyle = y.colour
            ctx.fillRect(xi * gridSize, yi * gridSize, gridSize, gridSize)
            //}
        })
    })

    if (showPerformance) {
        //render text
        ctx.fillStyle = '#000000'
        ctx.font = '30px monospace';
        ctx.fillText(performanceMeasure.average, 30, 50)

        //render graph
        renderPerformanceGraph()
    }


    //render cursor
    // ctx.fillStyle = "#FF0000";
    // ctx.fillRect(round(cursor.x), round(cursor.y), gridSize, gridSize)
}

//own functions for each particle

function updateSand(particle, grid) {
    let updatedGrid = generateSpecGrid()

    return updatedGrid
}

function update2() {
    if (isPaused) return

    const startPerf = performance.now()

    let updatedGrid = generateSpecGrid()

    // function gridBelow(x, y) {
    //     return grid[x][y + 1]
    // }

    function sandLogic(x, y) {
        if (grid[x][y + 1] === 'empty') {
            gridSwap(x, y, x, y + 1)
        } else if (!particleOnLeftEdge(x, y)
            && grid[x - 1][y + 1] === 'empty'
            && grid[x - 1][y] === 'empty') {
            gridSwap(x, y, x - 1, y + 1)
        } else if (!particleOnRightEdge(x, y)
            && grid[x + 1][y + 1] === 'empty'
            && grid[x + 1][y] === 'empty') {
            gridSwap(x, y, x + 1, y + 1)
        } else {
            noChange(x, y)
        }
    }

    function smokeLogic(x, y) {
        const dir = getRandom([-1, 0, 1])

        const dead = Math.random() < 0.01

        if (dead) {
            //no update to updatedGrid
        }
        else if (grid[x + dir][y - 1] === 'empty') {
            gridSwap(x, y, x + dir, y - 1)
        }



        else {
            noChange(x, y)
        }
    }

    function waterLogic(x, y) {
        if (grid[x][y + 1] === 'empty') {
            gridSwap(x, y, x, y + 1)
        } else if (!particleOnLeftEdge(x, y)
            && grid[x - 1][y + 1] === 'empty'
            && grid[x - 1][y] === 'empty') {
            gridSwap(x, y, x - 1, y + 1)
        }

        else if (!particleOnRightEdge(x, y)
            && grid[x + 1][y + 1] === 'empty'
            && grid[x + 1][y] === 'empty') {
            gridSwap(x, y, x + 1, y + 1)
        }

        //move left horizontally
        else if (!particleOnLeftEdge(x, y)
            && grid[x - 1][y] === 'empty'
            && grid[x][y].flowDir === 'left') {
            gridSwap(x, y, x - 1, y)
        }

        else if (grid[x + 1][y] === 'empty'
            && grid[x][y].flowDir === 'left') {
            flipWaterDirection(x, y)
        }

        //move right horizontally

        else if (!particleOnRightEdge(x, y)
            && grid[x + 1][y] === 'empty'
            && grid[x][y].flowDir === 'right') {
            gridSwap(x, y, x + 1, y)
        }

        else if (grid[x - 1][y] === 'empty'
            && grid[x][y].flowDir === 'right') {
            flipWaterDirection(x, y)
        }

        else {
            noChange(x, y)
        }
    }

    function wallLogic(x, y) {
        noChange(x, y)
    }

    function swapIfEmpty(x, y) {

    }

    function flipWaterDirection(x, y) {
        const newDir = grid[x][y].flowDir === 'left' ? 'right' : 'left'
        updatedGrid[x][y] = grid[x][y]
        updatedGrid[x][y].flowDir = newDir
    }

    function particleOnLeftEdge(x, y) {
        return x == 0
    }

    function particleOnRightEdge(x, y) {
        return x == (canvas.width / gridSize) - 1
    }

    function gridSwap(x1, y1, x2, y2) {
        updatedGrid[x1][y1] = grid[x2][y2]
        updatedGrid[x2][y2] = grid[x1][y1]
    }

    function noChange(x, y) {
        updatedGrid[x][y] = grid[x][y]
    }



    grid.forEach((col, x) => {
        col.forEach((particle, y) => {

            if (particle.type === 'sand') {
                sandLogic(x, y)
            }

            if (particle.type === 'water') {
                waterLogic(x, y)
            }

            if (particle.type === 'wall') {
                wallLogic(x, y)
            }

            if (particle.type === 'smoke') {
                smokeLogic(x, y)
            }

            if (particle.flashing === true) {
                particle.colour = rainbowColourArray[particle.colourIndex]
                particle.colourIndex = (particle.colourIndex + 1) % (360 / 2)
            }
        })
    })

    grid = updatedGrid

    //
    // if(performanceMeasure.needUpdate){
    //     performanceMeasure.value = performance.now() -  startPerf
    //     performanceMeasure.needUpdate = false
    //     setTimeout(()=> performanceMeasure.needUpdate = true , 500 )
    // }

    performanceMeasure.array.push(performance.now() - startPerf)
    if (performanceMeasure.array.length > 50) {
        performanceMeasure.average = average(performanceMeasure.array)
        performanceMeasure.averageArray.push(performanceMeasure.average)
        performanceMeasure.array = []
    }


}

function renderPerformanceGraph() {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(0, 200);
    performanceMeasure.averageArray.forEach((e, i) => {
        ctx.lineTo(i * 2, e * -200 + 400, 2, 2)
    })
    ctx.stroke();
}


function roundNum(num) {
    return Math.round((num + Number.EPSILON) * 10000) / 10000
}

function average(arr) {
    return arr.reduce((p, c) => p + c, 0) / arr.length;
}


function update() {
    let updatedGrid = generateSpecGrid()

    grid.forEach((x, xi) => {
        x.forEach((y, yi) => {
            //abstraction here
            if (y === 'empty') return
            if (y.type === 'sand') {
                //sand should fall down one (increment y)
                //if((grid[xi][yi+1] === undefined)) return //if no grid below, do nothing

                //if type rainbow, then change colour
                if (y.flashing === true) {
                    y.colour = rainbowColourArray[y.colourIndex]
                    y.colourIndex = (y.colourIndex + 1) % (360 / 2)
                }

                if (grid[xi][yi + 1] === 'empty') { // if empty below, fall
                    updatedGrid[xi][yi + 1] = y
                    return
                }

                if (xi !== 0 && grid[xi - 1][yi + 1] === 'empty') { //if empty to left-down, fall left-down
                    updatedGrid[xi - 1][yi + 1] = y
                    return
                }
                if (xi !== (canvas.width / gridSize) - 1 && grid[xi + 1][yi + 1] === 'empty') { //if empty to right-down, fall right-down
                    updatedGrid[xi + 1][yi + 1] = y
                    return
                }

                updatedGrid[xi][yi] = y //else it doesn't move
            }

            if (y.type === 'wall') {
                updatedGrid[xi][yi] = y // it doesn't move
            }

            if (y.type === 'water') {

                //we need to do the gravity step, and then the movement step?

                // if empty below, fall
                if (grid[xi][yi + 1] === 'empty') {
                    updatedGrid[xi][yi + 1] = y
                    return
                }

                //if direction is empty, and nothing above you

                if (grid[xi + y.direction][yi] === 'empty'
                    && grid[xi + y.direction][yi - 1] === 'empty'
                ) {
                    updatedGrid[xi + y.direction][yi] = y
                    return
                }
                y.direction *= -1

                updatedGrid[xi][yi] = y //else it doesn't move
            }
        })
    })

    grid = updatedGrid
}

setInterval(render, 1000 / FPS)
setInterval(update2, 1000 / gameSpeed)



/**
 * NOTES/IDEAS
 * 
 * cursor should indicate which elemnt is selected (sand, water, air, etc)
 * 
 * add 'game of life' element that follow game of life rules
 * 
 * pause, play button
 * 
 * flip gravity button
 * 
 * 
 */
