const fs = require('fs');
const path = 'src/app/donate/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const heroEnd = content.indexOf('{/* Who We Serve Section');
const whoWeServeStart = heroEnd;
const howToGiveStart = content.indexOf('{/* How to give? Section');
const howToGiveEnd = content.indexOf('{/* Footer Banner');

const beforeHeroEnd = content.slice(0, heroEnd);
const whoWeServeAndGoal = content.slice(whoWeServeStart, howToGiveStart);
const howToGive = content.slice(howToGiveStart, howToGiveEnd);
const footerAndEnd = content.slice(howToGiveEnd);

let newContent = beforeHeroEnd + howToGive + whoWeServeAndGoal + footerAndEnd;

newContent = newContent
    .replace('mt-[85px]', 'mt-[130px]')
    .replace('h-[calc(100vh-85px)]', 'h-[calc(100vh-130px)]');

fs.writeFileSync(path, newContent, 'utf8');
console.log('Reordered successfully');
