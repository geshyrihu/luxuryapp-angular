import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DateService } from "@core/services/date.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PeriodMonthService } from "@core/services/periodo-month.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { SubirPdf } from "@ui/inputs/web/lux-input-upload-pdf-signal";
import type { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";
import { AyudaOrdenesServicio } from "./ayuda-ordenes-servicio";
import { OrdenesServicioListDesktop } from "./desktop/ordenes-servicio-list-desktop";
import { OrdenesServicioListMobile } from "./mobile/ordenes-servicio-list-mobile";
import { OrdenesServicioFotos } from "./ordenes-servicio-fotos";
import { OrdenesServicioListPdfService } from "./ordenes-servicio-list-pdf.service";
import { OrdenesServicioReporteProveedor } from "./ordenes-servicio-reporte-proveedor";
import { SeguimientoOrdenServicio } from "./seguimiento-orden-servicio";
import { ServiceOrderForm } from "./service-order-form";
import { ReporteOrdenesServicioService } from "./services/reporte-ordenes-servicio.service";
import { SuspensionOrdenServicio } from "./suspension-orden-servicio";
import { UploadImgForm } from "./upload-img-form";

@Component({
  selector: "app-ordenes-servicio-list",
  templateUrl: "./ordenes-servicio-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OrdenesServicioListDesktop, OrdenesServicioListMobile],
})
export class OrdenesServicio {
  apiResponseS = inject(ApiResponseService);
  customToastS = inject(CustomToastService);
  authS = inject(AuthService);
  route = inject(Router);
  customerIdS = inject(CustomerIdService);
  reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  dateS = inject(DateService);
  dialogHandlerS = inject(DialogHandlerService);
  periodMonthService = inject(PeriodMonthService);
  pdfService = inject(OrdenesServicioListPdfService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  mm: number;
  fechaControl = new FormControl<string>("");
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  observations: [""];
  ref: DynamicDialogRef;

  nameCarpetaFecha = "";

  filtroEquiposValue: any = "todos";
  filtroId: any | string = "";
  filtroEquipos: { icon: AppIconName; id: any | string; nombre: string }[] = [
    {
      icon: "material-symbols-light:format-list-bulleted",
      id: "",
      nombre: "todos",
    },
    {
      icon: "material-symbols-light:star-outline",
      id: 2,
      nombre: "amenidades",
    },
    { icon: "material-symbols-light:home", id: 8, nombre: "A. Comunes" },
    { icon: "material-symbols-light:package", id: 7, nombre: "bodegas" },
    { icon: "material-symbols-light:settings", id: 1, nombre: "equipos" },
    { icon: "material-symbols-light:bolt", id: 5, nombre: "gimnasio" },
    { icon: "material-symbols-light:videocam", id: 6, nombre: "sistemas" },
    { icon: "material-symbols-light:palette", id: 10, nombre: "pintura" },
  ];

  onSegmentFilterChange(event: any) {
    const nombre = event.detail.value;
    const selectedItem = this.filtroEquipos.find((f) => f.nombre === nombre);
    if (selectedItem) {
      this.onReloadOrdenes(selectedItem.id, selectedItem.nombre);
    }
  }

  onReloadOrdenes(id: any, filtroEquiposValue: any) {
    this.filtroEquiposValue = filtroEquiposValue;
    this.filtroId = id;
    this.periodMonthService.setPeriodo(this.fechaControl.value || "");

    if (this.filtroId === 10) {
      this.onLoadPintura();
    } else {
      this.onLoadData();
    }
  }

  constructor() {
    const date = new Date();
    this.mm = date.getMonth() + 1;
    const initialFecha = [
      date.getFullYear(),
      (this.mm > 9 ? "" : "0") + this.mm,
    ].join("-");
    this.fechaControl.setValue(initialFecha);

    this.reporteOrdenesServicioService.setDate(Date.now);
    this.periodMonthService.setPeriodo(initialFecha);
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
        this.onReloadOrdenes(this.filtroId, this.filtroEquiposValue);
      }
    });
  }

  onNavigateToReport() {
    this.periodMonthService.setPeriodo(this.fechaControl.value || "");
    const converToDate = this.parseFechaControl();
    const fechaFormateada = this.dateS.getDateFormat(converToDate);
    this.pdfService.downloadReporte(fechaFormateada, this.filtroEquiposValue);
  }

  onNavigateToReportTabla() {
    const converToDate = this.parseFechaControl();
    const fechaFormateada = this.dateS.getDateFormat(converToDate);
    this.pdfService.downloadReporteTablaCategoria(
      this.dataSignal(),
      fechaFormateada,
      this.filtroEquiposValue,
    );
  }

  onNavigateToReportPorEquipo() {
    const desdePeriodo = window.prompt(
      "Generar reportes por equipo desde mes y año (AAAA-MM):",
      this.fechaControl.value || "",
    );

    if (desdePeriodo === null) return;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(desdePeriodo)) {
      this.customToastS.showWarn(
        "Periodo inválido",
        "Capture el periodo con formato AAAA-MM.",
      );
      return;
    }

    void this.pdfService.downloadReportesPorEquipo(desdePeriodo);
  }

  onModalFormUploadImg(id: any) {
    this.dialogHandlerS
      .openDialog(
        UploadImgForm,
        {
          serviceOrderId: id,
        },
        "Cargar Imagenes",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalFormUploadDoc(id: string) {
    this.dialogHandlerS
      .openDialog(
        SubirPdf,
        {
          serviceOrderId: id,
          pathUrl: "service-orders/subir-documento/",
        },
        "Cargar Documentos",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalFotos(id: string) {
    this.dialogHandlerS
      .openDialog(
        OrdenesServicioFotos,
        {
          id,
        },
        "Soporte Fotografico",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalRpeorteProveedor(id: any) {
    this.dialogHandlerS
      .openDialog(
        OrdenesServicioReporteProveedor,
        {
          id,
        },
        "Reportes de proveedor",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalAyuda() {
    this.dialogHandlerS.openDialog(
      AyudaOrdenesServicio,
      {},
      "Ayuda: Seguimiento y Suspensión",
      this.dialogHandlerS.sizeXl,
      true,
    );
  }

  onModalSeguimiento(id: string) {
    this.dialogHandlerS
      .openDialog(
        SeguimientoOrdenServicio,
        { id },
        "Seguimiento de la orden",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalSuspension(data: any) {
    this.dialogHandlerS
      .openDialog(
        SuspensionOrdenServicio,
        {
          id: data.id,
          suspensionReasonId: data.suspensionReasonId,
          suspensionNotes: data.suspensionNotes,
        },
        "Suspender orden de servicio",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onResume(id: string) {
    if (
      !window.confirm(
        "Se reanudara la orden de servicio y se limpiara la marca de suspensión. Continuar?",
      )
    ) {
      return;
    }

    this.apiResponseS
      .onPost(Endpoints.ServiceOrders.resume(id), {})
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  private parseFechaControl(): Date {
    const [year, month] = (this.fechaControl.value || "")
      .split("-")
      .map(Number);
    return new Date(year, month - 1, 1);
  }

  onLoadPintura() {
    let converToDate = this.parseFechaControl();
    this.reporteOrdenesServicioService.setDate(converToDate);

    const urlApi = Endpoints.ServiceOrders.listPintura(
      this.customerIdS.customerId(),
      this.dateS.getDateFormat(converToDate),
    );
    this.loading.set(true);
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => {
        this.dataSignal.set(result || []);
        this.reporteOrdenesServicioService.setData(this.dataSignal());

        if (this.dataSignal().length !== 0) {
          this.nameCarpetaFecha = this.dateS.getDateFormat(
            this.dataSignal()[0].requestDate,
          );
        }
      })
      .finally(() => this.loading.set(false));
  }
  onLoadData() {
    let converToDate = this.parseFechaControl();
    this.reporteOrdenesServicioService.setDate(converToDate);

    const fechaFormateada = this.dateS.getDateFormat(converToDate);
    let urlApi = Endpoints.ServiceOrders.listByCustomerAndDate(
      this.customerIdS.customerId(),
      fechaFormateada,
    );
    if (this.filtroId) {
      urlApi += `?inventoryCategory=${this.filtroId}`;
    }
    this.loading.set(true);
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => {
        this.dataSignal.set(result || []);

        this.reporteOrdenesServicioService.setData(this.dataSignal());

        if (this.dataSignal().length !== 0) {
          this.nameCarpetaFecha = this.dateS.getDateFormat(
            this.dataSignal()[0].requestDate,
          );
        }
      })
      .finally(() => this.loading.set(false));
  }

  onEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        ServiceOrderForm,
        {
          id: data.id,
          machineryId: data.machineryId,
          providerId: data.providerId,
        },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDelete(id: string) {
    const confirmed = await this.confirmS.confirm(
      "Se eliminara la orden de servicio junto con sus imágenes y documentos. Esta acción no se puede deshacer. Continuar?",
    );
    if (!confirmed) return;

    this.apiResponseS
      .onDelete(Endpoints.ServiceOrders.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
        }
      });
  }

  onNavigateMessage(id: any, status: number, nameGroup: string) {
    this.route.navigate(["/tickets/ticket-messages", id, status, nameGroup]);
  }
}
