const fs = require('fs');
const path = require('path');

const newDirPath = path.join(__dirname, 'project-dist');
fs.promises.mkdir(newDirPath, { recursive: true });

const newStyleFile = path.join(newDirPath, 'style.css');

async function createStyleCss() {
  const stylesDir = path.join(__dirname, 'styles');
  try {
    await fs.promises.writeFile(newStyleFile, '');
    let files = await fs.promises.readdir(stylesDir, { withFileTypes: true });

    files.forEach(async f => {
      if (f.isFile()) {
        let fullName = path.join(stylesDir, f.name);
        let extension = path.extname(fullName);
        if (extension == '.css') {
          let content = await fs.promises.readFile(fullName, 'utf8');
          await fs.promises.appendFile(newStyleFile, content);
        }
      }
    });
  } catch (e) {
    console.error(`The file could not be copied: ${e}`);
  }
}

const oldAssetsDir = path.join(__dirname, 'assets');

async function copyAssets() {
  const newAssetsDir = path.join(newDirPath, 'assets');
  const newFontsDir = path.join(newAssetsDir, 'fonts');
  const newImgDir = path.join(newAssetsDir, 'img');
  const newSvgDir = path.join(newAssetsDir, 'svg');

  try {
    await fs.promises.mkdir(newAssetsDir, { recursive: true });
    let dirItems = await fs.promises.readdir(oldAssetsDir, { withFileTypes: true });

    dirItems.forEach(async d => {
      if (d.isDirectory()) {
        let oldAssetsInnerFolder = d.name;
        await fs.promises.mkdir(newFontsDir, { recursive: true });
        await fs.promises.mkdir(newImgDir, { recursive: true });
        await fs.promises.mkdir(newSvgDir, { recursive: true });

        let sourceAssetsFolder = path.join(oldAssetsDir, oldAssetsInnerFolder);

        let files = await fs.promises.readdir(sourceAssetsFolder, { withFileTypes: true });
        files.forEach(async (f) => {
          if (f.isFile()) {
            let fileName = f.name;
            let extension = path.extname(fileName);
            let oldFilePath = path.join(sourceAssetsFolder, fileName);
            if (extension == '.svg') {
              let newFilePath = path.join(newSvgDir, fileName);
              await fs.promises.copyFile(oldFilePath, newFilePath);
            }
            else if (extension == '.jpg') {
              let newFilePath = path.join(newImgDir, fileName);
              await fs.promises.copyFile(oldFilePath, newFilePath);
            }
            else {
              let newFilePath = path.join(newFontsDir, fileName);
              await fs.promises.copyFile(oldFilePath, newFilePath);
            }
          }
        })
      }
    });
  } catch (e) {
    console.error(`The file could not be copied: ${e}`);
  }
}

async function createHtmlFile() {
  const componentsDir = path.join(__dirname, 'components');
  const newHtmlFile = path.join(newDirPath, 'index.html');
  const templateFilePath = path.join(__dirname, 'template.html');

  let templateContent = await getContent(templateFilePath);

  await fs.promises.writeFile(newHtmlFile, '');
  await fs.promises.copyFile(templateFilePath, newHtmlFile);

  let files = await fs.promises.readdir(componentsDir, { withFileTypes: true });

  for (f of files) {
    let extension = path.extname(f.name);
    if (extension == '.html') {
      let name = path.parse(f.name).name;
      let fullPath = path.join(componentsDir, f.name);

      let content = await getContent(fullPath);
      let regexp = `{{${name}}}`;
      templateContent = templateContent.replace(regexp, content);

    }
  }
  await fs.promises.writeFile(newHtmlFile, templateContent);
}

async function getContent(filePath) {
  let content = await fs.promises.readFile(filePath, 'utf8');
  return content;
}

createStyleCss();
copyAssets();
createHtmlFile();