/*
 * Test the models
 */

process.env.NODE_ENV = 'test';

var chai = require('chai'),
    assert = chai.assert,
    config = require('../config'),
    app = require('../app'),
    supertest = require('supertest'),
    models = require('../models');

