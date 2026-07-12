import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EmployeeBankDataDTO } from './interfaces/employee-bank-data.interfaces';

@Component({
  selector: "app-employee-bank-data-form",
  templateUrl: "./employee-bank-data-form.html",

  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    InputMask,
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

  cbEmployees = signal<SelectItemDto[]>([]);
  cbBanks = signal<SelectItemDto[]>([]);
  cbRelations = signal<SelectItemDto[]>([]);

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
      .onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.employeesByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((res) => {
        if (res) this.cbEmployees.set(res);
      });

    // Cargar Bancos
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.bank)
      .then((res) => {
        if (res) this.cbBanks.set(res);
      });

    // Cargar Relaciones (Enum)
    this.apiResponseS
      .onGetEnumSelectItem<SelectItemDto[]>(
        Endpoints.EnumSelectItems.relationEmployee,
      )
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
