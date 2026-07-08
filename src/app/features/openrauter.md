Trabaja SOLO en este scope:

- `D:\repos\luxuryapp-api\client\angular\src\app\features\system\**`
- `D:\repos\luxuryapp-api\client\angular\src\app\features\hr\**`

No toques nada fuera de `system/**` y `hr/**`.
No edites `accounting/**`, `operations/**`, `maintenance/**`, `legal/**`, `purchasing/**`, `recruitment/**`, `web/**`.
No toques `shared/**` salvo que sea estrictamente necesario para destrabar un wrapper faltante y lo documentes.
No toques `system/catalogs/catalog-component-ui`.

Objetivo:
Consolidar de verdad `system/**` y `hr/**` contra el árbol actual, porque el plan histórico dice que ya hay mucho migrado, pero el escáner actual sigue reportando residuales.

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

Lote inicial obligatorio:

1. `system/catalogs/**` excepto `catalog-component-ui`
2. `system/gestin-de-cliente/**`
3. `system/vault/**`

Lote 2:

- `system/infrastructure/**`
- `system/debug/**`
- residuales mobile con `ion-item` / `ion-label`

Lote 3:

- `hr/**` residuales reales
- limpieza de imports `Lx*`, PrimeNG e Ionic sobrantes

Familias foco:

- `p-tag`
- `p-card`
- `p-dialog`
- `p-drawer`
- `ion-item`
- `ion-label`
- `p-tabs`

Reglas:

- valida el árbol actual, no asumas que algo ya quedó migrado porque lo diga el plan
- usa wrappers existentes de `shared/`
- si un wrapper ya existe, úsalo
- no cambies otros módulos
- usa `apply_patch` para edits manuales
- documenta cualquier contradicción entre plan y árbol
- no toques el catálogo demo permitido

Validaciones mínimas:

- escaneo de UI residual por carpeta trabajada
- scan de encoding en archivos tocados
- si puedes, build o al menos validación suficiente para asegurar que no rompiste tu lane
- listar imports residuales o falsos positivos si quedan

Entregable esperado:

- bloques realmente cerrados
- contradicciones detectadas entre plan y árbol
- validación ejecutada
- blockers
- resumen listo para anexar al `PLAN-MIGRACION-UI-ABSTRAIDA.md`
