import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTime } from "src/app/core/components/inputs/web/custom-input-time-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-presentacion-junta-add",
  templateUrl: "./presentacion-junta-add.html",
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomInputTime,
    WebButtonLabelSave,
    CustomInputTextSignal,
  ],
})
export class PresentacionJuntaAdd implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);

  submitting = signal(false);
  id: string = "";
  filePath: string = "";
  errorMessage: string = "";

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    customerId: new FormControl<string>(this.customerIdS.customerId()),
    juntaMensualSessionId: new FormControl<string | null>(null),
    fechaCorrespondiente: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaJunta: new FormControl<string>(""),
    horaJunta: new FormControl<string>(""),
  });

  private normalizeTime(value: string | null | undefined): string {
    return value ? value.slice(0, 5) : "";
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.form.controls.juntaMensualSessionId.setValue(
      this.config.data.juntaMensualSessionId ?? null,
    );
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.PresentacionJuntaComite.getById(this.id))
      .then((result: any) => {
        result.fechaCorrespondiente = this.dateS.getDateFormat(
          result.fechaCorrespondiente,
        );
        result.fechaJunta = this.dateS.getDateFormat(result.fechaJunta);
        result.horaJunta = this.normalizeTime(result.horaJunta);
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      fechaCorrespondiente:
        this.dateS.getDateFormat(raw.fechaCorrespondiente) ?? "",
      juntaMensualSessionId: raw.juntaMensualSessionId || null,
      fechaJunta: this.dateS.getDateFormat(raw.fechaJunta),
      horaJunta: raw.horaJunta || null,
    };

    if (!this.id) {
      this.apiResponseS
        .onPost(Endpoints.PresentacionJuntaComite.addFecha, payload)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.PresentacionJuntaComite.updateFecha(this.id), payload)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
