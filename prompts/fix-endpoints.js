const fs = require('fs');
const file = 'D:/repos/luxuryapp-api/client/angular/src/app/core/constants/endpoints.ts';
let lines = fs.readFileSync(file, 'utf8').split('\n');
let replacedThis = 0;

for (let i = 0; i < lines.length; i++) {
    let original = lines[i];
    
    // Fix arrow functions with 'this'
    lines[i] = lines[i].replace(/\(this:\s*any\)\s*=>\s*(.*?)(,?)$/, 'function(this: any) { return $1; }$2');
    
    // Fix parameter involving 'this' not being first: (param, this: any) => ...
    lines[i] = lines[i].replace(/\(([^(]+?),\s*this:\s*any\)\s*=>\s*(.*?)(,?)$/, 'function(this: any, $1) { return $2; }$3');

    // Fix reserved keywords
    lines[i] = lines[i].replace(/\btrue\b\s*:\s*any/g, 'isTrue: any');
    lines[i] = lines[i].replace(/\bfalse\b\s*:\s*any/g, 'isFalse: any');
    lines[i] = lines[i].replace(/\$\{true\}/g, '${isTrue}');
    lines[i] = lines[i].replace(/\$\{false\}/g, '${isFalse}');
    
    // Fix typos if any
    lines[i] = lines[i].replace(/converToDate/g, 'convertToDate');

    if (original !== lines[i]) replacedThis++;
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed endpoints.ts. Lines changed:', replacedThis);
