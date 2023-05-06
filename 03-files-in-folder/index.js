const fs = require('fs');
const path = require('path');

async function listDir(dir) {
  let dirPath = path.join(__dirname, dir);
  try {
    var files = await fs.promises.readdir(dirPath, { withFileTypes: true });

    files.forEach(async f => {
      // let res = '';
      if (f.isFile()) {
        let fullName = f.name;
        let filePath = path.join(dirPath, fullName);
        let extension = path.extname(fullName).slice(1);
        let name = path.parse(f.name).name;

        let size = (await fs.promises.stat(filePath)).size;
        console.log(`${name} - ${extension} - ${size}b`);
      }
    });
  } catch (err) {
    console.error('Error occurred while reading directory!', err);
  }
}

listDir('secret-folder');
