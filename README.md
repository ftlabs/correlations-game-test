# Alexa Tests

Prototype of using mocha to test the Alexa Make connections game.
### Installation
Install the dependencies
```sh
$ npm install
```
Run Tests

```sh
$ npm test
```
Generate Report
```sh
$ npm run test-html
```

## Usage

### Actions

Actions are commands that can be sent to the Alexa, e.g:

* launchMakeConnections()
* sendYesIntent()
* answerQuestionCorrectly()
* answerQuestionIncorrectly()
* sendHelpIntent()

Each action will return a promise, containing the response from the Alexa skill.
Each response will typically contain output speech(ssml), a card to render and any state/session attributes.

### Custom assertions

As well as the standard assertions includded within Chai, a few custom assertions are being built to further the reach of the tests and make existing assertions more semantic.
Custom assertions will always take a response recieved from an individual action, for example:

```javascript
let data = await launchMakeConnections()
expect(data).to.have.speech("Welcome to...")
```
Some other examples of custom assertions are:

* expect(data).to.be.a.question()
* expect(data).to.be.question(1)
* expect(data).to.have.score(2)
* expect(data).to.have.state('STATE')

### Enviroment Params
* CORRELATIONS_GAME_PATH - Pathway to the correlations game folder
* TEST_MODE - Set this to "TRUE"
* DATABASE - Should be set to "PRETEND" for testing
* CORRELATIONS_SERVICE_TOKEN
* CORRELATION_SERVICE_HOST
* APP_ID - Alexa App skill ID
