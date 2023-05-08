const fs = require('fs');
const path = require('path');

const newDirPath = path.join(__dirname, 'project-dist');
const newStyleFile = path.join(newDirPath, 'style.css');

fs.promises.mkdir(newDirPath, { recursive: true });

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

async function copyAssets() {

  const oldAssetsDir = path.join(__dirname, 'assets');
  const newAssetsDir = path.join(newDirPath, 'assets');

  copyDir(oldAssetsDir, newAssetsDir);
}

async function copyDir(sourceDir, targetDir) {
  try {
    let sourceDirItems = await fs.promises.readdir(sourceDir, { withFileTypes: true });
    sourceDirItems.forEach(async item => {
      if (item.isDirectory()) {
        let sourceChildDir = path.join(sourceDir, item.name);
        let targetChildDir = path.join(targetDir, item.name);
        await fs.promises.mkdir(targetChildDir, { recursive: true });
        await copyDir(sourceChildDir, targetChildDir)
      }
      else if (item.isFile) {
        let sourceFile = path.join(sourceDir, item.name);
        let targetFile = path.join(targetDir, item.name);
        await fs.promises.copyFile(sourceFile, targetFile);
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