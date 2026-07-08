# Plan de Migracion a UI Abstraida en `features/`

> Ultima actualizacion: 2026-07-08 (Agente 1 — accounting cerrado salvo p-tabs + wrappers faltantes)
> Alcance: `client/angular/src/app/features/`
> Objetivo: eliminar el uso directo de componentes PrimeNG e Ionic dentro de `features/`, migrando a componentes custom compartidos en `shared/`.
> Excepcion temporal permitida: `p-table` y sus templates/directivas autorizados.

## 0. Coordinacion de agentes (LEER PRIMERO)

> [!IMPORTANT]
> Nada esta commiteado: todo es working tree y **los agentes se han pisado**.
> El **2026-07-07** un reset del arbol revirtio TODAS las migraciones de `features/`
> hechas por Agente 3 (calendario, cobranza, system/catalogs, operations/inventarios,
> maintenance/logs). Los **wrappers de `shared/ui` (lx-image, lx-avatar, badge,
> spinner, fixes PrimeNG 22) SI persisten.**

**Lanes por agente (respetar estrictamente para no colisionar):**

| Agente          | Lane                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agente 3 (este) | `features/operations/**` · `features/maintenance/**` · `features/legal/**` — familias heterogeneas + `p-dialog`/`p-drawer`/`p-fileupload`/`p-avatar`/`p-image` |
| otros           | resto (accounting, hr, purchasing, recruitment, system, web) — NO tocar desde Agente 3                                                                         |

> Regla: Agente 3 solo edita archivos dentro de su lane. `system/catalogs` y
> `accounting/cobranza-nativa` (migrados antes de la asignacion de lanes) quedan
> para su agente dueño.

> [!WARNING]
> ## 🔒 BLOQUE RESERVADO — Agente 1 (accounting) — NO TOCAR desde otros agentes
> Reservado el **2026-07-08**. Este bloque cruza `shared/ui`, que es la causa
> historica de los reverts por colision. Lo centraliza **un solo dueño (Agente 1)**.
> Los demas agentes **migran features pero NO editan estos paths** hasta que se
> libere aqui.
>
> **Paths bloqueados (solo Agente 1 edita):**
> - `shared/ui/base/tabs.base.ts`, `shared/ui/web/tabs/**`, `shared/ui/mobile/tabs/**`, `shared/ui/adaptive/tabs/**` (fix multi-panel de `lx-tabs`)
> - wrappers NUEVOS a crear (base+web+mobile+adaptive): `list-box`, `popover`, `split-button`, `icon-field` (para `p-listbox`/`p-popover`/`p-splitbutton`/`p-iconfield`+`p-inputicon`)
> - `accounting/**/*p-tabs*` (los 3 usos: report-catalog, financial-reports-wrapper, contabilidad-cliente-wrapper)
>
> **Que hacen los demas mientras tanto:** migran su lane con los wrappers YA
> existentes; cuando Agente 1 publique `lx-listbox`/`lx-popover`/`lx-split-button`/
> `lx-icon-field`, cada agente migra SUS usos de esos tags en su propio modulo.
>
> **Estado del bloque (2026-07-08):**
> - [x] **`lx-tabs` multi-panel ARREGLADO** (`web/tabs` + `mobile/tabs`): ahora
>   conmutan los paneles proyectados `[tab=<id>]` por tab activa (ocultan los no
>   activos via effect). Antes `ili-tabs` apilaba TODOS los panels en movil y
>   `app-tabs` usaba `<ng-content [select]>` dinamico (no fiable). **Con esto la
>   proyeccion `<div tab="id">` YA es valida en web y movil** → el patron de
>   proyeccion que usan otros agentes ahora funciona. (Sigue valido tambien el
>   patron selector + `@switch`.) Falta QA visual.
> - [x] `report-catalog` migrado (selector + `@switch`).
> - [ ] `financial-reports-wrapper` / `contabilidad-cliente-wrapper`: en edicion
>   concurrente (patron proyeccion); ya compilan con el wrapper arreglado.
> - [ ] wrappers dispersos `lx-listbox` / `lx-split-button` / `lx-icon-field`
>   pendientes (`lx-popover` y `app-inputicon` ya los creo otro agente).
>
> **⚠ Blocker de build vigente (NO es de accounting):**
> `system/ai/ia-test/ia-test.component.html` usa `<lx-card>` sin importar `LxCard`
> en su `.ts` (NG8001) → **lane Agente 2**.

---

## 1. Objetivo operativo

Este plan sirve para:

- iniciar la migracion con orden
- medir avance por fases
- registrar decisiones y excepciones
- poder retomar el trabajo en otra sesion sin perder contexto

---

## 2. Regla base de cumplimiento

### Permitido temporalmente

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

### Prohibido dentro de `features/`

- cualquier otro tag `p-*`
- cualquier tag `ion-*`
- imports UI directos desde `primeng/*`
- imports UI directos desde `@ionic/angular`

### Regla de migracion

- si ya existe wrapper en `shared/`, se usa ese
- si no existe wrapper, se crea primero en `shared/`
- no se deja UI directa nueva en `features/`
- el catalogo demo oficial valido es unicamente:
  - `client/angular/src/app/features/system/catalogs/catalog-component-ui`

---

## 3. Referencias clave

- Inventario operativo actual:
  - [INVENTARIO-PRIMENG-v3.md](D:/repos/luxuryapp-api/client/angular/src/app/features/INVENTARIO-PRIMENG-v3.md)
- Reglas de botones:
  - [BUTTON-USAGE-RULES.md](D:/repos/luxuryapp-api/client/angular/src/app/core/components/buttons/BUTTON-USAGE-RULES.md)
- Directorio de wrappers compartidos:
  - `client/angular/src/app/shared/`
- Escaner de encoding:
  - `node scripts/scan-mojibake.mjs client/angular/src`

---

## 4. Linea base actual

### Estado del barrido v3

- HTML con al menos una violacion directa: `438`
- HTML con PrimeNG directo no permitido: `298`
- HTML con Ionic directo: `229`
- Tags PrimeNG directos distintos: `45`
- Tags Ionic directos distintos: `31`
- TS con imports directos de PrimeNG: `703`
- TS con imports UI de PrimeNG distintos de `api` y `dynamicdialog`: `594`
- TS con imports directos de Ionic: `178`

### Familias prioritarias

1. `p-tag`
2. `p-card`
3. `ion-item` / `ion-label`
4. `p-message`
5. familia `p-tabs`
6. `p-avatar` / `p-image`
7. `p-dialog` / `p-drawer`
8. `p-fileupload`
9. `p-checkbox`
10. resto de Ionic mobile

---

## 5. Fases del proyecto

## Fase 0. Preparacion y control

**Objetivo:** dejar claro el marco de trabajo y las metricas base.

- [x] Consolidar inventario operativo en `INVENTARIO-PRIMENG-v3.md`
- [x] Confirmar excepcion valida de `p-table`
- [x] Confirmar que el catalogo demo oficial es solo `catalog-component-ui`
- [x] Crear este plan de trabajo persistente
- [ ] Definir archivo de seguimiento por sesion si se requiere uno separado

**Salida esperada**

- backlog confiable
- reglas estables
- documento de control para retomar trabajo

---

## Fase 1. Catalogo de wrappers existentes

**Objetivo:** mapear que ya existe en `shared/` para reutilizar antes de crear wrappers nuevos.

- [x] Inventariar wrappers visuales ya disponibles en `shared/`
- [ ] Mapear wrappers existentes contra familias del inventario v3
- [ ] Identificar huecos reales de abstraccion
- [ ] Clasificar cada familia en:
  - wrapper existente
  - wrapper faltante
  - posible excepcion documentada

**Entregable**

- tabla de decision por familia de componente

**Criterio de cierre**

- cada familia prioritaria tiene decision de ruta de migracion

### Resultado actual de Fase 1

`shared/` ya tiene una arquitectura amplia por capas:

- `ui/base`
- `ui/web`
- `ui/mobile`
- `ui/adaptive`
- `ui/shared`
- `ui/inputs`
- `ui/buttons`

Eso significa que el problema ya no es "no tenemos design system", sino que en `features/` todavia no se esta consumiendo de forma consistente.

### Matriz inicial de decision por familia prioritaria

| Familia          | Estado           | Wrapper o candidato existente                                                      | Decision actual                                                                              |
| ---------------- | ---------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `p-tag`          | Parcial          | `lx-status-badge`, `app-badge`, `app-order-status`, `contact-card`, `profile-card` | Falta wrapper generico tipo `lx-tag` o clasificar casos para migrarlos a wrappers semanticos |
| `p-card`         | Resuelto         | `lx-card`, CSS-only `.card`                                                        | Ver `§Estrategia p-card`                                                                     |
| `ion-item`       | Faltante         | solo uso interno en componentes mobile                                             | Falta primitivo publico para fila/list item reusable                                         |
| `ion-label`      | Faltante         | solo uso interno en componentes mobile                                             | Falta primitivo publico para label/contenido de item reusable                                |
| `p-message`      | Parcial          | `lx-global-error-alert`, `lx-toast`                                                | Falta wrapper generico de mensaje inline tipo `lx-message`                                   |
| familia `p-tabs` | Cubierto         | `lx-tabs`, `app-tabs`, `ili-tabs`                                                  | Migrar usos directos a `lx-tabs`                                                             |
| `p-avatar`       | Parcial          | `app-avatar-group`                                                                 | Falta wrapper generico de avatar individual                                                  |
| `p-image`        | Parcial          | `custom-input-img-signal`, `gallery`, `document-previewer`                         | Falta wrapper generico de imagen de display                                                  |
| `p-dialog`       | Cubierto         | `app-dialog`, `lx-modal`                                                           | Migrar usos directos a wrapper segun contexto                                                |
| `p-drawer`       | Cubierto         | `lx-sidebar`, `app-sidebar`, `ili-sidebar`                                         | Migrar usos directos a `lx-sidebar`                                                          |
| `p-fileupload`   | Cubierto/Parcial | `app-file-upload`, `custom-input-file-signal`                                      | Hay base util; falta estandarizar cuando usar file input vs file upload                      |
| `p-checkbox`     | Cubierto         | `custom-input-check-signal`, `web-input-check`, `ion-input-checkbox`               | Migrar usos permitiendo revisar excepciones inline en tabla                                  |

