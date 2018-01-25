const LaunchRequest = require('../tests/fixtures/LaunchRequest');
const YesIntent = require('../tests/fixtures/YesIntent');
const NoIntent = require('../tests/fixtures/NoIntent');
const AnswerIntent = require('../tests/fixtures/AnswerIntent');
const RepeatIntent =  require('../tests/fixtures/RepeatIntent');
const HelpIntent = require('../tests/fixtures/HelpIntent');
const StopIntent = require('../tests/fixtures/StopIntent');
const StartOverIntent = require('../tests/fixtures/StartOverIntent');
const questionUtils = require('./game-utils');
const OutputText = require('../tests/fixtures/OutputText');
const stringUtil = require('../util/string-utils');

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
        NoIntent.session.sessionId = parseInt(NoIntent.session.sessionId) + 1;
        LaunchRequest.session.sessionId = parseInt(LaunchRequest.session.sessionId) + 1;
        HelpIntent.session.sessionId = parseInt(HelpIntent.session.sessionId) + 1;
        StopIntent.session.sessionId = parseInt(StopIntent.session.sessionId) + 1;
        StartOverIntent.session.sessionId = parseInt(StopIntent.session.sessionId) + 1;
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
                let ssml = stringUtil.extractSSML(data);
            
                expect(ssml).to.equal(OutputText.WELCOME_SSML);
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
        return this._sendIntent(yesIntent);
    }

    /**
     * Send a NoIntent to Alexa
     * @param {*} sessionAttributes 
     */
    sendNoIntent() {
        let noIntent = NoIntent;
        if (this.sessionAttributes) {
            noIntent.session.attributes = this.sessionAttributes;
        }
        let self = this;
        return this._sendIntent(noIntent);
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
        return this._sendIntent(helpIntent);
    }

    /**
     * Sends a stop intent to Alexa
     */
    sendStopIntent() {
        let stopIntent = StopIntent;
        if(this.sessionAttributes) {
            stopIntent.session.attributes = this.sessionAttributes;
        }
        return this._sendIntent(stopIntent)
    }

    /**
     * Sends a HelpIntent to Alexa
     */
    sendRepeatIntent() {
        let repeatIntent = RepeatIntent;
        if (this.sessionAttributes) {
            repeatIntent.session.attributes = this.sessionAttributes;
        }
        return this._sendIntent(repeatIntent);
    }

    /**
     * Sends a StartOverIntent to Alexa
     */
    sendStartOverIntent() {
        let startOverIntent = StartOverIntent;
        if (this.sessionAttributes) {
            startOverIntent.session.attributes = this.sessionAttributes;
        }
        return this._sendIntent(startOverIntent)
    }

    /**
     * Given a question string, send the correct answer to Alexa
     * @param {*} question 
     */
    answerQuestionCorrectly(question) {
        let answerIntent = AnswerIntent;
        if (this.sessionAttributes) answerIntent.session.attributes = this.sessionAttributes;
        let self = this;
        return new Promise((resolve, reject) => {
            questionUtils.correctAnswer(question).then(answer => {
                let answerSlots = [{ name: 'Answer', value: answer }];
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
        let answerIntent = AnswerIntent;
        if (this.sessionAttributes) answerIntent.session.attributes = this.sessionAttributes;
        let self = this;
        return new Promise((resolve, reject) => {
            questionUtils.incorrectAnswer(question).then(answer => {
                let answerSlots = [{ name: 'Answer', value: answer }];
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

    /**
     * Sends an Intent Request to Alexa
     * @param {*} intent 
     */
    _sendIntent(intent) {
        let self = this;
        return chai.request(server)
            .post('/alexa/')
            .send(intent)
            .then(res => {
                let data = JSON.parse(res.text);
                expect(res.status).to.equal(200);
                self.sessionAttributes = data.sessionAttributes
                return data;
            })
    }
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