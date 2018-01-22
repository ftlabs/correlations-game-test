const LaunchRequest = require('../tests/fixtures/LaunchRequest');
const YesIntent = require('../tests/fixtures/YesIntent');
const AnswerIntent = require('../tests/fixtures/AnswerIntent');
const HelpIntent = require('../tests/fixtures/HelpIntent');
const questionUtils = require('./game-utils');

class Actions {
    constructor(sessionAttributes) {
        this.sessionAttributes = sessionAttributes || {};
    }

    /**
     * Clear Session Attributes & Assign a new Session Id;
     */
    clear() {
        this.sessionAttributes = {};
        this.incrementSessionId();
    }

    /**
     * Change the session ID
     */
    incrementSessionId() {
        AnswerIntent.session.sessionId = parseInt(AnswerIntent.session.sessionId) + 1;
        YesIntent.session.sessionId = parseInt(YesIntent.session.sessionId) + 1;
        LaunchRequest.session.sessionId = parseInt(LaunchRequest.session.sessionId) + 1;
        HelpIntent.session.sessionId = parseInt(HelpIntent.session.sessionId) + 1;
    }

    /**
     * Send a Launch Request to make connections
     */
    launchMakeConnections() {
        let self = this;
        return chai.request(server)
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
                expect(data.response.outputSpeech.ssml).to.equal('<speak> Welcome to Make Connections, an FT Labs game. For instructions, say "help". Shall we start playing? </speak>');
                self.sessionAttributes = data.sessionAttributes;
                return data;
            })
    }

    /**
     * Send a YesIntent to Alexa
     * @param {*} sessionAttributes 
     */
    sendYesIntent() {
        let yesIntent = YesIntent;
        if (this.sessionAttributes) {
            yesIntent.session.attributes = this.sessionAttributes;
        }
        let self = this;
        return chai.request(server)
            .post('/alexa/')
            .send(yesIntent)
            .then(res => {
                let data = JSON.parse(res.text);
                expect(res.status).to.equal(200);
                self.sessionAttributes = data.sessionAttributes;
                return data;
            })
    }

    /**
     * Send a NoIntent to Alexa
     * @param {*} sessionAttributes 
     */
    sendNoIntent() {
        let yesIntent = YesIntent;
        if (this.sessionAttributes) {
            yesIntent.session.attributes = this.sessionAttributes;
        }
        let self = this;
        return chai.request(server)
            .post('/alexa/')
            .send(yesIntent)
            .then(res => {
                let data = JSON.parse(res.text);
                expect(res.status).to.equal(200);
                self.sessionAttributes = data.sessionAttributes;
                return data;
            })
    }

    /**
     * Sends a HelpIntent to Alexa
     */
    sendHelpIntent() {
        let helpIntent = HelpIntent;
        if (this.sessionAttributes) {
            helpIntent.session.attributes = this.sessionAttributes;
        }
        let self = this;
        return chai.request(server)
            .post('/alexa/')
            .send(helpIntent)
            .then(res => {
                let data = JSON.parse(res.text);
                expect(res.status).to.equal(200);
                self.sessionAttributes = data.sessionAttributes;
                return data;
            })
    }

    /**
     * Given a question string, send the correct answer to Alexa
     * @param {*} question 
     */
    answerQuestionCorrectly(question) {
        let answerSlots;
        let answerIntent = AnswerIntent;
        if (this.sessionAttributes) answerIntent.session.attributes = this.sessionAttributes;
        let self = this;
        return new Promise((resolve, reject) => {
            questionUtils.correctAnswer(question).then(answer => {
                answerSlots = [{ name: 'Answer', value: answer }];
                answerIntent.request.intent.slots = formatSlots(answerSlots)
                chai.request(server)
                    .post('/alexa/')
                    .send(answerIntent)
                    .then(res => {
                        let data = JSON.parse(res.text);
                        expect(res.status).to.equal(200);
                        self.sessionAttributes = data.sessionAttributes;
                        resolve(data)
                    })
                    .catch(e => reject(e));
            });
        });
    }

    /**
     * Given a question string, send the incorrect answer to alexa.
     * @param {*} question 
     */
    answerQuestionIncorrectly(question) {
        let answerSlots;
        let answerIntent = AnswerIntent;
        if (this.sessionAttributes) answerIntent.session.attributes = this.sessionAttributes;
        let self = this;
        return new Promise((resolve, reject) => {
            questionUtils.incorrectAnswer(question).then(answer => {
                answerSlots = [{ name: 'Answer', value: answer }];
                answerIntent.request.intent.slots = formatSlots(answerSlots)
                chai.request(server)
                    .post('/alexa/')
                    .send(answerIntent)
                    .then(res => {
                        let data = JSON.parse(res.text);
                        expect(res.status).to.equal(200);
                        self.sessionAttributes = data.sessionAttributes;
                        resolve(data)
                    })
                    .catch(e => reject(e));
            });
        });
    }

    /**
     * Answer a question with a given response string
     * @param {*} response 
     */
    answerQuestion(response) {
        let answerSlots;
        let answerIntent = AnswerIntent;
        if (this.sessionAttributes) answerIntent.session.attributes = this.sessionAttributes;
        let self = this;
        return new Promise((resolve, reject) => {
            answerSlots = [{ name: 'Answer', value: response }];
            answerIntent.request.intent.slots = formatSlots(answerSlots)
            chai.request(server)
                .post('/alexa/')
                .send(answerIntent)
                .then(res => {
                    let data = JSON.parse(res.text);
                    expect(res.status).to.equal(200);
                    self.sessionAttributes = data.sessionAttributes;
                    resolve(data)
                })
                .catch(e => reject(e));
        });
    }
}

/**
 * Send a NoIntent to Alexa
 * @param {*} sessionAttributes 
 */
async function sendNoIntent() {
    if (this.sessionAttributes) YesIntent.session.attributes = this.sessionAttributes;
    let self = this;
    let response = await chai.request(server)
        .post('/alexa/')
        .send(NoIntent)
        .then(res => {
            let data = JSON.parse(res.text);
            expect(res.status).to.equal(200);
            return data
        })
    return response;
}

/**
 * Format slots for intent format
 * @param {*} slots 
 */
function formatSlots(slots) {
    let formattedSlots = {};
    for (let s of slots) {
        formattedSlots[s.name] = {
            name: s.name,
            value: s.value
        }
    }
    return formattedSlots;
}

module.exports = Actions;