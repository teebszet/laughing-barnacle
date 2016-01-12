'use strict'

/*
 *  run_game.js
 *
 *  main entry point for battleships game
 *  
 *    node run_game.js
 *
 * */

var log      = require('loglevel');
var readline = require('readline');
var Game     = require('./battleships.js');

var debug = (process.argv[2] === '-d') ? 1 : 0;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run(g) {
  rl.question("where them ships at? ", coords => {
    log.info('\x1B[2J');
    if (coords === 'exit' || g.finished) {
      return rl.close();
    }
    let hit = g.fireAt(coords);
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

