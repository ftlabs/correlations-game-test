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
  it('Should be able to ask for help from the welcome screen and return to a new question.', function (done) {
    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          await actions.launchMakeConnections();
          let data = await actions.sendHelpIntent();
          expect(data).to.have.speech('"Make Connections" is a quiz game that tests your knowledge of people in the news.')
          expect(data).to.have.speech("Would you like to play now?");
          expect(data).to.be.state('_HELPMODE');          
          data = await actions.sendYesIntent();
          expect(data).to.have.speech('Question 1.');
          expect(data).to.be.state('_QUIZMODE');          
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
  it('Should be able to ask for help from within a question and return to that question', function (done) {
    chai.request(server)
      .post('/alexa/')
      .send(LaunchRequest)
      .end(async (err, res) => {
        expect(res.status).to.equal(200);
        try {
          await actions.launchMakeConnections();
          let data = await actions.sendYesIntent();
          expect(data).to.have.speech('Question 1.');
          expect(data).to.be.state('_QUIZMODE');          
          data = await actions.sendHelpIntent();
          expect(data).to.have.speech('"Make Connections" is a quiz game that tests your knowledge of people in the news.')
          expect(data).to.have.speech("Would you like to continue your game?");
          expect(data).to.be.state('_HELPMODE')          
          data = await actions.sendYesIntent();
          expect(data).to.have.speech('Question 1.');
          expect(data).to.be.state('_QUIZMODE');          
          done();
        }
        catch (e) {
          done(e)
        }
      });
  });


});
