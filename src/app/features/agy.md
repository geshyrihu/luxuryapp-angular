Trabaja SOLO en este scope:

- `D:\repos\luxuryapp-api\client\angular\src\app\features\operations\**`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\maintenance\**`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\legal\**`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\purchasing\**`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\recruitment\**`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\web\**`

No toques nada fuera de esos módulos.
No edites `accounting/**`, `system/**`, `hr/**`.
No toques `shared/**` salvo que sea estrictamente necesario para destrabar un wrapper faltante y lo documentes.
No toques `system/catalogs/catalog-component-ui`.

Objetivo:
Cerrar las zonas más heterogéneas y legacy mobile que siguen con UI directa, especialmente donde todavía hay `p-avatar`, `p-image`, `p-tabs`, `p-fileupload`, `ion-card`, `ion-list`, `ion-button`, `ion-grid`.

Excepción permitida:

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

Orden de trabajo obligatorio:

Lote 1:

1. `purchasing/**`
2. `recruitment/**`
3. `web/**`

Lote 2:

1. `operations/**`
2. `maintenance/**`
3. `legal/**`

Lote 3:

- remanentes complejos de `p-avatar`
- remanentes complejos de `p-image`
- `p-tabs`
- `p-fileupload`

Familias foco:

- `p-avatar`
- `p-image`
- `p-tabs`
- `p-fileupload`
- `ion-card`
- `ion-list`
- `ion-button`
- `ion-grid`
- también cualquier `ion-item` / `ion-label` residual que aparezca

Reglas:

- no hagas migración ciega si el layout es heterogéneo
- si ves pantallas complejas, documenta por qué no conviene migrarlas mecánicamente
- usa wrappers existentes primero
- si el wrapper no existe y hace falta de verdad, documenta y créalo solo si desbloquea varias pantallas
- usa `apply_patch` para ediciones manuales
- no invadas otros lanes

Validaciones mínimas:

- escaneo de UI residual por carpeta trabajada
- scan de encoding sobre archivos tocados
- reportar qué quedó limpio y qué quedó diferido por complejidad
- si puedes, build o validación suficiente para detectar regresiones de tu lane

Entregable esperado:

- carpetas cerradas
- migraciones complejas documentadas
- validación ejecutada
- blockers
- resumen listo para anexar al `PLAN-MIGRACION-UI-ABSTRAIDA.md`
