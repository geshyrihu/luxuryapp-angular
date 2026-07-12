import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import { LxCarousel } from "@ui/adaptive/carousel/carousel";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { AppImage } from "@ui/web/image/image";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { AutorizacionCuadroComparativo } from "src/app/core/enums/autorizacion-cuadro-comparativo.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { SwalService } from "src/app/core/services/swal.service";
import Swal from "sweetalert2";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { Carousel } from "primeng/carousel";

@Component({
  selector: "app-solicitud-compra-presentacion",
  templateUrl: "./solicitud-compra-presentacion.html",
  imports: [
    WebButtonIcon,
    CommonModule,
    LxCarousel,
    AppImage,
    TableModule,
    WebButtonLabel,
    WebButtonLabelViewPdf,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }

      .presentation-shell {
        background:
          radial-gradient(
            circle at top right,
            rgba(25, 118, 210, 0.08),
            transparent 26%
          ),
          linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
        min-height: 100%;
        overflow-x: hidden;
      }

      :host ::ng-deep .presentation-carousel .p-carousel-content {
        align-items: stretch;
        gap: 0;
      }

      :host ::ng-deep .presentation-carousel .p-carousel-container {
        align-items: flex-start;
      }

      :host ::ng-deep .presentation-carousel .p-carousel-indicator-list {
        margin: 0.35rem 0 0;
        gap: 0.35rem;
        justify-content: center;
      }

      :host ::ng-deep .presentation-carousel .p-carousel-item {
        padding: 0 !important;
      }

      :host ::ng-deep .presentation-carousel .p-carousel-item > div {
        width: 100%;
      }

      :host ::ng-deep .presentation-carousel .p-carousel-indicator button {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 999px;
      }

      .presentation-slide {
        background: #ffffff;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 24px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
        overflow: hidden;
      }

      .presentation-accent {
        height: 0.45rem;
        background: linear-gradient(
          90deg,
          var(--primary-color) 0%,
          #0ea5e9 100%
        );
      }

      .presentation-kicker {
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .evidence-frame {
        background: #fff;
        border: 1px solid var(--surface-border);
        border-radius: 16px;
        overflow: hidden;
      }

      .provider-card {
        border-radius: 18px;
        padding: 1rem 1.1rem;
        border: 1px solid var(--surface-border);
        background: #f8fafc;
      }

      .provider-metric {
        min-width: 6.5rem;
      }
    `,
  ],
})
export class SolicitudCompraPresentacion {
  @ViewChild("presentationCarousel") presentationCarousel?: Carousel;

  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  swalService = inject(SwalService);

  solicitudesSignal = signal<any[]>([]);
  presentationSlides = signal<any[]>([]);
  optimizeMap = signal<Record<string, boolean>>({});
  solicitudIds: string[] = [];
  currentPage = signal(0);

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
        this.solicitudesSignal.set([]);
        this.presentationSlides.set([]);
      }
    });
  }

  async onLoadSelectedSolicitudes(customerId: string) {
    this.currentPage.set(0);

    const selectedItems = await this.apiResponseS.onGetList<any[]>(
      Endpoints.PurchaseRequests.presentation(customerId),
    );

    const ids = Array.from(selectedItems || []).map((item: any) => item.id);
    this.solicitudIds = ids;

    if (ids.length === 0) {
      this.solicitudesSignal.set([]);
      this.presentationSlides.set([]);
      return;
    }

    await this.onLoadSolicitudes(ids);
  }

  async onLoadSolicitudes(ids: string[]) {
    const requests = ids.map((id) =>
      this.apiResponseS.onGetItem(
        Endpoints.PurchaseRequests.cuadroComparativo(id),
      ),
    );

    const results = await Promise.all(requests);
    const formatted = (results || [])
      .filter(Boolean)
      .map((item: any) => this.mapSolicitudForPresentation(item));

    this.solicitudesSignal.set(formatted);
    this.presentationSlides.set([
      {
        id: "summary-slide",
        kind: "summary",
        rows: formatted.map((solicitud, index) =>
          this.mapSolicitudSummaryRow(solicitud, index),
        ),
      },
      ...formatted.map((solicitud) => ({
        kind: "solicitud",
        ...solicitud,
      })),
    ]);
    this.currentPage.set(0);
    this.optimizeMap.update((prev) => {
      const next = { ...prev };
      for (const solicitud of formatted) {
        next[solicitud.id] = next[solicitud.id] ?? false;
      }
      return next;
    });
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
      costoTotalConIva: solicitud.cheapestTotal || 0,
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
    };
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

  isBestProvider(total: number, solicitud: any): boolean {
    return total > 0 && total === solicitud.cheapestTotal;
  }

  canOptimizeProducts(solicitud: any): boolean {
    return (solicitud?.solicitudCompraDetalle?.length || 0) > 4;
  }

  isOptimized(solicitudId: string): boolean {
    return !!this.optimizeMap()[solicitudId];
  }

  toggleOptimizeProducts(solicitudId: string) {
    this.optimizeMap.update((prev) => ({
      ...prev,
      [solicitudId]: !prev[solicitudId],
    }));
  }

  getDisplayedSolicitudDetalle(solicitud: any): any[] {
    const details = Array.from(solicitud?.solicitudCompraDetalle || []);
    if (!this.isOptimized(solicitud.id) || details.length <= 4) {
      return details;
    }

    return [
      {
        id: `${solicitud.id}-grouped`,
        producto: `PRODUCTOS AGRUPADOS (${details.length} PARTIDAS)`,
        cantidad: details.reduce(
          (sum: number, item: any) => sum + (item.cantidad || 0),
          0,
        ),
        unidadMedida: "Lote",
        total: solicitud.total1,
        total2: solicitud.total2,
        total3: solicitud.total3,
      },
    ];
  }

  getBudgetAccumulated(budget: any): number {
    return (
      (budget.totalGastadoEjecutado || 0) + (budget.totalGastosPendientes || 0)
    );
  }

  getProviderColumnWidth(providerCount: number): number {
    if (providerCount <= 0) return 0;
    return 50 / providerCount;
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
        <div class="flex flex-column gap-2 text-left">
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

    if (result) {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        await this.onLoadSelectedSolicitudes(customerId);
      }
    }
  }

  onCarouselPage(event: { page: number }) {
    this.currentPage.set(event.page ?? 0);
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
