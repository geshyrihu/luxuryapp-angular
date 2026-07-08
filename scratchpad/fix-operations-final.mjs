const fs = require("fs");
const glob = require("glob");

const files = glob.sync("D:/repos/luxuryapp-api/client/angular/src/app/features/operations/**/*.html");

for (let file of files) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  if (content.includes("<ion-segment-button")) {
      content = content.replace(/<ion-segment-button[^>]*\[value\]="([^"]*)"[^>]*>/g, '<button class="p-button p-button-text p-button-sm flex-1" (click)="onSegmentChange($1)">');
      content = content.replace(/<ion-segment-button[^>]*value="([^"]*)"[^>]*>/g, '<button class="p-button p-button-text p-button-sm flex-1" (click)="onSegmentChange(\'$1\')">');
      content = content.replace(/<\/ion-segment-button\s*>/g, '</button>');
      changed = true;
  }
  
  if (content.includes("<ion-label")) {
      content = content.replace(/<ion-label[^>]*>/g, (match) => {
          const cls = match.match(/class="([^"]*)"/);
          return `<span class="${cls ? cls[1] : ''}">`;
      });
      content = content.replace(/<\/ion-label\s*>/g, '</span>');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, "utf8");
    console.log("Fixed ion- tags in: " + file);
  }
}
