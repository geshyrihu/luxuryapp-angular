import { CommonModule } from "@angular/common";
import { Endpoints } from "src/app/core/constants/endpoints";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonItem } from "src/app/core/components/buttons/mobile";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button"; // Importar CustomButton
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item"; // Importar CustomButtonItem
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { SubirPdf } from "src/app/core/components/inputs/web/custom-input-upload-pdf-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { ReporteOrdenesServicioService } from "src/app/core/services/reporte-ordenes-servicio.service";
import { resolvePrimeIcon } from "src/app/core/utils/prime-icon-resolver";
import { OrdenesServicioFotos } from "./ordenes-servicio-fotos";
import { OrdenesServicioReporteProveedor } from "./ordenes-servicio-reporte-proveedor";
import { ServiceOrderForm } from "./service-order-form";
import { UploadImgForm } from "./upload-img-form";
import { OrdenesServicioListPdfService } from "./ordenes-servicio-list-pdf.service";
// ... (skipping other imports)|

@Component({
  selector: "app-ordenes-servicio-list",
  templateUrl: "./ordenes-servicio-list.html",
  imports: [
    CommonModule,
    CustomButtonDelete,
    CustomButtonEdit,
    CustomButton, // Añadir CustomButton a imports
    CustomButtonItem,
    DataViewMobile,
    ActionMenu,
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputTextModule,
    PrimeNgCustomCaption,
    RouterModule,
    TableModule,
    TagModule,
    TooltipModule,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonLabel,
    IonButtonItem,
  ],
})
export class OrdenesServicio {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  route = inject(Router);
  customerIdS = inject(CustomerIdService);
  reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  dateS = inject(DateService);
  dialogHandlerS = inject(DialogHandlerService);
  periodMonthService = inject(PeriodMonthService); // Asegurarse de que esté inyectado
  pdfService = inject(OrdenesServicioListPdfService);

  mm: number;
  fechaControl = new FormControl<string>("");
  dataSignal = signal<any[]>([]);
  readonly resolvePrimeIcon = resolvePrimeIcon;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  observations: [""];
  ref: DynamicDialogRef;

  // urlImg: string = '';
  nameCarpetaFecha = "";

  filtroEquiposValue: any = "todos";
  filtroId: any | string = "";
  filtroEquipos = [
    { icon: "mdi:format-list-bulleted", id: "", nombre: "todos" },
    { icon: "mdi:star-outline", id: 2, nombre: "amenidades" },
    { icon: "mdi:home", id: 8, nombre: "A. Comunes" },
    { icon: "mdi:package", id: 7, nombre: "bodegas" },
    { icon: "mdi:cog", id: 1, nombre: "equipos" },
    { icon: "mdi:lightning-bolt", id: 5, nombre: "gimnasio" },
    { icon: "mdi:video", id: 6, nombre: "sistemas" },
    { icon: "mdi:palette", id: 10, nombre: "pintura" },
  ];

  getInventoryIconClass(icon: string | null | undefined): string {
    return this.resolvePrimeIcon(icon, "mdi:package");
  }

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
    this.periodMonthService.setPeriodo(this.fechaControl.value || ""); // Actualizar el servicio con la nueva fecha usando el método correcto

    if (this.filtroId === 10) {
      this.onLoadPintura();
    } else {
      this.onLoadData();
    }
  }

  constructor() {
    const date = new Date(); // Inicializar date dentro del constructor
    this.mm = date.getMonth() + 1;
    const initialFecha = [
      date.getFullYear(),
      (this.mm > 9 ? "" : "0") + this.mm,
    ].join("-");
    this.fechaControl.setValue(initialFecha);

    this.reporteOrdenesServicioService.setDate(Date.now);
    this.periodMonthService.setPeriodo(initialFecha); // Establecer fecha inicial en el servicio usando el método correcto
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
        this.onReloadOrdenes(this.filtroId, this.filtroEquiposValue);
      }
    });
  }

  // Descargar reporte PDF directamente
  onNavigateToReport() {
    this.periodMonthService.setPeriodo(this.fechaControl.value || "");
    const converToDate = this.parseFechaControl();
    const fechaFormateada = this.dateS.getDateFormat(converToDate);
    this.pdfService.downloadReporte(fechaFormateada, this.filtroEquiposValue);
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
          pathUrl: "ServiceOrders/SubirDocumento/",
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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  private parseFechaControl(): Date {
    const [year, month] = (this.fechaControl.value || "").split("-").map(Number);
    return new Date(year, month - 1, 1);
  }

  onLoadPintura() {
    let converToDate = this.parseFechaControl();
    this.reporteOrdenesServicioService.setDate(converToDate);

    const urlApi = Endpoints.ServiceOrders.listPintura(
      this.customerIdS.customerId(),
      this.dateS.getDateFormat(converToDate),
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result || []);
      this.reporteOrdenesServicioService.setData(this.dataSignal());

      if (this.dataSignal().length !== 0) {
        this.nameCarpetaFecha = this.dateS.getDateFormat(
          this.dataSignal()[0].requestDate,
        );
      }
    });
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
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result || []);

      this.reporteOrdenesServicioService.setData(this.dataSignal());

      if (this.dataSignal().length !== 0) {
        this.nameCarpetaFecha = this.dateS.getDateFormat(
          this.dataSignal()[0].requestDate,
        );
      }
    });
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

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(`ServiceOrders/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
        }
      });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return "Pendiente";
      case 1:
        return "Terminado";
      case 2:
        return "No Autorizado";
      case 4:
        return "Cancelado";
      default:
        return "";
    }
  }

  getBadgeSeverity(status: number): string {
    switch (status) {
      case 0:
        return "danger"; // bg-danger en Bootstrap
      case 1:
        return "success"; // bg-success en Bootstrap
      case 2:
        return "secondary"; // bg-secondary en Bootstrap
      case 4:
        return "secondary"; // bg-secondary en Bootstrap
      default:
        return "";
    }
  }

  onNavigateMessage(id: any, status: number, nameGroup: string) {
    this.route.navigate(["/tickets/ticket-messages", id, status, nameGroup]);
  }
}
