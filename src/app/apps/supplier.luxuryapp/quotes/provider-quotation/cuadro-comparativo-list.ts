import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";

import { AppImage } from "@ui/web/image/image";
import { DividerModule } from "@ui/web/primeng-divider/primeng-divider";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { AutorizacionCuadroComparativo } from "src/app/core/enums/autorizacion-cuadro-comparativo.enum";
import { TooltipPlacement } from "src/app/core/enums/tooltip-placement.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { AiService } from "src/app/core/services/ai.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import Swal from "sweetalert2";
import { CuadroComparativoAddProveedor } from "./cuadro-comparativo-add-proveedor";
import { CuadroComparativoCotizacion } from "./cuadro-comparativo-cotizacion";

import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";

import { LxModal } from "@ui/adaptive/modal/modal";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-cuadro-comparativo-list",
  templateUrl: "./cuadro-comparativo-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    WebButtonIconViewPdf,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DividerModule,
    AppImage,
    WebButtonLabel,
    CustomInputSelectSignal,
    LxModal,
  ],
})
export class CuadroComparativoList implements OnInit, OnDestroy {
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
  budgetSignal = signal<any[]>([]);
  availableBudgetSignal = signal<any[]>([]);

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
  optimizeProducts = false;

  autorizacionOptions: SelectItemDto[] = [
    { label: "Comite", value: AutorizacionCuadroComparativo.Comite },
    {
      label: "Administrador",
      value: AutorizacionCuadroComparativo.Administrador,
    },
    { label: "Supervisor", value: AutorizacionCuadroComparativo.Supervisor },
    { label: "Direccion", value: AutorizacionCuadroComparativo.Direccion },
  ];
  comiteEventsSignal = signal<any[]>([]);
  selectedEvidenceFiles: File[] = [];
  selectedEvidencePreviewUrls: string[] = [];
  showBudgetModal = false;
  budgetSelectOptionsSignal = signal<SelectItemDto[]>([]);
  budgetAccountControl = new FormControl<string | null>(null);

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

  ngOnDestroy(): void {
    this.revokeSelectedEvidencePreviews();
  }

