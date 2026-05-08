// import { CommonModule } from "@angular/common";
// import { Component, effect, inject, OnInit, signal } from "@angular/core";
// import { toSignal } from "@angular/core/rxjs-interop";
// import {
//     FormBuilder,
//     FormsModule,
//     ReactiveFormsModule,
//     Validators,
// } from "@angular/forms";
// import { ActivatedRoute, Router } from "@angular/router";
// import { MessageService, TreeNode } from "primeng/api";
// import { ButtonModule } from "primeng/button";
// import { CheckboxModule } from "primeng/checkbox";
// import { ToolbarModule } from "primeng/toolbar";
// import { TreeTableModule } from "primeng/treetable";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { CustomerIdService } from "src/app/core/services/customer-id.service";
// import {
//     FinancialReportResultDTO,
//     FinancialReportRowType,
//     ReportRowResultDTO,
// } from "../../models/financial-report.models";

// @Component({
//   selector: "app-report-viewer",
//   imports: [
//     //     CheckboxModule,
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     ToolbarModule,
//     TreeTableModule,
//   ],
//   providers: [MessageService],
//   templateUrl: "./report-viewer.html",
//   styleUrls: ["./report-viewer.scss"],
// })
// export class ReportViewer implements OnInit {
//   private apiResponseS = inject(ApiResponseService);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private fb = inject(FormBuilder);
//   private customerIdService = inject(CustomerIdService);

//   // State
//   loading = signal<boolean>(false);
//   showZeros = signal<boolean>(true); // Default to showing all
//   results = signal<
//     {
//       dto: FinancialReportResultDTO;
//       nodes: TreeNode[];
//       isBalanceSheet: boolean;
//       leftNodes: TreeNode[];
//       rightNodes: TreeNode[];
//     }[]
//   >([]);

//   // Re-generate nodes when toggle changes (without API call)
//   toggleZeros() {
//     this.showZeros.update((v) => !v);
//     // Re-process existing results
//     const currentResults = this.results();
//     const updated = currentResults.map((item) => {
//       const nodes = this.buildResultNodes(item.dto.rows, this.showZeros());

//       let leftNodes: TreeNode[] = [];
//       let rightNodes: TreeNode[] = [];

//       if (item.isBalanceSheet) {
//         leftNodes = nodes.filter((n) => {
//           const name = n.data.name.toUpperCase();
//           return name.includes("ACTIVO");
//         });

//         rightNodes = nodes.filter((n) => {
//           const name = n.data.name.toUpperCase();
//           return name.includes("PASIVO") || name.includes("CAPITAL");
//         });
//       }

//       return { ...item, nodes, leftNodes, rightNodes };
//     });
//     this.results.set(updated);
//   }

//   // Updated buildResultNodes with filtering
//   buildResultNodes(rows: ReportRowResultDTO[], showZeros: boolean): TreeNode[] {
//     return rows
//       .filter((row) => {
//         if (showZeros) return true; // Show all

//         // Logic to hide zero rows
//         // If it's a Header, usually keep it unless all children are gone?
//         // Better strategy: Filter purely on Value.
//         // If Matrix View: check monthlyValues.
//         // If Standard View: check row.Value.

//         // However, we process children first to see if a Group becomes empty.
//         // But here we are recursive.
//         // Let's filter post-recursion mapping?
//         return true; // We do filtering in the map below to handle parent/child dependency
//       })
//       .map((row) => {
//         const children = this.buildResultNodes(row.children, showZeros);

//         // Decide if this row should be visible
//         let isVisible = true;

//         if (!showZeros) {
//           // Check if it has visible children (Group)
//           if (row.children.length > 0 && children.length > 0) {
//             isVisible = true;
//           } else if (
//             children.length === 0 &&
//             row.children &&
//             row.children.length > 0
//           ) {
//             // It had children but they were all filtered out -> Hide this group?
//             // Usually yes, empty groups are noise.
//             isVisible = false;
//           } else {
//             // Leaf node or Empty Group
//             // Check values
//             const hasValue = Math.abs(row.value) > 0.01; // Tolerance
//             const hasBudget = Math.abs(row.budget) > 0.01;

