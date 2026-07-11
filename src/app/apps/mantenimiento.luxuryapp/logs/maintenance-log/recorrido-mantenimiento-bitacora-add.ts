import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

interface IRecorridoMantenimientoBitacoraAdd {
  machineryId: FormControl<number | null>;
  machinery: FormControl<string>;
  descripcion: FormControl<string>;
  emergencia: FormControl<boolean>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-recorrido-mantenimiento-bitacora-add",
  templateUrl: "./recorrido-mantenimiento-bitacora-add.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputTextAreaSignal,
    CustomInputTextSignal,
  ],
})
export class RecorridoMantenimientoBitacoraAdd implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  machinery = signal<any>(null);

  form: FormGroup<IRecorridoMantenimientoBitacoraAdd> =
    new FormGroup<IRecorridoMantenimientoBitacoraAdd>({
      machineryId: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      machinery: new FormControl("", {
        nonNullable: true,
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

  ngOnInit(): void {
    const machineryId = this.config.data.machineryId;
    this.onGetMachinerySelectItem(machineryId);
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    this.apiResponseS
      .onPost(`BitacoraMantenimiento`, this.form.getRawValue())
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }

  onGetMachinerySelectItem(value: number) {
    const urlApi = `Machineries/GetMachinerySelectItem/${value}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.machinery.set(result);
      this.form.patchValue({
        machineryId: result.value,
        machinery: result.label,
      });
    });
  }
}
