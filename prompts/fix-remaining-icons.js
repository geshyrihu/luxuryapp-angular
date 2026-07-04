const fs = require("fs");
const path = require("path");

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // customer-images.html
  content = content.replace(
    /<i class="pi pi-spin pi-spinner text-primary mb-2" style="font-size: 2.5rem"><\/i>/g,
    '<app-icon icon="mdi:loading" class="ds-animate-spin text-primary mb-2" style="font-size: 2.5rem"/>',
  );
  content = content.replace(
    /<i class="pi pi-cloud-upload mb-2" style="font-size: 2.5rem"><\/i>/g,
    '<app-icon icon="mdi:cloud-upload" class="mb-2" style="font-size: 2.5rem"/>',
  );
  content = content.replace(
    /<i class="pi pi-spin pi-spinner text-primary" style="font-size: 3rem"><\/i>/g,
    '<app-icon icon="mdi:loading" class="ds-animate-spin text-primary" style="font-size: 3rem"/>',
  );
  content = content.replace(/icon="pi pi-trash"/g, 'icon="mdi:delete"');
  content = content.replace(
    /<i class="pi pi-images text-300 mb-2" style="font-size: 3rem"><\/i>/g,
    '<app-icon icon="mdi:image-multiple" class="text-300 mb-2" style="font-size: 3rem"/>',
  );

  // customer-data-company-list.html
  content = content.replace(
    /<i class="pi pi-envelope text-xs"><\/i>/g,
    '<app-icon icon="mdi:email-outline" class="text-xs"/>',
  );
  content = content.replace(
    /<i class="pi pi-phone text-xs"><\/i>/g,
    '<app-icon icon="mdi:phone" class="text-xs"/>',
  );

  // customer-modul-edit.html
  content = content.replace(
    /<i class="pi pi-search"><\/i>/g,
    '<app-icon icon="mdi:magnify"/>',
  );
  content = content.replace(
    /<i\s+\[class\]="item\.isAssigned \? 'pi pi-check' : 'pi pi-times'"\s+style="font-size: 0\.7rem"\s*><\/i>/g,
    "<app-icon [icon]=\"item.isAssigned ? 'mdi:check' : 'mdi:close'\" style=\"font-size: 0.7rem\"/>",
  );
  content = content.replace(
    /<i\s+class="pi"\s+\[class\.pi-check-circle\]="item\.isAssigned"\s+\[class\.text-green-500\]="item\.isAssigned"\s+\[class\.pi-circle\]="!item\.isAssigned"\s+\[class\.text-400\]="!item\.isAssigned"\s*><\/i>/g,
    '<app-icon [icon]="item.isAssigned ? \'mdi:check-circle\' : \'mdi:circle-outline\'" [class.text-green-500]="item.isAssigned" [class.text-400]="!item.isAssigned"/>',
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log("Updated: " + filePath);
  }
}

const files = [
  "src/app/features/configuration/customer/pages/customer-images.html",
  "src/app/features/configuration/customer-data-company/customer-data-company-list.html",
  "src/app/features/configuration/customer-modul/pages/customer-modul-edit.html",
];

files.forEach(replaceInFile);
