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
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  ChargeTypeCatalogResponseDTO,
  CreateChargeTypeCatalogDTO,
  UpdateChargeTypeCatalogDTO,
} from "../../interfaces/charge-type-catalog.dto";

import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";

interface IChargeTypeForm {
  name: FormControl<string>;
  code: FormControl<string>;
  accountNumber: FormControl<string>;
  description: FormControl<string | null>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: "app-charge-type-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputCheckSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-type-form.html",
})
export class ChargeTypeForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id = "";
  customerId = "";
  isSystem = signal(false);
  submitting = signal(false);

  form = new FormGroup<IChargeTypeForm>({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    code: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    accountNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    description: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(300)],
    }),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;
    if (this.id) this.loadData();
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<ChargeTypeCatalogResponseDTO>(
      Endpoints.CobranzaCore.ChargeTypes.getById(this.id),
    );

    if (!res) return;

    this.isSystem.set(res.isSystem);
    this.form.patchValue(res);

    if (res.isSystem) {
      this.form.controls.code.disable({ emitEvent: false });
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CobranzaCore.ChargeTypes.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        const payload = {
          customerId: this.customerId,
          name: raw.name.trim(),
          code: raw.code.trim(),
          accountNumber: raw.accountNumber.trim(),
          description: raw.description?.trim() || null,
          isActive: raw.isActive,
        };

        return this.id
          ? ({ id: this.id, ...payload } as UpdateChargeTypeCatalogDTO)
          : (payload as CreateChargeTypeCatalogDTO);
      },
    });
  }
}


