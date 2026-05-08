const fs = require('fs');

function run() {
    const swaggerPath = 'D:/repos/luxuryapp-api/client/angular/prompts/endpoint-po.json';
    const frontendPath = 'D:/repos/luxuryapp-api/client/angular/src/app/extracted-endpoints.json';
    const outputPath = 'C:/Users/geshy/.gemini/antigravity/brain/cbea4021-ebdc-4c03-befb-b34604aa7951/api_frontend_comparison.md';

    let swaggerData;
    let frontData;

    try {
        swaggerData = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
        frontData = JSON.parse(fs.readFileSync(frontendPath, 'utf8'));
    } catch (e) {
        console.error("Error reading JSON files:", e);
        return;
    }

    // 1. Parse Swagger API Endpoints
    const apiEndpoints = [];
    if (swaggerData.paths) {
        for (const path in swaggerData.paths) {
            for (const method in swaggerData.paths[path]) {
                const tags = swaggerData.paths[path][method].tags || ['General'];
                let normPath = path.replace(/^\/api\//i, '').toLowerCase();
                normPath = normPath.replace(/\{[^}]+\}/g, '{id}');

                apiEndpoints.push({
                    originalPath: path,
                    method: method.toUpperCase(),
                    normPath: normPath,
                    tags: tags,
                    foundInFront: false
                });
            }
        }
    }

    // 2. Parse Frontend Endpoints
    const frontEndpoints = [];
    // The format is {"components": [{url, file, apiMethod, rawArg}], "services": [...]}
    for (const category in frontData) {
        if (!Array.isArray(frontData[category])) continue;
        for (const item of frontData[category]) {
            if (!item.url || typeof item.url !== 'string') continue;

            let cleanUrl = item.url.replace(/^[`'"]/, '').replace(/[`'"]$/, '');
            let normPath = cleanUrl.toLowerCase();
            // Replace front dynamic variables like ${this.id} -> {id}
            normPath = normPath.replace(/\$\{[^}]+\}/g, '{id}');
            normPath = normPath.replace(/^\//, ''); // Remove leading slash just in case

            frontEndpoints.push({
                module: category,
                action: item.apiMethod,
                file: item.file?.split('/').pop() || '',
                originalPath: cleanUrl,
                normPath: normPath,
                matchedApi: null
            });
        }
    }

    // Add exactly Banks Phase 2 overrides since they are in a different format now
    const staticBanks = [
       { normPath: "banks", originalPath: "banks", module: "Banks(Phase2)" },
       { normPath: "banks/{id}", originalPath: "banks/${id}", module: "Banks(Phase2)" },
       { normPath: "selectitem/banks", originalPath: "selectitem/banks", module: "Banks(Phase2)" }
    ];
    for (let bt of staticBanks) {
       frontEndpoints.push({ ...bt, action: "CRUD", file: "endpoints.ts", matchedApi: null });
    }

    // 3. Match them up
    for (const fe of frontEndpoints) {
        let match = apiEndpoints.find(ae => ae.normPath === fe.normPath);
        if (!match) {
           // Fallback relaxed matching e.g missing path param
           match = apiEndpoints.find(ae => ae.normPath === fe.normPath.replace('/{id}', '') || fe.normPath === ae.normPath + '/{id}');
        }
        if (match) {
            fe.matchedApi = match;
            match.foundInFront = true;
        }
    }

    // Deduplicate frontend endpoints to keep table clean
    const uniqueFront = Array.from(new Map(frontEndpoints.map(f => [f.normPath, f])).values());

    const matched = uniqueFront.filter(f => f.matchedApi);
    const unmatchedFront = uniqueFront.filter(f => !f.matchedApi);
    const unusedApi = apiEndpoints.filter(a => !a.foundInFront);

    // 4. Generate Markdown
    let md = `# Análisis Comparativo de Endpoints (API vs Frontend)\n\n`;
    md += `Este documento presenta una tabla comparativa entre el contrato Swagger (Backend) y los endpoints extraídos en el Frontend. Se incluye una propuesta de refactorización hacia estándares RESTful.\n\n`;

    md += `## Resumen\n`;
    md += `- **Total Endpoints en API (Swagger):** ${apiEndpoints.length}\n`;
    md += `- **Total Endpoints asimilados por Frontend:** ${uniqueFront.length}\n`;
    md += `- **Endpoints en sincronía perfecta (Coinciden Front y API):** ${matched.length}\n`;
    md += `- **Endpoints Frontend sin correspondencia clara en API (Huérfanos):** ${unmatchedFront.length}\n`;
    md += `- **Endpoints API inactivos (No consumidos en Frontend):** ${unusedApi.length}\n\n`;

    md += `> **Nota sobre el Estándar Propuesto:** La columna de refactorización sugiere convenciones REST usando sustantivos en plural, omitiendo verbos como 'get' o 'add' en la URI, y respetando las buenas prácticas HTTP.\n\n`;

    function suggestRefactor(method, path) {
        let p = path.replace(/^\/api\//i, '');
        const segments = p.split('/');
        const resource = segments[0] || 'recurso';
        
        if (method === 'GET' && segments.length > 1 && segments[1].toLowerCase().includes('get')) {
            return '`GET /api/' + resource + '`';
        }
        if ((method === 'POST' || method === 'PUT') && segments.join('').toLowerCase().includes('update')) {
            return '`PUT /api/' + resource + '/{id}`';
        }
        if (method === 'POST' && segments.join('').toLowerCase().includes('delete')) {
            return '`DELETE /api/' + resource + '/{id}`';
        }
        if (method === 'POST' && segments.length === 2 && segments[1].toLowerCase() === 'list') {
            return '`GET /api/' + resource + '` (usando query params)';
        }
        if (segments.length > 2 && method === 'POST') {
            return 'Reducir anidamiento ej. `POST /api/' + resource + '/{id}/accion`';
        }

        return `✅ Estándar Aceptable`;
    }

    md += `## Tabla de Correspondencias (Front y API)\n`;
    md += `Muestra limitadamente los emparejados exitosos y la acción correspondiente.\n\n`;
    md += `| API (Swagger) | Frontend Endpoint | Clase TS | Coincidencia | Estándar Propuesto (Refactorización) |\n`;
    md += `|---|---|---|---|---|\n`;

    matched.sort((a, b) => a.originalPath.localeCompare(b.originalPath));
    let rowCount = 0;
    for (const m of matched) {
        if (rowCount > 800) break;
        const api = m.matchedApi;
        const refactor = suggestRefactor(api.method, api.originalPath);
        md += `| \`${api.method}\` ${api.originalPath} | \`${m.originalPath}\` | ${m.file} | 🟢 Exacta | ${refactor} |\n`;
        rowCount++;
    }

    md += `\n## Endpoints del Frontend sin API (Huérfanos / Custom / Erratas)\n\n`;
    md += `| Frontend Endpoint | Método Llamado | Archivo TS | Posible Causa |\n`;
    md += `|---|---|---|---|\n`;
    
    let uRowCount = 0;
    for (const u of unmatchedFront) {
        if (uRowCount > 200) break;
        md += `| \`${u.originalPath}\` | \`${u.action}\` | ${u.file} | Difiere en formato, URL dinámica o ruta externa |\n`;
        uRowCount++;
    }

    md += `\n## Endpoints del API no detectados en Frontend (Posible backend sin usar)\n\n`;
    md += `| API (Swagger) | Tag Principal | Recomendación |\n`;
    md += `|---|---|---|\n`;
    
    let apiRowCount = 0;
    for (const a of unusedApi) {
        if (apiRowCount > 200) break;
        md += `| \`${a.method}\` ${a.originalPath} | ${a.tags[0]} | Revisar si es obsoleto o aplicarle soft-delete |\n`;
        apiRowCount++;
    }

    fs.writeFileSync(outputPath, md);
    console.log(`Markdown generated at ${outputPath}`);
}

run();
