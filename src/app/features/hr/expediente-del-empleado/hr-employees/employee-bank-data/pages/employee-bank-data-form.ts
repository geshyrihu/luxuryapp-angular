import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputMaskSignal } from "src/app/core/components/web/inputs/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { EmployeeInternalService } from "../../employee-internal/services/employee-internal.service";
import { IEmployeeBankDataForm } from "../models/employee-bank-data.interface";

@Component({
  selector: "app-employee-bank-data-form",
  templateUrl: "./employee-bank-data-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputMaskSignal,
    CustomButtonSave,
  ],
})
export class EmployeeBankDataForm implements OnInit {
  private readonly employeeInternalS = inject(EmployeeInternalService);
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly enumSelectS = inject(EnumSelectService);

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id = this.config.data?.id || "";
  submitting = signal(false);
  cbBanks = signal<ISelectItem[]>([]);
  cbRelations = signal<ISelectItem[]>([]);

  form = new FormGroup({
    id: new FormControl<string>(this.id, { nonNullable: true }),
    employeeId: new FormControl<string>(this.config.data.employeeId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bankId: new FormControl<string | null>(null, Validators.required),
    bankAccount: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bankKey: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(18), Validators.maxLength(18)],
    }),
    nameContact: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    relacion: new FormControl<number | null>(null),
  });

  get f() {
    return this.form.controls;
  }

  async ngOnInit() {
    await this.onLoadCombos();

    if (this.id) {
      this.onLoadData();
    }
  }

  async onLoadCombos() {
    const [banks, relations] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.bank),
      firstValueFrom(this.enumSelectS.relationEmployee()),
    ]);

    this.cbBanks.set(banks ?? []);
    this.cbRelations.set(relations ?? []);
  }

  onLoadData() {
    this.employeeInternalS.getBankDataById(this.id).then((result) => {
      if (result) {
        this.form.patchValue(result);
      }
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form as FormGroup,
      api: this.apiResponseS,
      endpoint: Endpoints.EmployeeBankData.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value: IEmployeeBankDataForm) => ({
        ...value,
        employeeId: this.config.data.employeeId,
      }),
    });
  }
}

