import fs from 'fs';
import path from 'path';

const searchDir = 'D:/repos/luxuryapp-api/client/angular/src/app';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Remove [noPadding]="true" from <ili-list-item>
    // This regex looks for [noPadding]="true" and removes it, handling spaces/newlines
    content = content.replace(/(\<ili-list-item[^>]*?)\s*\[noPadding\]="true"([^>]*\>)/g, '$1$2');

    // 2. Add 'end' to <ili-action-menu> if it doesn't already have it
    // The regex matches <ili-action-menu ... > ensuring 'end' is not already an attribute
    content = content.replace(/<ili-action-menu(?![^>]*\bend\b)([^>]*)>/g, '<ili-action-menu end$1>');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

processDirectory(searchDir);
console.log('Finished processing mobile views.');
