import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { EAutorizacionCuadroComparativo } from "src/app/core/enums/e-autorizacion-cuadro-comparativo.enum";
import { TooltipPlacement } from "src/app/core/enums/tooltip-placement";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { AiService } from "src/app/core/services/ai.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import { CuadroComparativoAddProveedor } from "./cuadro-comparativo-add-proveedor";
import { CuadroComparativoCotizacion } from "./cuadro-comparativo-cotizacion";

@Component({
  selector: "app-cuadro-comparativo-list",
  templateUrl: "./cuadro-comparativo-list.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DividerModule,
    ImageModule,
    CustomButton,
    CustomButtonViewPdf,
    DialogModule,
  ],
})
export class CuadroComparativoList implements OnInit {
  tooltipPlacement = TooltipPlacement;
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customToastService = inject(CustomToastService);
  routeActive = inject(ActivatedRoute);
  aiService = inject(AiService);
  authS = inject(AuthService);
  swalService = inject(SwalService);
  ref: DynamicDialogRef;

  showAiModal: boolean = false;
  aiAnalysisResult: string = "";
  isAnalyzing: boolean = false;

  solicitudCompra: any;
  solicitudCompraDetalleSignal = signal<any[]>([]);
  cotizacionProveedorSignal = signal<any[]>([]);
  evidenciasSignal = signal<any[]>([]);

  provider1: any;
  provider2: any;
  provider3: any;

  cotizacionProveedorId1: any;
  cotizacionProveedorId2: any;
  cotizacionProveedorId3: any;

  total1 = 0;
  total2 = 0;
  total3 = 0;

  amarilloTotal1 = false;
  amarilloTotal2 = false;
  amarilloTotal3 = false;

  solicitudCompraId: string = "";
  folio = "";
  mejorPrecioTotal1 = 0;
  mejorPrecioTotal2 = 0;
  mejorPrecioTotal3 = 0;
  totalMejorPrecioTotal = 0;
  evaluarPrecioIndependiente = false;
  cleanView = false;

  autorizacionOptions: ISelectItem[] = [
    { label: "Comite", value: EAutorizacionCuadroComparativo.Comite },
    { label: "Administrador", value: EAutorizacionCuadroComparativo.Administrador },
    { label: "Supervisor", value: EAutorizacionCuadroComparativo.Supervisor },
    { label: "Direccion", value: EAutorizacionCuadroComparativo.Direccion },
  ];
  selectedEvidenceFiles: File[] = [];

