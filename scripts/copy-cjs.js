const fs = require('fs');
const path = require('path');

function copyAndRename(srcDir, destDir, srcExt, destExt) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  function processDirectory(currentSrcDir, currentDestDir) {
    const items = fs.readdirSync(currentSrcDir);

    items.forEach(item => {
      const srcPath = path.join(currentSrcDir, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        const newDestDir = path.join(currentDestDir, item);
        if (!fs.existsSync(newDestDir)) {
          fs.mkdirSync(newDestDir, { recursive: true });
        }
        processDirectory(srcPath, newDestDir);
      } else if (path.extname(item) === srcExt) {
        const baseName = path.basename(item, srcExt);
        const destPath = path.join(currentDestDir, baseName + destExt);
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      }
    });
  }

  processDirectory(srcDir, destDir);
}

// Copy .js files as .cjs
copyAndRename('./dist-cjs', './dist', '.js', '.cjs');

// Clean up temporary directory
fs.rmSync('./dist-cjs', { recursive: true, force: true });

console.log('CommonJS build completed!'); 