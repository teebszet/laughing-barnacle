'use strict'

var clone = require('clone');
var log = require('loglevel');
var prompt = require('prompt');

/*
 * class Game
 */
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

function gameCoordsToXY (string) {

}

Game.prototype.fireAt = function (x,y) {
  this._grid[y][x] = 'x';
  return 0;
}

Game.prototype.printGrid = function () {
  log.info(this._grid);
}
// class GAME

log.setLevel('info');

log.info('welcome to battleships')
log.info('new game')

var g = new Game(10);
g.placeAllShips();
g.printGrid();

prompt.start();
prompt.get(['x','y'], function (err,result) {
  g.fireAt(result.x, result.y);
  g.printGrid();
});
