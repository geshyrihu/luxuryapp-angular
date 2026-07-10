Necesito que realices un escaneo profundo y actualizado del estado real de la migración de UI abstraída en este repo:

Repositorio:
`D:\repos\luxuryapp-api`

Objetivo:
Levantar una foto real, actual y confiable del estado de `client/angular/src/app/features/` para identificar qué componentes directos de PrimeNG e Ionic siguen existiendo hoy, qué ya fue migrado, qué está parcialmente migrado, y qué contradicciones hay entre el plan/documentación y el árbol actual.

Contexto importante:

- En `features/` NO debe existir uso directo de componentes PrimeNG ni Ionic.
- La única excepción permitida por ahora es:
  - `<p-table>`
  - `<p-sorticon>`
  - `<p-columnfilter>`
  - `<p-tablecheckbox>`
  - `<p-tableheadercheckbox>`
  - `#caption`
  - `#header`
  - `#body`
  - `#emptymessage`
  - `#paginatorleft`
- Todo lo demás debe pasar por wrappers/custom components en `shared/`.
- El único catálogo demo permitido es:
  - `client/angular/src/app/apps/admin.luxuryapp/catalogs/catalog-component-ui`
- Hay que excluir ese catálogo demo del diagnóstico operativo.
- No confíes ciegamente en los `.md`; el árbol actual manda.
- También respeta reglas de encoding UTF-8 y revisa si hay mojibake en archivos relevantes tocados por el análisis.

Fuentes que debes revisar:

- `client/angular/src/app/features/PLAN-MIGRACION-UI-ABSTRAIDA.md`
- `client/angular/src/app/features/INVENTARIO-PRIMENG-v3.md`
- `client/angular/src/app/features/INVENTARIO-PRIMENG-v2.md`
- `client/angular/src/app/features/INVENTARIO-PRIMENG.md`
- `scripts/scan-mojibake.mjs`
- `client/angular/src/app/shared/`
- `client/angular/src/app/core/components/buttons/BUTTON-USAGE-RULES.md`

Quiero que hagas lo siguiente:

1. Haz un barrido profundo de `client/angular/src/app/features/` para detectar uso directo actual de:

- tags `p-*` no permitidos
- tags `ion-*`
- imports directos de `primeng/*`
- imports directos de `@ionic/angular` o `@ionic/angular/standalone`
- clases o APIs directas de PrimeNG/Ionic incrustadas en features

2. Separa claramente:

- violaciones HTML reales
- imports TS reales
- falsos positivos esperables
- excepciones válidas
- componentes demo excluidos

3. Agrupa hallazgos por:

- módulo (`accounting`, `system`, `hr`, `operations`, `maintenance`, `legal`, `purchasing`, `recruitment`, `web`, etc.)
- familia de componente (`p-tag`, `p-card`, `p-dialog`, `p-drawer`, `p-tabs`, `p-avatar`, `p-image`, `p-fileupload`, `p-checkbox`, `ion-item`, `ion-label`, `ion-card`, etc.)
- severidad / prioridad de migración

4. Detecta contradicciones entre:

- lo documentado en el plan
- lo documentado en inventarios
- lo que realmente existe hoy en el árbol

5. Revisa si ya existen wrappers reutilizables en `shared/` para cada familia detectada y arma una matriz:

- familia detectada
- wrapper existente
- wrapper faltante
- propuesta de migración
- excepción documentable si aplica

6. Identifica si hay módulos que parecen “casi limpios” y módulos que siguen “muy contaminados”.

7. Entrega resultados accionables, no solo conteos.
   Quiero:

- resumen ejecutivo
- tabla por módulo
- tabla por familia
- top 20 archivos más problemáticos
- top 20 quick wins
- propuesta de división en 3 agentes, con fronteras claras para que no se pisen
- lista de riesgos o zonas heterogéneas que no conviene tocar mecánicamente

8. Valida encoding:

- ejecuta `node scripts/scan-mojibake.mjs client/angular/src/app/features`
- reporta si hay mojibake actual o si está limpio
- si detectas falsos positivos, documéntalos

Restricciones:

- No hagas cambios de código.
- No edites archivos.
- No arregles nada todavía.
- Solo audita, analiza y reporta.
- Si un comando falla, intenta alternativa equivalente.
- Prefiere evidencia real del árbol actual sobre documentación histórica.

Formato de salida esperado:

- **Resumen Ejecutivo**
- **Estado Global**
- **Hallazgos por Módulo**
- **Hallazgos por Familia**
- **Wrappers Existentes vs Faltantes**
- **Contradicciones entre Plan y Árbol**
- **Top Archivos Problemáticos**
- **Quick Wins**
- **Propuesta de División en 3 Agentes**
- **Riesgos / No tocar mecánicamente**
- **Resultado de Encoding / Mojibake**
- **Siguiente paso recomendado**

Importante:
No me des una respuesta superficial. Quiero un diagnóstico profundo, preciso, verificable y útil para replanear el esfuerzo real desde el estado actual.
