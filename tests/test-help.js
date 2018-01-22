require('../index');
const LaunchRequest = require('./fixtures/LaunchRequest.json');
const YesIntent = require('./fixtures/YesIntent');
const questionUtils = require('../util/game-utils');
const Actions = require('../util/test-actions')
const actions = new Actions();


describe('Test Help Intent', function () {

  beforeEach(() => {
    actions.clear();
  });


  /**
   * Launch Make Connections
   * Ask for Help
   */
  it('Should be able to ask for help from the welcome screen', function (done) {
    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          await actions.launchMakeConnections();
          let data = await actions.sendHelpIntent();
          expect(data.response.outputSpeech.ssml).to.contain('"Make Connections" is a quiz game that tests your knowledge of people in the news.')
          expect(data.response.outputSpeech.ssml).to.contain("Would you like to play now?");
          done();
        }
        catch (e) {
          done(e)
        }
      });
  });

   /**
   * Launch Make Connections
   * Start the game
   * Ask for Help
   */
  it('Should be able to ask for help from within a question.', function (done) {
    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          await actions.launchMakeConnections();
          await actions.sendYesIntent();
          let data = await actions.sendHelpIntent();
          expect(data.response.outputSpeech.ssml).to.contain('"Make Connections" is a quiz game that tests your knowledge of people in the news.')
          expect(data.response.outputSpeech.ssml).to.contain("Would you like to continue your game?");
          done();
        }
        catch (e) {
          done(e)
        }
      });
  });


});
