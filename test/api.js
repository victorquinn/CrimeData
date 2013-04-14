/*
 * Set up some environment defaults for these tests
 */

process.env.NODE_ENV = 'test';

var chai = require('chai'),
    expect = chai.expect,
    app = require('../app'),
    config = require('../config'),
    supertest = require('supertest'),
    _ = require('underscore'),
    fetchCrimes = require('../api/fetchCrimes'),
    crimes = {};

describe("CrimeData - API", function() {
    describe('fetchCrimes()', function() {
        it('fetchCrimes should not be undefined', function(done) {
            fetchCrimes('2012', '01', '01', function(crimes) {
                expect(crimes).to.not.be.undefined;
                done();
            });
        });
        it('fetchCrimes should have proper crime format', function(done) {
            fetchCrimes('2012', '01', '01', function(crimes) {
                _.each(crimes, function(crime) {
                    // These come from the original API source but we filter them
                    // out because they're all null or otherwise not useful.
                    expect(crime.beat).to.not.be.defined;
                    expect(crime.geometry).to.not.be.defined;
                    expect(crime.address).to.not.be.defined;
                    expect(crime.zip_code).to.not.be.defined;

                    expect(crime.id).to.be.defined;
                    expect(crime.type).to.be.defined;
                    expect(crime.description).to.be.defined;
                    expect(crime.case_number).to.be.defined;
                    expect(crime.date_time).to.be.defined;
                    expect(crime.latitude).to.be.defined;
                    expect(crime.longitude).to.be.defined;
                });
                done();
            });
        });
    });
});
