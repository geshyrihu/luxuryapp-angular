import fs from 'fs';
import path from 'path';

const searchDir = 'D:/repos/luxuryapp-api/client/angular/src/app';

function processDirectory(dir, results) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath, results);
        } else if (fullPath.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<app-data-view-mobile')) {
                let addMatch = content.match(/<app-data-view-mobile[^>]*?\((?:add|addClicked)\)="([a-zA-Z0-9_]+)\(/);
                let editMatch = content.match(/<ili-button-edit[^>]*?\(clicked\)="([a-zA-Z0-9_]+)\(/);
                
                if (addMatch || editMatch) {
                    results.push({
                        file: fullPath.replace(searchDir, ''),
                        addMethod: addMatch ? addMatch[1] : null,
                        editMethod: editMatch ? editMatch[1] : null
                    });
                }
            }
        }
    }
}

const results = [];
processDirectory(searchDir, results);

const reportPath = 'D:/repos/luxuryapp-api/client/angular/scripts/modal-audit-report.json';
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`Audit complete. Found ${results.length} files. Report saved to ${reportPath}`);
