// import { CommonModule } from "@angular/common";
// import { Component, inject, input, output, signal } from "@angular/core";
// import { FormControl, ReactiveFormsModule } from "@angular/forms";
// import { TreeNode } from "primeng/api";
// import { ButtonModule } from "primeng/button";
// import { DialogModule } from "primeng/dialog";
// import { InputTextModule } from "primeng/inputtext";
// import { TreeModule } from "primeng/tree";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { CustomerIdService } from "../../../../../core/services/customer-id.service";

// @Component({
//   selector: "app-account-tree-selector",

//   imports: [
//     CommonModule,
//     DialogModule,
//     //     TreeModule,
//     InputTextModule,
//     ReactiveFormsModule,
//   ],
//   template: `
//     <p-dialog
//       [visible]="visible()"
//       [modal]="true"
//       [style]="{ width: '50vw', height: '80vh' }"
//       header="Seleccionar Cuenta Contable"
//       (onHide)="close()"
//     >
//       <div class="flex flex-col h-full">
//         <!-- Filters -->
//         <div class="flex  mb-3">
//           <span class="p-input-icon-left flex-1">
//             <i class="pi pi-search"></i>
//             <input
//               pInputText
//               type="text"
//               [formControl]="filterText"
//               (input)="filterNodes()"
//               placeholder="Buscar por nombre o cuenta..."
//               class="w-full"
//             />
//           </span>
//           <button
//             pButton
//             icon="pi pi-refresh"
//             (click)="loadAccounts()"
//             [loading]="loading()"
//             pTooltip="Recargar"
//           ></button>
//         </div>

//         <!-- Tree -->
//         <div
//           class="flex-1 overflow-auto border-1 surface-border border-round p-2"
//         >
//           @if (loading()) {
//             <div class="flex items-center justify-center h-full">
//               <i class="pi pi-spin pi-spinner text-4xl"></i>
//             </div>
//           } @else {
//             <p-tree
//               [value]="nodes()"
//               selectionMode="single"
//               [(selection)]="selectedNode"
//               (onNodeSelect)="onNodeSelect($event)"
//               [filter]="true"
//               filterMode="lenient"
//               scrollHeight="flex"
//               styleClass="w-full border-none"
//             ></p-tree>
//           }
//         </div>

//         <div
//           class="flex justify-end  mt-3 pt-3 border-top-1 surface-border"
//         >
//           <button
//             pButton
//             label="Cancelar"
//             icon="pi pi-times"
//             class="p-button-text"
//             (click)="close()"
//           ></button>
//           <button
//             pButton
//             label="Seleccionar"
//             icon="pi pi-check"
//             [disabled]="!selectedNode"
//             (click)="confirmSelection()"
//           ></button>
//         </div>
//       </div>
//     </p-dialog>
//   `,
// })
// export class AccountTreeSelector {
//   private apiResponseS = inject(ApiResponseService);
//   private customerIdS = inject(CustomerIdService);

//   visible = input<boolean>(false);
//   customerId = input<string>("");
//   year = input<number>(0);

//   visibleChange = output<boolean>();
//   onAccountSelected = output<any>();

//   nodes = signal<TreeNode[]>([]);
//   loading = signal<boolean>(false);
//   filterText = new FormControl<string>("", { nonNullable: true });
//   selectedNode: TreeNode | null = null;
//   rawAccounts: any[] = [];

//   ngOnChanges() {
//     if (
//       this.visible() &&
//       this.nodes().length === 0 &&
//       this.customerId() &&
//       this.year()
//     ) {
//       this.loadAccounts();
//     }
//   }

//   async loadAccounts() {
//     if (!this.customerId() || !this.year()) return;

//     this.loading.set(true);
//     const url = `FinancialReports/accounts?customerId=${this.customerIdS.customerId()}&year=${this.year()}`;

//     try {
//       const data = await this.apiResponseS.onGetItem<any[]>(url, true); // true for list

//       if (data) {
//         this.rawAccounts = data;
//         this.nodes.set(this.buildTree(data));
//       }
//     } catch (error) {
//       // Error is handled by global interceptor but we can clear loading
//       console.error("Failed to load accounts", error);
//     } finally {
//       this.loading.set(false);
//     }
//   }

//   buildTree(accounts: any[]): TreeNode[] {
//     const nodeMap = new Map<string, TreeNode>();
//     const roots: TreeNode[] = [];

//     // 1. Create Nodes
//     accounts.forEach((acc) => {
//       nodeMap.set(acc.codigoCuenta, {
//         label: `${acc.codigoCuenta} - ${acc.descripcionCuenta}`,
//         data: acc,
//         key: acc.codigoCuenta,
//         children: [],
//         expanded: acc.nivelCuenta < 3, // Auto expand top levels
//         icon: acc.esFilaAgrupadora ? "pi pi-folder" : "pi pi-file",
//       });
//     });

//     // 2. Build Hierarchy
//     accounts.forEach((acc) => {
//       const node = nodeMap.get(acc.codigoCuenta)!;
//       if (acc.cuentaPadre && nodeMap.has(acc.cuentaPadre)) {
//         nodeMap.get(acc.cuentaPadre)!.children!.push(node);
//       } else {
//         roots.push(node);
//       }
//     });

//     return roots;
//   }

//   filterNodes() {
//     // Basic filtering is handled by p-tree [filter]="true"
//     // but if we want custom implementation we can do it here.
//     // For now, p-tree filter is sufficient if we enable it in template.
//   }

//   onNodeSelect(event: any) {
//     this.selectedNode = event.node;
//   }

//   confirmSelection() {
//     if (this.selectedNode) {
//       this.onAccountSelected.emit(this.selectedNode.data);
//       this.close();
//     }
//   }

//   close() {
//     this.visibleChange.emit(false);
//   }
// }
