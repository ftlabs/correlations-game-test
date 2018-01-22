require('../index');
const LaunchRequest = require('./fixtures/LaunchRequest.json');
const YesIntent = require('./fixtures/YesIntent');
const questionUtils = require('../util/game-utils');
const Actions = require('../util/test-actions')
const actions = new Actions();


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
          await actions.launchMakeConnections();
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
          expect(data.response.outputSpeech.type).to.equal('SSML');
          expect(data.response.shouldEndSession).to.equal(false);
          done();
        }
        catch (e) {
          done(e)
        }
      });
  });


});
