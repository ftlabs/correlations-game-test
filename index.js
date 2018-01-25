chai = require('chai');
expect = chai.expect;
chai.use(require('chai-string'));
chai.use(require('chai-http'));
should = require('should');
require('./util/custom-assertions')
require('dotenv').config({path: './.env'})
const correlationsPath = process.env.CORRELATIONS_GAME_PATH;
console.log(correlationsPath)
// for code coverage instrumentation
server = require(correlationsPath);

