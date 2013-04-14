/*
 * Set up some environment defaults for these tests
 */

process.env.NODE_ENV = 'test';

var chai = require('chai'),
    expect = chai.expect,
    app = require('../app'),
    config = require('../config'),
    supertest = require('supertest'),
    fetchCrimes = require('../api/fetchCrimes');

describe("CrimeData - API", function() {
    it('fetchCrimes should not be undefined', function(done) {
        fetchCrimes('2012', '01', function(crimes) {
            expect(crimes).to.not.be.undefined;
            done();  
        });
    });
});
