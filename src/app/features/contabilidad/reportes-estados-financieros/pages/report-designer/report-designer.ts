// import { CommonModule } from "@angular/common";
// import { Component, computed, inject, OnInit, signal } from "@angular/core";
// import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
// import { ActivatedRoute, Router } from "@angular/router";
// import { MessageService, TreeNode } from "primeng/api";
// import { ButtonModule } from "primeng/button";
// import { CheckboxModule } from "primeng/checkbox";
// import { DialogModule } from "primeng/dialog";
// import { DialogService } from "primeng/dynamicdialog";
// import { InputTextModule } from "primeng/inputtext";
// import { ToastModule } from "primeng/toast";
// import { TooltipModule } from "primeng/tooltip";
// import { TreeTableModule } from "primeng/treetable";
// import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
// import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
// import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
// import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
// import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { CustomInputTextAreaSignal } from "../../../../../core/components/inputs/web/custom-input-textarea-signal";
// import {
//   FinancialReportRow,
//   FinancialReportRowType,
// } from "../../models/financial-report.models";

// import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// import { ReportRowForm } from "./components/report-row-form/report-row-form";

// @Component({
//   selector: "app-report-designer",

//   imports: [
//     ButtonModule,
//     CheckboxModule,
//     CommonModule,
//     CustomButton,
//     CustomButtonDelete,
//     CustomButtonEdit,
//     CustomButtonSave,
//     CustomInputTextAreaSignal,
//     CustomInputTextSignal,
//     DialogModule,
//     InputTextModule,
//     ReactiveFormsModule,
//     ToastModule,
//     TooltipModule,
//     TreeTableModule,
//   ],
//   templateUrl: "./report-designer.html",
//   providers: [DialogService, MessageService],
// })
// export class ReportDesigner implements OnInit {
//   // Services
//   private apiResponseS = inject(ApiResponseService);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private fb = inject(FormBuilder);
//   private dialogHandlerS = inject(DialogHandlerService);

//   // State
//   reportId: string | null = null;
//   loading = signal<boolean>(true);
//   structure = signal<TreeNode[]>([]);
//   flatRows = signal<FinancialReportRow[]>([]);

//   // Design Context (for Catalog) - Passed to Modal
//   designContext = signal<{ customerId: string; year: number }>({
//     customerId: "",
//     year: new Date().getFullYear(),
//   });

//   // Getters
//   get FinancialReportRowType() {
//     return FinancialReportRowType;
//   }

//   // Forms
//   form = this.fb.group({
//     name: ["", [Validators.required]],
//     code: ["", [Validators.required]],
//     description: [""],
//   });

//   ngOnInit() {
//     this.reportId = this.route.snapshot.paramMap.get("id");
//     if (this.reportId && this.reportId !== "new") {
//       this.loadReport(this.reportId);
//     } else {
//       this.loading.set(false);
//     }
//     this.loadDesignContext();
//   }

//   // Actions
//   loadReport(id: string) {
//     this.loading.set(true);
//     const urlApi = `FinancialReports/${id}`;

//     this.apiResponseS.onGetItem<any>(urlApi).then((data) => {
//       if (data) {
//         this.form.patchValue({
//           name: data.name,
//           code: data.code,
//           description: data.description,
//         });
//         this.flatRows.set(data.rows || []);
//         this.buildTree(data.rows || []);
//       }
//       this.loading.set(false);
//     });
//   }

//   saveReport() {
//     if (this.form.invalid) return;

//     const formVal = this.form.value;
//     const payload = {
//       name: formVal.name,
//       code: formVal.code,
//       description: formVal.description,
//       rows: this.flatRows(),
//     };

//     const request =
//       this.reportId && this.reportId !== "new"
//         ? this.apiResponseS.onPut(`FinancialReports/${this.reportId}`, payload)
//         : this.apiResponseS.onPost(`FinancialReports`, payload);

//     request.then((success) => {
//       if (success) {
//         // Success handled by global handler usually, or redirect
//         if (!this.reportId || this.reportId === "new") {
//           // Maybe navigate or stay
//         }
//       }
//     });
//   }

