require('../index');
const LaunchRequest = require('./fixtures/LaunchRequest.json');
const YesIntent = require('./fixtures/YesIntent');
const questionUtils = require('../util/game-utils');
const textUtils = require('../util/string-utils');
const Actions = require('../util/test-actions')
const actions = new Actions();
const addContext = require('mochawesome/addContext');
const OutputText = require('../tests/fixtures/OutputText');
require('./helpers/hooks');

describe('Launch Make Connections', function () {

  beforeEach(() => {
    actions.clear();
  });

  /**
   * Launch Make Connections
   */
  it('Should Respond with "Make Connections" welcome text.', function (done) {
    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          let data = await actions.launchMakeConnections();
          expect(data).to.have.speech(OutputText.WELCOME_SSML);
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
   */
  it('Should be able to start a new game', function (done) {

    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          let data = await actions.launchMakeConnections();
          data = await actions.sendYesIntent();
          expect(data).to.have.speech('Question 1');
          expect(data.response.shouldEndSession).to.equal(false);
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
   * Answer incorrectly
   * Start a new game
   */
  it('Should be able to start a new game after answering a question incorrectly', function (done) {
    
        chai.request(server)
          .post('/alexa/')
          .send(LaunchRequest)
          .end(async (err, res) => {
            expect(res.status).to.equal(200);
            try {
              //Launch game
              let data = await actions.launchMakeConnections();
              data = await actions.sendYesIntent();
              expect(data.response.shouldEndSession).to.equal(false);

              //Answer question incrorrectly
              data = await actions.answerQuestionIncorrectly(data.response.outputSpeech.ssml);
              expect(data).to.have.speech("That was not the correct answer");
              data = await actions.sendYesIntent();
              expect(data).to.be.question(1);                                  
              done();
            }
            catch(e) {
                done(e)
            }
          });
      });
});
