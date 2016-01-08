'use strict'

var log = require('loglevel');
var readline = require('readline');
var _ = require('lodash');

var debug = (process.argv[2] === '-d') ? 1 : 0;

/*
 * Game Class
 *
 * Optional param grid size, defaults to 10
 */
// game tiles
var OCEAN = '~';
var MISS = 'x';
var HIT = '*';

function Game (size) {
  // default variables in ES2015. TODO use babel
  // gridSize is probably limited to 26 with current implementation
  this.gridSize = typeof size !== 'undefined' ? size : 10; // default 10
  if (size <= 0 || !Number.isInteger(size)) {
    this.gridSize = 10; 
  }

  this.finished = 0;

  // multidimensional array to represent playing field
  this._grid = _.range(size).map( function(){
    return _.range(size).map( function(){
      return OCEAN
    });
  });

  // hash containing ship names to length
  this._ships = {'battleship': 5, 'destroyer': 4};
}

/*
 * Returns 1 on success placing ship, else 0
 *
 * Expects key to item in self._ships, e.g. 'battleship'
 */
Game.prototype.placeShip = function (shipKey) {
  var self = this;

  var x = _.random(self.gridSize);
  var y = _.random(self.gridSize);
  var orientation = _.random(1); // 0 - horizontal, 1 - vertical
  log.debug('placing ' + shipKey + ' at:', x, y, orientation);

  // my brute force approach to placing ships:
  //
  // from a starting x,y we walk either in positive x or y direction
  // and break out to start again if we hit anything
  var success = 1;
  var gridClone = _.cloneDeep(self._grid);
  var shipLength = self._ships[shipKey];

  _.times(shipLength, function() {
    // fail if ship not in bounds
    if (x > (self.gridSize - 1) ||
        y > (self.gridSize - 1)) {
      log.debug('invalid position. out of bounds. try again');
      success = 0;
      return; 
    }
    // fail if ship overlaps another ship
    if (gridClone[y][x] !== OCEAN){
      log.debug('invalid position. overlapping ship. try again');
      success = 0;
      return; 
    }

    gridClone[y][x] = shipKey[0]; // 'b' for 'battleship'
    if (orientation === 1) {
      x += 1;
    } else if (orientation === 0) {
      y += 1; 
    }
  });

  if (success) {
    self._grid = gridClone;
    return 1;
  } else {
    return 0;
  }
}

/*
 * Places ships on game grid
 */
Game.prototype.placeAllShips = function () {
  var self = this;
  // probably want a more robust way to do this, where it's obvious if the ships
  // didn't all get placed. But let's not over-engineer a game of
  // battleships...

  var i = 100; // safety to bail out
  while (!self.placeShip('battleship') && i ) { i-- };
  while (!self.placeShip('destroyer')  && i ) { i-- };
  while (!self.placeShip('destroyer')  && i ) { i-- };
}

/*
 * Returns { x: INT, y: INT } or undefined
 * 
 * Expects coordinate string like 'A10' or 'j1'
 */
Game.prototype.gameCoordsToXY = function (string) {
  var self = this;

  // hard limit of 99 for gridSize
  if (string.length < 2 || string.length > 3) {
    return;
  }

  var r = new Object();
  r.x = string
    .slice(0)
    .toLowerCase()
    .charCodeAt(0) - 97; // hard limit of z=26 for gridSize

  r.y = string.slice(1) - 1
  log.debug(r);
  return r;
}

/*
 * Returns 1 if valid, else undef
 * 
 * Expects { x: INT, y: INT }
 */
Game.prototype.validXY = function (r) {
  var self = this;

  if (!r) {
    log.debug('x,y not returned');
    return;
  }

  if (!Number.isInteger(r.x) || !Number.isInteger(r.y)) {
    log.debug('x or y returned not integer');
    return;
  }

  if ( 0 > r.x || r.x >= self.gridSize
    || 0 > r.y || r.y >= self.gridSize) {
    log.debug('x or y returned was outside grid');
    return;
  }

  return 1;
}

/*
 * Game action to handle coordinate input
 *
 * Returns 1 if Hit, 0 if Miss, else undef
 * 
 * Expects string like 'A1' or 'j10'
 */
Game.prototype.fireAt = function (coords) {
  var self = this;

  var r = self.gameCoordsToXY(coords);
  if (!self.validXY(r)) {
    log.info("that's not a valid coordinate");
    return;
  }

  switch (self._grid[r.y][r.x]) {
    case OCEAN:
    case MISS: 
      self._grid[r.y][r.x] = MISS;
      return 0;
    default:
      self._grid[r.y][r.x] = HIT;
      return 1;
  }
}

/*
 * Returns a game grid where ships have been masked with OCEAN
 */
Game.prototype.maskGameGrid = function () {
  var self = this;

  self.finished = 1;
  var gameGrid = self._grid.map( function (i) {
    return i.map( function (v) {
      switch (v) {
        case HIT:
        case MISS:
        case OCEAN:
          return v;
        default:
          self.finished = 0;
          return OCEAN;
      }
    });
  });
  
  return gameGrid;
}

/*
 * Prints game grid internal representation
 */
Game.prototype.printDebugGrid = function () {
  log.debug(this._grid);
  log.debug('\n\n\n\n\n');
}

/*
 * Prints game grid external representation
 */
Game.prototype.printGameGrid = function () {
  log.info(this.maskGameGrid());
  if (this.finished) {
    log.info("YOU SUNK EM ALL!"); 
  }
  log.info('\n\n\n\n\n');

  this.printDebugGrid();
}
// end class Game

/*******************
 * MAIN
 */
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run (g) {
  rl.question("where them ships at? ", function(coords) {
    log.info('\x1B[2J');
    if (coords === 'exit' || g.finished) {
      return rl.close();
    }
    var hit = g.fireAt(coords);
    if (hit) {
      log.info('HIT\n');
    }
    g.printGameGrid();
    run(g);
  });
}

log.setLevel('info');
if (debug) {
  log.setLevel('debug');
}
log.info('\x1B[2J');

rl.question('welcome to battleships\n\n PRESS ENTER', function() {
  log.info('\x1B[2J');
  log.info('new game')
  log.info('\n\n\n\n\n');

  var g = new Game(10);
  g.placeAllShips();
  g.printGameGrid();
  run(g);
});

