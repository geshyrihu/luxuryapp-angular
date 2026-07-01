import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateTimeNative } from "src/app/core/components/inputs/web/custom-input-date-time-native";
import { CustomInputDecimal } from "src/app/core/components/inputs/web/custom-input-decimal-signal";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IRecepcionPipaAguaForm } from "./recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-form",
  templateUrl: "./recepcion-pipas-agua-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    WebButtonLabelSave,
    CustomInputTextSignal,
    CustomInputDateTimeNative,
    CustomInputDecimal,
    CustomInputImg,
    CustomInputAutoComplete,
  ],
})
export class RecepcionPipasAguaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id: string = "";

  cb_empleados = signal<ISelectItem[]>([]);

  urlFotoPipaLlena = signal("");
  urlFotoPipaVacia = signal("");
  urlFotoIneChofer = signal("");
  urlFotoPlacas = signal("");
  urlFotoMedidorAntes = signal("");
  urlFotoMedidorDespues = signal("");
  urlFotoNivelAntes = signal("");
  urlFotoNivelDespues = signal("");
  urlFotoNota = signal("");

  form: FormGroup<IRecepcionPipaAguaForm> =
    new FormGroup<IRecepcionPipaAguaForm>({
      customerId: new FormControl<string | null>(
        this.customerIdS.customerId(),
        [Validators.required],
      ),
      horaLlegada: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      horaTermino: new FormControl<string | null>(null),
      placasCamion: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      capacidadPipa: new FormControl<number | null>(null),
      nivelCisternaAntes: new FormControl<number | null>(null),
      nivelCisternaDespues: new FormControl<number | null>(null),
      lecturaMedidorInicial: new FormControl<number | null>(null),
      lecturaMedidorFinal: new FormControl<number | null>(null),
      costoMetroCubico: new FormControl<number | null>(null),
      empresa: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      colaboradorMttoId: new FormControl<string | null>(null),
      colaboradorMtto: new FormControl<string | null>(null),
      guardiaSeguridad: new FormControl<string | null>(null),
      fotoPipaLlena: new FormControl<string | File>("", { nonNullable: true }),
      fotoPipaVacia: new FormControl<string | File>("", { nonNullable: true }),
      fotoIneChofer: new FormControl<string | File>("", { nonNullable: true }),
      fotoPlacas: new FormControl<string | File>("", { nonNullable: true }),
      fotoMedidorAntes: new FormControl<string | File>("", {
        nonNullable: true,
      }),
      fotoMedidorDespues: new FormControl<string | File>("", {
        nonNullable: true,
      }),
      fotoNivelAntes: new FormControl<string | File>("", { nonNullable: true }),
      fotoNivelDespues: new FormControl<string | File>("", {
        nonNullable: true,
      }),
      fotoNota: new FormControl<string | File>("", { nonNullable: true }),
    });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.loadEmpleados();
    if (this.id) this.onLoadData();
  }

  private async loadEmpleados(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `employeeactivo/${this.customerIdS.customerId()}`,
    );
    this.cb_empleados.set(data || []);
  }

  saveColaboradorMtto = (item: ISelectItem) =>
    this.form.patchValue({
      colaboradorMttoId: String(item?.value),
      colaboradorMtto: item?.label,
    });

  onLoadData() {
    this.apiResponseS
      .onGetItem(`recepcion-pipas-agua/${this.id}`)
      .then((result: any) => {
        this.urlFotoPipaLlena.set(result.fotoPipaLlenaUrl ?? "");
        this.urlFotoPipaVacia.set(result.fotoPipaVaciaUrl ?? "");
        this.urlFotoIneChofer.set(result.fotoIneChoferUrl ?? "");
        this.urlFotoPlacas.set(result.fotoPlacasUrl ?? "");
        this.urlFotoMedidorAntes.set(result.fotoMedidorAntesUrl ?? "");
        this.urlFotoMedidorDespues.set(result.fotoMedidorDespuesUrl ?? "");
        this.urlFotoNivelAntes.set(result.fotoNivelAntesUrl ?? "");
        this.urlFotoNivelDespues.set(result.fotoNivelDespuesUrl ?? "");
        this.urlFotoNota.set(result.fotoNotaUrl ?? "");
        this.form.patchValue(result);
      });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "recepcion-pipas-agua",
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (val) => this.buildFormData(val),
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
    fd.append("lecturaMedidorInicial", String(dto.lecturaMedidorInicial ?? 0));
    fd.append("lecturaMedidorFinal", String(dto.lecturaMedidorFinal ?? 0));
    fd.append("costoMetroCubico", String(dto.costoMetroCubico ?? 0));
    if (dto.empresa) fd.append("empresa", dto.empresa);
    if (dto.colaboradorMttoId)
      fd.append("colaboradorMttoId", dto.colaboradorMttoId);
    if (dto.guardiaSeguridad)
      fd.append("guardiaSeguridad", dto.guardiaSeguridad);
    if (dto.fotoPipaLlena instanceof File)
      fd.append("fotoPipaLlena", dto.fotoPipaLlena);
    if (dto.fotoPipaVacia instanceof File)
      fd.append("fotoPipaVacia", dto.fotoPipaVacia);
    if (dto.fotoIneChofer instanceof File)
      fd.append("fotoIneChofer", dto.fotoIneChofer);
    if (dto.fotoPlacas instanceof File) fd.append("fotoPlacas", dto.fotoPlacas);
    if (dto.fotoMedidorAntes instanceof File)
      fd.append("fotoMedidorAntes", dto.fotoMedidorAntes);
    if (dto.fotoMedidorDespues instanceof File)
      fd.append("fotoMedidorDespues", dto.fotoMedidorDespues);
    if (dto.fotoNivelAntes instanceof File)
      fd.append("fotoNivelAntes", dto.fotoNivelAntes);
    if (dto.fotoNivelDespues instanceof File)
      fd.append("fotoNivelDespues", dto.fotoNivelDespues);
    if (dto.fotoNota instanceof File) fd.append("fotoNota", dto.fotoNota);
    return fd;
  }
}
