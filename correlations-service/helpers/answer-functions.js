const helper = require('../../../helpers/helper');
const correlationsHelper = require('./test-helper');

const stringToFunction = {
    "correctAnswer": correctAnswer,
    "incorrectAnswer": incorrectAnswer,
    "misunderstoodAnswer": misunderstoodAnswer
};

function correctAnswer(outputSpeech) {
    const speech = helper.processSpeech(outputSpeech);
    const possiblePeople = correlationsHelper.getPeopleFromQuestion(speech);
    return correlationsHelper.getCorrectAnswer(possiblePeople.personX, possiblePeople.people);
}

function incorrectAnswer(outputSpeech) {
    const speech = helper.processSpeech(outputSpeech);
    const possiblePeople = correlationsHelper.getPeopleFromQuestion(speech);
    return correlationsHelper.getIncorrectAnswer(possiblePeople.personX, possiblePeople.people);
}

function misunderstoodAnswer(outputSpeech) {
    return "NOT AN ANSWER";
}

module.exports = stringToFunction;
