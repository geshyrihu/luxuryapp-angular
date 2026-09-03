import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { firstValueFrom } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EmployeeInternalService } from "src/app/apps/recursos-humanos.luxuryapp/employee/employee-internal.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { IEmployeeBeneficiaryForm } from "./interfaces/employee-beneficiary.interface";

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
export class EmployeeBeneficiaryForm implements OnInit {
  private readonly employeeInternalS = inject(EmployeeInternalService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly enumSelectS = inject(EnumSelectService);

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id = this.config.data?.id || "";
  submitting = signal(false);
  
  cbRelations = signal<SelectItemDto[]>([]);

  form = new FormGroup({
    id: new FormControl<string>(this.id, { nonNullable: true }),
    employeeId: new FormControl<string>(this.config.data.employeeId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fullName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    relation: new FormControl<number | null>(null),
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
    const relations = await firstValueFrom(this.enumSelectS.relationEmployee());
    this.cbRelations.set(relations ?? []);
  }

  onLoadData() {
    this.employeeInternalS.getBeneficiaryById(this.id).then((result) => {
      if (result) {
        this.form.patchValue(result);
      }
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form as FormGroup,
      api: this.apiResponseS,
      endpoint: Endpoints.EmployeeBeneficiary.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value: IEmployeeBeneficiaryForm) => ({
        ...value,
        employeeId: this.config.data.employeeId,
      }),
    });
  }
}


