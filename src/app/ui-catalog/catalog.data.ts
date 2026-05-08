// /**
//  * catalog.data.ts
//  *
//  * PROPÓSITO:
//  * Metadatos de todos los componentes del catálogo UI.
//  * Cada entrada documenta:
//  * - Qué componente de PrimeNG usa
//  * - Qué clases de Tailwind son recomendadas
//  * - Qué clases están prohibidas
//  * - Ejemplos de código listos para copiar
//  * - Reglas de accesibilidad
//  * - Reglas de uso (do's / don'ts)
//  */

// export interface ComponentState {
//   name: string;
//   template: string;
//   component?: string;
// }

// export interface CatalogItem {
//   id: string;
//   name: string;
//   category: 'forms' | 'data' | 'feedback' | 'navigation' | 'layout' | 'brand';
//   status: 'stable' | 'beta' | 'deprecated';
//   description: string;

//   // PrimeNG
//   primeNGComponent: string;
//   primeNGProps?: Record<string, string>;

//   // Tailwind
//   tailwindLayout?: string[];
//   tailwindSpacing?: string[];
//   tailwindColors?: string[];

//   // Reglas
//   doUse: string[];
//   dontUse: string[];

//   // Ejemplos
//   examples: {
//     label: string;
//     template: string;
//     component?: string;
//     states?: string[];
//   }[];

//   // Accesibilidad
//   a11y?: {
//     role?: string;
//     ariaAttributes?: string[];
//     keyboardNavigation?: boolean;
//     notes: string;
//   };

//   // Compatibilidad
//   compatibility?: {
//     darkMode: boolean;
//     mobileResponsive: boolean;
//     primeNGMinVersion: string;
//   };
// }

