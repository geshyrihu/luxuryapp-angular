const fs=require('fs');
let txt = fs.readFileSync('prompts/endpoint-po.json','utf8');
txt = txt.replace(/"Authorization: Bearer \{token\}"/g, '\\"Authorization: Bearer {token}\\"');
fs.writeFileSync('prompts/endpoint-po.json',txt);
console.log("JSON fixed");
