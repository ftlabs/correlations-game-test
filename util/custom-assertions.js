const Assertion = require('chai').Assertion;
const stringUtils = require('./string-utils');
const assert = require('chai').assert;

// this.assert(
//     obj._type === type
//   , "expected #{this} to be of type #{exp} but got #{act}"
//   , "expected #{this} to not be of type #{act}"
//   , type        // expected
//   , obj._type   // actual
// );


/**
 * Check that data contains a question
 * Number - Optional number parameter of the question to check 
 */
Assertion.addMethod('question', function (number = null) {
  const obj = this._obj;
  let ssml = obj.response.outputSpeech.ssml;

  new Assertion(ssml).to.contain('Question');
  if (number) {
    const questionNum = stringUtils.questionNumber(ssml);
    new Assertion(number).to.equal(questionNum);
  }
});

/**
 * Check that data contains speech
 * Number - Optional speech parameter of the string to check 
 */
Assertion.addMethod('speech', function (speech = null) {
  const obj = this._obj;
  let ssml = obj.response.outputSpeech.ssml;
  new Assertion(obj.response.outputSpeech.type).to.equal('SSML');
  if (speech) {
    new Assertion(ssml).to.contain(speech);
  }
});

/**
 * Check the score 
 * Number - The expected score 
 */
Assertion.addMethod('score', function (expectedScore = null) {
  const obj = this._obj;
  let ssml = obj.response.outputSpeech.ssml;
  if (typeof expectedScore != 'number') {
    assert.fail(typeof expectedScore, 'number', "Expected score must be a number", "+");
  }
  const actualScore = stringUtils.score(ssml);
  this.assert(expectedScore === actualScore,
    `Expected a score of ${expectedScore} but the score was ${actualScore}`)
});


/**
 * Check the state of a response
 * State - 
 */
Assertion.addMethod('state', function (expectedState = null) {
  const obj = this._obj;
  let currentState = obj.sessionAttributes.STATE;
  if (expectedState) {
    ;
    new Assertion(currentState).to.equal(expectedState);
  }
});

//expect(data.sessionAttributes.STATE).to.equal('_HELPMODE')

// chai.use(function (_chai, utils) {
//   function assertSpeech (n) {
//     // make sure we have an age and its a number
//     console.log(this._obj)
//     //var age = this._obj.get('age');
//     new Assertion(n).to.be.a('number');
//   }

//   function speech () {
//     const date = utils.flag(this, 'object')
//     expect(date.getUTCFullYear()).to.eql(expected)
//   }

// Assertion.addChainableMethod('speech', assertScore, chainScore);

// });