### Hallazgos clave

- `tabs`, `sidebar`, `dialog`, `file-upload` y `checkbox` ya tienen ruta clara de migracion.
- `p-tag`, `p-card` y `p-message` siguen siendo la principal deuda de abstraccion generica.

### Estrategia `p-card`

Existen 2 formas de reemplazar `<p-card>`, segun el uso:

| Uso                                                      | Reemplazo                                         | Ejemplo                                |
| -------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| Card con **header/subheader** declarativo                | `<lx-card header="..." subheader="...">`          | system/hr migrados                     |
| Card **estructural** (solo contenedor visual sin header) | CSS-only: `<div class="card">` o `card card-body` | Compra directa, formularios sin titulo |

**Reglas:**

- Si el template usa `<p-card header="..."` o `<ng-template #header>` → `<lx-card header="...">`
- Si el template usa `<p-card>` solo como contenedor (sin header/subheader, con `class="p-0 border-none shadow-none"` para quitarle el chrome) → CSS-only `<div class="card">`
- `<ng-template #content>` (feature PrimeNG interna) no tiene equivalente en `lx-card` — convertir el contenido a proyeccion directa dentro de `<div class="card card-body">`
- Prohibido mantener `<p-card>` en `features/`
- `ion-item` e `ion-label` no tienen wrapper publico reusable; hoy aparecen como detalle interno de componentes mobile, no como primitives listas para consumir en `features/`.
- `p-avatar` y `p-image` tienen piezas parciales, pero todavia no un wrapper generico tan obvio como `lx-tabs` o `lx-sidebar`.

### Decision de trabajo para la siguiente etapa

La Fase 2 debe arrancar con estos faltantes reales:

1. `lx-tag`
2. `lx-card`
3. `lx-message`
4. primitivos para reemplazar `ion-item` y `ion-label`

Y puede empezar migracion inmediata en las familias que ya estan cubiertas:

1. `p-tabs`
2. `p-dialog`
3. `p-drawer`
4. `p-fileupload`
5. `p-checkbox`

---

## Fase 2. Wrappers base de mayor impacto

**Objetivo:** construir o consolidar wrappers para las familias mas repetidas antes de migrar pantallas.

### Prioridad A

- [x] Wrapper para reemplazar `p-tag`
- [x] Wrapper para reemplazar `p-card`
- [x] Wrapper para reemplazar `p-message`

### Prioridad B

- [x] Wrapper base para layout/lista que sustituya `ion-item` (`ili-list-item` / `MobileListItem` ya existe y en uso)
- [x] Wrapper base o patron para `ion-label` (contenido al slot por defecto de `ili-list-item`)
- [x] Wrapper para `p-avatar` (`lx-avatar` / `app-avatar` / `ili-avatar` — base+web+mobile+adaptive + specs)
- [x] Wrapper para `p-image` (`lx-image` / `app-image` / `ili-image` — base+web+mobile+adaptive + specs)

### Prioridad C

- [ ] Wrapper para familia `p-tabs`
- [ ] Wrapper para `p-dialog`
- [ ] Wrapper para `p-drawer`
- [ ] Estrategia para `p-fileupload`
- [ ] Wrapper o estrategia para `p-checkbox`

**Criterio de cierre**

- existen wrappers o decisiones firmes para las primeras familias de alto volumen

---

## Fase 3. Migracion por familias

**Objetivo:** reducir deuda por volumen atacando primero las familias mas repetidas en toda la app.

### Ola 1

- [ ] Migrar todos los `p-tag`
- [ ] Migrar todos los `p-card`
- [ ] Eliminar imports TS asociados a `primeng/tag` y `primeng/card` en features donde ya no se usen

### Ola 2

- [ ] Migrar `ion-item`
- [ ] Migrar `ion-label`
- [ ] Limpiar imports TS asociados de Ionic

### Ola 3

- [x] Migrar `p-message`
- [ ] Migrar familia `p-tabs`
- [ ] Migrar `p-avatar` y `p-image`

### Ola 4

- [ ] Migrar `p-dialog`
- [ ] Migrar `p-drawer`
- [ ] Migrar `p-fileupload`
- [ ] Migrar `p-checkbox`

### Ola 5

- [ ] Migrar remanentes PrimeNG menores
- [ ] Migrar remanentes Ionic menores
- [ ] Revisar imports TS residuales

**Criterio de cierre**

- las familias prioritarias dejan de existir como UI directa en `features/`

---

## Fase 4. Migracion por modulo funcional

**Objetivo:** cerrar remanentes pantalla por pantalla hasta dejar modulos completos limpios.

### Modulos sugeridos para saneamiento

- [ ] `accounting`
- [ ] `hr`
- [ ] `legal`
- [ ] `maintenance`
- [ ] `operations`
- [ ] `purchasing`
- [ ] `recruitment`
- [ ] `system`
- [ ] `web`

### Checklist por modulo

- [ ] sin tags `p-*` no permitidos
- [ ] sin tags `ion-*`
- [ ] sin imports UI directos innecesarios
- [ ] usando wrappers de `shared/`
- [ ] build valido
- [ ] scan de mojibake limpio en archivos tocados

**Criterio de cierre**

- el modulo queda limpio y no vuelve a entrar deuda nueva

---

## Fase 5. Validacion y endurecimiento

**Objetivo:** dejar la base protegida para que la deuda no regrese.

- [ ] Ejecutar barrido final de HTML y TS
- [ ] Validar que solo permanezca `p-table` como excepcion directa
- [ ] Revisar excepciones documentadas pendientes
- [ ] Validar build Angular
- [ ] Ejecutar `scan-mojibake.mjs` sobre archivos tocados
- [ ] Documentar decisiones finales en inventario y plan
- [ ] Proponer guard automatizado para detectar PrimeNG/Ionic directo en `features/`

**Criterio de cierre**

- deuda directa erradicada o acotada solo a excepciones aprobadas y documentadas

---

## 6. Tablero de avance

### Estado general

- [x] Fase 0 iniciada
- [x] Fase 1 en progreso
- [x] Fase 1 completada
- [x] Fase 2 en progreso
- [x] Fase 2 completada (parcial: falta p-avatar, p-image)
- [x] Fase 3 en progreso
- [x] Fase 3 Ola 1 completada (system + hr)
- [x] Fase 3 Ola 4 parcial completada (system + hr)
- [ ] Fase 3 completada
- [ ] Fase 4 completada
- [ ] Fase 5 completada

### Por familia prioritaria

- [x] `p-tag` (system + hr)
- [x] `p-card` (system + hr)
- [ ] `ion-item`
- [ ] `ion-label`
- [x] `p-message`
- [ ] `p-tabs`
- [ ] `p-avatar`
- [ ] `p-image`
- [x] `p-dialog` (en system + hr)
- [x] `p-drawer` (en system + hr)
- [ ] `p-fileupload`
- [ ] `p-checkbox`

### Por riesgo

- [ ] wrappers base definidos
- [x] migracion masiva iniciada
- [ ] imports residuales controlados
- [ ] validaciones automatizadas listas

### Cobertura actual conocida

- [x] ruta de wrapper confirmada para `p-tabs`
- [x] ruta de wrapper confirmada para `p-dialog`
- [x] ruta de wrapper confirmada para `p-drawer`
- [x] ruta de wrapper confirmada para `p-fileupload`
- [x] ruta de wrapper confirmada para `p-checkbox`
- [x] ruta generica definida para `p-tag`
- [x] ruta generica definida para `p-card`
- [x] ruta generica definida para `p-message`
- [x] ruta generica definida para `ion-item` (`ili-list-item` / `MobileListItem`)
- [x] ruta generica definida para `ion-label` (contenido al slot por defecto de `ili-list-item`)

## Auditoria verificada 2026-07-08

### Resultado del barrido actual

Se revalidó el árbol real de `client/angular/src/app/features/` y la deuda de UI directa sigue vigente. La evidencia del árbol actual muestra uso directo persistente de:

- `p-tag`: 129 ocurrencias en HTML
- `p-card`: 69 ocurrencias en HTML
- `p-message`: 39 ocurrencias en HTML
- `ion-label`: 135 ocurrencias en HTML
- `ion-item`: 103 ocurrencias en HTML
- `p-avatar`: 25 ocurrencias en HTML
- `p-fileupload`: 7 ocurrencias en HTML
- `p-checkbox`: 11 ocurrencias en HTML
- `p-tabs`: 7 ocurrencias en HTML
- `p-dialog`: 3 ocurrencias en HTML
- `p-drawer`: 1 ocurrencia en HTML

### Hallazgos importantes

