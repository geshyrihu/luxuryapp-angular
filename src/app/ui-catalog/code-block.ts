// /**
//  * code-block.ts
//  *
//  * Bloque de código con syntax highlighting básico y botón de copiar.
//  *
//  * Stack: Angular 21, Standalone, OnPush, Signals
//  */

// import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';

// @Component({
//   selector: 'ui-code-block',
//
//   imports: [CommonModule, ButtonModule, ToastModule],
//   providers: [MessageService],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     <div class="relative group">
//       <!-- Header del bloque -->
//       <div class="flex items-center justify-between px-4 py-2 bg-surface-800 dark:bg-surface-950 rounded-t-lg border-b border-surface-700">
//         <span class="text-xs text-surface-400 font-mono uppercase">{{ language() }}</span>

//         <!-- Botón copiar -->
//         <button
//           type="button"
//           (click)="copyToClipboard()"
//           class="
//             px-3 py-1 text-xs rounded-md
//             bg-surface-700 hover:bg-surface-600
//             text-surface-300 hover:text-white
//             transition-colors duration-150
//             flex items-center gap-1.5
//           "
//           aria-label="Copiar código"
//         >
//           <i class="pi" [class]="copied() ? 'pi-check' : 'pi-copy'"></i>
//           <span>{{ copied() ? '¡Copiado!' : 'Copiar' }}</span>
//         </button>
//       </div>

//       <!-- Código -->
//       <pre class="p-4 bg-surface-900 dark:bg-surface-950 rounded-b-lg overflow-x-auto">
//         <code class="text-sm text-surface-100 font-mono whitespace-pre">{{ code() }}</code>
//       </pre>

//       <!-- Toast de confirmación -->
//       <p-toast position="bottom-right" />
//     </div>
//   `,
// })
// export class CodeBlock {
//   readonly code = input.required<string>();
//   readonly language = input<string>('html');

//   readonly copied = signal(false);

//   constructor(private messageService: MessageService) {}

//   async copyToClipboard(): Promise<void> {
//     try {
//       await navigator.clipboard.writeText(this.code());
//       this.copied.set(true);

//       this.messageService.add({
//         severity: 'success',
//         summary: 'Copiado',
//         detail: 'Código copiado al portapapeles',
//         life: 2000,
//       });

//       setTimeout(() => this.copied.set(false), 2000);
//     } catch {
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'No se pudo copiar el código',
//         life: 3000,
//       });
//     }
//   }
// }
