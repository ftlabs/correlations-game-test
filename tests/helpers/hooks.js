const fetchJoke = require('../../util/joke');
const addContext = require('mochawesome/addContext');

// Add a joke to each failed test.
afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      let joke = await fetchJoke()
      addContext(this, `Joke: ${joke.joke}`);   
    }
  });

