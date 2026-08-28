import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import * as FileSaver from "file-saver";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { MedidorLecturaAdminForm } from "./medidor-lectura-admin-form";
import { MedidorLecturaForm } from "./medidor-lectura-form";

import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AuthService } from "../../../../../core/auth/services/auth.service";

@Component({
  selector: "app-medidor-lectura-list",
  templateUrl: "./medidor-lectura-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ActionMenu,
    WebButtonIconDownload,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    ApiDatePipe,
    TableModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    AppIcon,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    MobileListItem,
  ],
})
export class MedidorLecturaList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  route = inject(ActivatedRoute);
  private apiDatePipe = inject(ApiDatePipe);
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
    import("exceljs").then(async (ExcelJS) => {
      const dataToExport = this.dataSignal().map((item) => ({
        Medidor: item.medidor || "",
        "Número de Medidor": item.numeroMedidor || "",
        Fecha: item.fechaRegistro
          ? this.apiDatePipe.transform(item.fechaRegistro, "dd-MMM-yyyy")
          : "",
        Lectura: item.lectura || 0,
      }));

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("data");

      if (dataToExport.length > 0) {
        worksheet.columns = Object.keys(dataToExport[0]).map((key) => ({
          header: key,
          key,
        }));
        dataToExport.forEach((item) => worksheet.addRow(item));
      }

      const buffer = await workbook.xlsx.writeBuffer();
      this.saveAsExcelFile(buffer, "lecturas");
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
