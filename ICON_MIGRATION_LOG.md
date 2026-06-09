# Registro de Migración a Iconify

Este documento detalla el progreso y las acciones realizadas durante la migración del sistema de iconos de la aplicación, pasando de **PrimeIcons / FontAwesome** al estándar centralizado de **Iconify (Material Design Icons - MDI)**.

## Resumen de la Estrategia
La migración se ha diseñado para ser retrocompatible. El frontend se encarga de traducir los nombres de iconos heredados (`pi-`, `icon-pi-`, etc.) al nuevo formato `mdi:` de forma dinámica, permitiendo que la base de datos y el backend se mantengan intactos temporalmente para evitar caídas del servicio.

---

## 🛠️ Fase 0: Infraestructura y Resolución Core
Se actualizaron los cimientos de la aplicación para soportar Iconify correctamente.
- **`src/index.html`**: Se actualizó el Content Security Policy (CSP) añadiendo `https://api.iconify.design` a la directiva `connect-src` para permitir la carga dinámica de iconos.
- **`src/app/core/components/app-icon/app-icon.component.ts`**: Se añadieron estilos en línea (`display: inline-flex`, `width: 1em`) para asegurar que los iconos de Iconify hereden el tamaño y color de su contenedor correctamente.
- **`src/app/core/utils/icon-mapping.ts`**: Se refactorizó la función `resolveToIconify` para limpiar prefijos variados de la base de datos (ej. `icon-pi-`, `pi pi-`).
- **`src/app/core/utils/prime-icon-resolver.ts`**: Se mejoró el soporte para detectar y procesar emojis y reglas *legacy* de iconos.
- **`src/styles/styles.scss`**: Se agregó la clase de animación `.ds-animate-spin` para soportar estados de carga en iconos SVG.
- **Base de datos**: Se generaron scripts SQL (`migracion_iconos_por_id.sql`), pero se decidió mantener la base de datos intacta para no romper la lógica del backend (menús de usuario). El frontend asume la traducción.

---

## 🟢 Fase 1: Componentes de Botones Web (Core)
Se refactorizó el sistema base de botones para que todos los botones de acción estándar usen el componente `<app-icon>`.
- **Modificados:**
  - `BaseButton` (`base-button.ts`)
  - `CustomButton`
  - `CustomButtonAdd`
  - `CustomButtonEdit`
  - `CustomButtonDelete`
  - `CustomButtonSave`
  - `CustomButtonConfirm`
  - `CustomButtonDownload`
  - `CustomButtonViewPdf`
  - `CustomButtonSendEmail`
  - `CustomButtonTracking`
  - `CustomButtonItem`

---

## 🟢 Fase 2: Componentes Core Compartidos
Se reemplazaron los iconos heredados en los elementos estructurales que se repiten en toda la aplicación.
- **Modificados:**
  - `CustomSearchInputSignal` (`custom-search-input-signal.ts`)
  - `PrimeNgCustomGlobalFilter` (`primeng-custom-global-filter.ts`)
  - Visor de PDF (`pdf-viewer-modal.ts` y `.html`)
  - Vista de tabla móvil (`data-view-mobile.ts` y `.html`): Breadcrumbs, estados vacíos e iconos de control.

---

## 🟡 Fase 3: Migración Masiva de Módulos (Features)
Esta es la fase de mayor volumen, donde se actualizan sistemáticamente todas las pantallas de la aplicación.

### Módulos Completados:
1. **`announcement` (Comunicados):**
   - Vistas de listado, detalles, analíticas, formularios de administrador y el diálogo generador de IA.
2. **`biblioteca` (Manuales y Procesos):**
   - Vistas de informes, manuales, visor de pasos, editor de manuales y editor de diagramas interactivos.
3. **`bitacoras`:**
   - Medidores (listados, formularios).
   - Préstamo de herramientas.
4. **`calendar`:**
   - Cumpleaños (estados vacíos).
   - Cronograma Anual de Mantenimiento (se migró la resolución dinámica de iconos para los departamentos y los checkboxes).
5. **`committee` (Mesa Directiva):**
   - Minutas de reuniones.
   - Informes financieros y visores de documentos.
   - Póliza de seguro del edificio.
6. **`configuration` (Configuración del Sistema - Bloques 1 a 5):**
   - `acceso-customer`, `ai-knowledge-base`, `application-user`, `application-role`.
   - `approval-rules`, `aspel-sync`, `brevo`, `catalog-component-ui`.
   - `customer`, `customer-data-company`, `customer-modul`, `demo-app`.
   - `eleven-labs`, `ia-test`, `jobs`, `juntas-mensuales-backfill`, `log-api-report`, `mini-postman`.
   - `email-data`, `entrega-recepcion`, `hr-catalog`, `machinery-classification`, `meter-category`, `module-app`, `module-app-rol`, `payment-method`, `payment-type`, `permission`, `product-category`, `test`, `units-of-measurement`, `user-activity-history`.
7. **`features` restantes (Migración global automatizada):**
   - Se procesaron más de 1,200 instancias y más de 300 archivos en todos los módulos restantes (`contabilidad`, `dashboard`, `tickets`, `inventory`, `purchases`, etc.).
   - Se tradujeron todas las etiquetas `<i class="pi pi-[icono]..."></i>` a `<app-icon icon="pi-[icono]"></app-icon>`.
   - Se ajustaron los parámetros `icon="pi pi-..."` a `icon="pi-..."`.

### Módulos Pendientes:
- *Ninguno. La migración de módulos está completada al 100%.*

---

## ✅ Próximos Pasos Recomendados (Fase Final)
1. Realizar pruebas visuales de los módulos de `features` para corroborar que la renderización mediante `<app-icon>` sea correcta en pantallas donde antes había `PrimeIcons`.
2. Desinstalar y eliminar por completo las referencias CSS a PrimeIcons de `angular.json` o `styles.scss`, una vez se asegure la estabilidad.