  paramsSignal = toSignal(this.routeActive.params);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params && params["id"]) {
        this.solicitudCompraId = params["id"];
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {}

  onLoadData() {
    if (!this.solicitudCompraId) return;

    this.onResetData();
    const urlApi = `solicitudcompra/cuadrocomparativo/${this.solicitudCompraId}`;

    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (!result) return;

      this.folio = result.folio;
      this.solicitudCompra = result;
      this.evidenciasSignal.set(result.evidencias || []);
      this.cotizacionProveedorSignal.set(result.cotizacionProveedor);
      this.solicitudCompraDetalleSignal.set(result.solicitudCompraDetalle);
      this.setupProvidersAnDTOtals();
      this.onEvaluationPriceTotal();
      this.onTotalPreciosMenores(this.solicitudCompraDetalleSignal());
    });
  }

  setupProvidersAnDTOtals(): void {
    const cotizacionProveedor = this.cotizacionProveedorSignal();
    const solicitudCompraDetalle = this.solicitudCompraDetalleSignal();

    if (cotizacionProveedor.length >= 1) {
      this.provider1 = cotizacionProveedor[0].nameProvider;
      this.cotizacionProveedorId1 = cotizacionProveedor[0].id;
    }
    if (cotizacionProveedor.length >= 2) {
      this.provider2 = cotizacionProveedor[1].nameProvider;
      this.cotizacionProveedorId2 = cotizacionProveedor[1].id;
    }
    if (cotizacionProveedor.length >= 3) {
      this.provider3 = cotizacionProveedor[2].nameProvider;
      this.cotizacionProveedorId3 = cotizacionProveedor[2].id;
    }

    solicitudCompraDetalle.forEach((n) => {
      this.total1 += n.total || 0;
      this.total2 += n.total2 || 0;
      this.total3 += n.total3 || 0;
    });
  }

  onEvaluationPriceTotal(): void {
    this.amarilloTotal1 = false;
    this.amarilloTotal2 = false;
    this.amarilloTotal3 = false;

    const preciosValidos = [];
    if (this.total1 > 0) preciosValidos.push(this.total1);
    if (this.total2 > 0) preciosValidos.push(this.total2);
    if (this.total3 > 0) preciosValidos.push(this.total3);
    if (preciosValidos.length === 0) return;

    const precioMasBajo = Math.min(...preciosValidos);
    if (this.total1 === precioMasBajo) this.amarilloTotal1 = true;
    if (this.total2 === precioMasBajo) this.amarilloTotal2 = true;
    if (this.total3 === precioMasBajo) this.amarilloTotal3 = true;
  }

  isLowestPrice(item: any, providerIndex: number): boolean {
    const currentPrice =
      providerIndex === 1
        ? item.total
        : providerIndex === 2
          ? item.total2
          : item.total3;

    if (currentPrice <= 0) return false;

    const preciosValidos = [item.total, item.total2, item.total3].filter(
      (p) => p > 0,
    );

    if (preciosValidos.length === 0) return false;

    const precioMasBajo = Math.min(...preciosValidos);
    return currentPrice === precioMasBajo;
  }

  onTotalPreciosMenores(solicitudCompraDetalle: any[]): void {
    this.onResetMejorPrecio();

    for (let n of solicitudCompraDetalle) {
      const preciosValidos = [
        { total: n.total, index: 1 },
        { total: n.total2, index: 2 },
        { total: n.total3, index: 3 },
      ].filter((p) => p.total > 0);

      if (preciosValidos.length === 0) continue;

      const mejorPrecio = Math.min(...preciosValidos.map((p) => p.total));
      const mejorOpcion = preciosValidos.find((p) => p.total === mejorPrecio);

      if (mejorOpcion) {
        if (mejorOpcion.index === 1) this.mejorPrecioTotal1 += mejorPrecio;
        if (mejorOpcion.index === 2) this.mejorPrecioTotal2 += mejorPrecio;
        if (mejorOpcion.index === 3) this.mejorPrecioTotal3 += mejorPrecio;
      }
    }

    this.totalMejorPrecioTotal =
      this.mejorPrecioTotal1 + this.mejorPrecioTotal2 + this.mejorPrecioTotal3;
  }

  onModalAddProveedor() {
    this.dialogHandlerS
      .openDialog(
        CuadroComparativoAddProveedor,
        { solicitudCompraId: this.solicitudCompraId },
        "Selecciona un proveedor",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onEditCotizacion(posicionCotizacion: number, cotizacionProveedorId: any) {
    this.dialogHandlerS
      .openDialog(
        CuadroComparativoCotizacion,
        {
          solicitudCompraId: this.solicitudCompraId,
          posicionCotizacion: posicionCotizacion,
          cotizacionProveedorId: cotizacionProveedorId,
        },
        "Editar Cotizacion",
        this.dialogHandlerS.sizeFull,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  async onOpenAutorizarModal() {
    if (this.isAuthorized()) {
      await this.onOpenDesautorizarModal();
      return;
    }

    const inputOptions = this.autorizacionOptions.reduce<Record<string, string>>(
      (acc, item) => {
        acc[String(item.value)] = String(item.label);
        return acc;
      },
      {},
    );

    const { value } = await this.swalService.fire({
      title: "Autorizar solicitud",
      input: "select",
      inputOptions,
      inputPlaceholder: "Selecciona quien autoriza",
      inputValue:
        this.solicitudCompra?.autorizadaPor !== null &&
        this.solicitudCompra?.autorizadaPor !== undefined
          ? String(this.solicitudCompra.autorizadaPor)
          : "",
      showCancelButton: true,
      confirmButtonText: "Autorizar",
      cancelButtonText: "Cancelar",
      inputValidator: (selectedValue: string) => {
        if (!selectedValue) {
          return "Selecciona quien autoriza.";
        }
        return null;
      },
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (value === undefined) return;

    this.apiResponseS
      .onPut(`SolicitudCompra/CuadroComparativo/${this.solicitudCompraId}`, {
        autorizadaPor: Number(value),
        applicationUserId: this.authS.applicationUserId,
      })
      .then((result) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  async onOpenDesautorizarModal() {
    const result = await this.swalService.fire({
      title: "Desautorizar solicitud",
      text: "Se eliminara la autorizacion registrada para esta solicitud.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Desautorizar",
      cancelButtonText: "Cancelar",
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (!result.isConfirmed) return;

    this.apiResponseS
      .onPut(`SolicitudCompra/CuadroComparativo/${this.solicitudCompraId}`, {
        autorizadaPor: null,
        applicationUserId: this.authS.applicationUserId,
      })
      .then((response) => {
        if (response) {
          this.onLoadData();
        }
      });
  }

  isAuthorized() {
    return (
      this.solicitudCompra?.autorizadaPor !== null &&
      this.solicitudCompra?.autorizadaPor !== undefined
    );
  }

  onEvidenceFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;
    const availableSlots = 4 - this.evidenciasSignal().length;

    if (availableSlots <= 0) {
      this.customToastService.showError(
        "Solo se permiten 4 fotos como maximo.",
        "Limite alcanzado",
      );
      input.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) => !["image/jpeg", "image/jpg", "image/png"].includes(file.type),
    );

    if (invalidFile) {
      this.customToastService.showError(
        "Solo se permiten imagenes JPG o PNG.",
        "Error de formato",
      );
      input.value = "";
      return;
    }

    if (files.length > availableSlots) {
      this.customToastService.showInfo(
        "Limite de fotos",
        `Solo se agregaran ${availableSlots} foto(s) para completar el maximo de 4.`,
      );
    }

    this.selectedEvidenceFiles = files.slice(0, availableSlots);
    input.value = "";
  }

  async onUploadEvidenceFiles() {
    if (this.selectedEvidenceFiles.length === 0) return;

    let hasError = false;

    for (const file of this.selectedEvidenceFiles) {
      const formData = new FormData();
      formData.append("File", file);
      formData.append("Descripcion", file.name);
      formData.append("ApplicationUserId", this.authS.applicationUserId);
      const result = await this.apiResponseS.onPostFile(
        `SolicitudCompra/CuadroComparativo/${this.solicitudCompraId}/Evidences`,
        formData,
      );

      if (!result) {
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      this.selectedEvidenceFiles = [];
      this.onLoadData();
    }
  }

  onDeleteEvidence(evidenceId: string) {
    this.apiResponseS
      .onDelete(`SolicitudCompra/CuadroComparativo/Evidences/${evidenceId}`)
      .then((success) => {
        if (success) {
          this.evidenciasSignal.set(
            this.evidenciasSignal().filter((item) => item.id !== evidenceId),
          );
          this.onLoadData();
        }
      });
  }

  toggleCleanView() {
    this.cleanView = !this.cleanView;
  }

  onResetData(): void {
    this.solicitudCompraDetalleSignal.set([]);
    this.cotizacionProveedorSignal.set([]);
    this.evidenciasSignal.set([]);
    this.provider1 = undefined;
    this.provider2 = undefined;
    this.provider3 = undefined;
    this.total1 = 0;
    this.total2 = 0;
    this.total3 = 0;
  }

  onResetMejorPrecio() {
    this.mejorPrecioTotal1 = 0;
    this.mejorPrecioTotal2 = 0;
    this.mejorPrecioTotal3 = 0;
    this.totalMejorPrecioTotal = 0;
  }

  onAnalyzeAI() {
    this.isAnalyzing = true;
    this.customToastService.showInfo(
      "Analizando...",
      "La IA esta revisando las cotizaciones y documentos adjuntos.",
    );

    this.aiService
      .analyzeComparativeChart(this.solicitudCompraId)
      .then((result) => {
        this.aiAnalysisResult = result;
        this.showAiModal = true;
        this.isAnalyzing = false;
      })
      .catch((error) => {
        this.customToastService.showError("Error AI", error.message);
        this.isAnalyzing = false;
      });
  }
}
