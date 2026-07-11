import fs from 'fs';
import path from 'path';

const dataPath = 'D:/repos/luxuryapp-api/client/angular/scripts/modal-audit-report.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updatedFiles = 0;

function replaceInFile(filePath, oldName, newName) {
    if (oldName === newName || !oldName || oldName === 'onModalForm') return;
    
    // HTML Replacement
    if (fs.existsSync(filePath)) {
        let htmlContent = fs.readFileSync(filePath, 'utf8');
        const htmlRegex = new RegExp(`"\\s*${oldName}\\s*\\(`, 'g');
        if (htmlRegex.test(htmlContent)) {
            htmlContent = htmlContent.replace(htmlRegex, `"${newName}(`);
            fs.writeFileSync(filePath, htmlContent, 'utf8');
        }
    }

    // TS Replacement
    const tsFilePath = filePath.replace('.html', '.ts');
    if (fs.existsSync(tsFilePath)) {
        let tsContent = fs.readFileSync(tsFilePath, 'utf8');
        
        // Match function definition: e.g. "addProductos(data: any)" or "public addProductos("
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
    
    // Simple cases
    if (entry.addMethod && (!entry.editMethod || entry.addMethod === entry.editMethod)) {
        replaceInFile(fullPath, entry.addMethod, 'onModalForm');
    } else if (entry.editMethod && !entry.addMethod) {
        replaceInFile(fullPath, entry.editMethod, 'onModalForm');
    } 
    // Complex cases (different names for add and edit)
    else if (entry.addMethod && entry.editMethod && entry.addMethod !== entry.editMethod) {
        console.log(`Handling complex case: ${entry.file}`);
        // We will just rename them to onModalAdd and onModalEdit to standardize if they aren't already
        if (entry.addMethod !== 'onModalForm' && entry.addMethod !== 'onModalAdd') {
            replaceInFile(fullPath, entry.addMethod, 'onModalAdd');
        }
        if (entry.editMethod !== 'onModalForm' && entry.editMethod !== 'onModalEdit') {
            replaceInFile(fullPath, entry.editMethod, 'onModalEdit');
        }
    }
}

console.log(`Refactor complete. Updated ${updatedFiles} TS files.`);
