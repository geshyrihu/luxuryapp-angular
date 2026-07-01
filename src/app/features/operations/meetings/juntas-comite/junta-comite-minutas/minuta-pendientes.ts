import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { WebButtonLabelDownload } from "src/app/core/components/buttons/web/label/button-download";
import { ReportHeader } from "src/app/core/components/web/report-header/report-header";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-minuta-pendientes",
  templateUrl: "./minuta-pendientes.html",
  imports: [CommonModule, ReportHeader, SanitizeHtmlPipe, WebButtonLabelDownload],
})
export class MinutaPendientes {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);
  data: any[] = [];
  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  todoElSeguimiento: boolean = true;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.Meetings.allPendingMinutas(this.customerIdS.customerId()),
      )
      .then((result: any) => {
        this.data = result;
        this.globalFilterFields = globalFilterFields(this.data);
        this.loading.set(false);
      });
  }

  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pendientes de Minutas");

    // Strip HTML function
    const stripHtml = (html: string) => {
      if (!html) return "";
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    // Define columns
    worksheet.columns = [
      { header: "Área Responsable", key: "area", width: 30 },
      { header: "Asunto", key: "asunto", width: 40 },
      { header: "Solicitud", key: "solicitud", width: 50 },
      { header: "Último Seguimiento", key: "seguimiento", width: 50 },
      { header: "Fecha Último Seguimiento", key: "fecha", width: 25 },
      { header: "Estatus", key: "estatus", width: 15 },
    ];

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF245074" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Flatten and add data
    this.data.forEach((area) => {
      area.items.forEach((asunto: any) => {
        const lastSeguimiento =
          asunto.seguimientos.length > 0
            ? asunto.seguimientos[asunto.seguimientos.length - 1]
            : { fecha: "", seguimiento: "" };

        worksheet.addRow({
          area: area.responsibleArea,
          asunto: asunto.title,
          solicitud: stripHtml(asunto.requestService),
          seguimiento: stripHtml(lastSeguimiento.seguimiento),
          fecha: lastSeguimiento.fecha,
          estatus: asunto.status === 0 ? "Pendiente" : "Completado",
        });
      });
    });

    // Style data rows
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFD4D4D4" } },
            left: { style: "thin", color: { argb: "FFD4D4D4" } },
            bottom: { style: "thin", color: { argb: "FFD4D4D4" } },
            right: { style: "thin", color: { argb: "FFD4D4D4" } },
          };
          cell.alignment = { vertical: "middle", wrapText: true };
        });
      }
    });

    // Generate and save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `Pendientes_Minutas_${this.dateS.getDateNow()}.xlsx`,
    );
  }
}
