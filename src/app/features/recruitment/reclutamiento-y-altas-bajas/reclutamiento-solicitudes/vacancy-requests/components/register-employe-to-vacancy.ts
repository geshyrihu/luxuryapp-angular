import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service"; // Assuming this service exists
@Component({
  selector: "app-register-employe-to-vacancy",
  templateUrl: "./register-employe-to-vacancy.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    WebButtonLabelSave,
  ],
})
export class RegisterEmployeToVacancy {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private dialogHandlerS = inject(DialogHandlerService);
  id: string = "";
  submitting = signal(false);

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    fistrName: ["", [Validators.required, Validators.maxLength(100)]],
    lastName: ["", [Validators.required, Validators.maxLength(15)]],
    name: ["", [Validators.required, Validators.maxLength(15)]],
    birth: [null as Date | null],
    nss: [""],

    // Campos aóadidos basados en HTML
    infonavitCredit: [""],
    infonavitCreditNumber: [""],
    discount: [""],
    rfc: [""],
    rfcZipCode: [""],
    curp: [""],
    address: [""],
    neighborhood: [""],
    municipality: [""],
    zipCode: [""],
    maritalStatus: [""],
    state: [""],
  });

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);
    // Logic to save would go here
  }
}
