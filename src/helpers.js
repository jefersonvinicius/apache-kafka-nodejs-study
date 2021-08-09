const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

module.exports = {
  delay(seconds) {
    return new Promise((resolve) => setTimeout(() => resolve(), seconds * 100));
  },
  input(msg) {
    return new Promise((resolve) => {
      rl.question(msg, (answer) => resolve(answer));
    });
  },
};
