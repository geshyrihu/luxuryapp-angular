import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";

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
    ReactiveFormsModule,
    WebButtonLabelSave,
    InputAutocomplete,
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
  maquinarias = signal<SelectItemDto[]>([]);

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
      Endpoints.SelectItems.listadoInstalaciones(this.customerIdS.customerId()),
    );
    this.maquinarias.set(result as SelectItemDto[]);
  }

  saveMaquinariaId = (item: SelectItemDto) => {
    this.form.patchValue({
      machineryId: String(item?.value),
      machinery: item?.label,
    });
  };

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "bitacora-mantenimiento",
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
