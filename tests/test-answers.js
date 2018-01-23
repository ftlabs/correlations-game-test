require('../index');
const LaunchRequest = require('./fixtures/LaunchRequest.json');
const YesIntent = require('./fixtures/YesIntent');
const questionUtils = require('../util/game-utils');
const stringUtils = require('../util/string-utils')
const Actions = require('../util/test-actions')
const actions = new Actions();

describe('Answering Questions', function () {

    beforeEach(() => {
        actions.clear();
    });

    /**
     * Launch Make Connections
     * Recieve the first question
     * Ask to repeat the first question
     */
    it('Should be able to repeat a question.', function (done) {
        chai.request(server)
            .post('/alexa/')
            .send(LaunchRequest)
            .end(async (err, res) => {
                expect(res.status).to.equal(200);
                try {
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();
                    expect(data.response.outputSpeech.ssml).to.contain("Question 1.");
                    expect(data.response.outputSpeech.type).to.equal('SSML');
                    expect(data.response.shouldEndSession).to.equal(false);
                    data = await actions.sendRepeatIntent();                    
                    expect(data.response.outputSpeech.ssml).to.contain("Question 1.");
                    done();
                }
                catch (e) {
                    done(e)
                }
            });
    });

    /**
     * Launch Make Connections
     * Recieve the first question
     * Answer the first question correctly
     */
    it('Should be able to answer a question correctly', function (done) {
        chai.request(server)
            .post('/alexa/')
            .send(LaunchRequest)
            .end(async (err, res) => {
                expect(res.status).to.equal(200);
                try {
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();
                    expect(stringUtils.questionNumber(data.response.outputSpeech.ssml)).to.equal(1)
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data.response.outputSpeech.type).to.equal('SSML');
                    expect(data.response.shouldEndSession).to.equal(false);
                    expect(data.response.outputSpeech.ssml).to.contain("Correct!");
                    expect(stringUtils.questionNumber(data.response.outputSpeech.ssml)).to.equal(2);
                    done();
                }
                catch (e) {
                    done(e)
                }
            });
    });

    /**
   * Launch Make Connections
   * Recieve the first question
   * Answer the first question correctly
   * Answer the second question correctly
   */
    it('Should be able to answer a follow up question correctly', function (done) {
        chai.request(server)
            .post('/alexa/')
            .send(LaunchRequest)
            .end(async (err, res) => {
                expect(res.status).to.equal(200);
                try {
                    //Start the game
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();

                    //Ask first question
                    expect(stringUtils.questionNumber(data.response.outputSpeech.ssml)).to.equal(1);
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data.response.outputSpeech.ssml).to.contain("Correct!");

                    //Ask Second question
                    expect(stringUtils.questionNumber(data.response.outputSpeech.ssml)).to.equal(2);                    
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data.response.outputSpeech.ssml).to.contain("Correct!");

                    //Should be on the third question
                    expect(stringUtils.questionNumber(data.response.outputSpeech.ssml)).to.equal(3);
                    
                    done();
                }
                catch (e) {
                    done(e)
                }
            });
    });

    /**
      * Launch Make Connections
      * Recieve the first question
      * Answer the first question incorrectly
      */
    it('Should be able to answer a question incorrectly', function (done) {
        chai.request(server)
            .post('/alexa/')
            .send(LaunchRequest)
            .end(async (err, res) => {
                expect(res.status).to.equal(200);
                try {
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();
                    data = await actions.answerQuestionIncorrectly(data.response.outputSpeech.ssml);
                    expect(data.response.outputSpeech.type).to.equal('SSML');
                    expect(data.response.shouldEndSession).to.equal(false);
                    expect(data.response.outputSpeech.ssml).to.contain("That was not the correct answer.");
                    expect(stringUtils.score(data.response.outputSpeech.ssml)).to.equal(0);
                    done();
                }
                catch (e) {
                    done(e)
                }
            });
    });

    /**
    * Launch Make Connections
    * Recieve the first question
    * Answer the first question with a unregistered response
    */
    it('Should be able to answer a question with a bad response', function (done) {
        chai.request(server)
            .post('/alexa/')
            .send(LaunchRequest)
            .end(async (err, res) => {
                expect(res.status).to.equal(200);
                try {
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();
                    data = await actions.answerQuestion('abcde');
                    expect(data.response.outputSpeech.type).to.equal('SSML');
                    expect(data.response.shouldEndSession).to.equal(false);
                    expect(data.response.outputSpeech.ssml).to.contain("Sorry, I did not understand that.");
                    done();
                }
                catch (e) {
                    done(e)
                }
            });
    });

});