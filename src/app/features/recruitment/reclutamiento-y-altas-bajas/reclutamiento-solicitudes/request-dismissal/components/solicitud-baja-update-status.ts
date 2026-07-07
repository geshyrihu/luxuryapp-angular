import { Component, OnInit, inject, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
// Assuming EStatus enum is available globally or imported
// For this example, I'll define it here based on the C# enum.
export const ESTATUS_BAJA = [
  { label: "Pendiente", value: 0 },
  { label: "Concluido", value: 1 },
  { label: "No Autorizado", value: 2 },
  { label: "Proceso", value: 3 },
  { label: "Cancelado", value: 4 },
];

interface ISolicitudBajaUpdateStatusForm {
  id: FormControl<string>;
  status: FormControl<number>;
}

@Component({
  selector: "app-solicitud-baja-update-status",
  templateUrl: "./solicitud-baja-update-status.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputSelectSignal, WebButtonLabelSave],
})
export class SolicitudBajaUpdateStatus implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  formBuilder = inject(FormBuilder);
  submitting: boolean = false;
  id: string = "";
  form: FormGroup<ISolicitudBajaUpdateStatusForm>;
  estatusBaja = ESTATUS_BAJA;

  ngOnInit(): void {
    this.id = this.config.data.id; // ID comes from the dialog config

    this.form = this.formBuilder.group({
      id: new FormControl(this.id, { nonNullable: true }),
      status: new FormControl(this.config.data.status, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting = true;
    // Construct DTO with only id and status
    const dto = {
      id: this.form.value.id,
      status: this.form.value.status,
    };

    // Use onPatch for partial update
    this.apiResponseS
      .onPatch(`RequestDismissal/${this.id}/status`, dto)
      .then((result: boolean) => {
        this.submitting = false;
        if (result) {
          this.ref.close(true);
        }
      });
  }
}
