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
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputText } from "@ui/inputs/adaptive/input-text/input-text";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { BankFormGroup } from "./interfaces/bank-form.interface";
import { BankAddOrEditDto } from "./interfaces/banks-add-or-edit.dto";

@Component({
  selector: "app-bank-form",
  templateUrl: "./bank-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, WebButtonLabelSave],
})
export class BankForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  /**
   * Validador de cross-field que verifica que Code y ShortName no sean idénticos.
   * Esto previene que se registren bancos con datos redundantes.
   */
  bankUniquenessValidator = (group: FormGroup): ValidationErrors | null => {
    const code = group.get('code')?.value;
    const shortName = group.get('shortName')?.value;

    if (code && shortName && code.toLowerCase() === shortName.toLowerCase().substring(0, 3)) {
      return { bankDuplicate: true };
    }

    return null;
  };

  form: FormGroup<BankFormGroup> = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
    code: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(3)],
    }),
    shortName: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
      ],
    }),
    largeName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
  }, { validators: this.bankUniquenessValidator });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem<BankAddOrEditDto>(Endpoints.Catalogs.Banks.getById(this.id))
      .then((result) => {
        if (result) this.form.patchValue(result);
      });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Catalogs.Banks.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
