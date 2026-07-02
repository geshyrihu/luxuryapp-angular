import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  IonChip,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import * as FileSaver from "file-saver";
import { addIcons } from "ionicons";
import { checkboxOutline, createOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web/label/button-item";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { TooltipPlacement } from "src/app/core/enums/tooltip-placement";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CronogramaMantenimientoService } from "src/app/core/services/cronograma-mantenimiento.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import {
  resolveIconifyIcon,
  resolvePrimeIcon,
} from "src/app/core/utils/prime-icon-resolver";
import { CronogramaItem } from "./interfaces/CronogramaItem";
import { FiltroEquipo } from "./interfaces/FiltroEquipo";
import { MantenimientoPreventivoForm } from "./mantenimiento-preventivo-form";
@Component({
  selector: "app-cronograma-anual-mantenimiento",
  templateUrl: "./cronograma-anual-mantenimiento.html",
  imports: [
    TableModule,
    FormsModule,
    WebButtonLabelItem,
    WebButtonLabel,
    CommonModule,
    TooltipModule,
    PrimeNgCustomCaption,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonLabel,
    IonListHeader,
    IonChip,
    AppIcon,
  ],
})
export class CronogramaAnualMantenimiento {
  TooltipPlacement = TooltipPlacement;
  readonly resolvePrimeIcon = resolvePrimeIcon;
  // --- Inyecci�n de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  cronogramaMantenimientoService = inject(CronogramaMantenimientoService);
  private htmlPrintS = inject(HtmlPrintService);
  // --- Propiedades del Componente ---
  // ? MEJORA: Usar signals para los datos
  dataSignal = signal<CronogramaItem[]>([]);
  loading = signal(true);
  ref: DynamicDialogRef;

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  // ? MEJORA: Filtros globales calculados din�micamente
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  filtroEquiposValue: string = "equipos";
  filtroId: string | number = 1;
  filterValue: string = "";

  // Usamos la interfaz para el array de filtros
  filtroEquipos: FiltroEquipo[] = [
    { emoji: "??", id: "", nombre: "todos" },
    { emoji: "✨", id: 2, nombre: "amenidades" },
    { emoji: "🏢", id: 8, nombre: "A. Comunes" },
    { emoji: "📦", id: 7, nombre: "bodegas" },
    { emoji: "⚙️", id: 1, nombre: "equipos" },
    { emoji: "🏋️", id: 5, nombre: "gimnasio" },
    { emoji: "??", id: 6, nombre: "sistemas" },
    { emoji: "🖌️", id: 9, nombre: "pintura" },
    { emoji: "🪚", id: 11, nombre: "Carpinteria" },
  ];

  // Nombres de los meses
  meses: string[] = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

  messageEvent = output<string>();

  constructor() {
    addIcons({ checkboxOutline, createOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  // --- Mobile Logic ---
  selectedMobileMonth = signal(new Date().getMonth() + 1);

  mobileData = computed(() => {
    const month = this.selectedMobileMonth();
    const data = this.dataSignal(); // Already filtered by Category

    // Filter items that have a service in this month
    // And group by System
    const itemsWithService = data.filter(
      (item) =>
        item.maintenanceCalendars &&
        item.maintenanceCalendars.some((s) => s.month === month),
    );

    // Grouping
    const grouped: { system: string; items: any[] }[] = [];
    itemsWithService.forEach((item) => {
      let group = grouped.find((g) => g.system === item.sistema);
      if (!group) {
        group = { system: item.sistema, items: [] };
        grouped.push(group);
      }
      // Attach the specific service ID for this month to the item for easy access
      const service = item.maintenanceCalendars.find((s) => s.month === month);
      group.items.push({ ...item, serviceId: service?.id });
    });

    return grouped;
  });

  onMobileMonthChange(event: any) {
    this.selectedMobileMonth.set(event.detail.value);
  }

  // --- L�gica de Carga y Filtro de Datos ---
  onLoadData(): void {
    const customerId: string = this.customerIdS.customerId();
    let endpoint = `MaintenanceCalendars/CronogramaAnual/${customerId}`;
    if (this.filtroId !== "") {
      endpoint += `/${this.filtroId}`;
    }

    this.loading.set(true);
    this.apiResponseS
      .onGetItem(endpoint)
      .then((result: CronogramaItem[]) => {
        // Ordenar los datos
        const sortedData = result.sort((a, b) =>
          a.sistema.localeCompare(b.sistema),
        );
        this.dataSignal.set(sortedData);
        this.loading.set(false);
      })
      .catch(() => {
        this.loading.set(false);
      });
  }

  clickButton(filtro: FiltroEquipo): void {
    this.filtroEquiposValue = filtro.nombre;
    this.filtroId = filtro.id;

    // Emitir evento
    const mensaje =
      filtro.nombre === "pintura" ? "Pintura" : "preventivo de equipos";
    this.messageEvent.emit(mensaje);

    this.onLoadData();
  }

  getFiltroIconClass(icon: string | null | undefined): string {
    return resolveIconifyIcon(icon, "mdi:package");
  }

  // --- Funciones de Ayuda para la Vista ---

  hasService(customer: CronogramaItem, monthName: string): boolean {
    const monthNumber = this.meses.indexOf(monthName) + 1;
    if (!customer.maintenanceCalendars) return false;
    return customer.maintenanceCalendars.some(
      (servicio) => servicio.month === monthNumber,
    );
  }

  getServiceIdForMonth(
    customer: CronogramaItem,
    monthName: string,
  ): number | null {
    const monthNumber = this.meses.indexOf(monthName) + 1;
    if (!customer.maintenanceCalendars) return null;
    const servicio = customer.maintenanceCalendars.find(
      (s) => s.month === monthNumber,
    );
    return servicio ? servicio.id : null;
  }

  // --- Acciones de la Interfaz ---

  onModalForm(data: any): void {
    // Si data es solo un ID (n�mero), lo adaptamos, o si es objeto lo usamos
    const id = typeof data === "number" ? data : data.id;

    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        { id, task: "edit" },
        `Editar Registro #${id}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  exportExcel(): void {
    this.apiResponseS
      .onGetItem(
        `MaintenanceCalendars/ExportCalendar/${this.customerIdS.customerId()}`,
      )
      .then((dataToExport: any[]) => {
        import("xlsx").then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(dataToExport);
          const workbook = {
            Sheets: { data: worksheet },
            SheetNames: ["Cronograma"],
          };
          const excelBuffer: any = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const fileName = `Cronograma_Anual_Mantenimiento_LuxuryApp`;
          this.saveAsExcelFile(excelBuffer, fileName);
        });
      });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}${EXCEL_EXTENSION}`);
  }

  async exportPdf(): Promise<void> {
    const data = this.dataSignal();
    if (!data || data.length === 0) return;

    this.loading.set(true);

    const groups: { [sistema: string]: CronogramaItem[] } = {};
    data.forEach((item) => {
      if (!groups[item.sistema]) groups[item.sistema] = [];
      groups[item.sistema].push(item);
    });

    let tableHtml = "";

    Object.keys(groups).forEach((sistema) => {
      tableHtml += `
        <tr>
          <td colspan="13" class="sistema-header">${this.htmlPrintS.esc(sistema.toUpperCase())}</td>
        </tr>
      `;

      groups[sistema].forEach((item, idx) => {
        const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";
        let tds = "";
        this.meses.forEach((mes) => {
          const has = this.hasService(item, mes);
          tds += `<td style="background-color: ${bg}; text-align: center;">
            ${has ? '<div class="block-indicator"></div>' : ""}
          </td>`;
        });

        tableHtml += `
          <tr>
            <td style="background-color: ${bg}; font-size: 9px; padding: 4px 6px;">${this.htmlPrintS.esc(item.nameMachinery)}</td>
            ${tds}
          </tr>
        `;
      });
    });

    const monthsHeaders = this.meses.map((m) => `<th>${m}</th>`).join("");
    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { size: landscape; margin: 10mm; }
  .container { max-width: 1400px; }
  th { background-color: #1E3A8A !important; color: #FFFFFF !important; }

  .sistema-header { background-color: #c9a84c !important; color: #ffffff !important; }
  .block-indicator { background-color: #0b3164 !important; }

  .title { font-size: 16px; font-weight: bold; color: #0b3164; margin-bottom: 16px; }

  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:4px 2px; border:1px solid #e5e7eb; }
  .data-table th { background:#1E3A8A; color: #ffffff; font-weight:700; text-align:center; font-size: 9px; }

  .sistema-header { background:#c9a84c; color: #ffffff; font-weight:700; font-size: 10px; padding: 4px 6px !important; }
  .block-indicator { width: 100%; height: 12px; background-color: #1E3A8A; margin: 0 auto; border-radius: 1px; }

</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Plan de Mantenimiento Preventivo", `TIPO: ${this.filtroEquiposValue.toUpperCase()}`, generatedAt, "MANTENIMIENTO")}

  <div class="body-doc">
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 25%;">DESCRIPCI�N</th>
          ${monthsHeaders}
        </tr>
      </thead>
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

    this.htmlPrintS.printHtml(
      html,
      `Cronograma_Mantenimiento_${this.filtroEquiposValue}`,
    );
    this.loading.set(false);
  }

  // --- TrackBy Functions ---
  trackByFiltro(index: number, filtro: FiltroEquipo): number | string {
    return filtro.id;
  }

  trackByCustomer(index: number, customer: CronogramaItem): number {
    return customer.id;
  }

  trackByItem(index: number, item: any): any {
    return index;
  }
}
