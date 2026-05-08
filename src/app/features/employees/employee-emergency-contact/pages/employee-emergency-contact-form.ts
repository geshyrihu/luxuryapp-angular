import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-employee-emergency-contact-form",
  templateUrl: "./employee-emergency-contact-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class EmployeeEmergencyContactForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  id: string = "";
  submitting = signal(false);
  cb_relacion = signal<ISelectItem[]>([]);

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    employeeId: new FormControl<string>(this.config.data.employeeId),
    nameContact: new FormControl<string>("", Validators.required),
    phoneNumber: new FormControl<string>("", Validators.required),
    relation: new FormControl<any>(null, Validators.required),
    contacOfBeneficiary: new FormControl<any>(
      this.config.data.contacOfBeneficiary,
    ),
  });

  async ngOnInit() {
    this.cb_relacion.set(
      await firstValueFrom(this.enumSelectS.relationEmployee()),
    );

    this.id = this.config.data.id || "";

    if (this.id !== "") this.onLoadData();
  }

  onLoadData() {
    const urlApi = `EmployeeEmergencyContact/${this.id}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    if (this.id === "") {
      this.apiResponseS
        .onPost(`EmployeeEmergencyContact`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`EmployeeEmergencyContact/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
