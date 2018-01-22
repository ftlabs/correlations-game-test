require('../index');
const LaunchRequest = require('./fixtures/LaunchRequest.json');
const YesIntent = require('./fixtures/YesIntent');
const questionUtils = require('../util/game-utils');
const Actions = require('../util/test-actions')
const actions = new Actions();

describe('Answering Questions', function () {

    beforeEach(() => {
        actions.clear();
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
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data.response.outputSpeech.type).to.equal('SSML');
                    expect(data.response.shouldEndSession).to.equal(false);
                    expect(data.response.outputSpeech.ssml).to.contain("Correct!");
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
    it('Should be able to answer two questions correctly', function (done) {
        chai.request(server)
            .post('/alexa/')
            .send(LaunchRequest)
            .end(async (err, res) => {
                expect(res.status).to.equal(200);
                try {
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data.response.outputSpeech.ssml).to.contain("Correct!");
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data.response.outputSpeech.ssml).to.contain("Correct!");
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