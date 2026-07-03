import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface ILevelThreeAccountForm {
  id: FormControl<string | null>;
  numeroCuenta: FormControl<string>;
  descripcion: FormControl<string>;
}

@Component({
  selector: "app-level-three-account-form",
  templateUrl: "./level-three-account-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    WebButtonLabelSave,
    CardModule,
  ],
})
export class LevelThreeAccountForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id: string = "";

  form: FormGroup<ILevelThreeAccountForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    numeroCuenta: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    descripcion: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();

    // Sync Id
    this.form.controls.id.setValue(this.id);
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.AccountingAccounts.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AccountingAccounts.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    };
    FormHelper.submitCrud(options);
  }
}
