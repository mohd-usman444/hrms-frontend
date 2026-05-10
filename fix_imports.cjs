const fs = require('fs');
const path = require('path');

const directoryPath = 'c:\\Users\\pc\\Desktop\\HRMS\\client\\src\\pages';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  content = content.replace(/from '\.\.\/\.\.\/\.\.\/services\/api'/g, "from '../../services/api'");
  content = content.replace(/from '\.\.\/\.\.\/common\/Spinner'/g, "from '../../components/common/Spinner'");
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(directoryPath);
console.log('Done');
