import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (filePath.endsWith('.html')) {
    // 1. Reemplazar <p-card ...> por <div class="card" ...>
    content = content.replace(/<p-card/g, '<div class="card"');
    content = content.replace(/<\/p-card>/g, '</div>');

    // 2. Extraer y remover wrappers de ng-template
    // Extraer contenido
    content = content.replace(/<ng-template\s+#content>([\s\S]*?)<\/ng-template>/g, '$1');
    content = content.replace(/<ng-template\s+pTemplate="content">([\s\S]*?)<\/ng-template>/g, '$1');

    // Mapear headers
    content = content.replace(/<ng-template\s+#header>/g, '<div class="card-header">');
    content = content.replace(/<ng-template\s+pTemplate="header">/g, '<div class="card-header">');

    // Mapear titles
    content = content.replace(/<ng-template\s+#title>/g, '<div class="text-xl font-bold mb-2">');
    content = content.replace(/<ng-template\s+pTemplate="title">/g, '<div class="text-xl font-bold mb-2">');

    // Mapear subtitles
    content = content.replace(/<ng-template\s+#subtitle>/g, '<div class="text-color-secondary mb-3">');
    content = content.replace(/<ng-template\s+pTemplate="subtitle">/g, '<div class="text-color-secondary mb-3">');

    // Mapear footers
    content = content.replace(/<ng-template\s+#footer>/g, '<div class="mt-3 flex justify-content-end gap-2">');
    content = content.replace(/<ng-template\s+pTemplate="footer">/g, '<div class="mt-3 flex justify-content-end gap-2">');

    // Cualquier </ng-template> que quede (despues de remover los de #content) DEBE ser el cierre de los divs mapeados
    content = content.replace(/<\/ng-template>/g, '</div>');
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modificado:', filePath);
  }
}

function processTs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Remover import de CardModule
  content = content.replace(/import\s+{\s*CardModule\s*}\s+from\s+["']primeng\/card["'];?\r?\n?/g, '');
  
  // Remover de imports array
  content = content.replace(/CardModule\s*,?\s*/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modificado TS:', filePath);
  }
}

const files = process.argv.slice(2);
files.forEach(f => {
  if (f.endsWith('.html')) processFile(f);
  if (f.endsWith('.ts')) processTs(f);
});
