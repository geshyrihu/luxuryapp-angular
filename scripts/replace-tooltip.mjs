import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (filePath.endsWith('.html')) {
    content = content.replace(/\bpTooltip\b/g, 'lxTooltip');
  } else if (filePath.endsWith('.ts')) {
    content = content.replace(/\bpTooltip\b/g, 'lxTooltip');
    
    // Replace import { TooltipModule } from 'primeng/tooltip'; with import { LxTooltipDirective } from '@ui/adaptive/tooltip';
    content = content.replace(/import\s*\{\s*TooltipModule\s*\}\s*from\s*['"]primeng\/tooltip['"];?/g, 'import { LxTooltipDirective } from "@ui/adaptive/tooltip";');
    
    // Replace TooltipModule with LxTooltipDirective in the imports array
    content = content.replace(/\bTooltipModule\b/g, 'LxTooltipDirective');
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modificado:', filePath);
  }
}

const files = process.argv.slice(2);
files.forEach(f => {
  if (f.endsWith('.html') || f.endsWith('.ts')) processFile(f);
});
