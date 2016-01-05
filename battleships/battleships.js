'use strict'

var clone = require('clone');
var log = require('loglevel');
var readline = require('readline');

/*
 * class Game
 */

var OCEAN = '~';
var MISS = 'x';
var HIT = '*';

function Game (size) {
  // default variables in ES2015. TODO use babel
  this.gridSize = typeof size !== 'undefined' ? size : 10; // default 10
  this.finished = 0;

  // multidimensional array to represent playing field
  this._grid = new Array(this.gridSize);
  for (var i = 0; i < this.gridSize; i++) {
      this._grid[i] = new Array(this.gridSize).fill('~');
  }

  // hash containing ship names to length
  this._ships = {'battleship': 5, 'destroyer': 4};
}

function randInt (m) {
  m = typeof m !== 'undefined' ? m : 1; // default 1
  return Math.floor(Math.random() * m);
}

Game.prototype.placeShip = function (shipKey) {
  var x = randInt(this.gridSize);
  var y = randInt(this.gridSize);
  // 0 - horizontal, 1 - vertical
  var orientation = randInt(1);

  log.debug('placing ' + shipKey + ' at:', x, y, orientation);
  var gridClone = clone(this._grid);
  for (var i = 0; i < this._ships[shipKey]; i++) {
    // fail if ship not in bounds
    if (x > (this.gridSize - 1) ||
        y > (this.gridSize - 1)) {
      log.debug('invalid position. out of bounds. try again');
      return 0; 
    }
    // fail if ship overlaps another ship
    if (gridClone[y][x] !== '~'){
      log.debug('invalid position. overlapping ship. try again');
      return 0; 
    }

    gridClone[y][x] = shipKey[0];
    if (orientation === 1) {
      x += 1;
    } else if (orientation === 0) {
      y += 1; 
    }
  }
  this._grid = gridClone;
  return 1;
}

// probably a better way to do this algorithmically, but this is the brute
// force approach
Game.prototype.placeAllShips = function () {
  while (!this.placeShip('battleship')) {};
  while (!this.placeShip('destroyer')) {};
  while (!this.placeShip('destroyer')) {};
}

var alpha = {a:0, b:1, c:2, d:3, e:4, f:5, g:6, h:7, i:8, j:9};
function gameCoordsToXY (string) {
  // really doesn't handle larger numbers than 99
  if (string.length < 2 || string.length > 3) {
    return;
  }

  //TODO TEST THIS FUNCTION FOR A15
  var r = new Object();
  string.split('').map(function(v, i){
    var key = i === 0 ? 'x' : 'y';
    if (key === 'x') {
      v = alpha[v.toLowerCase()];
    } else {
      v -= 1; 
    }
    r[key] = v;
  });
  log.debug(r);
  return r;
}

/*
 * Returns 1 if valid, else undef
 * 
 * Expects { x: INT, y: INT }
 */
Game.prototype.validXY = function (r) {
  // not an object
  if (!r) {
    return;
  }

  if (!Number(r.x) || !Number(r.y)) {
    return;
  }

  if (r.x > this.gridSize || r.y > this.gridSize) {
    return;
  }

  return 1;
}

Game.prototype.fireAt = function (coords) {
  var r = gameCoordsToXY(coords);
  if (!this.validXY(r)) {
    log.info("that's not a valid coordinate");
    return;
  }

  switch (this._grid[r.y][r.x]) {
    case OCEAN:
    case MISS: 
      this._grid[r.y][r.x] = MISS;
      return 0;
    default:
      this._grid[r.y][r.x] = HIT;
      return 1;
  }
}

Game.prototype.printGrid = function () {
  log.info(this._grid);
  log.info('\n\n\n\n\n');
}
// end class GAME

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run (g) {
  rl.question("where them ships at? ", function(coords) {
    log.info('\x1B[2J');
    if (coords === 'exit') {
      return rl.close();
    }
    var hit = g.fireAt(coords);
    if (hit) {
      log.info('HIT\n');
    }
    g.printGrid();
    run(g);
  });
}

log.setLevel('info');
log.info('\x1B[2J');

rl.question('welcome to battleships\n\n PRESS ENTER', function() {
  log.info('\x1B[2J');
  log.info('new game')
  log.info('\n\n\n\n\n');

  var g = new Game(10);
  g.placeAllShips();
  g.printGrid();
  run(g);
});