// export const CATALOG_DATA: CatalogItem[] = [
//   // ═══════════════════════════════════════════
//   // FORMS
//   // ═══════════════════════════════════════════
//   {
//     id: 'button',
//     name: 'Button',
//     category: 'forms',
//     status: 'stable',
//     description: 'Botón de acción principal. Usar custom-button-* en features nuevas.',
//     primeNGComponent: 'p-button',
//     primeNGProps: {
//       label: 'string',
//       icon: 'string (opcional, ej: "pi pi-check")',
//       severity: '"primary" | "secondary" | "success" | "danger" | "warning"',
//       loading: 'boolean',
//       disabled: 'boolean',
//     },
//     tailwindLayout: ['flex', 'items-center', 'gap-2'],
//     tailwindSpacing: ['px-4', 'py-2'],
//     doUse: [
//       'Usar para acciones principales del formulario',
//       'Combinar con iconos de PrimeIcons para claridad',
//       'Usar estado loading para operaciones async',
//       'Preferir custom-button-add/edit/delete/save en features nuevas',
//     ],
//     dontUse: [
//       'No usar más de 1 botón primario por formulario',
//       'No mezclar con clases PrimeFlex (p-flex)',
//       'No sobrescribir .p-button con !important',
//     ],
//     examples: [
//       {
//         label: 'Básico',
//         template: `<p-button label="Guardar" icon="pi pi-check" />`,
//         states: ['default', 'hover', 'focus'],
//       },
//       {
//         label: 'Loading',
//         template: `<p-button label="Procesando" [loading]="true" />`,
//         states: ['loading'],
//       },
//       {
//         label: 'Deshabilitado',
//         template: `<p-button label="Deshabilitado" [disabled]="true" />`,
//         states: ['disabled'],
//       },
//     ],
//     a11y: {
//       role: 'button',
//       ariaAttributes: ['aria-label (si solo tiene icono)', 'aria-disabled'],
//       keyboardNavigation: true,
//       notes: 'p-button maneja role="button" y aria-disabled automáticamente.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },
//   {
//     id: 'input-text',
//     name: 'Input Text',
//     category: 'forms',
//     status: 'stable',
//     description: 'Campo de texto. Usar custom-input-text-signal en features nuevas.',
//     primeNGComponent: 'p-inputText',
//     primeNGProps: {
//       type: '"text" | "email" | "password" | "number"',
//       placeholder: 'string',
//       disabled: 'boolean',
//       readonly: 'boolean',
//     },
//     tailwindLayout: ['w-full', 'max-w-md'],
//     doUse: [
//       'Usar custom-input-text-signal con FormControl',
//       'Altura consistente (40px) definida en primeng-overrides.css',
//       'Siempre asociar label con for/id',
//     ],
//     dontUse: [
//       'No usar p-inputtext-sm/p-inputtext-lg',
//       'No mezclar con clases PrimeFlex',
//       'No usar style="width:..." usar clases Tailwind',
//     ],
//     examples: [
//       {
//         label: 'Básico con label',
//         template: `
// <label for="nombre" class="block text-sm font-medium mb-1">Nombre</label>
// <input pInputText id="nombre" type="text" placeholder="Escribe aquí..." class="w-full" />`,
//         states: ['default'],
//       },
//       {
//         label: 'Con validación',
//         template: `
// <input pInputText type="text" [formControl]="nombreCtrl" class="w-full" />
// @if (nombreCtrl.invalid && nombreCtrl.touched) {
//   <small class="text-red-600">Campo obligatorio</small>
// }`,
//         states: ['error'],
//       },
//     ],
//     a11y: {
//       role: 'textbox',
//       ariaAttributes: ['aria-required', 'aria-invalid', 'aria-describedby'],
//       keyboardNavigation: true,
//       notes: 'Siempre asociar label con for/id o usar aria-label.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },
//   {
//     id: 'select',
//     name: 'Select / Dropdown',
//     category: 'forms',
//     status: 'stable',
//     description: 'Selector de opciones. Usar custom-input-select-signal en features nuevas.',
//     primeNGComponent: 'p-select',
//     primeNGProps: {
//       options: 'SelectItem[]',
//       optionLabel: 'string',
//       optionValue: 'string',
//       placeholder: 'string',
//       filter: 'boolean',
//       disabled: 'boolean',
//     },
//     tailwindLayout: ['w-full', 'max-w-md'],
//     doUse: [
//       'Usar custom-input-select-signal con FormControl',
//       'Activar filter para listas largas (>10 items)',
//       'Altura consistente (40px)',
//     ],
//     dontUse: [
//       'No usar p-dropdown-sm/p-dropdown-lg',
//       'No hardcodear options en template; usar signal',
//     ],
//     examples: [
//       {
//         label: 'Básico',
//         template: `
// <label for="estado" class="block text-sm font-medium mb-1">Estado</label>
// <p-select id="estado" [options]="estados()" optionLabel="nombre" optionValue="id" placeholder="Seleccionar..." class="w-full" />`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'combobox',
//       ariaAttributes: ['aria-required', 'aria-expanded'],
//       keyboardNavigation: true,
//       notes: 'p-select maneja navegación por teclado y búsqueda automáticamente.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },
//   {
//     id: 'textarea',
//     name: 'Textarea',
//     category: 'forms',
//     status: 'stable',
//     description: 'Área de texto multilínea. Usar custom-input-textarea-signal.',
//     primeNGComponent: 'p-textarea',
//     primeNGProps: {
//       rows: 'number',
//       autoResize: 'boolean',
//       disabled: 'boolean',
//     },
//     tailwindLayout: ['w-full'],
//     doUse: [
//       'Usar custom-input-textarea-signal con FormControl',
//       'Definir rows mínimo (3)',
//       'Usar autoResize para texto variable',
//     ],
//     dontUse: [
//       'No usar style="height:..." usar rows o autoResize',
//     ],
//     examples: [
//       {
//         label: 'Básico',
//         template: `
// <label for="notas" class="block text-sm font-medium mb-1">Notas</label>
// <textarea pInputTextarea id="notas" rows="3" class="w-full"></textarea>`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'textbox',
//       ariaAttributes: ['aria-multiline', 'aria-required'],
//       keyboardNavigation: true,
//       notes: 'Siempre asociar label con for/id.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },

