const fs = require('fs');

function countSwagger() {
    const sw = JSON.parse(fs.readFileSync('prompts/endpoint-po.json', 'utf8'));
    let methods = {};
    let total = 0;
    
    if (sw.paths) {
        for (const p in sw.paths) {
            for (const m in sw.paths[p]) {
                if (m === 'parameters') continue;
                methods[m] = (methods[m] || 0) + 1;
                total++;
            }
        }
    }
    
    console.log(`--- SWAGGER ANALYSIS ---`);
    console.log(`Total real endpoints (paths * methods): ${total}`);
    console.log(`Methods breakdown:`, methods);
    console.log(`Paths without expanding methods: ${Object.keys(sw.paths).length}`);
}

countSwagger();
