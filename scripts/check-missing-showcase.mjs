import fs from 'fs';
import path from 'path';

// 1. Load the generated TS file (we can parse it simply with a regex since it's a static file)
const dictionaryContent = fs.readFileSync(path.join(process.cwd(), 'src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/shared/ui-dictionary.ts'), 'utf8');

const selectorRegex = /selector:\s*'([^']+)'/g;
let match;
const allSelectors = new Set();
while ((match = selectorRegex.exec(dictionaryContent)) !== null) {
    if (match[1] && match[1] !== 'Unknown') {
        allSelectors.add(match[1]);
    }
}

// 2. Scan all HTML and TS template files in catalog-component-ui
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.html') || file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const catalogDir = path.join(process.cwd(), 'src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui');
const filesToScan = getAllFiles(catalogDir, []);

const usedSelectors = new Set();
filesToScan.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Extract everything that looks like a tag
    const tagRegex = /<([a-zA-Z0-9-]+)/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(content)) !== null) {
        usedSelectors.add(tagMatch[1]);
    }
});

// 3. Compare and output missing
const missing = [];
allSelectors.forEach(selector => {
    // PrimeNG wrappers like custom-input-* might be used, check exact match
    if (!usedSelectors.has(selector) && !usedSelectors.has(selector.toLowerCase())) {
        missing.push(selector);
    }
});

console.log(`Total components extracted: ${allSelectors.size}`);
console.log(`Total missing from visual catalog: ${missing.length}`);
console.log('Missing components:');
console.log(missing.join(', '));