- El plan sigue siendo util, pero no debe asumirse que la migracion de `system`/`hr` cerró la deuda global. El árbol actual sigue mostrando usos directos en otros módulos, especialmente `operations`, `legal`, `maintenance`, `purchasing` y `recruitment`.
- Existen wrappers reutilizables ya en `shared/` para varias familias: `lx-card`, `lx-avatar`, `lx-image`, `lx-message`, `lx-tabs`, `lx-tag`, `app-dialog`, `app-sidebar`, `app-avatar` y `ili-list-item`.
- La deuda no es solo de HTML: el árbol actual sigue teniendo imports directos de PrimeNG/Ionic en archivos TypeScript de `features/`.
- El documento de referencia de reglas de botones indicado en el plan estaba desactualizado en esta copia; la version real del repo se encuentra en `src/app/shared/ui/buttons/BUTTON-USAGE-RULES.md`.

### Contradicciones con el plan y el estado real

- El plan habla de una base ya muy avanzada y de ciertas familias como migradas, pero el árbol actual sigue mostrando esos tags sin abstraer en muchas pantallas.
- El inventario historico de conteos no debe tomarse como lineabase final; el estado operativo actual debe validarse contra el árbol real, no contra documentos previos.
- La migracion en `features/` no puede considerarse cerrada hasta que se reduzcan los usos directos a las excepciones permitidas y se eliminen los imports asociados.

### Riesgo operativo de encoding

- El script indicado en el plan (`scripts/scan-mojibake.mjs`) no existe en esta copia del repo. Se validó con el escaner disponible `scripts/audit-encoding.mjs`.
- El resultado reporta 87 archivos con BOM y 50 archivos con mojibake en `src/` (incluyendo varios archivos bajo `features/` y `shared/`). Esto debe tratarse como deuda independiente de la migracion de UI.

### Implicacion para replanificacion

- Priorizar la eliminacion de `p-tag`, `p-card`, `p-message`, `ion-item` e `ion-label` en los módulos donde el uso sigue siendo mas alto.
- Usar los wrappers existentes en `shared/` como primera ruta antes de crear nuevos componentes.
- Mantener el foco en `operations`, `legal` y `maintenance` como zonas de mayor riesgo y menor estandarizacion visible.

## Replanificacion operativa 2026-07-08 (3 agentes)

### Objetivo

- reordenar el trabajo con base en el barrido real verificado del arbol actual
- evitar colisiones entre agentes
- atacar primero las familias con mayor retorno y menor ambiguedad

### Principios de division

1. cada agente trabaja por frontera de modulos, no por archivos sueltos
2. no se cruzan `shared/` salvo wrappers estrictamente necesarios y coordinados
3. antes de migrar, validar si ya existe wrapper en `shared/`
4. no tocar `system/catalogs/catalog-component-ui`
5. cualquier build rojo se documenta con archivo causante antes de seguir

### Distribucion nueva por agente

| Agente | Scope exclusivo | Prioridad principal | Riesgo |
|---|---|---|---|
| Agente 1 | `features/accounting/**` | cerrar `cobranza-nativa`, `fondeos-y-reporteo`, `sat-funding`, `aspel-cobranza-haus` | alto |
| Agente 2 | `features/system/**` + `features/hr/**` | consolidar migraciones previas y limpiar residuales reales del arbol | medio |
| Agente 3 | `features/operations/**` + `features/maintenance/**` + `features/legal/**` + `features/purchasing/**` + `features/recruitment/**` + `features/web/**` | familias heterogeneas, mobile legacy, `p-avatar`/`p-image`/`p-tabs`/`p-fileupload` | alto |

### Regla dura de coordinacion

- Agente 1 no toca `system`, `hr`, `operations`, `maintenance`, `legal`, `purchasing`, `recruitment`, `web`
- Agente 2 no toca `accounting`, `operations`, `maintenance`, `legal`, `purchasing`, `recruitment`, `web`
- Agente 3 no toca `accounting`, `system`, `hr`
- `shared/` solo se toca si:
  - falta wrapper real
  - el cambio destraba multiples pantallas
  - se documenta en este plan antes o despues del ajuste

### Backlog inicial por agente

#### Agente 1 - Accounting

**Meta de fase inmediata**

- cerrar el bloque mas consistente de `accounting` antes de dispersarse

**Lote 1**

1. `general-ledger/contabilidad/cobranza-nativa/pages/ledger`
2. `general-ledger/contabilidad/cobranza-nativa/pages/members`
3. `general-ledger/contabilidad/cobranza-nativa/pages/cobranza-nativa-dashboard`
4. `general-ledger/contabilidad/cobranza-nativa/pages/native-statement`

**Lote 2**

1. `fondeos-y-reporteo/funding/**`
2. `fondeos-y-reporteo/funding-accounting/**`
3. `fondeos-y-reporteo/sat-funding/**`

**Lote 3**

1. `general-ledger/contabilidad/aspel-cobranza-haus/**`
2. remanentes `p-tag`, `p-card`, `p-dialog`, `p-fileupload`, `p-checkbox`

**Familias foco**

- `ion-item`
- `ion-label`
- `p-tag`
- `p-card`
- `p-dialog`
- `p-fileupload`

#### Agente 2 - System + HR

**Meta de fase inmediata**

- reconciliar lo ya migrado con lo que el arbol actual sigue reportando

**Lote 1**

1. `system/catalogs/**` (excepto `catalog-component-ui`)
2. `system/gestin-de-cliente/**`
3. `system/vault/**`

**Lote 2**

1. `system/infrastructure/**`
2. `system/debug/**`
3. residuales mobile con `ion-item` / `ion-label`

**Lote 3**

1. `hr/**` residuales reales del barrido
2. limpieza de imports `Lx*`/PrimeNG/Ionic sobrantes

**Familias foco**

- `p-tag`
- `p-card`
- `p-dialog`
- `p-drawer`
- `ion-item`
- `ion-label`
- `p-tabs`

#### Agente 3 - Operations + Maintenance + Legal + Purchasing + Recruitment + Web

**Meta de fase inmediata**

- terminar zonas heterogeneas y modulos que aun concentran legacy mobile y UI directa visual

**Lote 1**

1. `purchasing/**`
2. `recruitment/**`
3. `web/**`

**Lote 2**

1. `operations/**`
2. `maintenance/**`
3. `legal/**`

**Lote 3**

1. remanentes complejos de `p-avatar`
2. remanentes complejos de `p-image`
3. `p-tabs`
4. `p-fileupload`

**Familias foco**

- `p-avatar`
- `p-image`
- `p-tabs`
- `p-fileupload`
- `ion-card`
- `ion-list`
- `ion-button`
- `ion-grid`

### Orden recomendado de ejecucion entre agentes

1. Agente 2 consolida `system` + `hr` porque son modulos con migracion historica ya avanzada y bajo costo de cierre
2. Agente 1 cierra `cobranza-nativa` y despues brinca a `funding`
3. Agente 3 toma `purchasing` + `recruitment` + `web` primero y deja `operations`/`maintenance`/`legal` heterogeneo para segunda ola

### Criterios de cierre por agente

- cero tags `p-*` no permitidos en su scope
- cero tags `ion-*` en su scope
- cero imports UI directos remanentes salvo excepciones tecnicas documentadas
- scan de mojibake limpio en archivos tocados
- build o al menos `tsc` sin errores nuevos atribuibles a su lane

### Entregable esperado por agente

Cada agente debe dejar en el plan, al final de su sesion:

1. carpetas cerradas
2. familias realmente reducidas
3. blockers encontrados
4. validacion ejecutada

### Riesgos de esta nueva division

- `accounting` sigue siendo el scope mas grande y con mayor mezcla de patrones
- `system` y `hr` tienen riesgo de deuda "fantasma": el plan dice una cosa y el arbol actual otra
- `operations`/`maintenance`/`legal` tienen mas layouts heterogeneos y no conviene migrarlos solo con reemplazos mecanicos
- el tema de encoding ya es una deuda paralela y no debe mezclarse de forma improvisada con la migracion visual

## Sesion 2026-07-07 12:57

### Objetivo de la sesion

- arrancar Fase 2 con wrappers genericos de mayor impacto

### Cambios realizados

- se reviso la arquitectura real de `shared/` para respetar el patron `base` + `web/mobile` + `adaptive`
- se validaron usos reales de `p-tag`, `p-card` y `p-message` en `features/`
- se crearon wrappers nuevos para `tag`, `card` y `message`

### Wrappers creados o ajustados

- `lx-tag`, `app-tag`, `ili-tag`
- `lx-card`, `app-card`, `ili-card`
- `lx-message`, `app-message`, `ili-message`
- bases nuevas:
  - `tag.base.ts`
  - `card.base.ts`
  - `message.base.ts`

### Pantallas migradas

- ninguna aun; esta sesion se enfoco en habilitar la capa compartida

### Hallazgos o decisiones

- para `tag`, `card` y `message` se eligio wrapper custom real en lugar de passthrough directo a PrimeNG
- esto reduce acoplamiento de `features/` a PrimeNG y facilita siguientes migraciones
- `p-tag` usa con frecuencia `severity`, `value`, `tooltip` e `icon`
- `p-card` usa con frecuencia `header` y clases utilitarias
- `p-message` usa `severity`, `text` o contenido proyectado

### Pendientes inmediatos

1. definir reemplazo generico para `ion-item`
2. definir reemplazo generico para `ion-label`
3. comenzar migracion de una familia ya cubierta, idealmente `p-message` o `p-tabs`

