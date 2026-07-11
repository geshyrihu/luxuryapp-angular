import fs from 'fs';
import path from 'path';

const dataPath = 'D:/repos/luxuryapp-api/client/angular/scripts/modal-audit-report.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updatedFiles = 0;

function forceTsReplace(filePath, oldName, newName) {
    if (!oldName) return;
    const tsFilePath = filePath.replace('.html', '.ts');
    if (fs.existsSync(tsFilePath)) {
        let tsContent = fs.readFileSync(tsFilePath, 'utf8');
        const defRegex = new RegExp(`\\b${oldName}\\s*\\(`, 'g');
        const newTsContent = tsContent.replace(defRegex, `${newName}(`);
        if (newTsContent !== tsContent) {
            fs.writeFileSync(tsFilePath, newTsContent, 'utf8');
            updatedFiles++;
        }
    }
}

for (const entry of data) {
    const fullPath = path.join('D:/repos/luxuryapp-api/client/angular', entry.file);
    
    if (entry.addMethod && (!entry.editMethod || entry.addMethod === entry.editMethod)) {
        forceTsReplace(fullPath, entry.addMethod, 'onModalForm');
    } else if (entry.editMethod && !entry.addMethod) {
        forceTsReplace(fullPath, entry.editMethod, 'onModalForm');
    } else if (entry.addMethod && entry.editMethod && entry.addMethod !== entry.editMethod) {
        if (entry.addMethod !== 'onModalForm' && entry.addMethod !== 'onModalAdd') {
            forceTsReplace(fullPath, entry.addMethod, 'onModalAdd');
        }
        if (entry.editMethod !== 'onModalForm' && entry.editMethod !== 'onModalEdit') {
            forceTsReplace(fullPath, entry.editMethod, 'onModalEdit');
        }
    }
}

console.log(`Forced TS Refactor complete. Updated ${updatedFiles} TS files.`);
