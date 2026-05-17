import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ApprovalPanelRequest } from "../interfaces/approval.interface";

/**
 * ✨ COMPONENTE GENÉRICO PARA PANELES DE APROBACIÓN ✨
 *
 * Basado en el estándar de tablas del proyecto (Referencia: BankList).
 * Utiliza Signal Inputs para una reactividad óptima.
 */
@Component({
  selector: "app-generic-approval-panel",
  imports: [
    CommonModule,
    TableModule,
    CustomButton,
    CustomButtonViewPdf,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
  template: `
    <p-table
      [globalFilterFields]="globalFilterFields()"
      [value]="requests()"
      [paginator]="true"
      [rows]="tablePrimeNgRows"
      [rowsPerPageOptions]="rowsPerPageOptions"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
      styleClass="card custom-table"
      size="small"
      [scrollable]="true"
      [scrollHeight]="scrollHeight()"
      #dt
    >
      <ng-template #caption>
        <primeng-custom-caption [showAdd]="false" [dt]="dt" />
      </ng-template>

      <ng-template #header>
        <tr>
          @for (col of columns(); track col.field) {
            <th [pSortableColumn]="col.field">
              {{ col.header }}
              <p-sortIcon [field]="col.field" />
            </th>
          }
          <th class="text-center">Acciones</th>
        </tr>
      </ng-template>

      <ng-template #body let-request>
        <tr>
          @for (col of columns(); track col.field) {
            <td>
              @if (col.isDate) {
                {{ request[col.field] | date: "dd/MM/yyyy" }}
              } @else {
                {{ request[col.field] }}
              }
            </td>
          }
          <td class="text-center">
            <div class="flex gap-1 justify-center">
              @if (request.attachmentPath) {
                <custom-button-view-pdf
                  [url]="request.attachmentPath"
                  fileName="Comprobante"
                />
              }
              <custom-button
                [showLabelOnDesktop]="true"
                iconClass="pi pi-check-square"
                label="Aprobar"
                size="small"
                (clicked)="onApprove(request)"
              />
              <custom-button
                [showLabelOnDesktop]="true"
                iconClass="pi pi-times"
                label="Rechazar"
                size="small"
                (clicked)="onReject(request)"
              />
            </div>
          </td>
        </tr>
      </ng-template>

      <ng-template emptymessage>
        <tr>
          <td [attr.colspan]="columns().length + 1" class="text-center">
            No hay solicitudes pendientes
          </td>
        </tr>
      </ng-template>

      <ng-template #paginatorleft>
        <primeng-custom-table-footer [data]="requests()" />
      </ng-template>
    </p-table>
  `,
})
export class GenericApprovalPanel {
  private tableScrollHeightS = inject(TableScrollHeightService);

  // --- INPUTS (Signals) ---
  requests = input<ApprovalPanelRequest[]>([]);
  columns = input<{ field: string; header: string; isDate?: boolean }[]>([]);
  loading = input<boolean>(false);

  // --- CONFIGURACIÓN ---
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // --- OUTPUTS ---
  approve = output<ApprovalPanelRequest>();
  reject = output<ApprovalPanelRequest>();
  viewDetail = output<ApprovalPanelRequest>();

  // --- LÓGICA ---
  // Se recalcula automáticamente cuando 'requests' cambia.
  globalFilterFields = computed(() => {
    const data = this.requests();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  onApprove(request: ApprovalPanelRequest): void {
    this.approve.emit(request);
  }

  onReject(request: ApprovalPanelRequest): void {
    this.reject.emit(request);
  }

  onViewDetail(request: ApprovalPanelRequest): void {
    this.viewDetail.emit(request);
  }
}