  onLoadData() {
    if (!this.solicitudCompraId) return;

    this.onResetData();
    const urlApi =
      Endpoints.RefactorSupplier.solicitudcompraCuadrocomparativoById(
        this.solicitudCompraId,
      );

    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (!result) return;

      this.folio = result.folio;
      this.solicitudCompra = result;
      this.evidenciasSignal.set(result.evidencias || []);
      this.budgetSignal.set(result.budgets || []);
      this.cotizacionProveedorSignal.set(result.cotizacionProveedor);
      this.solicitudCompraDetalleSignal.set(result.solicitudCompraDetalle);
      this.setupProvidersAnDTOtals();
      this.onEvaluationPriceTotal();
      this.onTotalPreciosMenores(this.solicitudCompraDetalleSignal());
      this.onLoadAvailableBudgets();
    });
  }

  onLoadAvailableBudgets() {
    this.apiResponseS
      .onGetItem(
        Endpoints.RefactorSupplier.solicitudCompraCuadroComparativoByIdBudgets(
          this.solicitudCompraId,
        ),
      )
      .then((result: any) => {
        const accounts = Array.from(result?.accounts || []);
        this.availableBudgetSignal.set(accounts);
        this.budgetSelectOptionsSignal.set(
          accounts.map((item: any) => ({
            label: `${item.accountNumber} | ${item.accountName} | Restante ${this.formatCurrency(item.availableBudget)}`,
            value: item.accountNumber,
          })),
        );
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

    const statusSelection = await this.swalService.fire({
      title: "Resolver solicitud",
      input: "radio",
      inputOptions: {
        autorizar: "Autorizar",
        denegar: "No se autoriza",
      },
      inputValidator: (value: string) => {
        if (!value) {
          return "Selecciona una opci\u00f3n.";
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
      await this.onOpenNoAutorizaModal();
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
      .onPut(
        Endpoints.PurchaseRequests.cuadroComparativoUpdate(
          this.solicitudCompraId,
        ),
        {
          estatus: 0,
          autorizadaPor: Number(value),
          motivoNoAutorizacion: "",
          applicationUserId: this.authS.applicationUserId,
        },
      )
      .then((result) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  async onOpenNoAutorizaModal() {
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
          <select id="swal-authorizer" class="swal2-select" class="flex w-full">
            <option value="">Selecciona quien decide</option>
            ${Object.entries(inputOptions)
              .map(
                ([value, label]) =>
                  `<option value="${value}">${label}</option>`,
              )
              .join("")}
          </select>
          <label for="swal-reason" class="font-semibold mt-2">Motivo</label>
          <textarea id="swal-reason" class="swal2-textarea" class="flex w-full m-0" placeholder="Explica por que no se autoriza"></textarea>
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
        const autorizadaPor = select?.value ?? "";
        const motivo = textarea?.value?.trim() ?? "";

        if (!autorizadaPor) {
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
          autorizadaPor: Number(autorizadaPor),
          motivo,
        };
      },
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (!result.isConfirmed || !result.value) return;

    this.apiResponseS
      .onPut(
        Endpoints.PurchaseRequests.cuadroComparativoUpdate(
          this.solicitudCompraId,
        ),
        {
          estatus: 1,
          autorizadaPor: result.value.autorizadaPor,
          motivoNoAutorizacion: result.value.motivo,
          applicationUserId: this.authS.applicationUserId,
        },
      )
      .then((response) => {
        if (response) {
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
      .onPut(
        Endpoints.PurchaseRequests.cuadroComparativoUpdate(
          this.solicitudCompraId,
        ),
        {
          estatus: 2,
          autorizadaPor: null,
          motivoNoAutorizacion: "",
          applicationUserId: this.authS.applicationUserId,
        },
      )
      .then((response) => {
        if (response) {
          this.onLoadData();
        }
      });
  }

  isAuthorized() {
    return this.solicitudCompra?.estatus === 0;
  }

  isDenied() {
    return this.solicitudCompra?.estatus === 1;
  }

  canOptimizeProducts() {
    return this.solicitudCompraDetalleSignal().length > 4;
  }

  toggleOptimizeProducts() {
    if (!this.canOptimizeProducts()) return;
    this.optimizeProducts = !this.optimizeProducts;
  }

  getDisplayedSolicitudDetalle() {
    const details = this.solicitudCompraDetalleSignal();

    if (!this.optimizeProducts || details.length <= 4) {
      return details;
    }

    return [
      {
        producto: `PRODUCTOS AGRUPADOS (${details.length} PARTIDAS)`,
        cantidad: details.reduce(
          (sum, item) => sum + Number(item.cantidad || 0),
          0,
        ),
        unidadMedida: "Lote",
        total: this.total1,
        total2: this.total2,
        total3: this.total3,
      },
    ];
  }

  getVisualEvidenceCards() {
    const uploadedCards = this.evidenciasSignal().map((evidencia) => ({
      id: evidencia.id,
      src: evidencia.fileUrl,
      alt: evidencia.fileName,
      isPending: false,
    }));

    const pendingCards = this.selectedEvidencePreviewUrls.map(
      (previewUrl, index) => ({
        id: `pending-${index}`,
        src: previewUrl,
        alt: this.selectedEvidenceFiles[index]?.name || "Vista previa",
        isPending: true,
      }),
    );

    return [...uploadedCards, ...pendingCards].slice(0, 4);
  }

  async onOpenAddBudgetModal() {
    if (this.availableBudgetSignal().length === 0) {
      this.customToastService.showInfo(
        "Sin presupuestos",
        "No se encontraron cuentas presupuestales disponibles para seleccionar.",
      );
      return;
    }

    this.budgetAccountControl.setValue(null);
    this.showBudgetModal = true;
  }

  async onConfirmAddBudgetModal() {
    const selectedAccountNumber = this.budgetAccountControl.value;
    if (!selectedAccountNumber) {
      this.customToastService.showInfo(
        "Cuenta requerida",
        "Selecciona una cuenta presupuestal para continuar.",
      );
      return;
    }

    const budgetData = this.availableBudgetSignal().find(
      (item) => item.accountNumber === selectedAccountNumber,
    );
    if (!budgetData) return;

    this.showBudgetModal = false;

    const amountModal = await this.swalService.fire({
      title: "Monto a usar",
      input: "number",
      inputLabel: `${budgetData.accountNumber} | Restante ${this.formatCurrency(budgetData.availableBudget)}`,
      inputValue: String(this.getCheapestQuotationTotal()),
      inputAttributes: {
        min: "0.01",
        step: "0.01",
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      inputValidator: (value: string) => {
        const amount = Number(value);
        if (!value || Number.isNaN(amount) || amount <= 0) {
          return "Ingresa un monto v\u00e1lido.";
        }
        if (amount > Number(budgetData.availableBudget)) {
          return "El monto excede el presupuesto restante.";
        }
        return null;
      },
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (!amountModal.isConfirmed || !amountModal.value) return;

    this.apiResponseS
      .onPost(
        Endpoints.RefactorSupplier.solicitudCompraCuadroComparativoByIdBudgets(
          this.solicitudCompraId,
        ),
        {
          fiscalYear: String(this.getFiscalYear()),
          accountNumber: budgetData.accountNumber,
          accountName: budgetData.accountName,
          amount: Number(amountModal.value),
        },
      )
      .then((result) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onCancelAddBudgetModal() {
    this.showBudgetModal = false;
    this.budgetAccountControl.setValue(null);
  }

  onDeleteBudget(budgetId: string) {
    this.apiResponseS
      .onDelete(
        Endpoints.RefactorSupplier.solicitudCompraCuadroComparativoBudgetsById(
          budgetId,
        ),
      )
      .then((success) => {
        if (success) {
          this.onLoadData();
        }
      });
  }

  getFiscalYear() {
    if (this.solicitudCompra?.fechaSolicitud) {
      return new Date(this.solicitudCompra.fechaSolicitud).getFullYear();
    }

    return new Date().getFullYear();
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  }

  getCheapestQuotationTotal() {
    const validTotals = [this.total1, this.total2, this.total3].filter(
      (value) => Number(value) > 0,
    );

    if (validTotals.length === 0) {
      return 0;
    }

    return Math.min(...validTotals);
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

    this.revokeSelectedEvidencePreviews();
    this.selectedEvidenceFiles = files.slice(0, availableSlots);
    this.selectedEvidencePreviewUrls = this.selectedEvidenceFiles.map((file) =>
      URL.createObjectURL(file),
    );
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
        Endpoints.PurchaseRequests.cuadroComparativoEvidences(
          this.solicitudCompraId,
        ),
        formData,
      );

      if (!result) {
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      this.revokeSelectedEvidencePreviews();
      this.selectedEvidenceFiles = [];
      this.onLoadData();
    }
  }

  onDeleteEvidence(evidenceId: string) {
    this.apiResponseS
      .onDelete(
        Endpoints.PurchaseRequests.cuadroComparativoEvidenceDelete(evidenceId),
      )
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

  onToggleRequiereContrato() {
    const nuevoValor = !this.solicitudCompra.requiereContrato;
    this.apiResponseS
      .onPut(
        Endpoints.PurchaseRequests.cuadroComparativoUpdate(
          this.solicitudCompraId,
        ),
        {
          estatus: this.solicitudCompra.estatus,
          autorizadaPor: this.solicitudCompra.autorizadaPor ?? null,
          motivoNoAutorizacion: this.solicitudCompra.motivoNoAutorizacion ?? "",
          applicationUserId: this.authS.applicationUserId,
          requiereContrato: nuevoValor,
          comiteGoogleCalendarEventId:
            this.solicitudCompra.comiteGoogleCalendarEventId ?? null,
        },
      )
      .then((result) => {
        if (result) {
          this.solicitudCompra = {
            ...this.solicitudCompra,
            requiereContrato: nuevoValor,
          };
        }
      });
  }

  async onOpenAsignarJuntaModal() {
    let events = this.comiteEventsSignal();

    if (events.length === 0) {
      const fetched: any = await this.apiResponseS.onGetItem(
        Endpoints.PurchaseRequests.comiteEvents(
          this.solicitudCompra.customerId,
        ),
      );
      events = Array.isArray(fetched) ? fetched : [];
      this.comiteEventsSignal.set(events);
    }

    if (events.length === 0) {
      this.customToastService.showInfo(
        "Sin juntas",
        "No hay eventos de comite disponibles para este cliente.",
      );
      return;
    }

    const inputOptions: Record<string, string> = { "": "-- Sin asignar --" };
    for (const e of events) {
      const fecha = new Date(e.startAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      inputOptions[e.id] = `${fecha} | ${e.title}`;
    }

    const selected = await this.swalService.fire({
      title: "Asignar a junta de comite",
      input: "select",
      inputOptions,
      inputValue: this.solicitudCompra.comiteGoogleCalendarEventId ?? "",
      inputPlaceholder: "Selecciona una junta",
      showCancelButton: true,
      confirmButtonText: "Asignar",
      cancelButtonText: "Cancelar",
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (!selected.isConfirmed) return;

    const eventoId = selected.value === "" ? null : selected.value;

    this.apiResponseS
      .onPut(
        Endpoints.PurchaseRequests.cuadroComparativoUpdate(
          this.solicitudCompraId,
        ),
        {
          estatus: this.solicitudCompra.estatus,
          autorizadaPor: this.solicitudCompra.autorizadaPor ?? null,
          motivoNoAutorizacion: this.solicitudCompra.motivoNoAutorizacion ?? "",
          applicationUserId: this.authS.applicationUserId,
          requiereContrato: this.solicitudCompra.requiereContrato,
          comiteGoogleCalendarEventId: eventoId,
        },
      )
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onResetData(): void {
    this.revokeSelectedEvidencePreviews();
    this.solicitudCompraDetalleSignal.set([]);
    this.cotizacionProveedorSignal.set([]);
    this.evidenciasSignal.set([]);
    this.budgetSignal.set([]);
    this.provider1 = undefined;
    this.provider2 = undefined;
    this.provider3 = undefined;
    this.total1 = 0;
    this.total2 = 0;
    this.total3 = 0;
  }

  revokeSelectedEvidencePreviews() {
    for (const previewUrl of this.selectedEvidencePreviewUrls) {
      URL.revokeObjectURL(previewUrl);
    }
    this.selectedEvidencePreviewUrls = [];
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
