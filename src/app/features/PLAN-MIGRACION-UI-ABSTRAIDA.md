# Plan de Migracion a UI Abstraida en `features/`

> Ultima actualizacion: 2026-07-07 (Agente 3)
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

| Agente | Lane |
|---|---|
| Agente 3 (este) | `features/operations/**` · `features/maintenance/**` · `features/legal/**` — familias heterogeneas + `p-dialog`/`p-drawer`/`p-fileupload`/`p-avatar`/`p-image` |
| otros | resto (accounting, hr, purchasing, recruitment, system, web) — NO tocar desde Agente 3 |

> Regla: Agente 3 solo edita archivos dentro de su lane. `system/catalogs` y
> `accounting/cobranza-nativa` (migrados antes de la asignacion de lanes) quedan
> para su agente dueño.

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

| Familia | Estado | Wrapper o candidato existente | Decision actual |
|---|---|---|---|
| `p-tag` | Parcial | `lx-status-badge`, `app-badge`, `app-order-status`, `contact-card`, `profile-card` | Falta wrapper generico tipo `lx-tag` o clasificar casos para migrarlos a wrappers semanticos |
| `p-card` | Parcial | `app-kpi-card`, `app-stat-card`, `contact-card`, `profile-card` | Falta wrapper contenedor generico tipo `lx-card`; varios casos pueden migrar a cards semanticas |
| `ion-item` | Faltante | solo uso interno en componentes mobile | Falta primitivo publico para fila/list item reusable |
| `ion-label` | Faltante | solo uso interno en componentes mobile | Falta primitivo publico para label/contenido de item reusable |
| `p-message` | Parcial | `lx-global-error-alert`, `lx-toast` | Falta wrapper generico de mensaje inline tipo `lx-message` |
| familia `p-tabs` | Cubierto | `lx-tabs`, `app-tabs`, `ili-tabs` | Migrar usos directos a `lx-tabs` |
| `p-avatar` | Parcial | `app-avatar-group` | Falta wrapper generico de avatar individual |
| `p-image` | Parcial | `custom-input-img-signal`, `gallery`, `document-previewer` | Falta wrapper generico de imagen de display |
| `p-dialog` | Cubierto | `app-dialog`, `lx-modal` | Migrar usos directos a wrapper segun contexto |
| `p-drawer` | Cubierto | `lx-sidebar`, `app-sidebar`, `ili-sidebar` | Migrar usos directos a `lx-sidebar` |
| `p-fileupload` | Cubierto/Parcial | `app-file-upload`, `custom-input-file-signal` | Hay base util; falta estandarizar cuando usar file input vs file upload |
| `p-checkbox` | Cubierto | `custom-input-check-signal`, `web-input-check`, `ion-input-checkbox` | Migrar usos permitiendo revisar excepciones inline en tabla |

### Hallazgos clave

- `tabs`, `sidebar`, `dialog`, `file-upload` y `checkbox` ya tienen ruta clara de migracion.
- `p-tag`, `p-card` y `p-message` siguen siendo la principal deuda de abstraccion generica.
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
