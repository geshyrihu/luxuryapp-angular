import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
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
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonLabel,
    WebButtonLabelViewPdf,
    TableCaption,
    TableFooter,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-table
      [globalFilterFields]="globalFilterFields()"
      [value]="requests()"
      [paginator]="true"
      [rows]="tableRows"
      [rowsPerPageOptions]="rowsPerPageOptions"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
      class="card custom-table"
      size="small"
      [scrollable]="true"
      [scrollHeight]="scrollHeight()"
      #dt
    >
      <ng-template #caption>
        <app-table-caption [showAdd]="false" [dt]="dt" />
      </ng-template>

      <ng-template #header>
        <tr>
          @for (col of columns(); track col.field) {
            <th [appSortableColumn]="col.field">
              {{ col.header }}
              <app-sorticon [field]="col.field" />
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
                {{ request[col.field] | apiDate: "dd/MM/yyyy" }}
              } @else {
                {{ request[col.field] }}
              }
            </td>
          }
          <td class="text-center">
            <div class="d-flex gap-1 justify-center">
              @if (request.attachmentPath) {
                <il-button-view-pdf
                  [url]="request.attachmentPath"
                  fileName="Comprobante"
                />
              }
              <il-button
                iconClass="material-symbols-light:visibility"
                label="Detalle"
                size="small"
                variant="outline"
                severity="info"
                (clicked)="onViewDetail(request)"
              />
              <il-button
                iconClass="material-symbols-light:check-box"
                label="Aprobar"
                size="small"
                (clicked)="onApprove(request)"
              />
              <il-button
                iconClass="material-symbols-light:close"
                label="Rechazar"
                size="small"
                (clicked)="onReject(request)"
              />
            </div>
          </td>
        </tr>
      </ng-template>

      <ng-template #emptymessage>
        <tr>
          <td [attr.colspan]="columns().length + 1" class="text-center">
            No hay solicitudes pendientes
          </td>
        </tr>
      </ng-template>

      <ng-template #paginatorleft>
        <app-table-footer [data]="requests()" />
      </ng-template>
    </app-table>
  `,
})
export class GenericApprovalPanel {
  private tableScrollHeightS = inject(TableScrollHeightService);

  // --- INPUTS (Signals) ---
  requests = input<ApprovalPanelRequest[]>([]);
  columns = input<{ field: string; header: string; isDate?: boolean }[]>([]);
  loading = input<boolean>(false);

  // --- CONFIGURACIÓNN ---
  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  // --- OUTPUTS ---
  approve = output<ApprovalPanelRequest>();
  reject = output<ApprovalPanelRequest>();
  viewDetail = output<ApprovalPanelRequest>();

  // --- LíGICA ---
  // Se recalcula automíticamente cuando 'requests' cambia.
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
