const helper = require('../correlations-service/helpers/test-helper')

/**
 * 
 * @param {*} question 
 */
function correctAnswer(question) {
    const extractedPeople = helper.getPeopleFromQuestion(question);
    return helper.getCorrectAnswer(extractedPeople.personX, extractedPeople.people)
    .then(person => person)
    .catch(err => console.log(error));
}

/**
 * Retrieve the incorrect answer for a question
 * @param {*} question 
 */
async function incorrectAnswer(question) {
    const extractedPeople = helper.getPeopleFromQuestion(question);
    let answer = await helper.getIncorrectAnswer(extractedPeople.personX, extractedPeople.people);
    return answer;
}

module.exports = {
    correctAnswer,
    incorrectAnswer
}