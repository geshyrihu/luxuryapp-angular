import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateTimeSignal } from "src/app/core/components/inputs/web/custom-input-date-time-signal";
import { CustomInputDecimal } from "src/app/core/components/inputs/web/custom-input-decimal-signal";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IRecepcionPipaAguaForm } from "./recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-form",
  templateUrl: "./recepcion-pipas-agua-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomButtonSave,
    CustomInputTextSignal,
    CustomInputDateTimeSignal,
    CustomInputDecimal,
    CustomInputImg,
  ],
})
export class RecepcionPipasAguaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id: string = "";

  urlFotoPipaLlena = signal("");
  urlFotoPipaVacia = signal("");
  urlFotoIneChofer = signal("");

  form: FormGroup<IRecepcionPipaAguaForm> = new FormGroup<IRecepcionPipaAguaForm>({
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), [Validators.required]),
    horaLlegada: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    horaTermino: new FormControl<string | null>(null),
    placasCamion: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    capacidadPipa: new FormControl<number | null>(null),
    nivelCisternaAntes: new FormControl<number | null>(null),
    nivelCisternaDespues: new FormControl<number | null>(null),
    lecturaMetroAntes: new FormControl<number | null>(null),
    lecturaMetroDespues: new FormControl<number | null>(null),
    fotoPipaLlena: new FormControl<string | File>("", { nonNullable: true }),
    fotoPipaVacia: new FormControl<string | File>("", { nonNullable: true }),
    fotoIneChofer: new FormControl<string | File>("", { nonNullable: true }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS.onGetItem(`recepcion-pipas-agua/${this.id}`).then((result: any) => {
      this.urlFotoPipaLlena.set(result.fotoPipaLlenaUrl ?? "");
      this.urlFotoPipaVacia.set(result.fotoPipaVaciaUrl ?? "");
      this.urlFotoIneChofer.set(result.fotoIneChoferUrl ?? "");
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const formData = this.buildFormData(this.form.getRawValue());
    this.submitting.set(true);

    const request = this.id
      ? this.apiResponseS.onPut(`recepcion-pipas-agua/${this.id}`, formData)
      : this.apiResponseS.onPost("recepcion-pipas-agua", formData);

    request.then((result: boolean) => {
      result ? this.ref.close(true) : this.submitting.set(false);
    });
  }

  private buildFormData(dto: any): FormData {
    const fd = new FormData();
    fd.append("customerId", String(dto.customerId));
    fd.append("horaLlegada", String(dto.horaLlegada));
    if (dto.horaTermino) fd.append("horaTermino", String(dto.horaTermino));
    fd.append("placasCamion", String(dto.placasCamion));
    fd.append("capacidadPipa", String(dto.capacidadPipa ?? 0));
    fd.append("nivelCisternaAntes", String(dto.nivelCisternaAntes ?? 0));
    fd.append("nivelCisternaDespues", String(dto.nivelCisternaDespues ?? 0));
    fd.append("lecturaMetroAntes", String(dto.lecturaMetroAntes ?? 0));
    fd.append("lecturaMetroDespues", String(dto.lecturaMetroDespues ?? 0));
    if (dto.fotoPipaLlena instanceof File) fd.append("fotoPipaLlena", dto.fotoPipaLlena);
    if (dto.fotoPipaVacia instanceof File) fd.append("fotoPipaVacia", dto.fotoPipaVacia);
    if (dto.fotoIneChofer instanceof File) fd.append("fotoIneChofer", dto.fotoIneChofer);
    return fd;
  }
}
