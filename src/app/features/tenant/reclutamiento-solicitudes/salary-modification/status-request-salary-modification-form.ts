import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
@Component({
  selector: "app-status-request-salary-modification-form",
  templateUrl: "./status-request-salary-modification-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
  ],
})
export class StatusRequestSalaryModificationForm implements OnInit {
  private formB = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private enumSelectS = inject(EnumSelectService);
  submitting = signal(false);

  id: string = "";

  cb_applicationRole = signal<ISelectItem[]>([]);
  cb_si_no = signal<ISelectItem[]>([]);

  form = this.formB.nonNullable.group({
    id: [{ value: this.config.data.id, disabled: true }],
    employeeId: ["", Validators.required],
    workPositionId: ["", Validators.required],
    requestDate: [null as Date | null, Validators.required],
    soport: [""],
    applicationRoleCurrentId: [0, Validators.required],
    applicationRoleNewId: [0, Validators.required],
    currentSalary: [0, Validators.required],
    finalSalary: [0, Validators.required],
    executionDate: [null as Date | null, Validators.required],
    folio: ["", Validators.required],
    retroactive: [false, Validators.required],
    status: [null as number | null, Validators.required],
    applicationUserId: ["", Validators.required],
    confirmationFinish: [false, Validators.required],
  });

  async ngOnInit() {
    this.cb_si_no.set(await firstValueFrom(this.enumSelectS.boolYesNo()));
    this.onApplicationRoleSelectItem();
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    const urlApi = `RequestSalaryModification/GetById/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "RequestSalaryModification",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
  onApplicationRoleSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`application-roles-to-administrator`)
      .then((response: any) => {
        this.cb_applicationRole.set(response);
      });
  }
}
