'use strict'

/*
 *  class Battleships
 *
 *    var Game = require(./battleships.js);
 *    var g = new Game(size);
 *
 *  Optional parameter grid size, defaults to 10
 *
 * */

var log = require('loglevel');
var _ = require('lodash');

// game tiles
const OCEAN = '~';
const MISS = 'x';
const HIT = '*';

class Game {
  constructor(size) {
    // default variables will be in ES2015 but for now...
    // gridSize is probably limited to 26 with current implementation
    this._gridSize = typeof size !== 'undefined' ? size : 10; // default 10
    if (size <= 0 || !Number.isInteger(size)) {
      this._gridSize = 10; 
    }

    this._finished = false;

    // multidimensional array to represent playing field
    this._grid = _.range(size).map( () => {
      return _.range(size).map( () => {
        return OCEAN
      });
    });

    // hash containing ship names to length
    this._ships = {'battleship': 5, 'destroyer': 4};
  }

  get finished() {
    return this._finished;
  }

  /*
   * Returns 1 on success placing ship, else 0
   * Expects key to item in self._ships, e.g. 'battleship'
   */
  placeShip(shipKey) {
    let self = this;
  
    let x = _.random(self._gridSize);
    let y = _.random(self._gridSize);
    let orientation = _.random(1); // 0 - horizontal, 1 - vertical
    log.debug('placing ' + shipKey + ' at:', x, y, orientation);
  
    // my brute force approach to placing ships:
    //
    // from a starting x,y we walk either in positive x or y direction
    // and break out to start again if we hit anything
    let success = 1;
    let gridClone = _.cloneDeep(self._grid);
    let shipLength = self._ships[shipKey];
  
    _.times(shipLength, () => {
      // fail if ship not in bounds
      if (x > (self._gridSize - 1) ||
          y > (self._gridSize - 1)) {
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
  placeAllShips() {
    let self = this;
    // probably want a more robust way to do this, where it's obvious if the ships
    // didn't all get placed. But let's not over-engineer a game of
    // battleships...
    let i = 100; // safety to bail out
    while (!self.placeShip('battleship') && i ) { i-- };
    while (!self.placeShip('destroyer')  && i ) { i-- };
    while (!self.placeShip('destroyer')  && i ) { i-- };

    return;
  }
  
  /*
   * Returns { x: INT, y: INT } or undefined
   * Expects coordinate string like 'A10' or 'j1'
   */
  gameCoordsToXY(coords) {
    let self = this;
  
    // hard limit of 99 for gridSize
    if (coords.length < 2 || coords.length > 3) {
      return;
    }
  
    var r = new Object();
    r.x = coords
      .slice(0)
      .toLowerCase()
      .charCodeAt(0) - 97; // hard limit of z=26 for gridSize
  
    r.y = coords.slice(1) - 1;
    log.debug(r);
    return r;
  }
  
  /*
   * Returns 1 if valid, else undef
   * Expects { x: INT, y: INT }
   */
  validXY(r) {
    let self = this;
  
    if (!r) {
      log.debug('x,y not returned');
      return;
    }
    if (!Number.isInteger(r.x) || !Number.isInteger(r.y)) {
      log.debug('x or y returned not integer');
      return;
    }
    if ( 0 > r.x || r.x >= self._gridSize
      || 0 > r.y || r.y >= self._gridSize) {
      log.debug('x or y returned was outside grid');
      return;
    }
  
    return 1;
  }
  
  /*
   * Game action to handle coordinate input
   *
   * Returns 1 if Hit, 0 if Miss, else undef
   * Expects string like 'A1' or 'j10'
   */
  fireAt(coords) {
    let self = this;
  
    let r = self.gameCoordsToXY(coords);
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
  maskGameGrid() {
    let self = this;

    self._finished = true;
    var gameGrid = self._grid.map( row => {
        return row.map( tile => {
          switch (tile) {
            case HIT:
            case MISS:
            case OCEAN:
              return tile;
            default:
              self._finished = false;
              return OCEAN;
          }
        });
      });
    return gameGrid;
  }
  
  /*
   * Prints game grid internal representation
   */
  printDebugGrid() {
    log.debug(this._grid);
    log.debug('\n\n\n\n\n');
  }
  
  /*
   * Prints game grid external representation
   */
  printGameGrid() {
    log.info(this.maskGameGrid());
    if (this.finished) {
      log.info("YOU SUNK EM ALL!"); 
    }
    log.info('\n\n\n\n\n');
  
    this.printDebugGrid();
  }

} // end class Game

module.exports = Game;
