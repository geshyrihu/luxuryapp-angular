import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import {
  type SegmentItem,
  SegmentedControl,
} from "@ui/shared/segmented-control/segmented-control";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { checkmarkCircleOutline } from "ionicons/icons";
import { startWith } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { HistorialComprasItem } from "./interfaces/historial-compras-item.interface";

const TIPO_COMPRA_OPTIONS: SegmentItem[] = [
  { label: "Todas", value: "all" },
  { label: "Fijos", value: "0" },
  { label: "Variable", value: "1" },
  { label: "Caja Chica", value: "2" },
  { label: "Extraordinario", value: "3" },
  { label: "Devoluciones", value: "4" },
  { label: "Tarjeta Debito", value: "5" },
  { label: "Proyectos", value: "6" },
  { label: "Nomina", value: "7" },
  { label: "Impuestos", value: "8" },
];

const TIPO_ORDEN_OPTIONS: SegmentItem[] = [
  { label: "Todas", value: "all" },
  { label: "Ordinaria", value: "1" },
  { label: "Progresiva", value: "2" },
  { label: "Fuera de fondeo", value: "3" },
];

const ESTADO_PAGO_OPTIONS: SegmentItem[] = [
  { label: "Todas", value: "0" },
  { label: "Pagadas", value: "1" },
  { label: "No pagadas", value: "2" },
];

const ESTADO_AUTORIZACION_OPTIONS: SegmentItem[] = [
  { label: "Todas", value: "all" },
  { label: "Autorizadas", value: "0" },
  { label: "Denegadas", value: "1" },
  { label: "Pendientes", value: "2" },
];

type HistorialComprasDateFilterForm = {
  fechaInicio: FormControl<Date | string | null>;
  fechaFin: FormControl<Date | string | null>;
};

@Component({
  selector: "app-historial-compras-list",
  templateUrl: "./historial-compras-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconEdit,
    MobileActionMenu,
    MobileButtonLabelEdit,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileListItem,
    AppIcon,
    SegmentedControl,
    CustomInputDateSignal,
  ],
})
export class HistorialComprasList {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly router = inject(Router);

  readonly dataSignal = signal<HistorialComprasItem[]>([]);
  readonly loading = signal(true);
  readonly selectedEstadoPago = signal("0");
  readonly selectedEstadoAutorizacion = signal("all");
  readonly selectedTipoCompra = signal("all");
  readonly selectedTipoOrden = signal("all");
  readonly estadoPagoOptions = ESTADO_PAGO_OPTIONS;
  readonly estadoAutorizacionOptions = ESTADO_AUTORIZACION_OPTIONS;
  readonly tipoCompraOptions = TIPO_COMPRA_OPTIONS;
  readonly tipoOrdenOptions = TIPO_ORDEN_OPTIONS;
  readonly dateRangePresets = [
    { label: "Hoy", days: 0, mode: "today" as const },
    { label: "Esta semana", mode: "week" as const },
    { label: "Este mes", mode: "month" as const },
    { label: "Ultimos 30 dias", days: 30, mode: "days" as const },
    { label: "Este anio", mode: "year" as const },
  ];
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  readonly tablePrimeNgRows = tablePrimeNgRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly filterForm = new FormGroup<HistorialComprasDateFilterForm>({
    fechaInicio: new FormControl<Date | string | null>(null),
    fechaFin: new FormControl<Date | string | null>(null),
  });
  readonly fechaInicioValue = toSignal(
    this.filterForm.controls.fechaInicio.valueChanges.pipe(
      startWith(this.filterForm.controls.fechaInicio.value),
    ),
    { initialValue: this.filterForm.controls.fechaInicio.value },
  );
  readonly fechaFinValue = toSignal(
    this.filterForm.controls.fechaFin.valueChanges.pipe(
      startWith(this.filterForm.controls.fechaFin.value),
    ),
    { initialValue: this.filterForm.controls.fechaFin.value },
  );

  constructor() {
    addIcons({ checkmarkCircleOutline });

    effect(() => {
      const customerId = this.customerIdS.customerId();
      const estadoPago = this.selectedEstadoPago();
      const estadoAutorizacion = this.selectedEstadoAutorizacion();
      const tipoCompra = this.selectedTipoCompra();
      const tipoOrden = this.selectedTipoOrden();
      const fechaInicio = this.fechaInicioValue();
      const fechaFin = this.fechaFinValue();

      if (!customerId) {
        this.dataSignal.set([]);
        this.loading.set(false);
        return;
      }

      this.onLoadData(
        Number(estadoPago),
        this.toOptionalNumber(estadoAutorizacion),
        this.toOptionalNumber(tipoCompra),
        this.toOptionalNumber(tipoOrden),
        this.toApiDate(fechaInicio),
        this.toApiDate(fechaFin),
      );
    });
  }

  onLoadData(
    estadoPago: number,
    estatus: number | null,
    tipoGasto: number | null,
    tipoOrden: number | null,
    fechaInicio: string | null,
    fechaFin: string | null,
  ): void {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      this.dataSignal.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    const urlApi = Endpoints.PurchaseHistory.listPaid(
      customerId,
      estadoPago,
      estatus,
      tipoGasto,
      tipoOrden,
      fechaInicio,
      fechaFin,
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: HistorialComprasItem[] | null) => {
        this.dataSignal.set(result ?? []);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  applyDatePreset(
    mode: "today" | "week" | "month" | "days" | "year",
    days = 0,
  ): void {
    const now = new Date();
    let start = new Date(now);
    const end = new Date(now);

    switch (mode) {
      case "today":
        break;
      case "week":
        start.setDate(now.getDate() - now.getDay());
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "days":
        start.setDate(now.getDate() - days);
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
    }

    this.filterForm.patchValue({
      fechaInicio: start,
      fechaFin: end,
    });
  }

  clearDateRange(): void {
    this.filterForm.patchValue({
      fechaInicio: null,
      fechaFin: null,
    });
  }

  onViewOrder(id: string): void {
    this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(id));
  }

  private toOptionalNumber(value: string): number | null {
    return value === "all" ? null : Number(value);
  }

  private toApiDate(value: Date | string | null): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === "string") {
      const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        return isoMatch[0];
      }

      const localMatch = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (localMatch) {
        const [, day, month, year] = localMatch;
        return `${year}-${month}-${day}`;
      }

      return null;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
