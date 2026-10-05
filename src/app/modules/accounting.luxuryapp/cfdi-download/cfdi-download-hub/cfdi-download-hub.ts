import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { EndpointsContabilidad } from "@core/constants/endpoints/contabilidad.endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { CredentialForm } from "../credential-form/credential-form";
import { CfdiList } from "../cfdi-list/cfdi-list";
import {
  CustomerSatCredentialDto,
  SatCfdiRecibidoDto,
  SatDownloadRequestDto,
} from "../interfaces/cfdi-download.interfaces";

/**
 * Página principal del módulo de Descarga Masiva de CFDI. Orquesta: estado de
 * la e.firma, solicitud/verificación de descarga, y el repositorio de CFDI.
 * Todo el módulo está acotado al customer en contexto (RN-CFD-002) — nunca se
 * opera sobre varios customers a la vez.
 */
@Component({
  selector: "app-cfdi-download-hub",
  templateUrl: "./cfdi-download-hub.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, ReactiveFormsModule, LxTag, CfdiList],
})
export class CfdiDownloadHub {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private aspRoleS = inject(AspRoleService);

  credential = signal<CustomerSatCredentialDto | null>(null);
  credentialLoaded = signal(false);
  lastRequest = signal<SatDownloadRequestDto | null>(null);
  cfdis = signal<SatCfdiRecibidoDto[]>([]);
  checkingStatus = signal(false);
  requestingDownload = signal(false);

  // D15/D17: cargar/reemplazar la e.firma es exclusivo de SuperUsuario/Direccion.
  canManageCredential = computed(() =>
    this.aspRoleS.hasAny([ApplicationRole.SuperUsuario, ApplicationRole.Direccion]),
  );

  requestForm = new FormGroup({
    fechaInicio: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
    fechaFin: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
  });

  filterForm = new FormGroup({
    fechaInicio: new FormControl<string>(""),
    fechaFin: new FormControl<string>(""),
  });

  globalFilterFields = computed(() =>
    this.cfdis().length > 0
      ? ["nombreEmisor", "rfcEmisor", "folio", "serie", "estadoSat"]
      : [],
  );

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.loadCredential();
        this.loadCfdis();
      }
    });
  }

  private loadCredential(): void {
    const urlApi = EndpointsContabilidad.CfdiDownload.credential(this.customerIdS.customerId());
    this.apiResponseS
      .onGetItem<CustomerSatCredentialDto>(urlApi, false)
      .then((result) => this.credential.set(result))
      .finally(() => this.credentialLoaded.set(true));
  }

  private loadCfdis(): void {
    const { fechaInicio, fechaFin } = this.filterForm.getRawValue();
    const urlApi = EndpointsContabilidad.CfdiDownload.list(
      this.customerIdS.customerId(),
      fechaInicio || undefined,
      fechaFin || undefined,
    );
    this.apiResponseS
      .onGetList<SatCfdiRecibidoDto[]>(urlApi)
      .then((result) => this.cfdis.set(result ?? []));
  }

  onFilter(): void {
    this.loadCfdis();
  }

  onOpenCredentialForm(): void {
    this.dialogHandlerS
      .openDialog<CustomerSatCredentialDto>(CredentialForm, {}, "Cargar / reemplazar e.firma", this.dialogHandlerS.sizeMd)
      .then((result: CustomerSatCredentialDto | undefined) => {
        if (result) this.credential.set(result);
      });
  }

  async onRequestDownload(): Promise<void> {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    const { fechaInicio, fechaFin } = this.requestForm.getRawValue();
    this.requestingDownload.set(true);

    const urlApi = EndpointsContabilidad.CfdiDownload.requestDownload(
      this.customerIdS.customerId(),
    );
    const result = await this.apiResponseS.onPost<SatDownloadRequestDto>(urlApi, {
      fechaInicio,
      fechaFin,
    });
    this.requestingDownload.set(false);

    if (result) {
      this.lastRequest.set(result);
    }
  }

  async onCheckStatus(): Promise<void> {
    const request = this.lastRequest();
    if (!request) return;

    this.checkingStatus.set(true);
    const urlApi = EndpointsContabilidad.CfdiDownload.checkStatus(
      this.customerIdS.customerId(),
      request.id,
    );
    const result = await this.apiResponseS.onGetItem<SatDownloadRequestDto>(urlApi);
    this.checkingStatus.set(false);

    if (result) {
      this.lastRequest.set(result);
      if (result.estadoSolicitud === "Descargada") {
        this.loadCfdis();
      }
    }
  }

  onVerPdf(cfdiId: string): void {
    const urlApi = EndpointsContabilidad.CfdiDownload.pdf(this.customerIdS.customerId(), cfdiId);
    this.apiResponseS.onPreviewPdf(urlApi);
  }

  onExportExcel(): void {
    const { fechaInicio, fechaFin } = this.filterForm.getRawValue();
    const urlApi = EndpointsContabilidad.CfdiDownload.exportExcel(
      this.customerIdS.customerId(),
      fechaInicio || undefined,
      fechaFin || undefined,
    );
    this.apiResponseS.exportToExcel(urlApi, `CFDI_Recibidos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
}