//   navigateBack() {
//     this.router.navigate(["/contabilidad/reportes-estados-financieros"]);
//   }

//   loadDesignContext() {
//     this.apiResponseS
//       .onGetList<any[]>("Customers/list/true", { pageSize: 1 })
//       .then((res) => {
//         // Handle direct array or wrapped items
//         const items = Array.isArray(res) ? res : (res as any)?.items || [];
//         if (items.length > 0) {
//           this.designContext.update((c) => ({ ...c, customerId: items[0].id }));
//         }
//       });
//   }

//   // Row Logic
//   rowNodes = computed(() => this.structure());

//   buildTree(rows: FinancialReportRow[]) {
//     const nodeMap = new Map<string, TreeNode>();

//     rows.forEach((row) => {
//       if (row.id) {
//         nodeMap.set(row.id, {
//           data: row,
//           children: [],
//           expanded: true,
//           key: row.id,
//         });
//       }
//     });

//     const tree: TreeNode[] = [];

//     rows.forEach((row) => {
//       if (row.id) {
//         const node = nodeMap.get(row.id)!;
//         if (row.parentRowId && nodeMap.has(row.parentRowId)) {
//           const parent = nodeMap.get(row.parentRowId)!;
//           parent.children!.push(node);
//         } else {
//           tree.push(node);
//         }
//       }
//     });

//     const sortNodes = (nodes: TreeNode[]) => {
//       nodes.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
//       nodes.forEach((n) => {
//         if (n.children && n.children.length > 0) {
//           sortNodes(n.children);
//         }
//       });
//     };
//     sortNodes(tree);

//     this.structure.set(tree);
//   }

//   // Dialog & Form Logic - Refactored to use DialogHandlerService
//   openNewRowDialog(parentRow?: FinancialReportRow) {
//     const nextOrder = this.calculateNextOrder(parentRow?.id);

//     const data = {
//       row: null,
//       parentRow: parentRow, // Pass parent info if needed for logic, though structure is flattened
//       nextOrder: nextOrder,
//       context: this.designContext(),
//     };

//     this.dialogHandlerS
//       .openDialog<FinancialReportRow>(
//         ReportRowForm,
//         data,
//         "Nueva Fila",
//         this.dialogHandlerS.sizeMd,
//       )
//       .then((result: FinancialReportRow) => {
//         if (result) {
//           // If parentRow was provided, set parentId
//           if (parentRow?.id) {
//             result.parentRowId = parentRow.id;
//           }
//           this.handleRowSave(result);
//         }
//       });
//   }

//   editRow(row: FinancialReportRow) {
//     const data = {
//       row: row, // Edit mode
//       context: this.designContext(),
//     };

//     this.dialogHandlerS
//       .openDialog<FinancialReportRow>(
//         ReportRowForm,
//         data,
//         "Editar Fila",
//         this.dialogHandlerS.sizeMd,
//       )
//       .then((result: FinancialReportRow) => {
//         if (result) {
//           // Preserve existing parent ID as modal might not know it if not passed
//           if (row.parentRowId) {
//             result.parentRowId = row.parentRowId;
//           }
//           this.handleRowSave(result);
//         }
//       });
//   }

//   handleRowSave(row: FinancialReportRow) {
//     let currentRows = [...this.flatRows()];

//     // Check if update or insert
//     const index = currentRows.findIndex((r) => r.id === row.id);

//     if (index !== -1) {
//       // Update
//       currentRows[index] = { ...currentRows[index], ...row };
//     } else {
//       // Insert
//       currentRows.push(row);
//     }

//     this.flatRows.set(currentRows);
//     this.buildTree(currentRows);
//   }

//   deleteRow(row: FinancialReportRow) {
//     if (!row.id) return;
//     const currentRows = this.flatRows().filter((r) => r.id !== row.id);
//     this.flatRows.set(currentRows);
//     this.buildTree(currentRows);
//   }

//   private calculateNextOrder(parentId?: string): number {
//     const siblings = this.flatRows().filter((r) => r.parentRowId == parentId);
//     if (siblings.length === 0) return 10;
//     const max = Math.max(...siblings.map((r) => r.order || 0));
//     return max + 10;
//   }
// }









