const fs = require('fs');
const path = require('path');

async function copyDir() {
  const newDirPath = path.join(__dirname, 'files-copy');
  const oldDirPath = path.join(__dirname, 'files');

  try {
    await fs.promises.mkdir(newDirPath, { recursive: true });
    let files = await fs.promises.readdir(oldDirPath, { withFileTypes: true });

    files.forEach(async f => {
      if (f.isFile()) {
        let fullName = f.name;
        let oldFilePath = path.join(oldDirPath, fullName);
        let newFilePath = path.join(newDirPath, fullName);

        await fs.promises.copyFile(oldFilePath, newFilePath);
      }
    });
  } catch (e) {
    console.error(`The file could not be copied: ${e}`);
  }
}

copyDir();

