import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { CustomInputDateTimeNative } from "@ui/inputs/web/custom-input-date-time-native";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { IRecepcionPipaAguaForm } from "./recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-form",
  templateUrl: "./recepcion-pipas-agua-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputTextSignal,
    CustomInputDateTimeNative,
    CustomInputDecimal,
    InputImg,
    InputAutocomplete,
  ],
})
export class RecepcionPipasAguaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id: string = "";

  cb_empleados = signal<SelectItemDto[]>([]);

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
      // "" = sin cambios, File = nueva imagen, null = eliminar la existente.
      fotoPipaLlena: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoPipaVacia: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoIneChofer: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoPlacas: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoMedidorAntes: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoMedidorDespues: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoNivelAntes: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoNivelDespues: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
      fotoNota: new FormControl<string | File | null>("", {
        nonNullable: true,
      }),
    });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.loadEmpleados();
    if (this.id) this.onLoadData();
  }

  private async loadEmpleados(): Promise<void> {
    // employeesByCustomer devuelve Employee.Id; employeeActive devuelve
    // Employee.UserId y rompe el FK ColaboradorMttoId -> Employees.Id.
    const data = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.employeesByCustomer(this.customerIdS.customerId()),
    );
    this.cb_empleados.set(data || []);
  }

  saveColaboradorMtto = (item: SelectItemDto) =>
    this.form.patchValue({
      // Sin String(): si se limpia el autocomplete enviaba el literal "undefined".
      colaboradorMttoId: item?.value ? String(item.value) : null,
      colaboradorMtto: item?.label ?? null,
    });

  onLoadData() {
    this.apiResponseS
      .onGetItem(
        Endpoints.RecepcionPipasAgua.getById(this.id),
      )
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
      endpoint: Endpoints.RecepcionPipasAgua.base,
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
    this.appendFoto(fd, "fotoPipaLlena", dto.fotoPipaLlena, this.urlFotoPipaLlena());
    this.appendFoto(fd, "fotoPipaVacia", dto.fotoPipaVacia, this.urlFotoPipaVacia());
    this.appendFoto(fd, "fotoIneChofer", dto.fotoIneChofer, this.urlFotoIneChofer());
    this.appendFoto(fd, "fotoPlacas", dto.fotoPlacas, this.urlFotoPlacas());
    this.appendFoto(fd, "fotoMedidorAntes", dto.fotoMedidorAntes, this.urlFotoMedidorAntes());
    this.appendFoto(fd, "fotoMedidorDespues", dto.fotoMedidorDespues, this.urlFotoMedidorDespues());
    this.appendFoto(fd, "fotoNivelAntes", dto.fotoNivelAntes, this.urlFotoNivelAntes());
    this.appendFoto(fd, "fotoNivelDespues", dto.fotoNivelDespues, this.urlFotoNivelDespues());
    this.appendFoto(fd, "fotoNota", dto.fotoNota, this.urlFotoNota());
    return fd;
  }

  /**
   * Adjunta la foto o la marca para eliminar.
   * Contrato del control: File = nueva imagen, null = eliminar, "" = sin cambios.
   * El flag de borrado solo se envia si realmente habia una foto guardada.
   */
  private appendFoto(
    fd: FormData,
    key: string,
    value: unknown,
    urlActual: string,
  ): void {
    if (value instanceof File) {
      fd.append(key, value);
      return;
    }
    if (value === null && urlActual) {
      const flag = `eliminar${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      fd.append(flag, "true");
    }
  }
}
