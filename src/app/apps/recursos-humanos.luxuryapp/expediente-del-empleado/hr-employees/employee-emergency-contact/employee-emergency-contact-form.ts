// import {
//   ChangeDetectionStrategy,
//   Component,
//   inject,
//   OnInit,
//   signal,
// } from "@angular/core";
// import {
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from "@angular/forms";
// import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
// import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
// import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
// import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
// import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
// import { firstValueFrom } from "rxjs";
// import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
// import { FormHelper } from "src/app/core/helpers/form-helper";
// import { ApiResponseService } from "src/app/core/http/services/api-response.service";
// import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
// import { EnumSelectService } from "src/app/core/services/enum-select.service";
// @Component({
//   selector: "app-employee-emergency-contact-form",
//   templateUrl: "./employee-emergency-contact-form.html",
//   changeDetection: ChangeDetectionStrategy.Eager,
//   imports: [
//     ReactiveFormsModule,
//     CustomInputTextSignal,
//     InputMask,
//     CustomInputSelectSignal,
//     WebButtonLabelSave,
//   ],
// })
// export class EmployeeEmergencyContactForm implements OnInit {
//   apiResponseS = inject(ApiResponseService);
//   config = inject(DynamicDialogConfig);
//   ref = inject(DynamicDialogRef);
//   enumSelectS = inject(EnumSelectService);
//   id: string = "";
//   submitting = signal(false);
//   cb_relacion = signal<SelectItemDto[]>([]);

//   // Definición estricta del formulario
//   form = new FormGroup({
//     id: new FormControl<string>({ value: "", disabled: true }),
//     employeeId: new FormControl<string>(this.config.data.employeeId),
//     nameContact: new FormControl<string>("", Validators.required),
//     phoneNumber: new FormControl<string>("", Validators.required),
//     relation: new FormControl<any>(null, Validators.required),
//     contacOfBeneficiary: new FormControl<any>(
//       this.config.data.contacOfBeneficiary,
//     ),
//   });

//   async ngOnInit() {
//     this.cb_relacion.set(
//       await firstValueFrom(this.enumSelectS.relationEmployee()),
//     );

//     this.id = this.config.data.id || "";

//     if (this.id !== "") this.onLoadData();
//   }

//   onLoadData() {
//     this.apiResponseS
//       .onGetItem(Endpoints.EmployeeEmergencyContact.getById(this.id))
//       .then((result: any) => {
//         this.form.patchValue(result);
//       });
//   }

//   onSubmit() {
//     FormHelper.submitCrud({
//       form: this.form,
//       api: this.apiResponseS,
//       endpoint: Endpoints.EmployeeEmergencyContact.base,
//       id: this.id,
//       ref: this.ref,
//       submitting: this.submitting,
//     });
//   }
// }
