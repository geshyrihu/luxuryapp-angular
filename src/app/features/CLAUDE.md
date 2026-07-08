Trabaja SOLO en este scope:

- `D:\repos\luxuryapp-api\client\angular\src\app\features\accounting\**`

No toques nada fuera de `accounting/**`.
No edites `system/**`, `hr/**`, `operations/**`, `maintenance/**`, `legal/**`, `purchasing/**`, `recruitment/**`, `web/**`.
No toques `shared/**` salvo que sea estrictamente necesario para destrabar un wrapper faltante y lo documentes.
No toques `system/catalogs/catalog-component-ui`.

Objetivo:
Eliminar uso directo de PrimeNG/Ionic en `accounting/**`, usando wrappers de `shared/`.
La única excepción permitida sigue siendo:

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

Prioridad actual según plan:

1. cerrar `cobranza-nativa`
2. seguir con `fondeos-y-reporteo`
3. después `aspel-cobranza-haus`
4. barrer remanentes `p-tag`, `p-card`, `p-dialog`, `p-fileupload`, `p-checkbox`

Lote inicial obligatorio:

1. `general-ledger/contabilidad/cobranza-nativa/pages/ledger`
2. `general-ledger/contabilidad/cobranza-nativa/pages/members`
3. `general-ledger/contabilidad/cobranza-nativa/pages/cobranza-nativa-dashboard`
4. `general-ledger/contabilidad/cobranza-nativa/pages/native-statement`

Después continuar con:

- `fondeos-y-reporteo/funding/**`
- `fondeos-y-reporteo/funding-accounting/**`
- `fondeos-y-reporteo/sat-funding/**`

Familias foco:

- `ion-item`
- `ion-label`
- `p-tag`
- `p-card`
- `p-dialog`
- `p-fileupload`
- `p-checkbox`

Reglas:

- usar wrappers existentes antes de crear nuevos
- si falta wrapper real, documentarlo y créalo solo si desbloquea varias pantallas
- no hacer cambios fuera de tu lane
- usar `apply_patch` para edits manuales
- correr scan de encoding sobre archivos tocados
- no confiar en el plan histórico si contradice el árbol actual

Validaciones mínimas al cerrar cada lote:

- escaneo de UI residual en el directorio tocado
- `node scripts/audit-encoding.mjs` o script vigente sobre archivos tocados
- reportar si quedan violaciones
- reportar blockers reales

Entregable esperado:

- archivos migrados
- familias reducidas
- validación ejecutada
- blockers
- actualización breve para agregar luego al `PLAN-MIGRACION-UI-ABSTRAIDA.md`
