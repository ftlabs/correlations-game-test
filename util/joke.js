
function fetchJoke() {
    return fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(function (data) {
        return data
    }).catch(function (error) {
        console.log('Joke Request failed', error);
    });
  }

module.exports = fetchJoke;