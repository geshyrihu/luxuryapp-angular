import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { IRequestEmployeeRegisterBasicInfo } from "../dtos/request-employee-register-basic-info.dto";
import { IRequestEmployeeRegisterUpdateStatus } from "../dtos/request-employee-register-update-status.dto";
@Component({
  selector: "app-solicitud-alta-status-form",
  templateUrl: "./solicitud-alta-status-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
  ],
})
export class SolicitudAltaStatusForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formBuilder = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private enumSelectS = inject(EnumSelectService);
  id: string = "";
  submitting = signal(false);

  statusOptions = signal<ISelectItem[]>([]);

  form = this.formBuilder.nonNullable.group({
    id: [""],
    folio: [{ value: "", disabled: true }],
    employeeName: [{ value: "", disabled: true }],
    status: [null as number | null, Validators.required],
    confirmationFinish: [false],
  });

  async ngOnInit() {
    this.id = this.config.data.id;
    this.form.patchValue({ employeeName: this.config.data.employeeName });
    this.statusOptions.set(await firstValueFrom(this.enumSelectS.status()));

    if (this.id) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<IRequestEmployeeRegisterBasicInfo>(
        `RequestEmployeeRegister/${this.id}/basic-info`,
      )
      .then((result) => {
        // Exclude folio from direct patch because types differ (number vs string)
        const { folio, ...rest } = result;
        this.form.patchValue(rest as any);
        this.form.patchValue({
          folio: `ALT${folio.toString().padStart(5, "0")}`,
        });
      });
  }

  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const formData = this.form.getRawValue();

    const dto: IRequestEmployeeRegisterUpdateStatus = {
      status: formData.status!,
      confirmationFinish: formData.confirmationFinish,
    };

    this.apiResponseS
      .onPut(`RequestEmployeeRegister/${this.id}/status`, dto)
      .then((result) => {
        this.ref.close(true);
      })
      .finally(() => this.submitting.set(false));
  }
}
