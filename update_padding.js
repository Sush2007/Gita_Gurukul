const fs = require('fs');

function replaceFile(path, replacements) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        for (const [search, replace] of replacements) {
            content = content.replace(search, replace);
        }
        fs.writeFileSync(path, content, 'utf8');
        console.log('Updated ' + path);
    }
}

replaceFile('src/app/page.tsx', [
    ['pt-[80px]', 'pt-[130px]']
]);

replaceFile('src/app/about/page.tsx', [
    ['pt-[85px]', 'pt-[130px]'],
    ['calc(100vh-85px)', 'calc(100vh-130px)']
]);

replaceFile('src/app/faq/page.tsx', [
    ['pt-[120px]', 'pt-[140px]']
]);

replaceFile('src/app/privacy/page.tsx', [
    ['pt-[120px]', 'pt-[140px]']
]);

replaceFile('src/app/shop/page.tsx', [
    ['pt-[120px]', 'pt-[140px]']
]);

replaceFile('src/app/terms/page.tsx', [
    ['pt-[120px]', 'pt-[140px]']
]);

