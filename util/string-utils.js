
/**
 * Extract SSML from the output response
 * @param {*} data 
 */
function extractSSML(data) {
    return data.response.outputSpeech.ssml;
}

/**
 * Extracts the question number from a question 
 * and returns this as an integer
 * @param {*} questionText 
 */
function questionNumber(questionText) {
    let regexStr = /(?:Question )([0-9]+)/g;
    let match = regexStr.exec(questionText)
    if(match.length == 2) {
        return parseInt(match[1]);
    }
}

/**
 * Extracts the score 
 * and returns this as an integer
 * @param {*} text 
 */
function score(text) {
    let regexStr = /(?:You made )([0-9]+)( connections)/g;
    let match = regexStr.exec(text)
    if(match && match.length == 3) {
        return parseInt(match[1]);
    }
}

module.exports = {
    extractSSML,
    score,
    questionNumber
}