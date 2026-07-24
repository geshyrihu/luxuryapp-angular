import fs from 'fs';
import path from 'path';

const dir = process.argv[2] || 'client/angular/src/app/apps';

function processFile(filePath) {
    if (filePath.includes('.spec.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    if (filePath.endsWith('.html')) {
        content = content.replace(/style\s*=\s*\"[^\"]*\"/gs, '');
        content = content.replace(/\[style\]\s*=\s*\"[^\"]*\"/gs, '');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated HTML styles: ${filePath}`);
    }
}

function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.html'))) {
            processFile(fullPath);
        }
    }
}

walk(dir);
console.log('Done!');
