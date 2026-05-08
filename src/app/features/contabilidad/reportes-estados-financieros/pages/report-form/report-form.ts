// import { Component, inject, OnInit, signal } from "@angular/core";
// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from "@angular/forms";
// import { CheckboxModule } from "primeng/checkbox";
// import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
// import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
// import { ApiResponseService } from "src/app/core/services/api-response.service";

// interface IFinancialReportForm {
//   id: FormControl<string | null>;
//   code: FormControl<string>;
//   name: FormControl<string>;
//   description: FormControl<string>;
//   sortOrder: FormControl<number | null>;
//   showZeros: FormControl<boolean>;
// }

// @Component({
//   selector: "app-report-form",
//   templateUrl: "./report-form.html",
//   imports: [
//     ReactiveFormsModule,
//     CustomInputTextSignal,
//     CustomButtonSave,
//     CheckboxModule,
//   ],
// })
// export class ReportForm implements OnInit {
//   apiResponseS = inject(ApiResponseService);
//   formB = inject(FormBuilder);
//   config = inject(DynamicDialogConfig);
//   ref = inject(DynamicDialogRef);

//   id: string = "";
//   submitting = signal(false);
//   fullReportData: any = null;

//   form: FormGroup<IFinancialReportForm> = this.formB.group({
//     id: new FormControl({ value: "", disabled: true }),
//     code: new FormControl("", {
//       nonNullable: true,
//       validators: [Validators.required, Validators.maxLength(20)],
//     }),
//     name: new FormControl("", {
//       nonNullable: true,
//       validators: [
//         Validators.required,
//         Validators.minLength(3),
//         Validators.maxLength(100),
//       ],
//     }),
//     description: new FormControl("", {
//       nonNullable: true,
//       validators: [Validators.maxLength(500)],
//     }),
//     sortOrder: new FormControl(0, { nonNullable: false }),
//     showZeros: new FormControl(true, { nonNullable: true }),
//   });

//   ngOnInit(): void {
//     if (this.config.data?.id) {
//       this.id = this.config.data.id;
//       this.onLoadData();
//     }
//   }

//   onLoadData() {
//     const urlApi = `FinancialReports/${this.id}`;
//     this.apiResponseS.onGetItem(urlApi).then((result: any) => {
//       this.fullReportData = result;
//       this.form.patchValue(result);
//     });
//   }

//   onSubmit() {
//     if (!this.apiResponseS.validateForm(this.form)) return;
//     this.submitting.set(true);

//     const payload = this.form.getRawValue();

//     if (this.id === "") {
//       this.apiResponseS
//         .onPost(`FinancialReports`, { ...payload, rows: [] })
//         .then((result: boolean) => {
//           result ? this.ref.close(true) : this.submitting.set(false);
//         });
//     } else {
//       const updatePayload = {
//         ...payload,
//         sortOrder: payload.sortOrder ?? 0,
//         showZeros: payload.showZeros,
//         rows: null, // Send null so backend preserves existing rows
//       };

//       this.apiResponseS
//         .onPut(`FinancialReports/${this.id}`, updatePayload)
//         .then((result: boolean) => {
//           result ? this.ref.close(true) : this.submitting.set(false);
//         });
//     }
//   }
// }









