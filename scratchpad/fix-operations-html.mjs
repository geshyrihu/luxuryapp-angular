const fs = require("fs");
const glob = require("glob");

const files = glob.sync("D:/repos/luxuryapp-api/client/angular/src/app/features/operations/**/*.html");

for (let file of files) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  const replaceMap = [
    { regex: /<\/ion-label\s*>/g, replacement: "</span>" },
    { regex: /<\/ion-segment-button\s*>/g, replacement: "</button>" },
    { regex: /<\/ion-badge\s*>/g, replacement: "</lx-tag>" },
    { regex: /<\/ion-card-title\s*>/g, replacement: "</div>" },
    { regex: /<\/ion-card-subtitle\s*>/g, replacement: "</div>" }
  ];

  for (let r of replaceMap) {
    if (r.regex.test(content)) {
      content = content.replace(r.regex, r.replacement);
      changed = true;
    }
  }

  // Handle task-status.html specific error
  if (file.includes("task-status.html") && content.includes("</button>\r\n    }")) {
      content = content.replace(/<\/button>\r?\n\s*\}/g, "}");
      changed = true;
  }
  
  if (file.includes("cumpleanos-list.html") && content.includes("</button>\r\n    }")) {
      content = content.replace(/<\/button>\r?\n\s*\}/g, "}");
      changed = true;
  }
  
  if (file.includes("cronograma-anual-mantenimiento.html") && content.includes("</button>\r\n        }")) {
      content = content.replace(/<\/button>\r?\n\s*\}/g, "}");
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, "utf8");
    console.log("Fixed HTML tags in: " + file);
  }
}
