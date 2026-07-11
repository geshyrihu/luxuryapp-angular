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
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CfdiUseAddOrEditDto } from "./interfaces/cfdi-use-add-or-edit.dto";
import { CfdiUseFormGroup } from "./interfaces/cfdi-use-form.interface";

@Component({
  selector: "app-cfdi-use-form",
  templateUrl: "./cfdi-use-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CustomInputTextSignal, WebButtonLabelSave],
})
export class CfdiUseForm implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";
  form: FormGroup<CfdiUseFormGroup>;

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.form = this.formB.group({
      id: new FormControl({ value: this.id, disabled: true }),
      codigo: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      descripcion: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      employeeId: new FormControl<string | null>(null),
    });
    if (this.id) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<CfdiUseAddOrEditDto>(Endpoints.CfdiUses.getById(this.id))
      .then((result) => {
        if (result) this.form.patchValue(result as any);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CfdiUses.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