//             let hasMonthly = false;
//             if (row.monthlyValues) {
//               hasMonthly = row.monthlyValues.some((v) => Math.abs(v) > 0.01);
//             }

//             isVisible = hasValue || hasBudget || hasMonthly;

//             // Keep Headers/Roots if needed?
//             // RowType headers usually don't have values.
//             if (row.rowType === FinancialReportRowType.Header) isVisible = true;
//           }
//         }

//         if (!isVisible) return null;

//         return {
//           data: row,
//           children: children,
//           expanded: true,
//           key: row.rowId,
//         };
//       })
//       .filter((n) => n !== null) as TreeNode[];
//   }
//   // Form
//   filterForm = this.fb.group({
//     year: [new Date().getFullYear(), Validators.required],
//     month: [new Date().getMonth() + 1, Validators.required],
//   });

//   // Filters
//   years = [2023, 2024, 2025, 2026].map((y) => ({
//     label: y.toString(),
//     value: y,
//   }));

//   months = [
//     { label: "Enero", value: 1 },
//     { label: "Febrero", value: 2 },
//     { label: "Marzo", value: 3 },
//     { label: "Abril", value: 4 },
//     { label: "Mayo", value: 5 },
//     { label: "Junio", value: 6 },
//     { label: "Julio", value: 7 },
//     { label: "Agosto", value: 8 },
//     { label: "Septiembre", value: 9 },
//     { label: "Octubre", value: 10 },
//     { label: "Noviembre", value: 11 },
//     { label: "Diciembre", value: 12 },
//   ];

//   queryParamsSignal = toSignal(this.route.queryParams);

//   constructor() {
//     effect(() => {
//       const customerId = this.customerIdService.customerId();
//       const params = this.queryParamsSignal();
      
//       if (params) {
//           if (params["year"])
//             this.filterForm.controls.year.setValue(+params["year"]);
//           if (params["month"])
//             this.filterForm.controls.month.setValue(+params["month"]);

//           if (customerId) {
//              this.generate(); 
//           }
//       }
//     });
//   }

//   ngOnInit() {
//       // Logic moved to effect
//   }

//   async generate() {
//     const customerId = this.customerIdService.customerId();
//     if (!customerId || this.filterForm.invalid) return;

//     const reportIdParam = this.route.snapshot.paramMap.get("id");
//     const idsParam = this.route.snapshot.queryParamMap.get("ids");

//     let reportIds: string[] = [];
//     if (idsParam) {
//       reportIds = idsParam.split(",");
//     } else if (reportIdParam && reportIdParam !== "multi") {
//       reportIds = [reportIdParam];
//     }

//     if (reportIds.length === 0) return;

//     this.loading.set(true);
//     this.results.set([]); // Clear previous

//     const promises = reportIds.map((id) => {
//       const urlApi = `FinancialReports/${id}/generate`;
//       const body = {
//         ...this.filterForm.value,
//         customerId: customerId,
//       };
//       return this.apiResponseS.onPostNotLoading<FinancialReportResultDTO>(
//         urlApi,
//         body,
//       );
//     });

//     try {
//       const responses = await Promise.all(promises);
//       const newResults = responses
//         .filter((r): r is FinancialReportResultDTO => !!r)
//         .map((res) => {
//           const nodes = this.buildResultNodes(res.rows, this.showZeros());
//           const isBalanceSheet = this.checkIsBalanceSheet(res);

//           let leftNodes: TreeNode[] = [];
//           let rightNodes: TreeNode[] = [];

//           if (isBalanceSheet) {
//             // Split Logic
//             leftNodes = nodes.filter(
//               (n) =>
//                 n.data.name.toUpperCase().includes("ACTIVO") &&
//                 !n.data.name.toUpperCase().includes("TOTAL"),
//             );
//             // Include Pasivo and Capital, excluding Totals if they are root level (usually headers are roots)
//             // Actually, usually "ACTIVO" is a Header Row.
//             // If structure is:
//             // 1. ACTIVO (Header/Group) -> Children
//             // 2. PASIVO (Header/Group) -> Children
//             // 3. CAPITAL (Header/Group) -> Children
//             // Then we just take those nodes.

