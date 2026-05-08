// /**
//  * catalog-section.ts
//  *
//  * Sección individual del catálogo.
//  * Muestra un componente con su preview, código y reglas de uso.
//  *
//  * Stack: Angular 21, Standalone, OnPush, Signals
//  */

// import { Component, input, ChangeDetectionStrategy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { CardModule } from 'primeng/card';
// import { TabsModule } from 'primeng/tabs';
// import { TagModule } from 'primeng/tag';
// import { DividerModule } from 'primeng/divider';
// import { type CatalogItem } from './catalog.data';
// import { CodeBlock } from './code-block';

// @Component({
//   selector: 'ui-catalog-section',
//
//   imports: [
//     CommonModule,
//     CardModule,
//     TabsModule,
//     TagModule,
//     DividerModule,
//     CodeBlock,
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     <div class="card p-6 mb-8">

//       <!-- Header del componente -->
//       <div class="flex items-start justify-between mb-4">
//         <div>
//           <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-50">
//             {{ item().name }}
//           </h3>
//           <p class="text-sm text-surface-500 mt-1">{{ item().description }}</p>
//         </div>

//         <!-- Status badge -->
//         <p-tag
//           [value]="statusLabel(item().status)"
//           [severity]="statusSeverity(item().status)"
//         />
//       </div>

//       <p-divider />

//       <!-- Información técnica -->
//       <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <!-- Info técnica -->
//         <div>
//           <h4 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
//             Info Técnica
//           </h4>
//           <dl class="space-y-1 text-sm">
//             <div>
//               <dt class="text-surface-500">Componente PrimeNG:</dt>
//               <dd class="font-mono text-surface-900 dark:text-surface-50">{{ item().primeNGComponent }}</dd>
//             </div>
//             @if (item().a11y) {
//               <div>
//                 <dt class="text-surface-500">Role ARIA:</dt>
//                 <dd class="font-mono text-surface-900 dark:text-surface-50">{{ item().a11y?.role || 'N/A' }}</dd>
//               </div>
//             }
//           </dl>
//         </div>

//         <!-- Clases recomendadas -->
//         <div>
//           <h4 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
//             Clases Tailwind Recomendadas
//           </h4>
//           <div class="flex flex-wrap gap-2">
//             @for (cls of allRecommendedClasses(); track cls) {
//               <code class="px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded text-xs font-mono">
//                 {{ cls }}
//               </code>
//             }
//           </div>
//         </div>
//       </div>

//       <!-- Ejemplos -->
//       <div>
//         <h4 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-4">
//           Ejemplos
//         </h4>

//         @for (example of item().examples; track example.label; let idx = $index) {
//           <div class="mb-6">
//             <h5 class="text-sm font-medium text-surface-600 dark:text-surface-400 mb-2">
//               {{ example.label }}
//             </h5>

//             <!-- Preview -->
//             <div class="border border-surface-200 dark:border-surface-700 rounded-lg p-4 mb-2 bg-surface-50 dark:bg-surface-900">
//               <!-- @TODO: Renderizar ejemplo real cuando se implemente CodeBlock -->
//               <pre class="text-sm text-surface-700 dark:text-surface-300 overflow-x-auto"><code>{{ example.template }}</code></pre>
//             </div>

//             <!-- Código -->
//             <ui-code-block [code]="example.template" language="html" />
//           </div>
//         }
//       </div>

//       <p-divider />

//       <!-- Reglas de uso -->
//       <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <!-- Do's -->
//         <div>
//           <h4 class="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
//             ✅ Hacer
//           </h4>
//           <ul class="space-y-1 text-sm">
//             @for (rule of item().doUse; track rule) {
//               <li class="flex items-start gap-2">
//                 <span class="text-green-600 mt-0.5">✓</span>
//                 <span class="text-surface-700 dark:text-surface-300">{{ rule }}</span>
//               </li>
//             }
//           </ul>
//         </div>

//         <!-- Don'ts -->
//         <div>
//           <h4 class="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
//             🚫 No hacer
//           </h4>
//           <ul class="space-y-1 text-sm">
//             @for (rule of item().dontUse; track rule) {
//               <li class="flex items-start gap-2">
//                 <span class="text-red-600 mt-0.5">✗</span>
//                 <span class="text-surface-700 dark:text-surface-300">{{ rule }}</span>
//               </li>
//             }
//           </ul>
//         </div>
//       </div>

//       <!-- Accesibilidad -->
//       @if (item().a11y) {
//         <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//           <h4 class="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
//             ♿ Accesibilidad
//           </h4>
//           <p class="text-sm text-blue-800 dark:text-blue-300">{{ item().a11y?.notes }}</p>
//         </div>
//       }

//     </div>
//   `,
// })
// export class CatalogSection {
//   readonly item = input.required<CatalogItem>();

//   readonly allRecommendedClasses = computed(() => {
//     const item = this.item();
//     return [
//       ...(item.tailwindLayout || []),
//       ...(item.tailwindSpacing || []),
//       ...(item.tailwindColors || []),
//     ];
//   });

//   statusLabel(status: string): string {
//     const labels: Record<string, string> = {
//       stable: 'Estable',
//       beta: 'Beta',
//       deprecated: 'Obsoleto',
//     };
//     return labels[status] || status;
//   }

//   statusSeverity(status: string): 'success' | 'warn' | 'danger' {
//     const severities: Record<string, 'success' | 'warn' | 'danger'> = {
//       stable: 'success',
//       beta: 'warn',
//       deprecated: 'danger',
//     };
//     return severities[status] || 'warn';
//   }
// }
