import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EmployeeBankDataDTO } from "../models/employee-bank-data.interfaces";

@Component({
  selector: "app-employee-bank-data-form",
  templateUrl: "./employee-bank-data-form.html",

  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputMaskSignal,
    WebButtonLabelSave,
  ],
})
export class EmployeeBankDataFormComponent implements OnInit {
  fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);

  form: FormGroup;
  id: string = this.config.data?.id || "";
  submitting = signal(false);

  cbEmployees = signal<ISelectItem[]>([]);
  cbBanks = signal<ISelectItem[]>([]);
  cbRelations = signal<ISelectItem[]>([]);

  get f() {
    return this.form.controls as any;
  }

  constructor() {
    this.form = this.fb.group({
      id: [this.id],
      employeeId: [null, Validators.required],
      bankId: [null, Validators.required],
      bankAccount: ["", [Validators.required]],
      bankKey: [
        "",
        [
          Validators.required,
          Validators.minLength(18),
          Validators.maxLength(18),
        ],
      ],
      nameContact: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      relacion: [null],
    });
  }

  ngOnInit(): void {
    this.onLoadCombos();
    if (this.id) {
      this.onLoadData();
    }
  }

  onLoadCombos(): void {
    // Cargar Empleados
    this.apiResponseS
      .onGetSelectItem<
        ISelectItem[]
      >(Endpoints.SelectItems.employeesByCustomer(this.customerIdS.customerId()))
      .then((res) => {
        if (res) this.cbEmployees.set(res);
      });

    // Cargar Bancos
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.bank)
      .then((res) => {
        if (res) this.cbBanks.set(res);
      });

    // Cargar Relaciones (Enum)
    this.apiResponseS
      .onGetEnumSelectItem<
        ISelectItem[]
      >(Endpoints.EnumSelectItems.relationEmployee)
      .then((res) => {
        if (res) this.cbRelations.set(res);
      });
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetItem<EmployeeBankDataDTO>(
        Endpoints.HR.EmployeeBankData.getById(this.id),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue(result);
        }
      });
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.HR.EmployeeBankData.upsert,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
