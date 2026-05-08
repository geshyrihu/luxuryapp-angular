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
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ICfdiUseAddOrEditDTO, ICfdiUseDTO } from "../models/cfdi-use.dto";

interface ICfdiUseForm {
  id: FormControl<string | null>;
  codigo: FormControl<string>;
  descripcion: FormControl<string>;
  employeeId: FormControl<string | null>;
}

@Component({
  selector: "app-cfdi-use-form",
  templateUrl: "./cfdi-use-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class CfdiUseForm implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";
  form: FormGroup<ICfdiUseForm>;

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
    this.apiResponseS.onGetItem<ICfdiUseAddOrEditDTO>(Endpoints.CfdiUses.getById(this.id)).then((result) => {
      if(result) this.form.patchValue(result as any);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    if (!this.id) {
      this.apiResponseS
        .onPost<ICfdiUseDTO>(Endpoints.CfdiUses.create, this.form.value)
        .then((result) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut<ICfdiUseDTO>(Endpoints.CfdiUses.update(this.id), this.form.value)
        .then((result) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}









