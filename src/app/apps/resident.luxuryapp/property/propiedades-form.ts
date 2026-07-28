import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface IPropiedadesForm {
  id: FormControl<string | null>;
  department: FormControl<string>;
  customerId: FormControl<string | null>;
  tower: FormControl<string>;
  floor: FormControl<string | null>;
  unitNumber: FormControl<string | null>;
  areaM2: FormControl<number | null>;
  indivisoPercentage: FormControl<number | null>;
  parkingSlots: FormControl<number | null>;
  storageUnit: FormControl<string | null>;
  accountNumber: FormControl<string | null>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-propiedades-form",
  templateUrl: "./propiedades-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class PropiedadesForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);
  cuentasCoi = signal<SelectItemDto[]>([]);

  id: string = "";
  isDelinquent = false;
  delinquentSince: string | null = null;

  form: FormGroup<IPropiedadesForm>;

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onLoadCuentasCoi();
    this.form = this.formB.group({
      id: new FormControl({ value: this.id, disabled: true }),
      department: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      customerId: new FormControl<string | null>(
        this.customerIdS.customerId(),
        { validators: [Validators.required] },
      ),
      tower: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      floor: new FormControl(""),
      unitNumber: new FormControl(""),
      areaM2: new FormControl<number | null>(null),
      indivisoPercentage: new FormControl<number | null>(null),
      parkingSlots: new FormControl<number | null>(null),
      storageUnit: new FormControl(""),
      accountNumber: new FormControl<string | null>(null, {
        validators: [Validators.pattern(/^$|^(\d{9}|\d{12})$/)],
      }),
      applicationUserId: new FormControl<string | null>(
        this.authS.applicationUserId,
      ),
    });

    if (this.id) {
      this.onLoadData();
    }
  }

  submit() {
    this.form.controls.accountNumber.setValue(
      this.normalizeAccountNumber(this.form.controls.accountNumber.value),
    );

    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Properties.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Properties.getById(this.id))
      .then((result: any) => {
        if (!result) return;
        this.isDelinquent = result.isDelinquent ?? false;
        this.delinquentSince = result.delinquentSince ?? null;
        this.form.patchValue({
          ...result,
          accountNumber: this.normalizeAccountNumber(result.accountNumber),
        });
      });
  }

  private onLoadCuentasCoi() {
    this.cuentasCoi.set([]);
  }

  private normalizeAccountNumber(accountNumber: string | null | undefined) {
    if (!accountNumber) {
      return null;
    }

    const digits = accountNumber.replace(/\D/g, "");
    return digits.length > 0 ? digits : null;
  }
}