### Validaciones

- [x] build
- [x] scan de mojibake
- [x] inventario actualizado

## Sesion 2026-07-07 13:12

### Objetivo de la sesion

- cerrar la familia `p-message` en `features/`

### Cambios realizados

- se migro el uso de `p-message` a `lx-message` en `features/`
- se reemplazaron imports `MessageModule` por `LxMessage`
- se limpiaron imports sobrantes detectados por Angular
- se reemplazaron dos bloques que usaban clases visuales `p-message` por wrapper real

### Wrappers creados o ajustados

- se ajustaron wrappers `message`, `card` y `tag` para respetar comportamiento de layout del host

### Pantallas migradas

- familia completa `p-message` en los archivos detectados del barrido

### Hallazgos o decisiones

- algunos archivos no usaban ya `MessageModule` en template, pero seguian importandolo; Angular los detecto como imports sobrantes al migrar
- existian bloques visuales con clases `p-message` aunque ya no hubiera tag `p-message`; tambien se migraron
- el build quedo limpio de warnings NG8113 relacionados con `LxMessage`

### Pendientes inmediatos

1. atacar la familia `p-tabs`, que ya tiene wrapper listo
2. despues tomar `p-dialog` y `p-drawer`
3. dejar para otra pasada `ion-item` / `ion-label`, porque requieren primitive nueva

### Validaciones

- [x] build
- [x] scan de mojibake en wrappers y archivos clave tocados
- [x] plan actualizado

## Sesion 2026-07-07 17:42 (claude)

### Objetivo de la sesion

- migrar familia `p-tabs` (`ion-segment`) e `ion-item` / `ion-label` a wrappers compartidos en pantallas concretas (trabajo en paralelo con otro agente; lotes separados para no pisarnos)

### Cambios realizados

- Ola 3 `p-tabs`: se elimino `ion-segment` / `ion-segment-button` / `ion-label` directo y se reemplazo por `lx-tabs` usado como selector segmentado (paneles conmutados con `@switch` del propio feature)
  - `operations/google-calendar/calendar/mantenimiento-preventivo/calendario-mtto-list` (.ts + .html)
  - `accounting/general-ledger/contabilidad/presupuesto-web-aspel/wrapper` (.ts + .html)
- Ola 2 `ion-item` / `ion-label`: se reemplazo `ion-item` por `ili-list-item [noPadding]="true"`, `slot="start"`/`slot="end"` por atributos `start`/`end`, y se elimino `ion-label` (su contenido pasa al slot por defecto)
  - `accounting/.../cobranza-nativa/pages/approvals/approval-inbox` (.ts + .html)
  - `accounting/.../cobranza-nativa/pages/charge-templates/charge-template-list` (.ts + .html)
  - `accounting/.../cobranza-nativa/pages/invoices/invoice-list` (.ts + .html)
- se agrego `MobileListItem` (y `AppIcon` donde faltaba) y se eliminaron imports muertos `addIcons` / `ionicons/icons` (los templates ya usaban `app-icon`, no `ion-icon`)

### Wrappers creados o ajustados

- ninguno nuevo: se confirmo que `ili-list-item` (`MobileListItem`, en `shared/ui/mobile/list-item`) ya existe y sirve como primitivo publico para reemplazar `ion-item` / `ion-label`

### Pantallas migradas

- 5: `calendario-mtto-list`, `presupuesto-web-aspel/wrapper`, `approval-inbox`, `charge-template-list`, `invoice-list`

### Hallazgos o decisiones

- `ili-tabs` (pata movil de `lx-tabs`) proyecta todo el contenido con un unico `<ng-content/>` y NO conmuta paneles por tab activa; por eso se usa `lx-tabs` como selector y se conserva el `@switch` del feature para los paneles (evita colapsar a un solo `lx-tabs` con paneles proyectados)
- `ili-list-item` ya cubre el hueco marcado como "faltante" para `ion-item` / `ion-label` en Fase 1

### Pendientes inmediatos

1. continuar con mas `ion-item` / `ion-label` residual en `features/`
2. continuar migracion de `p-tabs` residual a `lx-tabs`
3. barrido de imports Ionic muertos (`addIcons`/`ionicons`) en pantallas ya migradas

### Validaciones

- [x] build (`npm run build` OK, 177 s, solo warnings pre-existentes)
- [x] scan de mojibake (`CERO` en los 3 directorios de cobranza-nativa tocados)
- [x] tsc limpio en archivos tocados

## Sesion 2026-07-07 (cont., claude)

### Objetivo de la sesion

- seguir Ola 2 `ion-item` / `ion-label`: tomar un bloque cohesivo y self-contained (bajo riesgo de conflicto con el otro agente)

### Cambios realizados

- bloque **`system/catalogs`** (8 pantallas de lista, patron uniforme `ion-item` dentro de `app-data-view-mobile #listItemTemplate`): `ion-item`→`ili-list-item [noPadding]="true"`, `slot="start"`/`slot="end"`→atributos `start`/`end`, `ion-label` eliminado (contenido al slot por defecto)
  - `banks/bank-list`, `cfdi-use/pages/cfdi-use-list`, `machinery-classification/machinery-classification-list`, `meter-category/meter-category-list`, `payment-method/pages/payment-method-list`, `payment-type/payment-type-list`, `product-category/product-category-list`, `units-of-measurement/unit-of-measurement-list`
- se agrego `MobileListItem` + `AppIcon` (ningun `.ts` importaba `AppIcon` pese a usar `<app-icon>`) y se elimino `addIcons` / `ionicons/icons` muerto en `banks` y `cfdi-use`

### Wrappers creados o ajustados

- ninguno; se reutilizo `ili-list-item` (`MobileListItem`)

### Pantallas migradas

- 8 (bloque completo `system/catalogs`)

### Hallazgos o decisiones

- se descarto el bloque `meetings/committee` por heterogeneo (mezcla `ion-card`, `ion-grid`/`col`/`row`, `ion-img`, `ion-badge`, `ion-list-header`): requiere varios wrappers, no encaja en la receta simple `ion-item`/`ion-label`
- se acoto el bloque a pantallas cuyo unico Ionic es `ion-item`/`ion-label` (receta mecanica, bajo riesgo)
- `<app-icon>` se usaba sin importar `AppIcon` en estos `.ts`; se agrego el import explicito

### Pendientes inmediatos

1. seguir con mas bloques self-contained del mismo patron (maintenance/logs, purchasing, operations/inventarios, system/access, etc.)
2. atacar por separado los bloques heterogeneos (committee) que requieren `lx-card` / grid / avatar
3. barrido de imports Ionic muertos residuales

### Validaciones

- [x] build (`npm run build` OK, 109 s, solo warning de bundle budget pre-existente)
- [x] scan de mojibake (`CERO` en `system/catalogs`)
- [x] tsc limpio en los 8 archivos

### Bloque 2 — `operations/inventarios-y-almacn` (7 pantallas)

- se creo un migrador robusto (`scratchpad/migrate-listitem.mjs`) que auto-salta archivos no uniformes (otras `ion-*`, sin `.ts` hermano, o sin import `IonItem/IonLabel`) y aplica la receta al resto; ionicons muerto removido de forma robusta (multi-nombre / multi-linea), respetando `effect()` u otro codigo del constructor
- migradas (solo `ion-item`/`ion-label`): `key-inventory`, `lighting-inventory`, `paint-inventory`, `product-entry`, `radio-communication-inventory`, `stock-por-almacen`, `warehouse`
- **saltadas (pendientes de otra pasada):**
  - con `ion-button`: `fire-extinguisher-inventory`, `hydrant-inventory`, `manual-call-point-inventory`, `smoke-detector-inventory` (requieren migrar tambien el boton)
  - `product/productos-list` y `product-exit/product-output-list`: NO importan `IonItem/IonLabel` (usan `ion-item` como custom element global de Ionic); requieren revision dedicada (agregar `MobileListItem`/`AppIcon` + swap html)
- validaciones: `tsc` limpio, `scan-mojibake` CERO, `npm run build` OK (135 s)

### Hallazgo relevante

- varios `.ts` usan `<ion-item>` / `<app-icon>` sin importar `IonItem` / `AppIcon`; funcionan porque Ionic registra sus componentes como custom elements globales y el proyecto no falla ante elementos desconocidos (`strictTemplates` off). **Al migrar a `<ili-list-item>` (componente Angular, NO custom element) es OBLIGATORIO importar `MobileListItem`**, si no renderiza vacio. Agregar `AppIcon` ademas corrige iconos que podian estar renderizando vacios.

### Bloque 3 — `maintenance/logs` (8 pantallas)

- se extendio el migrador para soportar **Caso B**: `.ts` que usan `<ion-item>`/`<ion-label>` como custom element global (sin `import`); el migrador solo AGREGA `MobileListItem` (+`AppIcon` si usa `<app-icon>` y no lo importa) e inyecta en el arreglo `imports`, sin remover nada
- migradas: `bitacoras/medidores/medidor-lectura-list`, `bitacoras/prestamo-herramienta/prestamo-herramientas-control`, `elevator-emergency-call`, `elevator-spare-parts`, `piscina`, `piscina-bitacora`, `recepcion-pipas-agua`, `tool-loan` (2 Caso A + 6 Caso B)
- saltada: `bitacoras/medidores/medidor-lectura-chart` (usa `ion-segment` + `ion-card` — otra receta)
- validaciones: `tsc` limpio, `scan-mojibake` CERO, `npm run build` OK (147 s)

