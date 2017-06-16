"use strict";

const DIRECTION_VERTICAL = 1,
    GRID_SIZE = 10,
    EMPTY_POSITIION = 0,
    DESTROYED_SHIP_POSITION = 1,
    SHIP_POSITION = 2;

var grid = [],
    ships = [5, 4, 4],
    gameFinished = false;

/**
* Create game grid
*/
function createGrid() {
    var i, j;
    for (i = 0; i < GRID_SIZE; i++) {
        grid[i] = [];
        for (j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = 0;
        }
    }
}

/**
* Add all ships
* @param {array} ships  - List of ship sizes
*/
function addShips(ships) {
    ships.forEach(function(ship, index) {
        addShip(ship, index);
    });
}

/**
* Generate a radom ship position
* @param {int} ship     - Ship size
* @return {object}      - Ship object
*/
function createShipPosition(ship) {
    let dir = Math.floor(Math.random() * 2),
        col,
        row;

    if (dir === DIRECTION_VERTICAL) {
        col = Math.floor(Math.random() * GRID_SIZE);
        row = Math.floor(Math.random() * (GRID_SIZE - ship + 1));
    } else {
        col = Math.floor(Math.random() * (GRID_SIZE - ship + 1));
        row = Math.floor(Math.random() * GRID_SIZE);
    }
    return {
        'col': col,
        'row': row,
        'dir': dir,
        'size': ship
    };
}

/**
* Check if the ship position is valid
* @param {object} pos   - Ship position
* @return {boolean}     - Is valid position
*/
function isValidShipPosition(pos) {
    var i;

    for (i = 0; i < pos.size; i++) {
        if ((pos.dir === DIRECTION_VERTICAL && grid[0][pos.row + i] !== EMPTY_POSITIION) ||
            (!pos.dir === DIRECTION_VERTICAL && grid[pos.col + i][0] !== EMPTY_POSITIION)) {
            return false;
        }
    }
    return true;
}

/**
* Add ship with valid position
* @param {int} ship     - Ship size
* @param {int} index    - Ship index
*/
function addShip(ship, index) {
    var position,
        isValidPosition = false;
    do {
        position = createShipPosition(ship);
        if (isValidShipPosition(position)) {
            placeShip(position, index);
            isValidPosition = true;
        }
    } while (!isValidPosition);
}

/**
* Place ship in the game grid
* @param {object} pos   - Ship position
* @param {int} index    - Ship index
*/
function placeShip(pos, index) {
    var i;

    for (i = 0; i < pos.size; i++) {
        if (pos.dir === DIRECTION_VERTICAL) {
            grid[pos.col][pos.row + i] = SHIP_POSITION + index;
        } else {
            grid[pos.col + i][pos.row] = SHIP_POSITION + index;
        }
    }
}

/**
* Check if the position is valid for the grid
* @param {int} pos      - Grid position
* @return {boolean}     - Is valid position
*/
function isValidPos(pos) {
    return pos >= 0 && pos < GRID_SIZE;
}

/**
* Fire in a position
* @param {string} position  - Position to fire to
*/
function fire(position) {
    var pos,
        col,
        row;

    if (position.length !== 2) {
        alert('Invalid position');
        return;
    }
    pos = position.split('');
    col = pos[0].charCodeAt(0) - 97;
    row = pos[1];
    if (!isValidPos(col)) {
        alert('Invalid column');
        return;
    }
    if (!isValidPos(row)) {
        alert('Invalid column');
        return;
    }
    if (grid[col][row] === EMPTY_POSITIION) {
        alert('Miss !');
        return;
    }
    if (grid[col][row] >= SHIP_POSITION) {
        ships[grid[col][row] - SHIP_POSITION]--;
        if (ships[grid[col][row] - SHIP_POSITION] === 0) {
            alert('Sunk !');
        } else {
            alert('Hit !');
        }

        grid[col][row] = DESTROYED_SHIP_POSITION;
        if (ships.reduce((a, b) => a + b, 0) === 0) {
            gameFinished = true;
            alert('Game finished');
        }
        return;
    }
    alert('You already hit this part of the ship');
}

/**
* Start battleShips game
* @param {array} ships  - Ships to add to the battle
*/
function startGame(ships) {
    createGrid();
    addShips(ships);
    do {
        var fireToPos = prompt('Fire to position: ');
        if (fireToPos === null) {
            gameFinished = true;
        }
        if (fireToPos) {
            fire(fireToPos.toLowerCase());
        }
    } while (!gameFinished)
}

startGame(ships);
