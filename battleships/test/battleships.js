'use strict'

/*
 *  test/battleships.js - unit tests
 *
 *    npm test
 */

var expect = require('chai').expect;
var Game = require('../battleships.js');

describe('battleships.js', function() {
  let g = new Game(10);

  describe('#validXY(r)', function() {
    let tests = [
      { r: {x:0, y:0},         expected: 1,         name: 'simple case' },
      { r: {x:9, y:9},         expected: 1,         name: 'simple case' },
      { r: {x:12, y:3},        expected: undefined, name: 'x too large' },
      { r: {x:6, y:10},        expected: undefined, name: 'y too large' },
      { r: {x:-1, y:0},        expected: undefined, name: 'x negative'  },
      { r: {x:0, y:-2},        expected: undefined, name: 'y negative'  },

      { r: {x:undefined, y:2}, expected: undefined, name: 'x undefined' },
      { r: {x:null, y:3},      expected: undefined, name: 'x null'      },
      { r: {x:2, y:{}},        expected: undefined, name: 'y hashref'   },
      { r: {x:4, y:[]},        expected: undefined, name: 'y arrayref'  }
    ];
    tests.forEach( t => {
      it(t.name, () => {
        expect(g.validXY(t.r)).to.equal(t.expected);
      });
    });
  });

  describe('#gameCoordsToXY(coords)', function() {
    let tests = [
      { coords: 'A1', expected: {x:0,y:0}, name: 'simple case' },
      { coords: 'a10', expected: {x:0,y:9}, name: 'simple lowercase' },
      { coords: 'A11', expected: undefined, name: 'row too large' },
      { coords: 'A100', expected: undefined, name: 'row far too large' },
      { coords: 'A-1', expected: undefined, name: 'row negative' },
      { coords: 'AA1', expected: undefined, name: 'col is AA' },
      { coords: '*', expected: undefined, name: 'col is random char' },
      { coords: undefined, expected: undefined, name: 'undefined' }
    ];
    tests.forEach( t => {
      it(t.name, () => {
        expect(g.gameCoordsToXY(t.coords)).to.eql(t.expected);
      });
    });
  
  });
});
