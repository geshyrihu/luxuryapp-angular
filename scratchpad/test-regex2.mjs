import { readFileSync } from 'fs';

const content = readFileSync('src/app/features/recruitment/estructura-organizacional/work-position/pages/job-description-form.html', 'utf-8');

// Manual match
const idx = content.indexOf('<p-dialog');
const afterTag = content.substring(idx, idx + 600);
console.log('Chars 0-600 from p-dialog:');
console.log(JSON.stringify(afterTag.substring(0, 400)));

// Test simple regex
const simple = afterTag.match(/^<p-dialog([\s\S]*?)>/);
console.log('\nSimple match:', simple ? 'YES' : 'NO');
if (simple) console.log('Captured:', JSON.stringify(simple[1].substring(0, 200)));

// Test step by step
const re = /<p-dialog\s+([\s\S]*?)>/g;
let m;
while ((m = re.exec(content)) !== null) {
  console.log(`\nMatch at ${m.index}: attr length=${m[1].length}, start=${m[1].substring(0, 50)}`);
}
