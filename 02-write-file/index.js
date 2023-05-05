const fs = require('fs');
const path = require('path');
const readline = require('readline');

let filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Здравствуй!');
console.log('Как дела?');

process.on('exit', (code) => {
  console.log('Засим прощаюсь. Успехов!');
});

rl
  .on('line', function (line) {
    if (line === "exit") {
      process.exit();
    }

    fs.appendFile(filePath, `${line}\n`, function () {
      console.log('Как дела?');
    })


  });
