const fs = require('fs');
const path = require('path');

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F200}-\u{1F251}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    if(filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('.next')) return;
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if(filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
          const lines = fs.readFileSync(filePath, 'utf8').split('\n');
          for(let i=0; i<lines.length; i++) {
              if(EMOJI_REGEX.test(lines[i])) {
                  // highlight the emoji line
                  results.push(`${filePath}:${i+1} : ${lines[i].trim()}`);
              }
          }
      }
    }
  });
  return results;
}

const res = walk('./career-guidance-frontend');
console.log("Found Emojis:");
console.log(res.join('\n'));