//             // Basic Split: Contains Activo -> Left. Contains Pasivo/Capital -> Right.
//             // We also want to include the "Total Activo" row on the left if it's a sibling.
//             // If Total Activo is a child of Activo, it comes with it.
//             // If Total Activo is a root row, we need to grab it.

//             leftNodes = nodes.filter((n) => {
//               const name = n.data.name.toUpperCase();
//               return name.includes("ACTIVO");
//             });

//             rightNodes = nodes.filter((n) => {
//               const name = n.data.name.toUpperCase();
//               return name.includes("PASIVO") || name.includes("CAPITAL");
//             });
//           }

//           return {
//             dto: res,
//             nodes: nodes,
//             isBalanceSheet: isBalanceSheet,
//             leftNodes: leftNodes,
//             rightNodes: rightNodes,
//           };
//         })
//         .sort((a, b) => (a.dto.sortOrder ?? 0) - (b.dto.sortOrder ?? 0));

//       this.results.set(newResults);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       this.loading.set(false);
//     }
//   }

//   checkIsBalanceSheet(dto: FinancialReportResultDTO): boolean {
//     const name = dto.reportName.toUpperCase();
//     // Check Name
//     if (name.includes("POSICIÃ“N FINANCIERA") || name.includes("BALANCE"))
//       return true;

//     // Fallback: Check Content
//     const rowNames = dto.rows.map((r) => r.name.toUpperCase());
//     return (
//       rowNames.some((n) => n.includes("ACTIVO")) &&
//       rowNames.some((n) => n.includes("PASIVO"))
//     );
//   }

//   navigateBack() {
//     this.router.navigate(["/contabilidad/reportes-estados-financieros"]);
//   }

//   hasBudgetColumns(reportName: string): boolean {
//     const name = reportName?.toLowerCase() || "";
//     return name.includes("presup") || name.includes("budget");
//   }

//   // --- Ayudantes de Vista Matriz ---
//   isMatrixView(dto: FinancialReportResultDTO): boolean {
//     return dto.code === "ER";
//   }

//   getMatrixColumns(dto: FinancialReportResultDTO): number[] {
//     const limit = dto.month || 12;
//     return Array.from({ length: limit }, (_, i) => i + 1);
//   }

//   getBudgetMonths(dto: FinancialReportResultDTO): number[] {
//     // PeticiÃ³n del usuario: Mostrar solo hasta el mes seleccionado.
//     const limit = dto.month || 12;
//     return Array.from({ length: limit }, (_, i) => i + 1);
//   }

//   getMonthName(month: number): string {
//     const monthNames = [
//       "ENE",
//       "FEB",
//       "MAR",
//       "ABR",
//       "MAY",
//       "JUN",
//       "JUL",
//       "AGO",
//       "SEP",
//       "OCT",
//       "NOV",
//       "DIC",
//     ];
//     return monthNames[month - 1] || "";
//   }

//   getMonthlyValue(row: ReportRowResultDTO, month: number): number {
//     if (!row.monthlyValues || row.monthlyValues.length <= month) return 0;
//     return row.monthlyValues[month];
//   }

//   getAccumulatedValue(row: ReportRowResultDTO, maxMonth: number): number {
//     if (!row.monthlyValues) return 0;
//     let sum = 0;
//     for (let i = 1; i <= maxMonth; i++) {
//       if (i < row.monthlyValues.length) {
//         sum += row.monthlyValues[i] || 0;
//       }
//     }
//     return sum;
//   }

//   // --- Ayudantes de Vista Presupuestal ---
//   isBudgetView(dto: FinancialReportResultDTO): boolean {
//     return dto.code?.startsWith("CED_PRE") || false;
//   }

