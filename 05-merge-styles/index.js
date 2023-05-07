const fs = require('fs');
const path = require('path');

const newPath = path.join(__dirname, 'project-dist', 'bundle.css');

async function createCssBundle() {
  const stylesDir = path.join(__dirname, 'styles');
  try {
    await fs.promises.writeFile(newPath, '');
    let files = await fs.promises.readdir(stylesDir, { withFileTypes: true });

    files.forEach(async f => {
      if (f.isFile()) {
        let fullName = path.join(stylesDir, f.name);
        let extension = path.extname(fullName);
        if (extension == '.css') {
          let content = await fs.promises.readFile(fullName, 'utf8');
          await fs.promises.appendFile(newPath, content);
        }
      }
    });
  } catch (e) {
    console.error(`The file could not be copied: ${e}`);
  }
}

createCssBundle();

