// /**
//  * ui-catalog.shell.ts
//  *
//  * Componente principal del catálogo UI.
//  * Layout con sidebar de navegación y área de contenido.
//  *
//  * Stack: Angular 21, Standalone, OnPush, Signals
//  */

// import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { InputTextModule } from 'primeng/inputtext';
// import { BadgeModule } from 'primeng/badge';
// import { DividerModule } from 'primeng/divider';
// import { CATALOG_DATA, getCategories, type CatalogItem } from './catalog.data';
// import { CatalogSection } from './catalog-section';

// @Component({
//   selector: 'ui-catalog-shell',
//
//   imports: [
//     CommonModule,
//     InputTextModule,
//     BadgeModule,
//     DividerModule,
//     CatalogSection,
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     <div id="app-root" class="flex h-screen bg-surface-50 dark:bg-surface-950">

//       <!-- ═══ SIDEBAR ═══ -->
//       <aside class="w-80 bg-surface-card border-r border-surface-200 dark:border-surface-800 overflow-y-auto flex-shrink-0">
//         <div class="p-6">
//           <!-- Header -->
//           <div class="mb-6">
//             <h1 class="text-2xl font-bold text-primary-600">UI Catalog</h1>
//             <p class="text-sm text-surface-500 mt-1">Componentes documentados</p>
//           </div>

//           <!-- Búsqueda -->
//           <div class="mb-4">
//             <input
//               type="text"
//               pInputText
//               [placeholder]="'Buscar componente...'"
//               class="w-full"
//               (input)="onSearch($event)"
//             />
//           </div>

//           <p-divider />

//           <!-- Navegación por categoría -->
//           <nav aria-label="Categorías del catálogo">
//             @for (cat of categories(); track cat.id) {
//               <button
//                 type="button"
//                 (click)="selectedCategory.set(cat.id)"
//                 [attr.aria-current]="selectedCategory() === cat.id ? 'page' : null"
//                 class="
//                   w-full text-left px-3 py-2.5 rounded-lg mb-1
//                   transition-colors duration-150
//                   flex justify-between items-center
//                   text-sm font-medium
//                   [@selectedCategory() === cat.id
//                     ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
//                     : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
//                   ]
//                 "
//               >
//                 <span>{{ cat.name }}</span>
//                 <p-badge [value]="cat.count" severity="secondary" />
//               </button>
//             }
//           </nav>
//         </div>
//       </aside>

//       <!-- ═══ CONTENIDO PRINCIPAL ═══ -->
//       <main class="flex-1 overflow-y-auto p-8" role="main" aria-label="Catálogo de componentes UI">

//         <!-- Header del contenido -->
//         <div class="mb-8">
//           <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50">
//             {{ currentCategoryName() }}
//           </h2>
//           <p class="text-surface-500 mt-1">
//             {{ filteredItems().length }} componente(s) disponible(s)
//           </p>
//         </div>

//         <!-- Lista de componentes -->
//         <div class="space-y-8">
//           @for (item of filteredItems(); track item.id) {
//             <ui-catalog-section [item]="item" />
//           }

//           @if (filteredItems().length === 0) {
//             <div class="text-center py-12 text-surface-400">
//               <i class="pi pi-search text-4xl mb-4"></i>
//               <p class="text-lg">No se encontraron componentes</p>
//               <p class="text-sm">Intenta con otro término de búsqueda</p>
//             </div>
//           }
//         </div>

//       </main>
//     </div>
//   `,
//   host: {
//     'class': 'block',
//   },
// })
// export class UiCatalogShell {
//   // Estado
//   readonly allItems = signal<CatalogItem[]>(CATALOG_DATA);
//   readonly searchTerm = signal('');
//   readonly selectedCategory = signal<string>('all');

//   // Categorías con conteo
//   readonly categories = computed(() => {
//     const items = this.allItems();
//     const grouped = items.reduce((acc, item) => {
//       acc[item.category] = (acc[item.category] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     return [
//       { id: 'all', name: 'Todos', count: items.length },
//       ...Object.entries(grouped).map(([id, count]) => ({
//         id,
//         name: this.capitalizeCategory(id),
//         count,
//       })),
//     ];
//   });

//   // Items filtrados
//   readonly filteredItems = computed(() => {
//     let items = this.allItems();
//     const category = this.selectedCategory();
//     const search = this.searchTerm().toLowerCase();

//     // Filtrar por categoría
//     if (category !== 'all') {
//       items = items.filter((item) => item.category === category);
//     }

//     // Filtrar por búsqueda
//     if (search) {
//       items = items.filter(
//         (item) =>
//           item.name.toLowerCase().includes(search) ||
//           item.description.toLowerCase().includes(search) ||
//           item.primeNGComponent.toLowerCase().includes(search)
//       );
//     }

//     return items;
//   });

//   // Nombre de categoría actual
//   readonly currentCategoryName = computed(() => {
//     const cat = this.selectedCategory();
//     return cat === 'all' ? 'Todos los Componentes' : this.capitalizeCategory(cat);
//   });

//   onSearch(event: Event) {
//     const input = event.target as HTMLInputElement;
//     this.searchTerm.set(input.value);
//   }

//   private capitalizeCategory(cat: string): string {
//     return cat.charAt(0).toUpperCase() + cat.slice(1);
//   }
// }
