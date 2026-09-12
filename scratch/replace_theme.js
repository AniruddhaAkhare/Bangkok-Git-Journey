const fs = require('fs');
const path = require('path');

const filepath = path.resolve('artifacts/git-commit-push-hackathon/src/App.tsx');
let content = fs.readFileSync(filepath, 'utf8');

// Imports and variables
content = content.replace(/bangkokMarketImage/g, 'nepalMarketImage');
content = content.replace(/watArunFestivalImage/g, 'swayambhuFestivalImage');
content = content.replace(/chaoPhrayaImage/g, 'himalayasImage');
content = content.replace(/'@assets\/bangkok\/bangkok-market\.jpg'/g, "'@assets/nepal/nepal-market.jpg'");
content = content.replace(/'@assets\/bangkok\/wat-arun-festival\.jpg'/g, "'@assets/nepal/swayambhunath-festival.jpg'");
content = content.replace(/'@assets\/bangkok\/chao-phraya-river\.jpg'/g, "'@assets/nepal/himalayas.jpg'");

// Specific phrases
content = content.replace(/Bangkok, Thailand/g, 'Kathmandu, Nepal');
content = content.replace(/Chao Phraya River/gi, 'Himalayan peaks');
content = content.replace(/Chao Phraya/gi, 'Himalayas');
content = content.replace(/Temple of dawn/gi, 'Monkey Temple');
content = content.replace(/wat arun/gi, 'Swayambhunath');

// Case sensitive Bangkok -> Nepal
content = content.replace(/Bangkok/g, 'Nepal');
content = content.replace(/bangkok/g, 'nepal');
content = content.replace(/BANGKOK/g, 'NEPAL');

// Thai -> Nepali
content = content.replace(/Thai/g, 'Nepali');
content = content.replace(/thai/g, 'nepali');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Replacements completed successfully.');
