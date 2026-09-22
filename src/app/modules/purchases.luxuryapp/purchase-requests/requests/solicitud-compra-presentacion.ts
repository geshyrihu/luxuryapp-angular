import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { AutorizacionCuadroComparativo } from "@core/enums/autorizacion-cuadro-comparativo.enum";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { SwalService } from "@core/services/swal.service";
import { LxCarousel } from "@ui/adaptive/carousel/carousel";
import { LxTag } from "@ui/adaptive/tag/tag";
import { TagSeverity } from "@ui/base/tag.base";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { AppImage } from "@ui/web/image/image";
import { AppTable } from "@ui/web/table/table";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppIcon as AppIconCatalog } from "@ui/shared/app-icon/app-icon.catalog";
import Swal from "sweetalert2";

import { DialogSize } from "@core/enums/dialog-size.enum";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { NIVEL_PRIORIDAD_TAG_OPTIONS } from "./nivel-prioridad-tag-options";
import { TIPO_SOLICITUD_TAG_OPTIONS } from "./tipo-solicitud-tag-options";

@Component({
  selector: "app-solicitud-compra-presentacion",
  templateUrl: "./solicitud-compra-presentacion.html",
  imports: [
    WebButtonIcon,
    CommonModule,
    LxCarousel,
    AppImage,
    AppTable,
    WebButtonLabel,
    WebButtonLabelViewPdf,
    LxTag,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      .presentation-shell {
        position: relative;
        background: var(--ds-bg-sunken);
        min-height: 100%;
        overflow-x: hidden;
      }

      .priority-group-header {
        font-weight: 600;
        font-size: 0.8rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 0.5rem 1rem;
      }

      .priority-group-danger {
        background: var(--ds-danger-light);
        color: var(--ds-danger);
      }

      .priority-group-warn {
        background: var(--ds-warning-light);
        color: var(--ds-warning);
      }

      .priority-group-info {
        background: var(--ds-info-light);
        color: var(--ds-info);
      }

      .priority-group-secondary {
        background: var(--ds-bg-sunken);
        color: var(--ds-text-secondary);
      }

      .presentation-nav-floating {
        position: absolute;
        top: 0;
        right: 1.25rem;
        z-index: 5;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        padding: 0.25rem;
        box-shadow: var(--ds-shadow-sm);
      }



      .presentation-slide {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-card);
        box-shadow: var(--ds-shadow-sm);
        overflow: hidden;
      }

      .presentation-carousel {
        display: block;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }

      :host ::ng-deep .presentation-carousel owl-carousel-o,
      :host ::ng-deep .presentation-carousel owl-carousel-o .owl-carousel,
      :host ::ng-deep .presentation-carousel .owl-stage-outer {
        display: block;
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }

      :host ::ng-deep .presentation-carousel .owl-stage {
        display: flex;
      }

      :host ::ng-deep .presentation-carousel .owl-item {
        flex: 0 0 auto;
        max-width: 100%;
      }

      :host ::ng-deep .presentation-carousel .owl-item > .presentation-slide {
        width: 100%;
        max-width: 100%;
      }

      .presentation-accent {
        height: 0.25rem;
        background: var(--ds-primary);
      }

      .presentation-kicker {
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .presentation-detail-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
        grid-template-areas:
          "evidence providers"
          "budget budget";
        gap: 1rem;
        align-items: start;
      }

      .presentation-section {
        min-width: 0;
      }

      .presentation-section-providers {
        grid-area: providers;
      }

      .presentation-section-evidence {
        grid-area: evidence;
      }

      .presentation-section-budget {
        grid-area: budget;
      }

      .detail-meta {
        min-height: 4.5rem;
      }

      .provider-fact {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
        column-gap: 0.5rem;
        align-items: baseline;
      }

      .provider-fact > :last-child {
        text-align: right;
      }

      :host ::ng-deep .presentation-section .custom-table {
        display: block;
        width: 100%;
        min-width: 0;
        overflow-x: auto;
      }

      :host ::ng-deep .presentation-section .custom-table table {
        width: 100%;
        min-width: 0 !important;
      }

      :host ::ng-deep .presentation-section .custom-table th,
      :host ::ng-deep .presentation-section .custom-table td {
        padding: 0.4rem 0.55rem;
      }

      .evidence-frame {
        background: var(--ds-bg-surface);
        border: 1px solid var(--surface-border);
        border-radius: var(--ds-radius-card);
        overflow: hidden;
      }

      .provider-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-card);
        box-shadow: var(--ds-shadow-sm);
      }

      .provider-card-best {
        background: var(--ds-warning-light);
        border-color: var(--ds-warning);
      }

      @media (max-width: 991.98px) {
        .presentation-detail-grid {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          grid-template-areas:
            "evidence evidence"
            "providers providers"
            "budget budget";
        }
      }

      @media (max-width: 767.98px) {
        .presentation-detail-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .provider-fact {
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        }
      }

      .summary-priority-legend {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .summary-legend-item {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        color: var(--ds-text-secondary);
        font-size: 0.75rem;
      }

      .summary-priority-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: var(--ds-radius-full);
        font-size: 0.9rem;
      }

      .summary-priority-icon-danger {
        background: var(--ds-danger-light);
        color: var(--ds-danger);
      }

      .summary-priority-icon-warn {
        background: var(--ds-warning-light);
        color: var(--ds-warning-dark, var(--ds-warning));
      }

      .summary-priority-icon-info {
        background: var(--ds-info-light);
        color: var(--ds-info);
      }

      .summary-priority-icon-secondary {
        background: var(--ds-bg-sunken);
        color: var(--ds-text-secondary);
      }

      .summary-table {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-card);
        box-shadow: var(--ds-shadow-sm);
        overflow: hidden;
      }

      .summary-table-scroll {
        width: 100%;
        overflow-x: hidden;
      }

      .summary-table-grid {
        width: 100%;
        min-width: 0;
        table-layout: fixed;
        border-collapse: collapse;
      }

      .summary-table-grid th {
        padding: 0.5rem 0.75rem;
        background: var(--ds-primary);
        color: var(--ds-primary-text);
        font-size: 0.75rem;
        font-weight: 600;
        text-align: left;
        white-space: nowrap;
      }

      .summary-table-grid td {
        padding: 0.55rem 0.75rem;
        border-top: 1px solid var(--ds-border);
        vertical-align: middle;
      }

      .summary-table-grid tbody tr:hover {
        background: var(--ds-bg-sunken);
      }

      .summary-table .summary-row-danger td:first-child {
        border-left: 4px solid var(--ds-danger);
      }

      .summary-table .summary-row-warn td:first-child {
        border-left: 4px solid var(--ds-warning);
      }

      .summary-table .summary-row-info td:first-child {
        border-left: 4px solid var(--ds-info);
      }

      .summary-table .summary-row-secondary td:first-child {
        border-left: 4px solid var(--ds-border-strong);
      }

      .summary-description-title {
        color: var(--ds-text-primary);
        font-weight: 650;
        line-height: 1.35;
      }

      .summary-description-justification {
        display: -webkit-box;
        overflow: hidden;
        color: var(--ds-text-secondary);
        font-size: 0.8rem;
        line-height: 1.35;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      @media (max-width: 767.98px) {
        .summary-table-scroll {
          overflow-x: auto;
        }

        .summary-table-grid {
          min-width: 62rem;
        }
      }

      .summary-money {
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }

      .provider-footer-row td {
        background: var(--ds-bg-sunken);
        font-size: 0.8rem;
      }

      .provider-footer-row:first-child td {
        border-top: 1px solid var(--surface-border);
      }

    `,
  ],
})
export class SolicitudCompraPresentacion {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  swalService = inject(SwalService);
  dialogHandlerS = inject(DialogHandlerService);

  solicitudesSignal = signal<any[]>([]);
  presentationSlides = signal<any[]>([]);
  solicitudIds: string[] = [];
  currentPage = signal(0);
  loadingPresentation = signal(true);
  presentationError = signal<string | null>(null);
  private presentationLoadSequence = 0;
  priorityOptions = [...NIVEL_PRIORIDAD_TAG_OPTIONS].reverse();
  typeOptions = TIPO_SOLICITUD_TAG_OPTIONS;

  autorizacionOptions: SelectItemDto[] = [
    { label: "Comite", value: AutorizacionCuadroComparativo.Comite },
    {
      label: "Administrador",
      value: AutorizacionCuadroComparativo.Administrador,
    },
    { label: "Supervisor", value: AutorizacionCuadroComparativo.Supervisor },
    { label: "Direccion", value: AutorizacionCuadroComparativo.Direccion },
  ];

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadSelectedSolicitudes(customerId);
      } else {
        this.presentationLoadSequence++;
        this.solicitudesSignal.set([]);
        this.presentationSlides.set([]);
        this.presentationError.set(null);
        this.loadingPresentation.set(false);
      }
    });
  }

  async onLoadSelectedSolicitudes(customerId: string) {
    const loadSequence = ++this.presentationLoadSequence;
    this.currentPage.set(0);
    this.loadingPresentation.set(true);
    this.presentationError.set(null);
    const selectedItems = await this.apiResponseS.onGetList<any[]>(
      Endpoints.PurchaseRequests.presentation(customerId),
      false,
    );

    if (loadSequence !== this.presentationLoadSequence) return;
    if (selectedItems === null) {
      this.solicitudIds = [];
      this.solicitudesSignal.set([]);
      this.presentationSlides.set([]);
      this.presentationError.set(
        "No se pudo cargar la selección de presentación.",
      );
      this.loadingPresentation.set(false);
      return;
    }

    const ids = Array.from(selectedItems || []).map((item: any) => item.id);
    this.solicitudIds = ids;

    if (ids.length === 0) {
      this.solicitudesSignal.set([]);
      this.presentationSlides.set([]);
      this.loadingPresentation.set(false);
      return;
    }

    const batchResult = await this.apiResponseS.onPost<any[]>(
      Endpoints.PurchaseRequests.cuadroComparativoBatch,
      { solicitudCompraIds: ids },
      undefined,
      false,
      false,
    );

    if (loadSequence !== this.presentationLoadSequence) return;
    if (batchResult === false) {
      this.solicitudesSignal.set([]);
      this.presentationSlides.set([]);
      this.presentationError.set(
        "No se pudieron cargar los comparativos seleccionados.",
      );
      this.loadingPresentation.set(false);
      return;
    }

    const resultById = new Map(
      (batchResult || []).map((item: any) => [item.id, item]),
    );
    const missingIds = ids.filter((id) => !resultById.has(id));
    const formatted = ids
      .map((id) => resultById.get(id))
      .filter(Boolean)
      .map((item: any) => this.mapSolicitudForPresentation(item));

    this.solicitudesSignal.set(formatted);
    this.presentationSlides.set([
      {
        id: "summary-slide",
        kind: "summary",
        rows: formatted
          .map((solicitud, index) =>
            this.mapSolicitudSummaryRow(solicitud, index),
          )
          .sort((left, right) => right.prioridad - left.prioridad),
      },
      ...formatted.map((solicitud) => ({
        kind: "solicitud",
        ...solicitud,
      })),
    ]);
    this.currentPage.set(0);
    if (missingIds.length > 0) {
      this.presentationError.set(
        `${missingIds.length} solicitud(es) seleccionada(s) no está(n) disponible(s) para presentación.`,
      );
    }
    this.loadingPresentation.set(false);
  }

  mapSolicitudForPresentation(item: any) {
    const detalles: any[] = Array.from(item?.solicitudCompraDetalle || []);
    const cotizaciones: any[] = Array.from(item?.cotizacionProveedor || []);
    const budgets: any[] = Array.from(item?.budgets || []);
    const evidencias: any[] = Array.from(item?.evidencias || []).slice(0, 4);

    const total1 = detalles.reduce(
      (sum: number, detail: any) => sum + (detail.total || 0),
      0,
    );
    const total2 = detalles.reduce(
      (sum: number, detail: any) => sum + (detail.total2 || 0),
      0,
    );
    const total3 = detalles.reduce(
      (sum: number, detail: any) => sum + (detail.total3 || 0),
      0,
    );
    const cheapestTotal = this.getCheapestTotal([total1, total2, total3]);

    return {
      ...item,
      solicitudCompraDetalle: detalles,
      cotizacionProveedor: cotizaciones,
      budgets,
      evidencias,
      total1,
      total2,
      total3,
      cheapestTotal,
      providerSummaries: cotizaciones.map((provider: any) => ({
        id: provider.id,
        posicionCotizacion: provider.posicionCotizacion,
        nameProvider: provider.nameProvider,
        entrega: provider.entrega,
        garantia: provider.garantia,
        politicaPago: provider.politicaPago,
        filePath: provider.filePath,
        total:
          provider.posicionCotizacion === 1
            ? total1
            : provider.posicionCotizacion === 2
              ? total2
              : total3,
      })),
    };
  }

  mapSolicitudSummaryRow(solicitud: any, index: number) {
    const budgets = Array.from(solicitud?.budgets || []);

    return {
      numero: index + 1,
      descripcion: solicitud.equipoOInstalacion,
      area: solicitud.solicita || "Sin área",
      justificacion: solicitud.justificacionGasto || "Sin justificación registrada",
      costoTotalConIva: solicitud.cheapestTotal || 0,
      partidaPresupuestalDescripcion:
        budgets.length > 0
          ? budgets.map((budget: any) => budget.accountName).filter(Boolean).join(", ") || "Sin descripción"
          : "Sin descripción",
      partidaPresupuestal:
        budgets.length > 0
          ? budgets.map((budget: any) => budget.accountNumber).join(", ")
          : "Sin partida",
      dineroDisponible:
        budgets.length > 0
          ? budgets.reduce(
              (sum: number, budget: any) =>
                sum + (budget.presupuestoRestante || 0),
              0,
            )
          : 0,
      tipoSolicitudLabel: this.getTipoSolicitudLabel(solicitud.tipoSolicitud),
      tipoSolicitudSeverity: this.getTipoSolicitudSeverity(
        solicitud.tipoSolicitud,
      ),
      prioridad: solicitud.prioridad ?? 0,
      prioridadLabel: this.getPrioridadLabel(solicitud.prioridad),
      prioridadSeverity: this.getPrioridadSeverity(solicitud.prioridad),
    };
  }

  getTipoSolicitudLabel(value: number): string {
    return (
      TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)?.label ??
      "N/D"
    );
  }

  getTipoSolicitudSeverity(value: number): TagSeverity {
    return (
      TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)
        ?.severity ?? "secondary"
    );
  }

  getPrioridadLabel(value: number): string {
    return (
      NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)?.label ??
      "N/D"
    );
  }

  getPrioridadSeverity(value: number): TagSeverity {
    return (
      NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)
        ?.severity ?? "secondary"
    );
  }

  getPrioridadIcon(value: number): string {
    switch (value) {
      case 4:
        return AppIconCatalog.AlertCircle;
      case 3:
        return AppIconCatalog.ArrowUp;
      case 2:
        return AppIconCatalog.Minus;
      case 1:
        return AppIconCatalog.ArrowDown;
      default:
        return AppIconCatalog.HelpOutline;
    }
  }

  getSummaryTotal(rows: any[]): number {
    return Array.from(rows || []).reduce(
      (sum: number, row: any) => sum + (row.costoTotalConIva || 0),
      0,
    );
  }

  getCheapestTotal(totals: number[]): number {
    const validTotals = totals.filter((total) => total > 0);
    return validTotals.length > 0 ? Math.min(...validTotals) : 0;
  }

  getBudgetAccumulated(budget: any): number {
    return (
      (budget.totalGastadoEjecutado || 0) + (budget.totalGastosPendientes || 0)
    );
  }

  getBudgetBalanceAfterUse(budget: any): number {
    return (budget.presupuestoRestante || 0) - (budget.amount || 0);
  }

  isBudgetExceeded(budget: any): boolean {
    return this.getBudgetBalanceAfterUse(budget) < 0;
  }

  getSummaryBudgetBalance(row: any): number {
    return (row.dineroDisponible || 0) - (row.costoTotalConIva || 0);
  }

  getProviderColumnWidth(providerCount: number): number {
    if (providerCount <= 0) return 0;
    return 50 / providerCount;
  }

  getBestProvider(solicitud: any): any | null {
    const providers = solicitud?.providerSummaries || [];
    if (providers.length === 0) return null;
    return providers.reduce((best: any, current: any) => {
      const bestTotal = best.total || Infinity;
      const currentTotal = current.total || Infinity;
      return currentTotal < bestTotal ? current : best;
    });
  }

  isBestProvider(solicitud: any, provider: any): boolean {
    const best = this.getBestProvider(solicitud);
    return best?.id === provider?.id;
  }

  async openProductDetailModal(solicitud: any): Promise<void> {
    const { ProductDetailModalComponent } =
      await import("./product-detail-modal/product-detail-modal");
    await this.dialogHandlerS.openDialog(
      ProductDetailModalComponent,
      { solicitud },
      `Detalle de productos - ${solicitud?.equipoOInstalacion || ""}`,
      DialogSize.full,
      true,
    );
  }

  isAuthorized(solicitud: any): boolean {
    return solicitud?.estatus === 0;
  }

  isDenied(solicitud: any): boolean {
    return solicitud?.estatus === 1;
  }

  async onOpenAutorizarModal(solicitud: any) {
    if (this.isAuthorized(solicitud)) {
      await this.onOpenDesautorizarModal(solicitud.id);
      return;
    }

    const statusSelection = await this.swalService.fire({
      title: "Resolver solicitud",
      input: "radio",
      inputOptions: {
        autorizar: "Autorizar",
        denegar: "No se autoriza",
      },
      inputValidator: (value: string) => {
        if (!value) {
          return "Selecciona una opción.";
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (!statusSelection.isConfirmed || !statusSelection.value) return;

    if (statusSelection.value === "denegar") {
      await this.onOpenNoAutorizaModal(solicitud.id, solicitud.autorizadaPor);
      return;
    }

    const inputOptions = this.autorizacionOptions.reduce<
      Record<string, string>
    >((acc, item) => {
      acc[String(item.value)] = String(item.label);
      return acc;
    }, {});

    const { value } = await this.swalService.fire({
      title: "Autorizar solicitud",
      input: "select",
      inputOptions,
      inputPlaceholder: "Selecciona quien autoriza",
      inputValue:
        solicitud?.autorizadaPor !== null &&
        solicitud?.autorizadaPor !== undefined
          ? String(solicitud.autorizadaPor)
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

    await this.updateAuthorization(solicitud.id, {
      estatus: 0,
      autorizadaPor: Number(value),
      motivoNoAutorizacion: "",
      applicationUserId: this.authS.applicationUserId,
    });
  }

  async onOpenNoAutorizaModal(
    solicitudId: string,
    autorizadaPor: number | null,
  ) {
    const inputOptions = this.autorizacionOptions.reduce<
      Record<string, string>
    >((acc, item) => {
      acc[String(item.value)] = String(item.label);
      return acc;
    }, {});

    const result = await this.swalService.fire({
      title: "No se autoriza",
      html: `
        <div class="d-flex flex-column gap-2 text-left">
          <label for="swal-authorizer" class="font-semibold">Quien decide</label>
          <select id="swal-authorizer" class="swal2-select" style="display:flex; width:100%;">
            <option value="">Selecciona quien decide</option>
            ${Object.entries(inputOptions)
              .map(
                ([value, label]) =>
                  `<option value="${value}" ${String(autorizadaPor ?? "") === value ? "selected" : ""}>${label}</option>`,
              )
              .join("")}
          </select>
          <label for="swal-reason" class="font-semibold mt-2">Motivo</label>
          <textarea id="swal-reason" class="swal2-textarea" style="display:flex; width:100%; margin:0;" placeholder="Explica por que no se autoriza"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar decision",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const select = document.getElementById(
          "swal-authorizer",
        ) as HTMLSelectElement | null;
        const textarea = document.getElementById(
          "swal-reason",
        ) as HTMLTextAreaElement | null;
        const selectedAutorizadaPor = select?.value ?? "";
        const motivo = textarea?.value?.trim() ?? "";

        if (!selectedAutorizadaPor) {
          Swal.showValidationMessage("Selecciona quien toma la decision.");
          return null;
        }

        if (!motivo) {
          Swal.showValidationMessage(
            "Debes indicar el motivo de no autorizacion.",
          );
          return null;
        }

        return {
          autorizadaPor: Number(selectedAutorizadaPor),
          motivo,
        };
      },
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (!result.isConfirmed || !result.value) return;

    await this.updateAuthorization(solicitudId, {
      estatus: 1,
      autorizadaPor: result.value.autorizadaPor,
      motivoNoAutorizacion: result.value.motivo,
      applicationUserId: this.authS.applicationUserId,
    });
  }

  async onOpenDesautorizarModal(solicitudId: string) {
    const result = await this.swalService.fire({
      title: "Desautorizar solicitud",
      text: "La solicitud volvera a estado pendiente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Desautorizar",
      cancelButtonText: "Cancelar",
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (!result.isConfirmed) return;

    await this.updateAuthorization(solicitudId, {
      estatus: 2,
      autorizadaPor: null,
      motivoNoAutorizacion: "",
      applicationUserId: this.authS.applicationUserId,
    });
  }

  async updateAuthorization(solicitudId: string, payload: any) {
    const result = await this.apiResponseS.onPut(
      Endpoints.PurchaseRequests.cuadroComparativoUpdate(solicitudId),
      payload,
    );

    if (result) this.applyAuthorizationUpdate(solicitudId, payload);
  }

  private applyAuthorizationUpdate(solicitudId: string, payload: any) {
    const statusDisplay =
      payload.estatus === 0
        ? "Autorizado"
        : payload.estatus === 1
          ? "Denegado"
          : "Pendiente";
    const authorizer = this.autorizacionOptions.find(
      (option) => option.value === payload.autorizadaPor,
    );

    const updateSolicitud = (solicitud: any) =>
      solicitud.id === solicitudId
        ? {
            ...solicitud,
            estatus: payload.estatus,
            estatusDisplay: statusDisplay,
            autorizadaPor: payload.autorizadaPor ?? null,
            autorizadaPorDisplay: authorizer?.label ?? "Sin autorizacion",
            motivoNoAutorizacion: payload.motivoNoAutorizacion || "",
          }
        : solicitud;

    this.solicitudesSignal.update((items) => items.map(updateSolicitud));
    this.presentationSlides.update((slides) =>
      slides.map((slide) =>
        slide.kind === "solicitud" ? updateSolicitud(slide) : slide,
      ),
    );
  }

  onCarouselPage(event: number | { page?: number; startPosition?: number }) {
    const page =
      typeof event === "number"
        ? event
        : (event.page ?? event.startPosition ?? 0);
    if (page !== this.currentPage()) this.currentPage.set(page);
  }

  goToSummary() {
    this.currentPage.set(0);
  }

  previousSlide() {
    if (this.currentPage() <= 0) return;
    const nextPage = this.currentPage() - 1;
    this.currentPage.set(nextPage);
  }

  nextSlide() {
    const total = this.presentationSlides().length;
    if (this.currentPage() >= total - 1) return;
    const nextPage = this.currentPage() + 1;
    this.currentPage.set(nextPage);
  }
}
