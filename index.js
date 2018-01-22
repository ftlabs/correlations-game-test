chai = require('chai');
expect = chai.expect;
chai.use(require('chai-string'));
chai.use(require('chai-http'));
should = require('should');
require('dotenv').config({path: './.env'})
// for code coverage instrumentation
server = require('../../Alexa /correlations-game/app');