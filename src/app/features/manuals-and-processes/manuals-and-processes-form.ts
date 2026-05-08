// import { Component, inject, OnInit, signal } from "@angular/core";
// import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
// import { CardModule } from "primeng/card";
// import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// import { InputTextModule } from "primeng/inputtext";
// import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
// import { CustomInputFile } from "src/app/core/components/inputs/web/custom-input-file-signal";
// import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
// import { ApiResponseService } from "src/app/core/services/api-response.service";
// import { AuthService } from "src/app/core/services/auth.service";
// import { CustomerIdService } from "src/app/core/services/customer-id.service";
// import { EDocumentType } from "src/app/features/legal/models/document-type.enum";
// @Component({
//   selector: "app-manuals-and-processes-form",
//   templateUrl: "./manuals-and-processes-form.html",
//   imports: [
//     ReactiveFormsModule,
//     CardModule,
//     InputTextModule,
//     CustomInputTextSignal,
//     CustomInputFile,
//     CustomButtonSave,
//   ],
// })
// export class ManualsAndProcessesForm implements OnInit {
//   private apiResponseS = inject(ApiResponseService);
//   private authS = inject(AuthService);
//   private config = inject(DynamicDialogConfig);
//   private formB = inject(FormBuilder);
//   private ref = inject(DynamicDialogRef);
//   private customerIdS = inject(CustomerIdService);
//   id: string = "";
//   file: File | null = null;
//   fileError: boolean = false;
//   submitting = signal(false);

//   // Tipado estricto implócito al usar nonNullable
//   form = this.formB.nonNullable.group({
//     id: [{ value: "", disabled: true }],
//     createdById: [this.authS.applicationUserId, Validators.required],
//     name: ["", [Validators.required, Validators.maxLength(100)]],
//     createAt: [new Date(), Validators.required],
//     documentType: [EDocumentType.ManualsAndProcesses, Validators.required],
//   });

//   ngOnInit() {
//     this.id = this.config.data.id;
//     if (this.id !== "") this.onLoadData();

//     // Sincronizar ID si existe
//     this.form.controls.id.setValue(this.id);
//   }

//   onLoadData() {
//     const urlApi = `customdocument/${this.id}`;
//     this.apiResponseS.onGetItem(urlApi).then((result: any) => {
//       // patchValue es seguro con Typed Forms, pero validamos tipos
//       this.form.patchValue(result);

//       // Corrección de fechas si vienen como string
//       if (result.createAt) {
//         this.form.controls.createAt.setValue(new Date(result.createAt));
//       }
//     });
//   }
//   onSubmit() {
//     if (!this.apiResponseS.validateForm(this.form)) return;

//     // Obtener valores tipados (getRawValue incluye disabled inputs)
//     const rawValue = this.form.getRawValue();
//     const model = this.onCreateFormData(rawValue);

//     this.submitting.set(true);

//     if (this.id === "") {
//       this.apiResponseS
//         .onPost(`customdocument`, model)
//         .then((result: boolean) => {
//           result ? this.ref.close(true) : this.submitting.set(false);
//         });
//     } else {
//       this.apiResponseS
//         .onPut(`customdocument/${this.id}`, model)
//         .then((result: boolean) => {
//           result ? this.ref.close(true) : this.submitting.set(false);
//         });
//     }
//   }

//   change(file: File) {
//     this.file = file; // Asigna el archivo correctamente
//   }

//   // Se tipa 'form' parcialmente ya que viene de getRawValue() que infiere tipos
//   onCreateFormData(
//     formValues: ReturnType<typeof this.form.getRawValue>,
//   ): FormData {
//     const formData = new FormData();
//     formData.append("customerId", this.customerIdS.customerId().toString());
//     formData.append("name", formValues.name);
//     formData.append("createdById", this.authS.applicationUserId);
//     formData.append("documentType", formValues.documentType.toString());
//     formData.append("createAt", formValues.createAt.toISOString());

//     if (this.file) {
//       formData.append("document", this.file);
//     }

//     return formData;
//   }
// }
