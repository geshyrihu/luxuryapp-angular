import { readFileSync } from 'fs';

// Test p-dialog in job-description-form.html
const content = readFileSync('src/app/features/recruitment/estructura-organizacional/work-position/pages/job-description-form.html', 'utf-8');
const idx = content.indexOf('<p-dialog');
if (idx >= 0) {
  const snippet = content.substring(idx, idx + 500);
  console.log('=== p-dialog test ===');
  
  // Test [^>]* pattern (current impl)
  const re1 = /<p-dialog\s+([^>]*)>([\s\S]*?)<\/p-dialog>/g;
  re1.lastIndex = idx;
  const m1 = re1.exec(content);
  console.log('re1 ([^>]*):', m1 ? 'MATCHED' : 'NO MATCH', 'attrs:', m1?.[1]?.substring(0, 80));

  // Test [\s\S]*? pattern  
  const re2 = /<p-dialog\s+([\s\S]*?)>([\s\S]*?)<\/p-dialog>/g;
  re2.lastIndex = idx;
  const m2 = re2.exec(content);
  console.log('re2 ([\\s\\S]*?):', m2 ? 'MATCHED' : 'NO MATCH', 'attrs:', m2?.[1]?.substring(0, 80));

  // Check if there are any > characters in the attributes
  const afterOpen = content.substring(idx + 9, content.indexOf('>', idx + 9));
  console.log('Chars between <p-dialog and first >:', JSON.stringify(afterOpen.substring(0, 200)));
}

// Test p-message in work-position-form.html
const content2 = readFileSync('src/app/features/recruitment/estructura-organizacional/work-position/pages/work-position-form.html', 'utf-8');
const idx2 = content2.indexOf('<p-message');
if (idx2 >= 0) {
  console.log('\n=== p-message test ===');
  const snippet2 = content2.substring(idx2, idx2 + 300);
  console.log('Snippet:', snippet2);
  
  const re3 = /<p-message\s+([^>]*)>([\s\S]*?)<\/p-message>/g;
  re3.lastIndex = idx2;
  const m3 = re3.exec(content2);
  console.log('re3 ([^>]*):', m3 ? 'MATCHED' : 'NO MATCH');

  const re4 = /<p-message\s+([\s\S]*?)>([\s\S]*?)<\/p-message>/g;
  re4.lastIndex = idx2;
  const m4 = re4.exec(content2);
  console.log('re4 ([\\s\\S]*?):', m4 ? 'MATCHED' : 'NO MATCH');
}
