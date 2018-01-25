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
                    //Start Game
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();
                    
                    //First Question
                    expect(data).to.have.speech("Question 1.");
                    expect(data.response.shouldEndSession).to.equal(false);

                    //Repeat question
                    data = await actions.sendRepeatIntent();                    
                    expect(data).to.have.speech("Question 1.");
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
                    //Start game
                    await actions.launchMakeConnections();
                    let data = await actions.sendYesIntent();

                    //Get first question
                    expect(data).to.be.question(1);
                
                    //Answer question
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
            
                    expect(data.response.shouldEndSession).to.equal(false);
                    expect(data).to.have.speech("Correct!");

                    //Next question
                    expect(data).to.be.question(2);                    
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
                    expect(data).to.be.question(1);
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data).to.have.speech("Correct!");

                    //Ask Second question
                    expect(data).to.be.question(2);                  
                      
                    data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
                    expect(data).to.have.speech("Correct!");

                    //Should be on the third question
                    expect(data).to.be.question(3);
                    
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
                    expect(data.response.shouldEndSession).to.equal(false);
                    expect(data).to.have.speech("That was not the correct answer.");
                    expect(data).have.score(0)
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
                    expect(data.response.shouldEndSession).to.equal(false);
                    expect(data).to.have.speech("Sorry, I did not understand that.")
                    done();
                }
                catch (e) {
                    done(e)
                }
            });
    });

});