import { ApiDatePipe } from "../../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  EvidenciaNominaDTO,
  TIPO_EVIDENCIA_COLORS,
  TIPO_EVIDENCIA_OPTIONS,
} from "../interfaces/evidencia-nomina.interface";
import { NominaEncabezadoDTO } from "../interfaces/nomina-encabezado.interface";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-evidencias-nomina",
  imports: [
    AppIcon,
    WebButtonIcon,
    LxTooltipDirective,
    ApiDatePipe,
    ReactiveFormsModule,
    WebButtonLabel,
    WebButtonLabelSave,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./evidencias-nomina.html",
})
export default class EvidenciasNomina {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private fb = inject(FormBuilder);

  readonly tipoEvidenciaOptions: SelectItemDto[] = TIPO_EVIDENCIA_OPTIONS;
  readonly tipoEvidenciaColors = TIPO_EVIDENCIA_COLORS;

  loading = signal(false);
  uploading = signal(false);
  evidencias = signal<EvidenciaNominaDTO[]>([]);
  nominas = signal<SelectItemDto[]>([]);
  nominaSeleccionada = signal<string>("");
  archivoSeleccionado = signal<File | null>(null);

  form = this.fb.nonNullable.group({
    tipoEvidencia: [0, Validators.required],
    descripcion: [""],
  });

  readonly evidenciasPorTipo = computed(() => {
    const all = this.evidencias();
    const grouped: Record<number, EvidenciaNominaDTO[]> = {};
    for (const e of all) {
      if (!grouped[e.tipoEvidencia]) grouped[e.tipoEvidencia] = [];
      grouped[e.tipoEvidencia].push(e);
    }
    return grouped;
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadNominas(customerId);
    });
  }

  async loadNominas(customerId: string): Promise<void> {
    const result = await this.apiResponseS.onGetList<NominaEncabezadoDTO[]>(
      Endpoints.HR.Nomina.Encabezado.getAll(customerId),
    );
    const options: SelectItemDto[] = ((result as any) ?? []).map((n: any) => ({
      label: n.periodoDescripcion,
      value: n.id,
    }));
    this.nominas.set(options);
    if (options.length) {
      this.nominaSeleccionada.set(options[0].value);
      this.loadEvidencias(options[0].value);
    }
  }

  async loadEvidencias(nominaId: string): Promise<void> {
    this.loading.set(true);
    const result = await this.apiResponseS.onGetList<EvidenciaNominaDTO[]>(
      Endpoints.HR.Nomina.Evidencias.byNomina(nominaId),
    );
    this.evidencias.set((result as any) ?? []);
    this.loading.set(false);
  }

  cambiarNomina(nominaId: string): void {
    this.nominaSeleccionada.set(nominaId);
    this.loadEvidencias(nominaId);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.archivoSeleccionado.set(file);
  }

  async onSubir(): Promise<void> {
    const file = this.archivoSeleccionado();
    const nominaId = this.nominaSeleccionada();
    if (!file || !nominaId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "tipoEvidencia",
      String(this.form.controls["tipoEvidencia"].value),
    );
    const desc = this.form.controls["descripcion"].value;
    if (desc) formData.append("descripcion", desc);

    this.uploading.set(true);
    const result = await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Evidencias.byNomina(nominaId),
      formData,
    );
    this.uploading.set(false);
    if (result) {
      this.form.reset({ tipoEvidencia: 0 });
      this.archivoSeleccionado.set(null);
      await this.loadEvidencias(nominaId);
    }
  }

  async onEliminar(id: string): Promise<void> {
    const result = await this.apiResponseS.onDelete(
      Endpoints.HR.Nomina.Evidencias.delete(id),
    );
    if (result) await this.loadEvidencias(this.nominaSeleccionada());
  }

  getTipoLabel(tipo: number): string {
    return (
      TIPO_EVIDENCIA_OPTIONS.find((o) => o.value === tipo)?.label ?? "Documento"
    );
  }

  getCardColor(tipo: number): string {
    return this.tipoEvidenciaColors[tipo] ?? "#f8fafc";
  }

  abrirEvidencia(filePath: string): void {
    window.open(filePath, "_blank");
  }
}