//   // ═══════════════════════════════════════════
//   // DATA
//   // ═══════════════════════════════════════════
//   {
//     id: 'datatable',
//     name: 'Data Table',
//     category: 'data',
//     status: 'stable',
//     description: 'Tabla de datos con paginación, filtros y ordenamiento.',
//     primeNGComponent: 'p-table',
//     primeNGProps: {
//       value: 'any[]',
//       paginator: 'boolean',
//       rows: 'number',
//       rowsPerPageOptions: 'number[]',
//       sortField: 'string',
//       sortOrder: 'number',
//       filterDisplay: '"menu" | "row"',
//       scrollable: 'boolean',
//       scrollHeight: 'string',
//     },
//     tailwindLayout: ['w-full', 'overflow-x-auto'],
//     doUse: [
//       'Usar styleClass="custom-table card" para estilo de marca',
//       'Paginator siempre en tablas >10 filas',
//       'Usar [scrollHeight] para tablas largas',
//     ],
//     dontUse: [
//       'No usar style="width:..." en columnas; usar clases semánticas',
//       'No usar p-datatable-sm',
//     ],
//     examples: [
//       {
//         label: 'Básica con paginación',
//         template: `
// <p-table [value]="data()" [paginator]="true" [rows]="10" styleClass="custom-table card">
//   <ng-template #header>
//     <tr>
//       <th>Nombre</th>
//       <th>Estado</th>
//       <th>Fecha</th>
//     </tr>
//   </ng-template>
//   <ng-template #body let-row>
//     <tr>
//       <td>{{ row.nombre }}</td>
//       <td>{{ row.estado }}</td>
//       <td>{{ row.fecha | date:'dd/MM/yyyy' }}</td>
//     </tr>
//   </ng-template>
// </p-table>`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'grid',
//       ariaAttributes: ['aria-label en th', 'aria-sort para columnas ordenables'],
//       keyboardNavigation: true,
//       notes: 'p-table genera role="grid" automáticamente.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },

//   // ═══════════════════════════════════════════
//   // FEEDBACK
//   // ═══════════════════════════════════════════
//   {
//     id: 'toast',
//     name: 'Toast',
//     category: 'feedback',
//     status: 'stable',
//     description: 'Notificaciones temporales. Usar Toastr (ngx-toastr) del proyecto.',
//     primeNGComponent: 'p-toast (MessageService)',
//     primeNGProps: {
//       severity: '"success" | "info" | "warn" | "error"',
//       summary: 'string',
//       detail: 'string',
//       life: 'number (ms)',
//     },
//     doUse: [
//       'Usar para confirmaciones de acción (guardar, eliminar)',
//       'Usar severity apropiado al contexto',
//       'Life por defecto 3000ms para info, 5000ms para error',
//     ],
//     dontUse: [
//       'No usar para validaciones de formulario (usar mensajes inline)',
//       'No acumular múltiples toasts',
//     ],
//     examples: [
//       {
//         label: 'Éxito',
//         template: `// En componente:
// this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Registro guardado correctamente', life: 3000 });`,
//         states: ['default'],
//       },
//       {
//         label: 'Error',
//         template: `this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro', life: 5000 });`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'alert',
//       ariaAttributes: ['aria-live="polite"'],
//       keyboardNavigation: false,
//       notes: 'Toasts deben ser auto-dismiss pero con opción de cerrar manualmente.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },
//   {
//     id: 'dialog',
//     name: 'Dialog / Modal',
//     category: 'feedback',
//     status: 'stable',
//     description: 'Diálogo modal para confirmaciones o formularios.',
//     primeNGComponent: 'p-dialog',
//     primeNGProps: {
//       header: 'string',
//       visible: 'boolean',
//       modal: 'boolean',
//       closable: 'boolean',
//       styleClass: 'string',
//       breakpoints: 'Record<string, string>',
//     },
//     doUse: [
//       'Usar para confirmaciones críticas (eliminar, salir)',
//       'Siempre header descriptivo',
//       'Usar breakpoints para responsive',
//     ],
//     dontUse: [
//       'No usar para información simple (usar toast)',
//       'No anidar dialogs',
//     ],
//     examples: [
//       {
//         label: 'Confirmación',
//         template: `
// <p-dialog header="Confirmar eliminación" [(visible)]="visible" [modal]="true" [closable]="true" [breakpoints]="{ '960px': '75vw' }">
//   <p>¿Está seguro de que desea eliminar este registro?</p>
//   <ng-template #footer>
//     <p-button label="Cancelar" severity="secondary" (onClick)="visible = false" />
//     <p-button label="Eliminar" severity="danger" (onClick)="onConfirm()" />
//   </ng-template>
// </p-dialog>`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'dialog',
//       ariaAttributes: ['aria-modal', 'aria-labelledby (header)'],
//       keyboardNavigation: true,
//       notes: 'p-dialog maneja focus trap y ESC para cerrar automáticamente.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },

