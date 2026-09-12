const fs = require('fs');
const filepath = 'artifacts/git-commit-push-hackathon/src/App.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Update Rounds titles
content = content.replace(/title: 'The Qualifier',/g, "title: 'Round 1',");
content = content.replace(/title: 'The Offline Hack',/g, "title: 'Round 2',");
content = content.replace(/title: 'The Nepal Finale',/g, "title: 'The Winning Ticket',");

// Update Timeline/Milestone titles
content = content.replace(/title: 'Nepal finale',/g, "title: 'The Winning Ticket',");

// Update textual references from 'finale' to 'trip' or 'destination'
content = content.replace(/finale launch in/gi, 'trip launch in');
content = content.replace(/origin\/main → finale/gi, 'origin/main → destination');
content = content.replace(/Nepal finale starts in/gi, 'Nepal trip starts in');
content = content.replace(/A four-day finale trip/gi, 'A four-day winning trip');
content = content.replace(/finale worth building toward/gi, 'destination worth building toward');
content = content.replace(/finale itinerary/gi, 'winning itinerary');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Text replacements done.');
