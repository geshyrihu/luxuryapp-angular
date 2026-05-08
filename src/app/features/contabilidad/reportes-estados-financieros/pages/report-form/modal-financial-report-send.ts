// import { CommonModule } from "@angular/common";
// import { Component, inject, OnInit, signal } from "@angular/core";
// import {
//   FormArray,
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
//   Validators,
// } from "@angular/forms";
// import { ButtonModule } from "primeng/button";
// import { CheckboxModule } from "primeng/checkbox";
// import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
// import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { CustomerIdService } from "src/app/core/services/customer-id.service";

// interface ISendReportForm {
//   year: FormControl<number>;
//   month: FormControl<number>;
// }

// @Component({
//   selector: "app-financial-report-send-modal",

//   imports: [
//     ReactiveFormsModule,
//     FormsModule,
//     CheckboxModule,
//     CommonModule,
//     //     CustomInputSelectSignal,
//     CustomButton,
//   ],
//   templateUrl: "./financial-report-send-modal.html",
// })
// export class FinancialReportSendModal implements OnInit {
//   apiResponseS = inject(ApiResponseService);
//   customerIdS = inject(CustomerIdService);
//   config = inject(DynamicDialogConfig);
//   ref = inject(DynamicDialogRef);
//   fb = inject(FormBuilder);

//   loading = signal(false);

//   // Data State
//   reports: any[] = []; // List of reports with selection state
//   reportsFormArray = new FormArray<FormControl<boolean>>([]);

//   // Form for Method/Year
//   form: FormGroup<ISendReportForm> = this.fb.group({
//     year: new FormControl(new Date().getFullYear(), {
//       nonNullable: true,
//       validators: [Validators.required],
//     }),
//     month: new FormControl(new Date().getMonth() + 1, {
//       nonNullable: true,
//       validators: [Validators.required],
//     }),
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

//   ngOnInit(): void {
//     if (this.config.data) {
//       // Initialize with provided data
//       if (this.config.data.year)
//         this.form.controls.year.setValue(this.config.data.year);
//       if (this.config.data.month)
//         this.form.controls.month.setValue(this.config.data.month);

//       if (this.config.data.reports) {
//         this.reports = this.config.data.reports;
//         this.reportsFormArray.clear();
//         this.reports.forEach((r: any) => {
//           this.reportsFormArray.push(
//             new FormControl<boolean>(r.selected ?? true, { nonNullable: true }),
//           );
//         });
//       }
//     }
//   }

//   onSubmit() {
//     if (this.form.invalid) return;

//     // Filter selected
//     const selectedIds = this.reports
//       .filter((r, index) => this.reportsFormArray.at(index).value)
//       .map((r) => r.id);
//     if (selectedIds.length === 0) {
//       // Warning? The API might handle it.
//       return;
//     }

//     this.loading.set(true);
//     const customerId: string = this.customerIdS.customerId();
//     const { year, month } = this.form.getRawValue();

//     this.apiResponseS
//       .onPost(
//         `FinancialReport/SendLink/${customerId}/${year}/${month}`,
//         selectedIds,
//       )
//       .then((result) => {
//         this.loading.set(false);
//         if (result) {
//           this.ref.close(true);
//         }
//       })
//       .catch(() => {
//         this.loading.set(false);
//       });
//   }

//   onCancel() {
//     this.ref.close(false);
//   }
// }
