import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputText } from "@ui/inputs/adaptive/input-text/input-text";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IBankAddOrEditDTO } from "./bank.dto";

interface IBankForm {
  id: FormControl<string | null>;
  code: FormControl<string>;
  shortName: FormControl<string>;
  largeName: FormControl<string>;
}

@Component({
  selector: "app-bank-form",
  templateUrl: "./bank-form.html",
  imports: [ReactiveFormsModule, InputText, WebButtonLabelSave],
})
export class BankForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  form: FormGroup<IBankForm> = this.formB.group({
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
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem<IBankAddOrEditDTO>(Endpoints.Banks.getById(this.id))
      .then((result) => {
        if (result) this.form.patchValue(result);
      });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Banks.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
