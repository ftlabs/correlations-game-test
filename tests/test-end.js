require('../index');
const LaunchRequest = require('./fixtures/LaunchRequest.json');
const YesIntent = require('./fixtures/YesIntent');
const questionUtils = require('../util/game-utils');
const Actions = require('../util/test-actions')
const actions = new Actions();
const OutputText = require('./fixtures/OutputText');


describe('End Make Connections', function () {

  beforeEach(() => {
    actions.clear();
  });


  /**
   * Launch Make Connections
   */
  it('Should be able to end the game during a question', function (done) {
    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          await actions.launchMakeConnections();
          await actions.sendYesIntent();
          let data = await actions.sendStopIntent();
          expect(data).to.have.speech(OutputText.CONTINUE_GAME_SSML)
          data = await actions.sendNoIntent();
          expect(data).to.have.speech(OutputText.EXIT_SSML);          
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
  it('Should be able to end a game after an incorrect answer', function (done) {
    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          await actions.launchMakeConnections();
          let data = await actions.sendYesIntent();
          data = await actions.answerQuestionCorrectly(data.response.outputSpeech.ssml);
          data = await actions.sendStopIntent();
          expect(data).to.have.speech(OutputText.CONTINUE_GAME_SSML)
          data = await actions.sendNoIntent();
          expect(data).to.have.speech(OutputText.EXIT_SSML);          
          done();
        }
        catch (e) {
          done(e)
        }
      });
  });


});