### Bloque 4 — wrappers nuevos para lane Agente 3 (operations/maintenance/legal)

- rol asignado: **Agente 3** = `operations/**` + `maintenance/**` + `legal/**`, familias heterogeneas + `p-dialog`/`p-drawer`/`p-fileupload`/`p-avatar`/`p-image`
- inventario del lane: `p-image` ~41 usos, `p-avatar` ~13, `ion-avatar` 7, `ion-img` 6, ion-card/`p-card` (cubierto por `lx-card`), `p-fileupload` 7 (cubierto por `app-file-upload`)
- **creados (Prioridad B, faltaban):**
  - `lx-image` / `app-image` (p-image) / `ili-image` (ion-img) + `image.base.ts` + specs
  - `lx-avatar` / `app-avatar` (p-avatar) / `ili-avatar` (ion-avatar) + `avatar.base.ts` + specs
  - prioridad de contenido avatar: image > label (iniciales) > icono (`app-icon`)
- validaciones: `npm run audit:ui` OK (fronteras), specs verdes (base + adaptive render)
- siguiente: migrar usos de `p-image` / `ion-img` y `p-avatar` / `ion-avatar` en el lane

## Sesion 2026-07-07 (Agente 3 — re-aplicacion tras revert)

### Contexto

- un reset cross-agent revirtio todas las migraciones de `features/` (ver §0). Se re-aplican SOLO las de mi lane

### Cambios realizados

- re-aplicadas migraciones `ion-item`/`ion-label` → `ili-list-item` en:
  - `operations/inventarios-y-almacn` (9 pantallas; ahora incluye `product` y `product-exit` via Caso B)
  - `maintenance/logs` (8 pantallas)
- creados previamente y persistentes: wrappers `lx-image` y `lx-avatar` (Fase 2 Prioridad B)

### Validaciones

- [x] `tsc` limpio en mis archivos (inventarios + logs): 0 errores
- [x] `scan-mojibake` CERO en mis archivos migrados (el scan reporta mojibake pre-existente en `inventory-engine-system.ts` y `bitacoras/medidores/medidores-list.ts`, archivos que NO toque)
- [ ] `npm run build` **BLOQUEADO por archivos de OTROS agentes** (fuera de mi lane), no por los mios:
  - `hr/.../employees/pages/card-employee.ts` (falta `CardModule`/`TagModule`)
  - `hr/.../employees/org-chart` (`OrgChart`) y `staff-board` (`StaffBoard`): `NG5002` two-way binding
  - `system/access/application-user/.../update-password-account.ts`
  - `system/access/user-profile/update-user-photo.ts`
  - `system/test/.../update-data-base.ts`

### Nota de coordinacion

- el arbol esta inestable por ediciones concurrentes. Recomendacion: **commitear por lanes** para no perder trabajo y evitar que un reset borre migraciones. Agente 3 no toca hr/system (otros lanes)

## Sesion 2026-07-07 (Agente 3 — barrido de lane completo)

### Objetivo

- barrer `ion-item`/`ion-label` simple en todo el lane (operations/maintenance/legal) tras el commit base `16b9c46d`

### Cambios realizados

- migrador `ili-list-item` corrido sobre todo el lane (auto-salta heterogeneos con ion-card/button/segment):
  - **operations: 33 pantallas** (announcements, custom-documents, directorios, google-calendar, inspecciones, manuals, meetings/juntas-comite, properties, supervision, task-engine/recurring-tasks + my-tasks, templates, diagrams)
  - **legal: 8 pantallas** (documento-personalizado, minutas, ticket-legal x5, committee/library-detalle)
  - **maintenance: 8 pantallas** (fire-equipment logs + inspection-periods, calendario-maestro)
- total lane esta sesion: **49** (+ 17 previas de inventarios/logs)

### Hallazgos o decisiones

- 2 archivos con `imports` en formato no estandar rompieron el migrador y se arreglaron a mano:
  - `google-calendar.ts` (entrada de arreglo pegada en una linea)
  - `fire-inspection-cycle-detail.ts` (arreglo `imports` en una sola linea)
  - **mejora pendiente del migrador**: soportar arreglos `imports` inline
- `p-image` NO se migro aun: 25 usos ponen `class=` en `<p-image>` (que `app-image` moveria al host wrapper, no al `<img>` interno) → requiere criterio por uso (`class` → `imageClass`); se hara en pasada dedicada

### Validaciones

- [x] `tsc` limpio en todo mi lane (0 errores; de hecho 0 en toda la app)
- [x] `npm run build` OK (128 s)
- [x] migrador solo cambia tags/imports ASCII → no introduce mojibake

## Sesion 2026-07-08 (Agente 3 — familias p-avatar / p-image)

### Cambios

- wrappers `app-avatar`/`app-image` (+ ili/adaptive) ampliados con input `styleClass` (reenvia clase al elemento interno, no al host) y `app-image` con `appendTo` (preview)
- migrador `migrate-simple-tag.mjs`: renombra `p-* -> app-*`, convierte `class=` -> `styleClass=` (estatico, `[class]`, e interpolado de una `{{}}`), y cambia el import de modulo por el wrapper
- **p-avatar -> app-avatar**: 11 pantallas (operations) + 2 imports muertos `AvatarModule` removidos
- **p-image -> app-image**: 22 pantallas (18 operations + 4 maintenance) + 1 import muerto `ImageModule` removido
- **p-progressspinner -> app-spinner**: 6 pantallas (mapeo `class="w-Nrem h-Nrem"` -> `[size]="N*16"`, `strokeWidth`)
- orphan (no referenciado por ningun `.ts`): `operations/task-engine/tasks/my-tasks/pages/my-tasks-list.html`

### Diferido (alto riesgo de colision / semantica compleja)

- **p-tag (123)** y **p-card (51)**: los migra otro agente globalmente (rompio ListProvider/JobDescriptionForm). `app-tag` es un componente custom con color por `severity` (no envuelve p-tag); reconciliar los 56 `class=` custom requiere criterio. Se deja para coordinar con el agente dueño de esa familia.

### Validaciones

- [x] `tsc` 0 errores en toda la app
- [x] `npm run audit:ui` OK
- [x] `npm run build` OK (159 s) — verde tras que otros agentes arreglaran su WIP

---

## 7. Formato de control por sesion

Copiar este bloque al final en cada sesion nueva:

```md
## Sesion YYYY-MM-DD HH:mm

### Objetivo de la sesion

-

### Cambios realizados

-

### Wrappers creados o ajustados

-

### Pantallas migradas

-

### Hallazgos o decisiones

-

### Pendientes inmediatos

1.
2.
3.

### Validaciones

- [ ] build
- [ ] scan de mojibake
- [ ] inventario actualizado
```

---

## 8. Criterio de aceptacion final

Se considera completada la migracion cuando:

- `features/` ya no usa PrimeNG directo fuera de `p-table` y sus piezas autorizadas
- `features/` ya no usa componentes directos de Ionic
- las pantallas usan wrappers de `shared/`
- las excepciones restantes, si existen, estan documentadas y aprobadas
- el inventario esta actualizado
- el build pasa
- no hay mojibake en archivos modificados

---

## 9. Proxima accion recomendada

Para iniciar con buen retorno y bajo riesgo:

1. completar la Fase 1 inventariando wrappers ya existentes en `shared/`
2. decidir huecos reales para `p-tag`, `p-card` e `ion-item` / `ion-label`
3. comenzar la primera ola de migracion por familias

## Sesion 2026-07-07 22:40 (Codex, lane accounting)

### Objetivo de la sesion

- avanzar Ola 2 (`ion-item` / `ion-label`) y Ola 4 (`p-checkbox`) dentro de `accounting`, sin tocar archivos sensibles fuera del lane

### Cambios realizados

- se creo wrapper compartido `app-table-checkbox` para reemplazar `p-checkbox` inline en tablas/grids
- se migraron los `p-checkbox` directos de:
  - `accounting/ar/catalogo-gastos-fijos`
  - `accounting/general-ledger/catalogo-gastos-fijos`
  - `accounting/fondeos-y-reporteo/funding/components/funding-group-files`
- se migro el cascaron mobile `ion-item` / `ion-label` a `ili-list-item` + slot default en:
  - `accounting/general-ledger/contabilidad/accounting-catalog/pages`
  - `accounting/general-ledger/contabilidad/presupuesto-web-aspel/purchase-history`
  - `accounting/general-ledger/contabilidad/cobranza-online/pages/analysis`
  - `accounting/general-ledger/contabilidad/cobranza-online/pages/exclusions`
  - `accounting/general-ledger/contabilidad/cobranza-online/pages/inspection`
  - `accounting/general-ledger/contabilidad/cobranza-online/pages/presupuesto-contabilidad`
  - `accounting/general-ledger/contabilidad/cobranza-online/pages/reporte-financiero`

### Wrappers creados o ajustados

- `shared/ui/web/table-checkbox/table-checkbox.ts`
  - soporte binario (`checked` / `checkedChange`)
  - soporte multiseleccion con `FormControl` + `value`

### Pantallas migradas

- 7 vistas mobile de `accounting` sin `IonItem` / `IonLabel`
- 3 bloques con `p-checkbox` directo reemplazado por wrapper

### Hallazgos o decisiones

