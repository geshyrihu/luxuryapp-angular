const fs = require('fs');

const file = fs.readFileSync('D:/repos/luxuryapp-api/client/angular/src/app/core/constants/endpoints.ts', 'utf8');

const startMatch = file.match(/export const Endpoints = \{/);
if (!startMatch) throw new Error('Could not find start');

const startIndex = startMatch.index + startMatch[0].length;
let braceCount = 1;
let currentIndex = startIndex;

const keys = {};
let currentKeyStart = startIndex;
let currentKeyName = '';

for (let i = startIndex; i < file.length; i++) {
    if (file[i] === '{') {
        if (braceCount === 1) {
            // Found a new key
            const textBefore = file.substring(currentKeyStart, i);
            const keyMatch = textBefore.match(/([a-zA-Z0-9_]+)\s*:\s*$/);
            if (keyMatch) {
                currentKeyName = keyMatch[1];
            }
        }
        braceCount++;
    } else if (file[i] === '}') {
        braceCount--;
        if (braceCount === 1) {
            // End of a key
            if (currentKeyName) {
                // Find where the comma is, or if it's the end of the object
                let endOfKey = i + 1;
                while (file[endOfKey] === ' ' || file[endOfKey] === '\n' || file[endOfKey] === '\r') endOfKey++;
                if (file[endOfKey] === ',') endOfKey++;
                
                keys[currentKeyName] = file.substring(currentKeyStart, endOfKey);
                currentKeyStart = endOfKey;
                currentKeyName = '';
            }
        } else if (braceCount === 0) {
            break;
        }
    }
}

const configKeys = [
    'ApplicationRoles', 'ApplicationUsers', 'AccessHistory', 'Banks', 'CfdiUses', 
    'CustomerAddresses', 'CustomerDataCompany', 'CustomerImages', 'Customers', 
    'EmailData', 'VaultSecrets', 'EmergencyPhones', 'ModuleAppCustomers', 'ModuleAppRoles', 
    'ModuleApps', 'PaymentMethods', 'PaymentTypes', 'Settings', 'UnitsOfMeasurement', 
    'UserActivityHistory', 'AiKnowledgeBase', 'Logs', 'Auth', 'EnumSelectItems', 'SelectItems'
];

let configStr = '/**\n * Endpoints para el proyecto de Configuración/Globales.\n */\nexport const EndpointsConfig = {\n';
let tenantStr = '/**\n * Endpoints para el proyecto de Tenant/Aplicación.\n */\nexport const EndpointsTenant = {\n';

for (const key of Object.keys(keys)) {
    if (configKeys.includes(key)) {
        configStr += keys[key];
    } else {
        tenantStr += keys[key];
    }
}

configStr += '\n} as const;\n';
tenantStr += '\n} as const;\n';

fs.writeFileSync('D:/repos/luxuryapp-api/client/angular/src/app/core/constants/endpoints.config.ts', configStr);
fs.writeFileSync('D:/repos/luxuryapp-api/client/angular/src/app/core/constants/endpoints.tenant.ts', tenantStr);

const indexStr = `import { EndpointsConfig } from './endpoints.config';
import { EndpointsTenant } from './endpoints.tenant';

/**
 * Archivo centralizado de endpoints del API.
 * Ahora exporta la unión de Config y Tenant para compatibilidad hacia atrás.
 */
export const Endpoints = {
  ...EndpointsConfig,
  ...EndpointsTenant
} as const;
`;
fs.writeFileSync('D:/repos/luxuryapp-api/client/angular/src/app/core/constants/endpoints.ts', indexStr);

console.log('Split completed successfully.');
