const fs = require('fs');
const path = require('path');

let filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');

readableStream.on('data', data => console.log(data));
readableStream.on('error', error => console.log('Error', error.message));