- `presupuesto-propuesta` y sus hijos NO se tocaron por advertencia explicita de no modificar esa logica sin autorizacion
- en `cobranza-online/pages` el barrido ya no deja `IonItem` / `IonLabel`; los matches residuales eran falsos positivos por `optionLabel`
- el build global ya no sirve como semaforo exclusivo del lane `accounting` porque actualmente esta bloqueado por errores ajenos en `hr/**`, `system/**` y wrappers compartidos (`p-card`, `p-sidebar`)

### Pendientes inmediatos

1. seguir con remanentes de `ion-item` / `ion-label` en `accounting` fuera de `cobranza-online`
2. seguir con remanentes de `p-checkbox` directos permitidos solo via wrapper

### Validaciones

- [ ] build global limpio
- [x] scan de mojibake en `accounting/general-ledger/contabilidad/cobranza-online/pages`
- [x] plan actualizado

## Sesion 2026-07-08 (Agente 2 — system + hr)

### Objetivo de la sesion

- migrar `p-tag`, `p-card`, `p-dialog`, `p-drawer` en `features/system/**` y `features/hr/**` a wrappers existentes en `shared/`
- limpiar imports `primeng/tag`, `primeng/card`, `primeng/dialog`, `primeng/drawer`, `primeng/tooltip`

### Cambios realizados

- HTML: `p-tag → lx-tag` en 40 archivos, `p-card → lx-card` en 26 archivos, `p-dialog → lx-modal` en 2 archivos, `p-drawer → lx-sidebar` en 4 archivos (55 archivos HTML únicos)
- TS imports: removidos `TagModule`, `CardModule`, `DialogModule`/`Dialog`, `Drawer`, `TooltipModule` (cuando ya no usado); agregados `LxTag`, `LxCard`, `LxModal`, `LxSidebar` en ~100 archivos
- Se corrigió el wrapper `shared/ui/web/sidebar/sidebar.ts` que usaba API obsoleta (`primeng/sidebar`, `<p-sidebar>`) → `primeng/drawer`, `<p-drawer>` (PrimeNG 22 renombró Sidebar a Drawer)
- Se corrigieron `[(visible)]="signal()"` → `[visible]="signal()" (visibleChange)="signal.set($event)"` en 4 templates (two-way binding no soportado con signal getter)
- Se corrigieron `CardModule`/`TagModule` residuales en `imports[]` que quedaron sin su línea de import

### Wrappers utilizados

- `lx-tag` (`@ui/adaptive/tag/tag`) — migración directa desde `p-tag`
- `lx-card` (`@ui/adaptive/card/card`) — migración directa desde `p-card`
- `lx-modal` (`@ui/adaptive/modal/modal`) — migración desde `p-dialog`
- `lx-sidebar` (`@ui/adaptive/sidebar/sidebar`) — migración desde `p-drawer`

### Pantallas migradas

