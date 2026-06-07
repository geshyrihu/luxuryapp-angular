const fs = require('fs');

const pathHtml = 'src/app/features/configuration/demo-app/demo-app.html';
let html = fs.readFileSync(pathHtml, 'utf8');

html = html.replace(/icon=\"pi pi-check\"/g, 'icon=\"mdi:check\"');
html = html.replace(/icon=\"pi pi-book\"/g, 'icon=\"mdi:book\"');
html = html.replace(/<i class=\"pi pi-list mr-2\"><\/i>/g, '<app-icon icon=\"mdi:format-list-bulleted\" class=\"mr-2\"></app-icon>');
html = html.replace(/icon=\"pi pi-trash\"/g, 'icon=\"mdi:delete\"');
html = html.replace(/icon=\"pi pi-plus\"/g, 'icon=\"mdi:plus\"');
html = html.replace(/icon=\"pi pi-save\"/g, 'icon=\"mdi:content-save\"');
html = html.replace(/<i class=\"pi pi-star mr-2\"><\/i>/g, '<app-icon icon=\"mdi:star\" class=\"mr-2\"></app-icon>');
html = html.replace(/<i class=\"pi pi-wallet text-gold-600 text-xl\"><\/i>/g, '<app-icon icon=\"mdi:wallet\" class=\"text-gold-600 text-xl\"></app-icon>');
html = html.replace(/icon=\"pi pi-arrow-left\"/g, 'icon=\"mdi:arrow-left\"');
html = html.replace(/icon=\"pi pi-exclamation-triangle\"/g, 'icon=\"mdi:alert\"');
html = html.replace(/icon=\"pi pi-filter\"/g, 'icon=\"mdi:filter\"');
html = html.replace(/icon=\"pi pi-ellipsis-h\"/g, 'icon=\"mdi:dots-horizontal\"');
html = html.replace(/icon=\"pi pi-pencil\"/g, 'icon=\"mdi:pencil\"');
html = html.replace(/icon=\"pi pi-filter-slash\"/g, 'icon=\"mdi:filter-off\"');
html = html.replace(/icon=\"pi pi-download\"/g, 'icon=\"mdi:download\"');
html = html.replace(/<i class=\"pi pi-search\"><\/i>/g, '<app-icon icon=\"mdi:magnify\"></app-icon>');
html = html.replace(/icon=\"pi pi-eye\"/g, 'icon=\"mdi:eye\"');
html = html.replace(/<i class=\"pi pi-inbox\"><\/i>/g, '<app-icon icon=\"mdi:inbox\"></app-icon>');
html = html.replace(/icon=\"pi pi-external-link\"/g, 'icon=\"mdi:external-link\"');
html = html.replace(/<i \[class\]=\"scenario.icon \+ ' text-primary text-2xl'\"><\/i>/g, '<app-icon [icon]=\"scenario.icon\" class=\"text-primary text-2xl\"></app-icon>');
html = html.replace(/<i \[class\]=\"rule.iconClass\"><\/i>/g, '<app-icon [icon]=\"rule.iconClass\"></app-icon>');
html = html.replace(/<i \[class\]=\"card.iconClass\"><\/i>/g, '<app-icon [icon]=\"card.iconClass\"></app-icon>');
html = html.replace(/<i \[class\]=\"metric.icon\"><\/i>/g, '<app-icon [icon]=\"metric.icon\"></app-icon>');

fs.writeFileSync(pathHtml, html);

const pathTs = 'src/app/features/configuration/demo-app/demo-app.ts';
let ts = fs.readFileSync(pathTs, 'utf8');

ts = ts.replace(/icon: \"pi pi-list-check\"/g, 'icon: \"mdi:format-list-checks\"');
ts = ts.replace(/icon: \"pi pi-star\"/g, 'icon: \"mdi:star\"');
ts = ts.replace(/icon: \"pi pi-mobile\"/g, 'icon: \"mdi:cellphone\"');
ts = ts.replace(/icon: \"pi pi-sliders-h\"/g, 'icon: \"mdi:tune\"');
ts = ts.replace(/icon: \"pi pi-table\"/g, 'icon: \"mdi:table\"');
ts = ts.replace(/icon: \"pi pi-building-columns\"/g, 'icon: \"mdi:bank\"');
ts = ts.replace(/icon: \"pi pi-bolt\"/g, 'icon: \"mdi:flash\"');
ts = ts.replace(/icon: \"pi pi-shield\"/g, 'icon: \"mdi:shield\"');

ts = ts.replace(/iconClass: \"pi pi-check-circle /g, 'iconClass: \"mdi:check-circle ');
ts = ts.replace(/iconClass: \"pi pi-arrow-left /g, 'iconClass: \"mdi:arrow-left ');
ts = ts.replace(/iconClass: \"pi pi-check /g, 'iconClass: \"mdi:check ');
ts = ts.replace(/iconClass: \"pi pi-trash /g, 'iconClass: \"mdi:delete ');
ts = ts.replace(/iconClass: \"pi pi-ellipsis-h /g, 'iconClass: \"mdi:dots-horizontal ');

ts = ts.replace(/icon: \"pi pi-th-large\"/g, 'icon: \"mdi:view-grid\"');
ts = ts.replace(/iconClass: \"pi pi-th-large /g, 'iconClass: \"mdi:view-grid ');
ts = ts.replace(/icon: \"pi pi-chart-line\"/g, 'icon: \"mdi:chart-line\"');
ts = ts.replace(/iconClass: \"pi pi-chart-line /g, 'iconClass: \"mdi:chart-line ');
ts = ts.replace(/iconClass: \"pi pi-shield /g, 'iconClass: \"mdi:shield ');

if(!ts.includes('AppIcon')) {
  ts = ts.replace('import { Component } from \"@angular/core\";', 'import { Component } from \"@angular/core\";\nimport { AppIcon } from \"src/app/core/components/app-icon/app-icon.component\";');
  ts = ts.replace('imports: [', 'imports: [\n    AppIcon,');
}

fs.writeFileSync(pathTs, ts);
