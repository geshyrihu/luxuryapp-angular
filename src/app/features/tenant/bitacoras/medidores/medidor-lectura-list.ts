import { CommonModule, formatDate } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as FileSaver from "file-saver";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { MedidorLecturaAdminForm } from "./medidor-lectura-admin-form";
import { Endpoints } from "src/app/core/constants/endpoints";
import { MedidorLecturaForm } from "./medidor-lectura-form";
@Component({
  selector: "app-medidor-lectura-list",
  templateUrl: "./medidor-lectura-list.html",
  imports: [
    CommonModule,
    TableModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    CustomButtonDownload,
    TooltipModule,
    PrimeNgCustomTableFooter,
    ActionMenu,
    AppIcon,
    IonButtonDelete,
    IonButtonEdit,
  ],
})
export class MedidorLecturaList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  route = inject(ActivatedRoute);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  medidorId: string = "";
  constructor() {
    this.medidorId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.MeterReadings.listByMeter(this.medidorId);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
      }
    });
  }

  exportExcel() {
    import("xlsx").then((xlsx) => {
      const dataToExport = this.dataSignal().map((item) => ({
        Medidor: item.medidor || "",
        "Número de Medidor": item.numeroMedidor || "",
        Fecha: item.fechaRegistro
          ? formatDate(item.fechaRegistro, "dd-MMM-yyyy", "en-US", "UTC")
          : "",
        Lectura: item.lectura || 0,
      }));
      const worksheet = xlsx.utils.json_to_sheet(dataToExport);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, "lecturas");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.MeterReadings.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        MedidorLecturaAdminForm,
        {
          id: data.id,
          medidorId: this.medidorId,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  modalMedidorLecturaAddEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        MedidorLecturaForm,
        {
          medidorId: data.id,
          id: 0,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
  ];
  numeros = [65, 59, 80, 81, 56, 55, 40, 36, 95, 85];
}