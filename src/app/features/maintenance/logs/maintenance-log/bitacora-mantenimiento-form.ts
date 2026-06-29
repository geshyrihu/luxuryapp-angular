import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IBitacoraMantenimientoForm {
  customerId: FormControl<string>;
  machineryId: FormControl<string>;
  machinery: FormControl<string | null>;
  descripcion: FormControl<string>;
  emergencia: FormControl<boolean>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-bitacora-mantenimiento-form",
  templateUrl: "./bitacora-mantenimiento-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputAutoComplete,
    CustomInputCheckSignal,
    CustomInputTextAreaSignal,
  ],
})
export class BitacoraMantenimientoForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  customToastService = inject(CustomToastService);

  submitting = signal(false);
  maquinarias = signal<ISelectItem[]>([]);

  form: FormGroup<IBitacoraMantenimientoForm> = this.formB.group({
    customerId: new FormControl(this.customerIdS.customerId(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    machineryId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    machinery: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    descripcion: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    emergencia: new FormControl(false, { nonNullable: true }),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
    }),
  });

  async ngOnInit(): Promise<void> {
    await this.onLoadMachinery();
  }

  async onLoadMachinery(): Promise<void> {
    const result: any = await this.apiResponseS.onGetSelectItem(
      `ListadoInstalaciones/${this.customerIdS.customerId()}`,
    );
    this.maquinarias.set(result as ISelectItem[]);
  }

  saveMaquinariaId = (item: ISelectItem) => {
    this.form.patchValue({
      machineryId: String(item?.value),
      machinery: item?.label,
    });
  };

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "BitacoraMantenimiento",
      id: "",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const { machinery, ...rest } = this.form.getRawValue();
        return rest;
      },
    });
  }
}
