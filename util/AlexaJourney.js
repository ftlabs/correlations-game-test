const LaunchRequest = require('../tests/fixtures/LaunchRequest')
const YesIntent = require('../tests/fixtures/YesIntent')

class AlexaJourney {
    
        constructor(sessionAttributes) {
            this.sessionAttributes = sessionAttributes || {};
            this.actions = [];
        }
        
        async execute() {            
            for (const fn of this.actions) {
                console.log(fn);
                try {
                    await fn()
                }
                catch(e) {
                    throw e;
                }
            }
        }

        launchGame() {
            this.actions.push(() =>
                chai.request(server)
                .post('/alexa/')
                .send(LaunchRequest)
                .then(res => {
                    expect(res.status).to.equal(200);
                    let data = JSON.parse(res.text);
                    let response = JSON.parse(res.text).response;
                    expect(data.response.outputSpeech.type).to.equal('SSML');
                    // the session must remain open for a user response
                    expect(data.response.shouldEndSession).to.equal(false);
                    // a welcome prompt must be provided.        
                    expect(data.response.outputSpeech.ssml).to.equal('<speakadssda> Welcome to Make Connections, an FT Labs game. For instructions, say "help". Shall we start playing? </speak>');
                })
            )
            return this;
        }
    
        sendYesIntent() {            
            let yesIntent = YesIntent;
            if(this.sessionAttributes) yesIntent.session.attributes = this.sessionAttributes;            
            this.actions.push(() =>
                chai.request(server)
                .post('/alexa/')
                .send(yesIntent)
                .then(res => {
                    let data = JSON.parse(res.text);        
                    expect(res.status).to.equal(200);
                    if(data.sessionAttributes) {
                        this.sessionAttributes = data.sessionAttributes;
                    }
                })
            )
            return this;
        }
    }

    module.exports = new AlexaJourney();