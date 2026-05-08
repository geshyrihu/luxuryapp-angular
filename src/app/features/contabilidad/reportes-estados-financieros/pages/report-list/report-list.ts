// import { CommonModule } from "@angular/common";
// import {
//     Component,
//     computed,
//     effect,
//     inject,
//     OnInit,
//     signal,
// } from "@angular/core";
// import { toSignal } from "@angular/core/rxjs-interop";
// import {
//     FormBuilder,
//     FormsModule,
//     ReactiveFormsModule,
//     Validators,
// } from "@angular/forms";
// import { Router, RouterLink, RouterModule } from "@angular/router";
// import { CheckboxModule } from "primeng/checkbox";
// import { DialogModule } from "primeng/dialog";
// import { TableModule } from "primeng/table";
// import { TooltipModule } from "primeng/tooltip";
// import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
// import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
// import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
// import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
// import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
// import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
// import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
// import {
//     globalFilterFields,
//     rowsPerPageOptions,
//     tablePrimeNgRows,
// } from "src/app/core/helpers/table-primeng-option";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// import { CustomButtonItem } from "../../../../../core/components/buttons/web/custom-button-item";
// import { CustomerIdService } from "../../../../../core/services/customer-id.service";
// import { FinancialReport } from "../../models/financial-report.models";
// import { FinancialReportSendModal } from "../report-form/financial-report-send-modal";
// import { ReportForm } from "../report-form/report-form";

// @Component({
//   selector: "app-report-list",
//   templateUrl: "./report-list.html",

//   imports: [
//     TableModule,
//     PrimeNgCustomCaption,
//     PrimeNgCustomTableFooter,
//     DataViewMobile,
//     RouterModule,
//     CustomButtonEdit,
//     CustomButtonDelete,
//     CustomButton,
//     CustomButtonItem,
//     TooltipModule,
//     RouterLink,
//     ReactiveFormsModule,
//     FormsModule,
//     CustomInputSelectSignal,
//     DialogModule,
//     CheckboxModule,
//     CommonModule,
//

//   ],
// })
// export class ReportList implements OnInit {
//   apiResponseS = inject(ApiResponseService);
//   dialogHandlerS = inject(DialogHandlerService);
//   router = inject(Router);
//   customerIdS = inject(CustomerIdService);
//   fb = inject(FormBuilder);

//   dataSignal = signal<FinancialReport[]>([]);
//   loading = signal(true);
//   selectedReports: FinancialReport[] = [];

//   // Filter Form
//   filterForm = this.fb.group({
//     year: [new Date().getFullYear(), Validators.required],
//     month: [new Date().getMonth() + 1, Validators.required],
//   });

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

//   tablePrimeNgRows: number = tablePrimeNgRows();
//   rowsPerPageOptions: number[] = rowsPerPageOptions();

//   globalFilterFields = computed(() => {
//     const data = this.dataSignal();
//     if (!data || data.length === 0) return [];
return globalFilterFields(data);
//   });

//   filterChanges = toSignal(this.filterForm.valueChanges);

//   constructor() {
//     effect(() => {
//         const val = this.filterChanges();
//         if (val) {
//             if (val.year)
//                 localStorage.setItem("financial_report_year", val.year.toString());
//             if (val.month)
//                 localStorage.setItem("financial_report_month", val.month.toString());
//         }
//     });

//     effect(() => {
//       const customerId: string = this.customerIdS.customerId();
//       if (customerId) {
//         this.onLoadData();
//       }
//     });
//   }

//   ngOnInit(): void {
//     // Load Filters
//     const savedYear = localStorage.getItem("financial_report_year");
//     const savedMonth = localStorage.getItem("financial_report_month");

//     if (savedYear) this.filterForm.controls.year.setValue(+savedYear);
//     if (savedMonth) this.filterForm.controls.month.setValue(+savedMonth);

//     // Save on change logic moved to effect
//     this.onLoadData();
//   }
//   onLoadData() {
//     const urlApi = `FinancialReports/list-to-customer/${this.customerIdS.customerId()}`;
//     this.apiResponseS
//       .onGetList<FinancialReport[]>(urlApi)
//       .then((result: any) => {
//         this.dataSignal.set(result || []);
//         this.loading.set(false);
//         this.restoreSelection();
//       });
//   }

//   restoreSelection() {
//     const savedIds = localStorage.getItem("financial_report_selection");
//     if (savedIds) {
//       const ids = savedIds.split(",");
//       // Filter from current data to ensure validity
//       this.selectedReports = this.dataSignal().filter(
//         (r) => r.id && ids.includes(r.id),
//       );
//     }
//   }

