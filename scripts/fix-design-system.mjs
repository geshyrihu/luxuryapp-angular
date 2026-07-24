import fs from 'fs';
import path from 'path';

const dir = process.argv[2] || 'client/angular/src/app/apps';

function createWrapper(moduleName) {
    const wrapperDir = `client/angular/src/app/shared/ui/web/primeng-${moduleName}`;
    const wrapperPath = path.join(wrapperDir, `primeng-${moduleName}.ts`);
    if (!fs.existsSync(wrapperDir)) {
        fs.mkdirSync(wrapperDir, { recursive: true });
    }
    if (!fs.existsSync(wrapperPath)) {
        fs.writeFileSync(wrapperPath, `export * from "primeng/${moduleName}";\n`);
        console.log(`Created wrapper: ${wrapperPath}`);
    }
}

const htmlReplacements = [
    { regex: /style="\s*width:\s*38px;\s*height:\s*38px;\s*background:\s*var\(--ds-warning-light,\s*#fef3c7\);\s*"/g, replace: 'class="w-3rem h-3rem bg-yellow-100"' },
    { regex: /style="\s*width:\s*38px;\s*height:\s*38px;\s*background:\s*var\(--ds-primary-50,\s*#edf1ff\);\s*"/g, replace: 'class="w-3rem h-3rem bg-primary-50"' },
    { regex: /style="font-size:\s*1\.1rem;\s*color:\s*var\(--ds-warning\)"/g, replace: 'class="text-xl text-yellow-500"' },
    { regex: /style="font-size:\s*1\.1rem;\s*color:\s*var\(--ds-primary\)"/g, replace: 'class="text-xl text-primary"' },
    { regex: /style="font-size:\s*20px;\s*color:\s*var\(--ds-success\)"/g, replace: 'class="text-xl text-green-500"' },
    { regex: /style="font-size:\s*20px;\s*color:\s*var\(--ds-warning\)"/g, replace: 'class="text-xl text-yellow-500"' },
    { regex: /style="font-size:\s*20px;\s*color:\s*var\(--ds-danger\)"/g, replace: 'class="text-xl text-red-500"' },
    { regex: /style="font-size:\s*2rem"/g, replace: 'class="text-4xl"' },
    { regex: /style="display:\s*none"/g, replace: 'class="hidden"' }
];

function processFile(filePath) {
    if (filePath.includes('.spec.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    if (filePath.endsWith('.ts')) {
        // Fix dynamicdialog
        content = content.replace(/import\s+\{\s*([^}]*)\s*\}\s+from\s+["']primeng\/dynamicdialog["'];/g, (match, imports) => {
            return `import { ${imports.trim()} } from "src/app/core/services/dialog-handler.service";`;
        });
        
        // Fix api
        content = content.replace(/import\s+\{\s*([^}]*)\s*\}\s+from\s+["']primeng\/api["'];/g, (match, imports) => {
            createWrapper('api');
            return `import { ${imports.trim()} } from "@ui/web/primeng-api/primeng-api";`;
        });

        // Fix other primeng imports (except dynamicdialog and api which we handled)
        content = content.replace(/import\s+\{\s*([^}]*)\s*\}\s+from\s+["']primeng\/([^"']+)["'];/g, (match, imports, moduleName) => {
            if (moduleName === 'dynamicdialog' || moduleName === 'api') return match;
            createWrapper(moduleName);
            return `import { ${imports.trim()} } from "@ui/web/primeng-${moduleName}/primeng-${moduleName}";`;
        });
    }

    if (filePath.endsWith('.html')) {
        htmlReplacements.forEach(r => {
            content = content.replace(r.regex, r.replace);
        });
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
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


function stripStyles() { walk(dir, true); } 
stripStyles();
