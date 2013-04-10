/*
 * Set up some environment defaults for these tests
 */

process.env.NODE_ENV = 'test';

var chai = require('chai'),
    expect = chai.expect,
    app = require('../app'),
    config = require('../config'),
    supertest = require('supertest'),
    models = require('../models');

describe("CrimeData", function() {
  describe("is alive", function() {
    it('useless empty test', function(done) {
      done();
    });
  });
});

describe("CrimeData's", function() {
  describe("'/' route", function() {
    it('should respond to /', function(done) {
      supertest(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          expect(err).to.not.exist;
          done();
        });
    });
  });
});