//   onDelete(id: string) {
//     this.apiResponseS
//       .onDelete(`FinancialReports/${id}`)
//       .then((response: boolean) => {
//         if (response) {
//           this.dataSignal.update((currentData) =>
//             currentData.filter((item) => item.id !== id),
//           );
//         }
//       });
//   }

//   onModalForm(data: any) {
//     this.dialogHandlerS
//       .openDialog(ReportForm, data, data.title, this.dialogHandlerS.sizeLg)
//       .then((result: boolean) => {
//         if (result) {
//           this.onLoadData();
//         }
//       });
//   }

//   onDesign(id: string) {
//     this.router.navigate([
//       "/contabilidad/reportes-estados-financieros/designer",
//       id,
//     ]);
//   }

//   onViewMirror() {
//     this.router.navigate([
//       "/contabilidad/reportes-estados-financieros/aspel-mirror",
//     ]);
//   }
//   onViewMirrorCobranza() {
//     this.router.navigate([
//       "/contabilidad/reportes-estados-financieros/aspel-mirror-cobranza",
//     ]);
//   }

//   onView(id: string) {
//     this.router.navigate(
//       ["/contabilidad/reportes-estados-financieros/viewer", id],
//       {
//         queryParams: {
//           year: this.filterForm.value.year,
//           month: this.filterForm.value.month,
//         },
//       },
//     );
//   }

//   onViewSelected() {
//     const selected = this.selectedReports;
//     if (selected.length === 0) return;

//     const ids = selected.map((r) => r.id).join(",");
//     localStorage.setItem("financial_report_selection", ids); // Persist selection

//     this.router.navigate(
//       ["/contabilidad/reportes-estados-financieros/viewer", "multi"],
//       {
//         queryParams: {
//           ids: ids,
//           year: this.filterForm.value.year,
//           month: this.filterForm.value.month,
//         },
//       },
//     );
//   }

//   onSeedDefaults() {
//     this.loading.set(true);
//     this.apiResponseS
//       .onPost("FinancialReports/seed/" + this.customerIdS.customerId(), {})
//       .then((res) => {
//         if (res) {
//           this.onLoadData();
//         }
//         this.loading.set(false);
//       });
//   }

//   onRowReorder(event: any) {
//     console.log("🔄 onRowReorder Event received:", event);

//     // PrimeNG mutates the array reference in place.
//     // We just need to trigger a signal update to ensure change detection (if needed)
//     // and then persist the new order.
//     const items = this.dataSignal();

//     // Optional: clone to force refresh if PrimeNG didn't trigger signal notification (it wouldn't)
//     // But sending the same array ref might not trigger effects.
//     // Let's spread it to be safe for the signal system.
//     this.dataSignal.set([...items]);

//     console.log(
//       "✅ Items after reorder (PrimeNG):",
//       items.map((i) => `${i.id}:${i.name}`).join(", "),
//     );

//     // Prepare payload
//     const payload = items.map((item, index) => ({
//       id: item.id!,
//       sortOrder: (index + 1) * 10,
//     }));

//     console.log("🚀 Sending Payload to Backend:", payload);

//     // Persist to Backend and Reload to confirm
//     this.apiResponseS
//       .onPost("FinancialReports/update-order", payload)
//       .then((res) => {
//         if (res) {
//           console.log("💾 Update Order Success - Reloading Data...");
//           this.onLoadData();
//         } else {
//           console.error("⚠️ Update Order returned false/null");
//         }
//       })
//       .catch((err) => {
//         console.error("🔥 Update Order Failed:", err);
//       });
//   }

//   trackByFn(index: number, item: FinancialReport): string {
//     return item.id!; // Unique ID ensures DOM stability during reorder
//   }

//   // --- Send Public Link Logic ---

//   onOpenSendModal() {
//     const allReports = this.dataSignal();
//     const tableSelectionIds = this.selectedReports.map((r) => r.id);

//     // Prepare data for Modal
//     const reportsForModal = allReports.map((r) => ({
//       id: r.id!,
//       name: r.name!,
//       code: r.code!,
//       selected:
//         tableSelectionIds.length > 0 ? tableSelectionIds.includes(r.id!) : true,
//     }));

//     // Data payload
//     const data = {
//       year: this.filterForm.value.year,
//       month: this.filterForm.value.month,
//       reports: reportsForModal,
//     };

//     this.dialogHandlerS
//       .openDialog(
//         FinancialReportSendModal,
//         data,
//         "Enviar Reportes Financieros",
//         this.dialogHandlerS.sizeMd, // Medium size seems appropriate
//       )
//       .then((result) => {
//         if (result) {
//           // Success logic if needed (e.g. show toast, though modal handles it ideally)
//           // Or reload if state changed? Ideally send doesn't change state much.
//         }
//       });
//   }
// }
