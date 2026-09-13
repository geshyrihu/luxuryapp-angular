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
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EmployeeBeneficiaryDTO } from "./interfaces/employee-beneficiary.interfaces";

@Component({
  selector: "app-employee-beneficiary-form",
  templateUrl: "./employee-beneficiary-form.html",

  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    InputMask,
    WebButtonLabelSave,
  ],
})
export class EmployeeBeneficiaryFormComponent implements OnInit {
  fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);

  form: FormGroup;
  id: string = this.config.data?.id || "";
  submitting = signal(false);

  cbEmployees = signal<SelectItemDto[]>([]);
  cbRelations = signal<SelectItemDto[]>([]);

  get f() {
    return this.form.controls as any;
  }

  constructor() {
    this.form = this.fb.group({
      id: [this.id],
      employeeId: [null, Validators.required],
      fullName: ["", [Validators.required, Validators.maxLength(50)]],
      phoneNumber: ["", [Validators.required, Validators.maxLength(16)]],
      relation: [null],
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
      .onGetItem<EmployeeBeneficiaryDTO>(
        Endpoints.HR.EmployeeBeneficiary.getById(this.id),
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
      endpoint: Endpoints.HR.EmployeeBeneficiary.upsert,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}