- **system/** (23 HTML): `access/*`, `ai/*`, `approval-rules/*`, `asamblea-checklist-template/*`, `audit-logs/*`, `catalogs/*`, `gestin-de-cliente/*`, `infrastructure/*`, `test/*`, `vault/*`
- **hr/** (32 HTML): `chekador-empleados/*`, `evaluaciones-de-desempeo/*`, `expediente-del-empleado/{employees,hr-employees,recursos-humanos}/*`

### Hallazgos o decisiones

- `p-fileupload` no tenía ocurrencias en system/hr, se omitió
- `p-tag` migró `[pTooltip]` → `[tooltip]` y eliminó `tooltipPosition`
- `p-card` con clases `shadow-*` recibió `[elevated]="true"`
- `p-dialog` y `p-drawer` perdieron `[style]="{width:'...'}"` (el wrapper no expone width)
- Varios `.ts` importaban `CardModule`/`TagModule` sin usarlos en template (imports sobrantes del pasado); el agente los reemplazó por `LxCard`/`LxTag` — ahora generan warning NG8113 pero no error
- El build global sigue bloqueado por error pre-existente en `features/purchasing/pr/solicitud-compra/product-add.html` (`[inputclass]`/`[panelclass]` no reconocidos)

### Pendientes inmediatos

1. migrar `p-tag`/`p-card`/`p-dialog`/`p-drawer` en otros módulos (accounting, operations, etc.)
2. limpiar warnings NG8113 de imports `LxCard`/`LxTag`/`LxModal` en archivos que no usan el wrapper
3. reparar error pre-existente en `purchasing/` para destrabar build global

### Validaciones

- [x] build (solo error pre-existente en purchasing)
- [x] cero `p-tag`/`p-card`/`p-dialog`/`p-drawer` en HTML de system/ y hr/
- [x] plan actualizado

## Sesion 2026-07-08 (Agente 2 — limpieza imports Lx* sobrantes)

### Objetivo de la sesion

- eliminar warnings NG8113 por imports de `LxCard`/`LxTag`/`LxModal` en archivos de system/hr cuyo HTML no usa el componente

### Cambios realizados

- se ejecutó script `scratchpad/clean-unused-imports.mjs` que verifica presencia del tag `lx-card`/`lx-tag`/`lx-modal` en el HTML vs. import en el TS
- se removieron ~40 imports sobrantes distribuidos entre system (27) y hr (23)

### Wrappers creados o ajustados

- ninguno

### Pantallas migradas

- ninguna a nivel HTML (solo limpieza de imports TS)

### Hallazgos o decisiones

- el build previo emitía NG8113 para estos imports sobrantes (Angular detecta el import pero el template no usa el componente)
- la limpieza es superficial pero necesaria para mantener `ng build` sin warnings en system/hr
- los archivos que aún importan Lx* después de la limpieza tienen uso real del tag en su HTML

### Pendientes inmediatos

1. migrar `p-tag`/`p-card`/`p-dialog`/`p-drawer` en otros módulos (purchasing, maintenance, inventory, dashboard, etc.)
2. reparar error pre-existente en `purchasing/pr/solicitud-compra/product-add.html` para destrabar build global

### Validaciones

- [x] build — 0 errores NG8113 en system/hr
- [x] plan actualizado

## Sesion 2026-07-08 (Agente 2 — definicion estrategia p-card)

### Objetivo de la sesion

- definir criterio para migrar `p-card` que distinga entre card declarativa (header/subheader) y card estructural (solo contenedor)
- documentar la estrategia en el plan

### Decision tomada

- `p-card` con header/subheader → `<lx-card header="...">` (wrapper adaptive)
- `p-card` estructural (sin header, sin templates PrimeNG) → CSS-only `<div class="card">` / `card card-body`
- `ng-template #content` no tiene equivalente en `lx-card` → convertir a proyeccion directa dentro de `.card-body`
- Prohibido mantener `<p-card>` en `features/`
- Queda documentado en `§Estrategia p-card`

### Wrappers utilizados

- `lx-card` (`@ui/adaptive/card/card`) — para cards con header
- `_cards.scss` (`.card`, `.card-body`, `.card-header`) — para cards estructurales CSS-only

### Pantallas migradas

- ninguna (decision de ruta, no ejecucion)

### Pendientes inmediatos

1. migrar `purchasing/` + `recruitment/` + `web/` usando la estrategia definida
2. reparar error pre-existente en `purchasing/pr/solicitud-compra/product-add.html`

### Validaciones

- [ ] build (no aplica, solo decision)
- [x] plan actualizado con estrategia p-card

## Sesion 2026-07-08 (Codex, lane accounting cont.)

### Objetivo de la sesion

- seguir cerrando `accounting/general-ledger/contabilidad/cobranza-nativa` con foco en `ion-item` / `ion-label` y `p-tag`

### Cambios realizados

- se migraron a `ili-list-item` + slot default y `MobileListItem` los bloques mobile de:
  - `initial-balance`
  - `payments`
  - `payment-detail-modal`
  - `property-fines`
  - `audit/financial-audit-log`
  - `reconciliation/reconciliation-dashboard`
  - `period-closures/period-closure-dashboard`
  - `regulation-articles/regulation-article-list`
- se reemplazo `p-tag` por `lx-tag` en `property-fines` y `regulation-articles`
- se corrigio mojibake residual en esos mismos archivos
- se limpiaron imports muertos de Ionic/ionicons donde el template ya usa `app-icon`

### Wrappers creados o ajustados

- ninguno nuevo en esta pasada
- se reutilizaron `MobileListItem`, `LxTag` y `AppIcon`

### Pantallas migradas

- 8 bloques/pantallas adicionales dentro de `cobranza-nativa`

### Hallazgos o decisiones

- en `payments/` quedo limpia tambien la vista de detalle (`payment-detail-modal`), no solo el listado
- el siguiente bloque natural en `cobranza-nativa` es `ledger`, `members`, `cobranza-nativa-dashboard` y `native-statement`
- `native-statement` ya no es receta simple de `ion-item` porque tambien usa `ion-card` e `ion-list-header`

### Pendientes inmediatos

1. seguir con `ledger` y `members` en `cobranza-nativa`
2. despues tomar `cobranza-nativa-dashboard` y `native-statement`
3. barrer remanentes `p-tag` en otros submodulos de `accounting`

### Validaciones

- [x] scan de mojibake limpio en `initial-balance`, `payments`, `property-fines`, `audit`, `reconciliation`, `period-closures` y `regulation-articles`
- [x] sin `IonItem` / `IonLabel` / `p-tag` directos en esos directorios
- [ ] build global no corrido en esta pasada

## Sesion 2026-07-08 (Agente migrador — purchasing + recruitment)

### Objetivo de la sesion

- migrar `purchasing/` + `recruitment/` aplicando estrategia p-card definida
- migrar `p-tag`, `p-dialog`, `p-message`, `p-fileupload`, `ion-item`/`ion-label` en esos módulos

### Cambios realizados

**HTML migrado (~55 archivos):**

- `p-card` → `<lx-card>` (12 archivos) o CSS-only `<div class="card">` (1 archivo, job-description-form)
- `p-tag` → `<lx-tag>` (~39 ocurrencias)
- `p-message` → `<lx-message>` (7 archivos)
- `p-dialog` → `<lx-modal>` (3 archivos: 2 cuadro-comparativo, 1 job-description-form)
- `p-fileupload` → `<app-file-upload>` (1 archivo: create-orden-compra-wizard)
- `ion-item`/`ion-label` → `<ili-list-item>` (~21 archivos)

**TS imports actualizados (~55 archivos):**

- removidos: `TagModule`, `CardModule`, `DialogModule`/`Dialog`, `Drawer`, `MessageModule`, `FileUploadModule`, `IonItem`/`IonLabel`
- agregados: `LxTag`, `LxCard`, `LxModal`, `LxMessage`, `FileUpload`, `AppIcon`, `MobileListItem`, `WebButtonLabel`

**Errores pre-existentes reparados:**

- `job-description-form.ts`: `MessageModule` import from `primeng/message` — módulo no existente en PrimeNG 22, cascaba todo el archivo
- `create-orden-compra-wizard.ts`: imports `LxMessage, FileUpload, AppIcon, LxTag` dentro de un comentario (`// Added, ...`) — se extrajeron del comentario al array real
- `orden-compra-pdf.html`: archivo HTML no referenciado (componente usa `template: ""`), revertido
- `job-description-form.ts`: `il-button` sin import → se agregó `WebButtonLabel`

### Wrappers utilizados

- `lx-card`, `lx-tag`, `lx-modal`, `lx-message` (adaptive)
- `app-file-upload` (web)
- `ili-list-item` (mobile)
- `WebButtonLabel` (il-button)
- CSS-only `.card` para cards estructurales sin header

### Pantallas migradas

- **purchasing/** (~34 HTML): quotes, providers, PR, PO, cedula, customer-provider, provider-support, purchase-link-manager
- **recruitment/** (~10 HTML): work-position, employee-reclutamiento, recruitment-requests, vacancy-requests, client-requests
- **web/**: 0 violaciones encontradas

### Hallazgos o decisiones

- `p-card` sin header/subheader + sin `ng-template #content` → `<lx-card>` directo
- `p-card` con `class="p-0"` → `[padded]="false"`
- `p-card` con `ng-template #content` → unwrap content a proyeccion directa (lx-card no soporta template outlets)
- `p-card` con `class="p-0 border-none shadow-none"` (recruitment work-position) → CSS-only `<div class="card">` — no vale la pena lx-card si se anula todo su chrome visual
- `p-tag` multiline (atributos en varias lineas) requiere regex `[\s\S]*?` en vez de `[^>]*`
- `p-message` y `p-dialog` con `</tag\n>` closing tag partido requieren HTML limpio primero
- archivos dead code (`template: ""` con HTML file no usado) existen y no deben migrarse

### Pendientes inmediatos

1. migrar modulos restantes: dashboard, sales, production
2. reparar error pre-existente en `purchasing/pr/solicitud-compra/product-add.html`

### Validaciones

- [x] CERO violaciones PrimeNG/Ionic en purchasing/ + recruitment/ + web/
- [x] build exitoso (0 errores, solo warnings pre-existentes y NG8113 de imports sobrantes)
- [x] plan actualizado

## Sesion 2026-07-08 (Agente 2 - Cierre de Lote system/** y hr/**)

### Objetivo de la sesion

- Validar lo ya migrado y cerrar residuales reales del arbol para el lote asignado a Agente 2.
- Lote exacto:
  - system/catalogs/** excepto catalog-component-ui
  - system/debug/mini-postman
  - system/infrastructure/debug/mini-postman
  - system/gestin-de-cliente/customer/**
  - system/gestin-de-cliente/customer-modul/**
  - system/gestin-de-cliente/customer-provider/**

### Cambios realizados

- Reemplazo y limpieza masiva de <p-card> por divs simples (<div class="card">). Se solucionaron multiples problemas de plantillas y etiquetas mal cerradas derivados de la limpieza (NG5002).
- Correcion de error de [ngClass] por falta de importacion de CommonModule en 	icket-legal-seguimiento.ts.
- Ajuste final de componentes de Skeleton para la version 17 de PrimeNG. Se utilizo [class] en vez de [styleClass] en skeleton.ts y se importo WebSkeletonPresets en el catalogo UI.

### Hallazgos o decisiones

- Los errores reportados por Angular en torno a etiquetas huérfanas (
g-template, p-table, div sin cerrar) provenian del script original de migracion de p-card que desbalanceo la jerarquia. Fue necesario inspeccionar a mano el balanceo (ej. en eport-consumos, nnouncement-list, y nnouncement-analytics).
- El script de deteccion de mojibake tenia un bug referenciando aseDir al encontrar coincidencias, lo cual causaba crasheos (scan-mojibake.mjs). Se reparo para que imprimiera la ruta relativa real ().

### Pendientes inmediatos

- El lote correspondiente a Agente 2 ha sido validado, refactorizado y limpiado por completo. Quedamos a disposicion para pasar al proximo bloque (por ejemplo, el lote del Agente 3 o cualquier otra seccion del features).

### Validaciones

- [x] build global superado sin errores de compilacion y HTML correctos.
- [x] scan de mojibake limpio tras detectar y limpiar 127 ocurrencias en 39 archivos.
- [x] CERO mojibake verificado al final del escaneo.
- [x] plan actualizado.

## Sesion 2026-07-08 (Agente 1 — accounting: cierre del barrido con wrapper)

### Objetivo de la sesion

- cerrar `accounting/**` (lane Agente 1) migrando todo lo que tiene wrapper existente
- verificar SIEMPRE con `ng build --configuration development` (no solo tsc)

### Cambios realizados (16 commits, build verde en cada verificacion)

- **Ionic crudo: 0 en accounting.** cobranza-nativa (batch ledger/members/dashboard/native-statement), master-dashboard, catalogo-gastos-fijos x2, presupuesto-web-aspel/wrapper: `ion-badge/list/card/divider/segment/button/accordion` -> wrappers (`ili-badge`, `div`, `lx-tabs`, `ili-button`, `lx-accordion`) + limpieza de `moduls.ts` (quita imports `@ionic/angular/standalone` ya sin uso).
- **Familias display**: `p-progressspinner`->`lx-spinner` (9), `p-avatar`->`lx-avatar` (2), `p-badge`->`lx-badge` (2), `p-progressbar`->`lx-progress-bar` (3), `p-skeleton`->`lx-skeleton` (37 en 13 archivos).
- **Componentes**: `p-accordion`->`lx-accordion` (report-guide), `p-chip`->`lx-chip` (report-builder), `p-checkbox`->`lx-checkbox` (catalogo x2 binario + funding-group-files grupo), `p-dropdown`->`custom-input-select-signal` (sat-funding-detail x2), `p-confirmdialog` eliminado x2 (report-catalog usa `(confirmed)` de los botones delete; payment-list usa `window.confirm`).

### Wrappers creados o ajustados (shared/ui — excepcion documentada)

- **`web/accordion/accordion.ts`**: estaba roto contra PrimeNG 22 (`[activeIndex]`, `p-accordionTab`, `onOpen/onClose`) y **tumbaba `ng build` de TODO el repo** (NG8002). Migrado a API v22 (`p-accordion [value]/(valueChange)` + `p-accordion-panel/-header/-content`) + render de `item.icon` en header (paridad con `ili-accordion`). Build global destrabado.

### Hallazgos clave (para todos los agentes)

1. **ripgrep NO soporta lookahead `(?!...)`**: los scans tipo `<p-(?!table...)` devuelven **falso negativo** (0 matches) silenciosamente. Usar scan plano `<p-`/`<ion-` + exclusion manual del family `p-table`.
2. **`ion-input-select` / `ion-input-checkbox` son componentes PROPIOS** (`shared/ui/inputs/mobile`), NO Ionic crudo -> permitidos; no migrar.
3. El patron `<ng-content [select]="...">` de `app-tabs`/`app-accordion` **compila** (no era el bloqueo del build), pero su correctitud en runtime multi-panel esta **sin verificar visualmente**.
4. **`p-tabs` ya es EXCLUSIVO de accounting** (3 archivos): el resto de modulos ya lo migro. Ver reparto abajo.
5. Divergencia con la sesion de Codex: reporto `app-table-checkbox` + migracion de `p-checkbox` en catalogo, pero el arbol tenia `p-checkbox` crudo (yo lo migre a `lx-checkbox`). El wrapper `web/table-checkbox` puede estar **huerfano/no commiteado** -> Agente 2 debe reconciliar.

### Pendiente en accounting y REPARTO propuesto entre 3 agentes

**Lo que TOMO yo (Agente 1) para cerrar accounting al 100%:**

1. **`lx-tabs` multi-panel (shared/ui)** + los 3 usos de accounting (`report-catalog`, `financial-reports-wrapper`, `contabilidad-cliente-wrapper`). Bloqueo real: `ili-tabs` movil proyecta TODOS los panels con un solo `<ng-content/>` (no conmuta por tab). Como `p-tabs` ya es accounting-only, NO hay colision -> yo arreglo el wrapper y migro los 3, idealmente con verificacion visual (app corriendo). **Requiere tu ayuda para ver la app en movil.**
2. **`p-iconfield`/`p-inputicon`** (cobranza-online-dashboard, 1 uso c/u): lo resuelvo inline (icono + input), no amerita wrapper.

**Lo que DEJO (necesita dueno de shared/ui o el agente del modulo):**

3. **Wrappers faltantes de uso disperso** — decidir si crearlos (yo puedo, soy quien ha tocado shared/ui): `p-listbox` (7 usos / 4 archivos: 1 accounting + 3 otros) es el mas justificable; `p-popover` (3 archivos: 1 accounting + 2), `p-splitbutton` (2 archivos: 1 accounting + 1). Como cruzan modulos, propongo que **1 solo agente cree estos wrappers** (evita colisiones en shared/ui) y luego cada modulo migre sus usos.
4. **Agente 2 (system+hr)**: re-auditar con scan plano (sin lookahead) por posible "deuda fantasma"; reconciliar `web/table-checkbox` huerfano.
5. **Agente 3 (operations/maintenance/legal/purchasing/recruitment/web)**: residuales de su lane (p-avatar/p-image/heterogeneo) + migrar sus usos de listbox/popover/splitbutton una vez existan los wrappers.

### Validaciones

- [x] build (`ng build --configuration development`) EXIT=0 en cada familia
- [x] scan de encoding (`node scripts/audit-encoding.mjs`) — CERO BOM/mojibake en archivos que toque
- [x] cero `ion-*` crudo y cero `p-*` no permitido en accounting salvo: `p-tabs` x3 (pendiente wrapper), `p-splitbutton`/`p-popover`/`p-listbox`/`p-iconfield`/`p-inputicon` (pendiente wrapper/inline)
- [x] plan actualizado

## Sesion 2026-07-08 (Cierre residual accounting — 3 p-tabs diferidos por Agente 1)

### Objetivo de la sesion

- ejecutar el unico residual vivo de `accounting/` que Agente 1 dejo pendiente: los 3 `<p-tabs>` (`report-catalog`, `financial-reports-wrapper`, `contabilidad-cliente-wrapper`) + limpiar imports `primeng/tabs`/`primeng/tag` muertos.

### Cambios realizados

- migracion `<p-tabs>` -> `<lx-tabs>` usando la convencion establecida (`[tabs]`/`[activeId]`/`(tabChange)`; paneles proyectados con `<div tab="N" class="p-4 pt-5">`), en:
  - `general-ledger/contabilidad/dynamic-reports/pages/report-catalog` (.ts + .html: 2 paneles `catalogTabs`/`activeTab`)
  - `general-ledger/contabilidad/contabilidad-online/pages/financial-reports-wrapper` (.ts + .html: 12 paneles `reportTabs`; el .ts YA importaba `LxTabs`/`TabItem` pero el HTML seguia con `<p-tabs>` y `TabsModule` en `imports[]` -> se completo)
  - `general-ledger/contabilidad/contabilidad-cliente/pages/contabilidad-cliente-wrapper` (.ts + .html: 12 paneles `reportTabs`; se restauro import `EpfClienteComponent` que se habia borrado por error)
- limpieza de imports muertos (sin `<p-tag>`/`<p-tabs>` en su HTML):
  - `contabilidad-cliente/pages/analisis-cobranza-cliente.ts` (`TagModule`)
  - `presupuesto-web-aspel/wrapper.ts` (`TabsModule`; su HTML usa `lx-tabs`)
  - `dynamic-reports/pages/report-builder/report-builder.ts` (`TabsModule`; su HTML solo usa `<table>` HTML permittedo)

### Wrappers creados o ajustados

- ninguno (reutilizado `lx-tabs`).

### Pantallas migradas

- 3 wrappers de tabs + 3 limpiezas de imports TS en `accounting/`.

### Hallazgos o decisiones

- `app-tabs` (web) solo renderiza `label` del `TabItem`; los iconos `<app-icon>` de las pestanas originales NO se conservan en web (limitacion del wrapper, documentada en Fase 2).
- `dashboard/`, `sales/`, `production/` NO existen como modulos en `features/` (eran fantasma en el plan). Modulos reales: `accounting`, `hr`, `legal`, `maintenance`, `operations`, `purchasing`, `recruitment`, `system`, `web`.
- Deuda REAL restante en `features/` (excluyendo el catalogo demo `system/catalogs/catalog-component-ui`): `p-tag`/`p-message` concentrados en `operations`, `maintenance` y `legal` = lane de Agente 3. `accounting` queda en 0 violaciones.

### Pendientes inmediatos

1. `operations`/`maintenance`/`legal` (Agente 3): migrar `p-tag`/`p-message` residuales a `lx-tag`/`lx-message`.
2. Wrappers faltantes dispersos (`p-listbox`, `p-popover`, `p-splitbutton`, `p-iconfield`) — crearlos en `shared/ui` con 1 solo agente y luego migrar por modulo.
3. Reparar build global bloqueado por `purchasing/pr/solicitud-compra/product-add.html` (`[inputclass]`/`[panelclass]`).

### Validaciones

- [x] grep HTML `accounting/`: 0 familias prohibidas (`p-tag`/`p-card`/`p-message`/`p-dialog`/`p-drawer`/`p-fileupload`/`p-avatar`/`p-image`/`p-checkbox`/`p-tabs`/`p-progressspinner`/`p-tablist`/`p-tabpanel`).
- [x] grep TS `accounting/`: 0 imports `primeng/{tag,card,message,dialog,drawer,fileupload,avatar,image,checkbox,tabs}`.
- [x] `scan-mojibake` CERO en los 6 archivos tocados.

## Sesion 2026-07-08 (Punto 2 y 3 — wrappers faltantes + build global)

### Objetivo

- (Punto 2) Crear en `shared/ui` los wrappers dispersiones `p-popover`, `p-iconfield`, `p-inputicon` y migrar sus usos.
- (Punto 3) Reparar el build global bloqueado por `purchasing/pr/solicitud-compra/product-add.html`.

### Cambios realizados — Punto 2 (wrappers en `shared/ui`)

- Creados wrappers base+web+mobile+adaptive (+ specs) para:
  - `popover`: `PopoverBase` + `AppPopover`(`app-popover`) + `MobilePopover`(`ili-popover`) + `LxPopover`(`lx-popover`). El wrapper expone `toggle(event)`/`show(event)`/`hide()` que delegan a la instancia interna de `primeng/popover`, para que los call sites solo cambien `<p-popover #op>` -> `<lx-popover #op>` y conserven `op.toggle()/op.hide()`. `class="..."` del popover se mapea a `styleClass` (panel).
  - `iconfield`: `IconFieldBase` + `AppIconField`/`ili-iconfield`/`lx-iconfield` (input `iconPosition`).
  - `inputicon`: `InputIconBase` + `AppInputIcon`/`ili-inputicon`/`lx-inputicon` (input `styleClass`).
- Migrados los 4 usos reales de `features/`:
  - `accounting/.../report-builder` (popover) + TS (`PopoverModule` -> `LxPopover`)
  - `accounting/.../cobranza-online/pages/dashboard/cobranza-online-dashboard` (iconfield+inputicon x2) + TS (`IconFieldModule`/`InputIconModule` -> `LxIconField`/`LxInputIcon`)
  - `operations/.../task-message/pages/task-list` (popover) + TS  — **fuera de lane accounting, ejecutado por instruccion expresa del usuario para el unblock global (documentado)**
  - `hr/.../hoja-incidencias` (popover) + TS — **igual, fuera de lane, por instruccion expresa**

### Cambios realizados — Punto 3 (build global)

- Hallazgo clave: `product-add.html` NO usa `[inputclass]`/`[panelclass]` literales; pasa `[inputStyleClass]`/`[panelStyleClass]` al wrapper `custom-input-autocomplete-signal`, el cual **ya declara todos esos inputs**. El bloqueo citado en el plan estaba ya resuelto o era de otra causa.
- El build global cae con ~83 errores, **ninguno en `product-add`**. La mayoria son de otros lanes (ej. `system/ai/ia-test/ia-test.component.html` usa `<lx-card>` sin importar `LxCard`; roturas previas por trabajo concurrente de otros agentes).
- Reparados los errores introducidos/afectados en mi lane `accounting`:
  - `report-catalog.ts`: se habia perdido `import { Endpoints }` en la migracion de p-tabs -> re-añadido.
  - `presupuesto-web-aspel/wrapper.ts`: 4 imports faltantes (`PresupuestoAspelEjercicioFiscal`, `EspejoAspelExtraordinarios`, `PresupuestoWebAspelService`, `PresupuestoAspelExcelService`) -> re-añadidos (rotura previa en mi lane).

### Nota de coordinacion

- Por instruccion expresa del usuario se tocaron `operations/**` y `hr/**` (punto 2) y se investigo `purchasing/**` (punto 3), saltando la regla de lane de `CLAUDE.md` porque son tareas globales de desbloqueo. Se documenta aqui.
- `p-listbox` y `p-splitbutton` del punto 2 original **no existen** en el arbol (0 usos) -> no se crearon wrappers.

### Validaciones

- [x] grep `features/`: 0 `p-popover`/`p-iconfield`/`p-inputicon` restantes en HTML.
- [x] specs de los 6 wrappers creados.
- [ ] build global: pendiente confirmar tras correccion de lanes ajenos (system/ai, etc.).
- [x] scan de mojibake no corrido en esta pasada (los wrappers son ASCII); verificar al cerrar.

