// import { Component, inject, OnInit, signal } from "@angular/core";
// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from "@angular/forms";
// import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { Endpoints } from "src/app/core/constants/endpoints";
// import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
// import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
// import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
// import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
// import { ApiResponseService } from "src/app/core/services/api-response.service";

// interface IPropertyForm {
//   department: FormControl<string>;
//   tower: FormControl<string>;
//   floor: FormControl<string | null>;
//   unitNumber: FormControl<string | null>;
//   accountNumber: FormControl<string | null>;
//   areaM2: FormControl<number | null>;
//   indivisoPercentage: FormControl<number | null>;
//   parkingSlots: FormControl<number | null>;
//   storageUnit: FormControl<string | null>;
// }

// @Component({
//   selector: "app-property-form",
//   imports: [
//     ReactiveFormsModule,
//     CustomInputTextSignal,
//     CustomInputMaskSignal,
//     CustomInputNumberSignal,
//     CustomButtonSave,
//   ],
//   templateUrl: "./property-form.html",
// })
// export default class PropertyForm implements OnInit {
//   private fb = inject(FormBuilder);
//   private apiResponseS = inject(ApiResponseService);
//   private ref = inject(DynamicDialogRef);
//   private config = inject(DynamicDialogConfig);

//   id = "";
//   customerId = "";
//   submitting = signal(false);

//   form: FormGroup<IPropertyForm>;

//   ngOnInit() {
//     this.id = this.config.data.id ?? "";
//     this.customerId = this.config.data.customerId ?? "";

//     this.form = this.fb.group({
//       department: new FormControl("", {
//         nonNullable: true,
//         validators: [Validators.required],
//       }),
//       tower: new FormControl("", {
//         nonNullable: true,
//         validators: [Validators.required],
//       }),
//       floor: new FormControl<string | null>(null),
//       unitNumber: new FormControl<string | null>(null),
//       accountNumber: new FormControl<string | null>(null, [
//         Validators.maxLength(9),
//       ]),
//       areaM2: new FormControl<number | null>(null),
//       indivisoPercentage: new FormControl<number | null>(null),
//       parkingSlots: new FormControl<number | null>(null),
//       storageUnit: new FormControl<string | null>(null),
//     });

//     if (this.id) this.onLoadData();
//   }

//   async onLoadData() {
//     const res = await this.apiResponseS.onGetItem<any>(
//       Endpoints.Properties.getById(this.id),
//     );
//     if (res) this.form.patchValue(res);
//   }

//   async onSubmit() {
//     if (!this.apiResponseS.validateForm(this.form)) return;
//     this.submitting.set(true);
//     try {
//       const payload = { ...this.form.getRawValue(), customerId: this.customerId };
//       const ok = this.id
//         ? await this.apiResponseS.onPut(
//             Endpoints.Properties.update(this.id),
//             payload,
//           )
//         : await this.apiResponseS.onPost(Endpoints.Properties.create, payload);
//       if (ok) this.ref.close(true);
//     } finally {
//       this.submitting.set(false);
//     }
//   }
// }