//   // ═══════════════════════════════════════════
//   // NAVIGATION
//   // ═══════════════════════════════════════════
//   {
//     id: 'tabs',
//     name: 'Tabs',
//     category: 'navigation',
//     status: 'stable',
//     description: 'Navegación por pestañas dentro de una vista.',
//     primeNGComponent: 'p-tabs',
//     primeNGProps: {
//       value: 'string | number',
//       scrollable: 'boolean',
//     },
//     doUse: [
//       'Usar para secciones relacionadas dentro de una vista',
//       'Máximo 7 tabs para legibilidad',
//     ],
//     dontUse: [
//       'No usar como navegación principal (usar router)',
//     ],
//     examples: [
//       {
//         label: 'Básico',
//         template: `
// <p-tabs [value]="0">
//   <p-tablist>
//     <p-tab value="0">General</p-tab>
//     <p-tab value="1">Avanzado</p-tab>
//   </p-tablist>
//   <p-tabpanels>
//     <p-tabpanel value="0">Contenido General</p-tabpanel>
//     <p-tabpanel value="1">Contenido Avanzado</p-tabpanel>
//   </p-tabpanels>
// </p-tabs>`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'tablist',
//       ariaAttributes: ['aria-selected', 'aria-controls'],
//       keyboardNavigation: true,
//       notes: 'p-tabs maneja navegación por flechas automáticamente.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },

//   // ═══════════════════════════════════════════
//   // LAYOUT
//   // ═══════════════════════════════════════════
//   {
//     id: 'card',
//     name: 'Card',
//     category: 'layout',
//     status: 'stable',
//     description: 'Contenedor de superficie elevada. Usar .card del Design System.',
//     primeNGComponent: 'p-card (opcional) o div.card',
//     doUse: [
//       'Usar div.card para contenido simple',
//       'Usar p-card cuando necesite header/footer',
//       'Combinar con p-4 para padding interno',
//     ],
//     dontUse: [
//       'No usar surface-card como patrón nuevo (legacy)',
//     ],
//     examples: [
//       {
//         label: 'Card simple',
//         template: `<div class="card p-4">Contenido de la tarjeta</div>`,
//         states: ['default'],
//       },
//       {
//         label: 'Card con borde',
//         template: `<div class="card card--bordered p-4">Contenido con borde</div>`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'region',
//       ariaAttributes: ['aria-label si es sección semántica'],
//       keyboardNavigation: false,
//       notes: 'Card es un contenedor visual, no requiere roles específicos.',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },

//   // ═══════════════════════════════════════════
//   // BRAND
//   // ═══════════════════════════════════════════
//   {
//     id: 'tag',
//     name: 'Tag / Badge',
//     category: 'brand',
//     status: 'stable',
//     description: 'Etiquetas de estado con colores de marca.',
//     primeNGComponent: 'p-tag',
//     primeNGProps: {
//       value: 'string',
//       severity: '"success" | "warn" | "danger" | "info"',
//       icon: 'string',
//       rounded: 'boolean',
//     },
//     doUse: [
//       'Usar para estados (activo, pendiente, error)',
//       'Usar severity apropiado al contexto',
//     ],
//     dontUse: [
//       'No usar para acciones (usar button)',
//     ],
//     examples: [
//       {
//         label: 'Estado activo',
//         template: `<p-tag value="Activo" severity="success" />`,
//         states: ['default'],
//       },
//       {
//         label: 'Estado pendiente',
//         template: `<p-tag value="Pendiente" severity="warn" />`,
//         states: ['default'],
//       },
//     ],
//     a11y: {
//       role: 'status',
//       ariaAttributes: ['aria-label descriptivo si el texto no es claro'],
//       keyboardNavigation: false,
//       notes: 'p-tag genera un span semántico con role="status".',
//     },
//     compatibility: {
//       darkMode: true,
//       mobileResponsive: true,
//       primeNGMinVersion: '21.0.0',
//     },
//   },
// ];

// // ═══════════════════════════════════════════════════════════
// // HELPERS
// // ═══════════════════════════════════════════════════════════

// export function getCategories(): string[] {
//   return Array.from(new Set(CATALOG_DATA.map((item) => item.category)));
// }

// export function getItemsByCategory(category: string): CatalogItem[] {
//   return CATALOG_DATA.filter((item) => item.category === category);
// }

// export function searchItems(query: string): CatalogItem[] {
//   const q = query.toLowerCase();
//   return CATALOG_DATA.filter(
//     (item) =>
//       item.name.toLowerCase().includes(q) ||
//       item.description.toLowerCase().includes(q) ||
//       item.primeNGComponent.toLowerCase().includes(q)
//   );
// }
