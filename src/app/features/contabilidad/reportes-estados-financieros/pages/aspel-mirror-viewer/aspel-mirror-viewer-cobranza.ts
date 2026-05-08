// import { DecimalPipe } from "@angular/common";
// import {
//   Component,
//   computed,
//   effect,
//   inject,
//   OnInit,
//   signal,
// } from "@angular/core";
// import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
// import { RouterModule } from "@angular/router";
// import { TreeNode } from "primeng/api";
// import { TagModule } from "primeng/tag";
// import { TreeTableModule } from "primeng/treetable";
// import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
// import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
// import { globalFilterFields as getGlobalFilterFields } from "src/app/core/helpers/table-primeng-option";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { PrimeNgCustomCaption } from "../../../../../core/components/primeng-custom-caption/primeng-custom-caption";
// import { CustomerIdService } from "../../../../../core/services/customer-id.service";
// interface AspelAccountRaw {
//   codigo_Cuenta: string;
//   descripcion_Cuenta: string;
//   nivel_Cuenta: number;
//   cuenta_Padre: string;
//   monto_Enero: number;
//   monto_Febrero: number;
//   monto_Marzo: number;
//   monto_Abril: number;
//   monto_Mayo: number;
//   monto_Junio: number;
//   monto_Julio: number;
//   monto_Agosto: number;
//   monto_Septiembre: number;
//   monto_Octubre: number;
//   monto_Noviembre: number;
//   monto_Diciembre: number;
//   [key: string]: any;
// }

// @Component({
//   selector: "app-aspel-mirror-viewer-cobranza",
//   templateUrl: "./aspel-mirror-viewer-cobranza.html",

//   imports: [
//     TreeTableModule,
//     CustomButton,
//     CustomInputSelectSignal,
//     PrimeNgCustomCaption,
//     ReactiveFormsModule,
//     RouterModule,
//     DecimalPipe,
//     TagModule,
//   ],
// })
// export class AspelMirrorViewerCobranza implements OnInit {
//   apiResponseS = inject(ApiResponseService);
//   customerIdS = inject(CustomerIdService);
//   fb = inject(FormBuilder);

//   dataSignal = signal<TreeNode[]>([]);
//   loading = signal(false);

//   years = [2023, 2024, 2025, 2026].map((y) => ({
//     label: y.toString(),
//     value: y,
//   }));

//   filterForm = this.fb.group({
//     year: [new Date().getFullYear(), Validators.required],
//   });

//   globalFilterFields = computed(() => {
//     const data = this.dataSignal();
//     return data.length > 0 ? getGlobalFilterFields(data) : [];
//   });

//   constructor() {
//     effect(() => {
//       const customerId: string = this.customerIdS.customerId();
//       if (customerId) this.onLoadData();
//     });
//   }
//   cols: any[] = [];
//   monthsCols = [
//     { field: "jan", header: "Ene" },
//     { field: "feb", header: "Feb" },
//     { field: "mar", header: "Mar" },
//     { field: "apr", header: "Abr" },
//     { field: "may", header: "May" },
//     { field: "jun", header: "Jun" },
//     { field: "jul", header: "Jul" },
//     { field: "aug", header: "Ago" },
//     { field: "sep", header: "Sep" },
//     { field: "oct", header: "Oct" },
//     { field: "nov", header: "Nov" },
//     { field: "dec", header: "Dic" },
//   ];

//   ngOnInit() {
//     this.cols = [
//       { field: "code", header: "Código" },
//       { field: "name", header: "Descripción" },
//       { field: "level", header: "Nivel" },
//       ...this.monthsCols,
//     ];

//     // Auto-load if params exist or just wait for user
//     // this.onLoadData();
//   }

//   onLoadData() {
//     this.loading.set(true);
//     const year = this.filterForm.value.year;
//     // We use a safe customerId like 64 for testing as noted in plan, or dynamic if available?
//     // User context implies we are logged in. Let's assume customerId=64 for now if not selectable.
//     // Wait, the API requires customerId. In ReportList we don't select customer.
//     // Usually it comes from session or a global selector.
//     // Let's check how ReportList usually works. It just calls 'FinancialReports' which infers context.
//     // But 'GetAspelMirrorAsync' needs explicit ID?
//     // PresupuestoController.PresupuestoLimpio(customerId, year).
//     // We need to know who the customer is.
//     // Assuming for now a hardcoded or retrieved ID.
//     // Re-checking ReportList logic... it calls FinancialReports endpoint.
//     // Let's try to get customerId from local storage or service.
//     // Fallback: 64 (Safe ID mentioned in plan).
//     const customerId: string = this.customerIdS.customerId();

//     // Endpoint: api/Presupuesto/PresupuestoLimpio
//     this.apiResponseS
//       .onGetItem(
//         `Presupuesto/presupuesto-limpio-cobranza?customerId=${customerId}&intYear=${year}`,
//       )
//       .then((response: any) => {
//         // Fallback: check for 'cuentas' or 'Cuentas' or 'cuentasDetalladas'
//         const accounts =
//           response?.cuentas || response?.Cuentas || response?.cuentasDetalladas;