//   getLastMonthlyBudget(row: ReportRowResultDTO, currentMonth: number): number {
//     if (!row.monthlyBudgets) return 0;
//     // Â¿Encontrar el Ãºltimo presupuesto distinto de cero hasta el mes actual?
//     // Â¿O solo el presupuesto del mes actual?
//     // Requisito: "Ãºltimo valor diferente"
//     // El usuario dijo: "presupuesto mensual aprobado... el Ãºltimo valor diferente... por ejemplo se actualizÃ³ en nov".
//     // Esto implica que miramos hacia atrÃ¡s desde Dic o Mes Actual hasta encontrar un presupuesto establecido.
//     // Si el presupuesto es constante, es solo el valor.
//     // Tomemos el presupuesto del *mes seleccionado actual* (param month) o el Ãºltimo disponible si es 0?
//     // Realmente, usualmente "Presupuesto Mensual Aprobado" en estos contextos significa el presupuesto aplicable para el anÃ¡lisis del periodo actual.
//     // Let's use the budget of the current selected month.
//     const val = row.monthlyBudgets[currentMonth];
//     if (val !== 0) return val;

//     // If 0, maybe look back?
//     // Optional: Loop backwards from currentMonth to 1.
//     for (let m = currentMonth - 1; m >= 1; m--) {
//       if (row.monthlyBudgets[m] !== 0) return row.monthlyBudgets[m];
//     }
//     return 0;
//   }

//   getBudgetRestante(row: ReportRowResultDTO, maxMonth: number): number {
//     // Annual Approved - Accumulated Real
//     const accumulatedReal = this.getAccumulatedValue(row, maxMonth);
//     const annualBudget = row.budget;
//     return annualBudget - accumulatedReal;
//   }

//   formatValue(value: number): string {
//     if (Math.abs(value) < 0.01) return "-";
//     return new Intl.NumberFormat("en-US", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(value);
//   }

//   isRowLeaf(rowNode: any): boolean {
//     // A row is a leaf if it has no children.
//     // In Budget View, values should only be shown for leaves (Detail accounts and Totals).
//     return !rowNode.node.children || rowNode.node.children.length === 0;
//   }

//   getBudgetRowClass(rowData: ReportRowResultDTO): string {
//     // Executive Style: Hierarchy based on levels
//     // Total Rows
//     if (rowData.rowType === FinancialReportRowType.Total) {
//       return "bg-gray-100 font-bold text-gray-900 border-t border-gray-300";
//     }

//     // Level 0: Main Headers (e.g., INGRESOS, EGRESOS)
//     if (rowData.level === 0) {
//       return "bg-gray-50 font-bold text-gray-800 border-b border-gray-200 tracking-wide";
//     }

//     // Level 1: Sub Groups (e.g., Mantenimiento, Administracion)
//     if (rowData.level === 1) {
//       return "font-semibold text-gray-700 bg-gray-50/50";
//     }

//     // Level 2/3: Details (Normal rows)
//     return "text-gray-600 hover:bg-gray-50 transition-colors duration-150";
//   }

//   // --- Expansion Logic ---

//   expandToLevel(targetLevel: number) {
//     const currentResults = this.results();
//     if (!currentResults || currentResults.length === 0) return;

//     const newResults = currentResults.map((res) => {
//       this.recurseExpand(res.nodes, targetLevel, 0);
//       return { ...res, nodes: [...res.nodes] };
//     });

//     this.results.set([...newResults]);
//   }

//   collapseAll() {
//     this.expandToLevel(-1);
//   }

//   private recurseExpand(
//     nodes: any[],
//     targetLevel: number,
//     currentLevel: number,
//   ) {
//     if (!nodes) return;

//     for (const node of nodes) {
//       const level = node.data ? node.data.level : -1;

//       if (level !== -1 && level <= targetLevel) {
//         node.expanded = true;
//       } else {
//         node.expanded = false;
//       }

//       if (targetLevel === -1) node.expanded = false;

//       if (node.children) {
//         this.recurseExpand(node.children, targetLevel, currentLevel + 1);
//       }
//     }
//   }

//   getRowClass(row: ReportRowResultDTO): string {
//     const name = row.name.toUpperCase();

//     // Semantic Highlighting for special accounts
//     if (name.includes("FONDO DE RESERVA") || name.includes("PATRIMONIO"))
//       return "text-emerald-700 font-medium";

//     if (name.includes("REMANENTE") || name.includes("DEPRECIACION"))
//       return "text-amber-700 font-medium";

//     // General styling is handled by getBudgetRowClass or default table styles
//     return "";
//   }

//   get FinancialReportRowType() {
//     return FinancialReportRowType;
//   }
// }









