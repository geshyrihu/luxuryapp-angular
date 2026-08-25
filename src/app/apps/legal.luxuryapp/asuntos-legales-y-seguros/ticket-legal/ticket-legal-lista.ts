import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconEdit, WebButtonIconTracking } from "@ui/buttons";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TicketLegalActualizarEstado } from "./ticket-legal-actualizar-estado";
import { TicketLegalEditar } from "./ticket-legal-editar";
import { TicketLegalForm } from "./ticket-legal-form";
import { TicketLegalSeguimiento } from "./ticket-legal-seguimiento";
import { TicketLegalSeguimientoSolicitudDetalle } from "./ticket-legal-seguimiento-solicitud-detalle";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { AspRoleService } from "../../../../core/auth/services/asp-role.service";

@Component({
  selector: "app-ticket-legal-lista",
  templateUrl: "./ticket-legal-lista.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CustomInputSelectSignal,
    WebButtonIconDownload,
    MobileActionMenu,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    FormsModule,
    TableModule,
    LxTooltipDirective,
    LxTag,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonIconEdit,
    DataViewMobile,
    WebButtonIconTracking,
    MobileListItem,
    AppIcon,
  ],
})
export class TicketLegalLista implements OnInit {
  private dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  public aspRoleS = inject(AspRoleService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  isSuperUser = this.aspRoleS.hasRole(ApplicationRole.SuperUsuario);

  dataSignal = signal<any[]>([]);
  cb_customer = signal<SelectItemDto[]>([]);
  selectedCustomerId = signal<string | undefined>(undefined);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  inputValue: string = "";
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {}

  ngOnInit() {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.customersActiveShortName,
      )
      .then((result: any) => this.cb_customer.set(result ?? []));
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalAll(this.selectedCustomerId()))
      .then((result: any) => {
        this.dataSignal.set(result ?? []);
        this.loading.set(false);
      });
  }

  onCustomerFilter(customerId: string | undefined) {
    this.selectedCustomerId.set(customerId);
    this.onLoadData();
  }

  onModalEdit(data: any) {
    this.dialogHandlerS
      .openDialog(TicketLegalEditar, data, "", this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(TicketLegalForm, data, "", this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalUpdateStatus(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketLegalActualizarEstado,
        data,
        "",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalSeguimiento(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketLegalSeguimiento,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalViewDetail(data: any) {
    this.dialogHandlerS.openDialog(
      TicketLegalSeguimientoSolicitudDetalle,
      data,
      "",
      this.dialogHandlerS.sizeLg,
    );
  }

  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tickets Legales");

    const STATUS_LABEL: Record<number, string> = {
      0: "PENDIENTE",
      1: "EN PROCESO",
      2: "CONCLUIDO",
      4: "CANCELADO",
    };
    // Paleta Office é discreta, bien en PowerPoint
    const STATUS_COLOR: Record<number, string> = {
      0: "FFED7D31", // naranja suave
      1: "FF4472C4", // azul medio
      2: "FF70AD47", // verde medio
      4: "FFA6A6A6", // gris
    };

    const HEADER_BG = "FF1F3864"; // azul marino oscuro
    const BORDER_COLOR = "FFD9D9D9";
    const border = (color = BORDER_COLOR): ExcelJS.Border => ({
      style: "thin",
      color: { argb: color },
    });
    const allBorders = (color?: string): ExcelJS.Borders => ({
      top: border(color),
      left: border(color),
      bottom: border(color),
      right: border(color),
      diagonal: { style: undefined, color: undefined },
    });

    worksheet.columns = [
      { header: "FOLIO", key: "folio", width: 10 },
      { header: "FECHA SOLICITUD", key: "requestDate", width: 16 },
      { header: "CLIENTE", key: "customer", width: 22 },
      { header: "ASUNTO", key: "title", width: 40 },
      { header: "RESPONSABLE", key: "assignee", width: 24 },
      { header: "ESTATUS", key: "status", width: 14 },
      { header: "FECHA CONCLUSIóN", key: "completionDate", width: 18 },
      { header: "DóAS", key: "dias", width: 8 },
    ];

    // Encabezado
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: HEADER_BG },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = allBorders("FF1F3864");
    });
    headerRow.height = 28;

    // Filas de datos
    this.dataSignal().forEach((item) => {
      const status: number = item.status ?? 0;
      const row = worksheet.addRow({
        folio: item.folio,
        requestDate: item.requestDate,
        customer: item.customer,
        title: `${item.title ?? ""}${item.description ? "\n" + item.description : ""}`,
        assignee: item.assignee,
        status: STATUS_LABEL[status] ?? "é",
        completionDate: item.completionDate ?? "",
        dias: item.diferenciaDias ?? "",
      });

      row.height = 22;

      row.eachCell({ includeEmpty: true }, (cell, colIdx) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: colIdx === 6 ? "center" : "left",
          wrapText: true,
        };
        cell.border = allBorders();
        cell.font = { size: 10 };
      });

      // Celda ESTATUS con color s  lido + texto blanco
      const statusCell = row.getCell("status");
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: STATUS_COLOR[status] ?? "FFA6A6A6" },
      };
      statusCell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };

      // DóAS en rojo si supera 10
      const diasVal = item.diferenciaDias ?? 0;
      if (diasVal > 10) {
        row.getCell("dias").font = {
          color: { argb: "FFC00000" },
          bold: true,
          size: 10,
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `Tickets_Legales_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  }
}