//         if (accounts) {
//           const tree = this.buildTree(accounts);
//           this.dataSignal.set(tree);
//         } else {
//           console.warn("No accounts found in response", response);
//           this.dataSignal.set([]);
//         }
//         this.loading.set(false);
//       })
//       .catch((err) => {
//         console.error("Error loading Aspel Data", err);
//         this.loading.set(false);
//       });
//   }

//   buildTree(accounts: AspelAccountRaw[]): TreeNode[] {
//     // 1. Sort by code
//     accounts.sort((a, b) =>
//       (a.codigo_Cuenta || "").localeCompare(b.codigo_Cuenta || ""),
//     );

//     const lookup: { [key: string]: TreeNode } = {};
//     const roots: TreeNode[] = [];

//     accounts.forEach((acc) => {
//       const node: TreeNode = {
//         data: {
//           code: acc.codigo_Cuenta,
//           name: acc.descripcion_Cuenta,
//           level: acc.nivel_Cuenta,
//           jan: acc.monto_Enero,
//           feb: acc.monto_Febrero,
//           mar: acc.monto_Marzo,
//           apr: acc.monto_Abril,
//           may: acc.monto_Mayo,
//           jun: acc.monto_Junio,
//           jul: acc.monto_Julio,
//           aug: acc.monto_Agosto,
//           sep: acc.monto_Septiembre,
//           oct: acc.monto_Octubre,
//           nov: acc.monto_Noviembre,
//           dec: acc.monto_Diciembre,
//         },
//         children: [],
//         expanded: acc.nivel_Cuenta < 3, // Expand top levels by default
//       };
//       lookup[acc.codigo_Cuenta] = node;

//       // Find parent
//       // Logic: If Nivel 1, it's root. If Nivel > 1, look for parent.
//       // Aspel Code structure: XXX-XXX-XXX.
//       // Sometimes 'Cuenta_Padre' is empty or implies hierarchy.

//       if (acc.nivel_Cuenta === 1) {
//         roots.push(node);
//       } else {
//         // Try to find parent by "cuenta_Padre" field if valid
//         let parentNode = acc.cuenta_Padre ? lookup[acc.cuenta_Padre] : null;

//         if (parentNode) {
//           parentNode.children!.push(node);
//         } else {
//           // Fallback: if no parent found, add to root
//           roots.push(node);
//         }
//       }
//     });

//     return roots;
//   }

//   isRowZero(data: any): boolean {
//     // Check if sum of all months is zero
//     const sum =
//       data.jan +
//       data.feb +
//       data.mar +
//       data.apr +
//       data.may +
//       data.jun +
//       data.jul +
//       data.aug +
//       data.sep +
//       data.oct +
//       data.nov +
//       data.dec;
//     return Math.abs(sum) < 0.01;
//   }

//   getLevelSeverity(
//     level: number,
//   ):
//     | "success"
//     | "info"
//     | "warning"
//     | "danger"
//     | "secondary"
//     | "contrast"
//     | undefined {
//     switch (level) {
//       case 1:
//         return "contrast"; // Black/Dark
//       case 2:
//         return "info"; // Blue
//       case 3:
//         return "success"; // Green
//       default:
//         return "secondary";
//     }
//   }

//   expandAll() {
//     this.toggleNodes(this.dataSignal(), true);
//     this.refreshTable();
//   }

//   collapseAll() {
//     this.toggleNodes(this.dataSignal(), false);
//     this.refreshTable();
//   }

//   expandToLevel(level: number) {
//     this.toggleNodesByLevel(this.dataSignal(), level);
//     this.refreshTable();
//   }

//   private toggleNodes(nodes: TreeNode[], expanded: boolean) {
//     if (!nodes) return;
//     for (const node of nodes) {
//       if (node.children && node.children.length > 0) {
//         node.expanded = expanded;
//         this.toggleNodes(node.children, expanded);
//       }
//     }
//   }

//   private toggleNodesByLevel(nodes: TreeNode[], targetLevel: number) {
//     if (!nodes) return;
//     for (const node of nodes) {
//       // Logic: Expand if node's level < targetLevel (so children at targetLevel are visible?)
//       // Actually usually "Level 1" means show Level 1 nodes (collapsed or expanded?)
//       // Interpretation: "Level 2" means Expand Level 1 so Level 2 is visible.
//       // If node level < targetLevel, expand it.

//       const nodeLevel = node.data.level;
//       if (nodeLevel < targetLevel) {
//         node.expanded = true;
//       } else {
//         node.expanded = false;
//       }

//       if (node.children && node.children.length > 0) {
//         this.toggleNodesByLevel(node.children, targetLevel);
//       }
//     }
//   }

//   private refreshTable() {
//     // Trigger new reference to update p-treeTable if needed, or just let mutation work
//     this.dataSignal.set([...this.dataSignal()]);
//   }
// }
