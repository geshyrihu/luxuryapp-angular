import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { AdvancedPieChart } from "src/app/core/components/charts/advanced-pie-chart";
import { MultiAxisChart } from "src/app/core/components/charts/multi-axis-chart";
import { PrimengRadarChart } from "src/app/core/components/charts/primeng-radar-chart";
import { Touchspin } from "src/app/core/components/touchspin/touchspin";
import { PrimeNgCustomGlobalFilter } from "src/app/core/components/primeng-custom-global-filter/primeng-custom-global-filter";
import { PrimeNgCustomToast } from "src/app/core/components/primeng-custom-toast/primeng-custom-toast";
import { BitacoraFiltroFechaForm } from "src/app/core/components/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { Mesanio } from "src/app/core/components/mesanio/mesanio";
import { CalendarRange } from "src/app/core/components/rango-calendario-mes-anio/calendar-range";
import { RangoCalendarioyyyymmdd } from "src/app/core/components/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { HeaderCustomer } from "src/app/core/components/header-customer/haeder-customer";
import { PageTitleReport } from "src/app/core/components/title-page-report/page-title-report";
import { PageTitleReportMaintenance } from "src/app/core/components/title-page-report-maintenance/page-title-report-maintenance";
import { ReportHeader } from "src/app/core/components/report-header/report-header";
import { CabeceraSolicitudPagoPdf } from "src/app/core/components/title-solicitud-pago-pdf/cabecera-solicitud-pago-pdf";
import { PdfViewerModal } from "src/app/core/components/pdf-viewer-modal/pdf-viewer-modal";
import { SubirPdf } from "src/app/core/components/inputs/web/custom-input-upload-pdf-signal";
import { GlobalErrorAlert } from "src/app/core/components/global-error-alert/global-error-alert";
import { WhatsNew } from "src/app/core/components/whats-new/whats-new.component";
import { FeatureAnnouncementService } from "src/app/core/services/feature-announcement.service";
import { GlobalErrorService } from "src/app/core/services/global-error.service";

@Component({
  selector: "app-common-core-coverage",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TableModule,
    Touchspin,
    PrimeNgCustomGlobalFilter,
    PrimeNgCustomToast,
    BitacoraFiltroFechaForm,
    Mesanio,
    CalendarRange,
    RangoCalendarioyyyymmdd,
    HeaderCustomer,
    PageTitleReport,
    PageTitleReportMaintenance,
    ReportHeader,
    CabeceraSolicitudPagoPdf,
    PdfViewerModal,
    SubirPdf,
    GlobalErrorAlert,
    WhatsNew,
    AdvancedPieChart,
    MultiAxisChart,
    PrimengRadarChart,
  ],
  providers: [
    {
      provide: DynamicDialogRef,
      useValue: { close: () => undefined },
    },
    {
      provide: DynamicDialogConfig,
      useValue: {
        data: {
          pdfSrc: "/demo.pdf",
          fileName: "demo.pdf",
          pathUrl: "/api/demo/",
          serviceOrderId: 1,
        },
      },
    },
  ],
  template: `
    <div class="grid">
      <div class="col-12 lg:col-6">
        <p-card header="Utilidades de Tabla y Toast">
          <primeng-custom-toast />
          <div class="flex flex-column gap-3">
            <p-button
              label="Mostrar toast"
              icon="mdi:message-badge"
              (onClick)="showToast()"
            />

            <p-table #demoTable [value]="inventory" styleClass="p-datatable-sm">
              <ng-template pTemplate="caption">
                <primeng-custom-global-filter [dt]="demoTable" />
              </ng-template>
              <ng-template pTemplate="header">
                <tr>
                  <th>Componente</th>
                  <th>Tipo</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-row>
                <tr>
                  <td>{{ row.name }}</td>
                  <td>{{ row.type }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Estados Globales y Novedades">
          <div class="flex flex-column gap-3">
            <p-button
              label="Disparar error global"
              icon="mdi:alert-circle"
              severity="danger"
              (onClick)="showGlobalError()"
            />
            <app-global-error-alert />

            <p-divider />

            <p-button
              label="Abrir What's New"
              icon="mdi:party-popper"
              (onClick)="showWhatsNew()"
            />
            <div class="p-3 surface-ground border-round text-sm text-color-secondary">
              <code>app-whats-new</code> — se muestra vía signal <code>FeatureAnnouncementService.showDialog</code>.
              El componente no se monta aquí para evitar auto-apertura en catálogo.
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Selectores de Fecha y Cantidad">
          <div class="flex flex-column gap-4">
            <app-touchspin [control]="touchControl" [minValue]="1" [maxValue]="10" />
            <app-mesanio />
            <app-calendar-range />
            <app-rango-calendario-yyyymmdd />
            <app-bitacora-filtro-fecha-form />
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Encabezados y Plantillas">
          <div class="flex flex-column gap-4">
            <app-header-customer
              [title]="'Centro de mando'"
              [subTitle]="'Vista consolidada de customer'"
            />
            <page-title-report [title]="'Reporte Operativo'" />
            <page-title-report-maintenance
              [title]="'Mantenimiento Preventivo'"
              [breadcrumbItems]="breadcrumbs"
            />
            <app-report-header
              [nameCustomer]="'Luxury Tower'"
              [logoCustomer]="'assets/images/default-avatar.png'"
            />
            <app-cabecera-solicitud-pago-pdf
              [titulo]="'Solicitud de pago'"
              [folio]="'SP-2026-015'"
              [factura]="'FAC-9921'"
            />
          </div>
        </p-card>
      </div>

      <div class="col-12">
        <p-card header="Modales PDF y Carga de Archivos">
          <div class="grid">
            <div class="col-12 xl:col-6">
              <div class="surface-ground border-round p-4 text-center text-sm text-color-secondary">
                <span class="block font-bold mb-1">app-pdf-viewer-modal</span>
                Se abre vía <code>DynamicDialogService</code> con <code>pdfSrc</code> real.
                No se monta inline para evitar peticiones a rutas de demostración.
              </div>
            </div>
            <div class="col-12 xl:col-6">
              <div class="surface-ground border-round p-4 text-center text-sm text-color-secondary">
                <span class="block font-bold mb-1">app-custom-input-upload-pdf-signal</span>
                Upload masivo de PDFs. Se abre vía <code>DynamicDialogService</code>,
                no como input de formulario inline.
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12">
        <p-card header="Cobertura de Charts Core">
          <div class="grid">
            <div class="col-12 xl:col-4">
              <app-advanced-pie-chart [dataGrafico]="advancedPieData" />
            </div>
            <div class="col-12 xl:col-4">
              <app-multi-axis-chart [data]="multiAxisData" />
            </div>
            <div class="col-12 xl:col-4">
              <app-primeng-radar-chart [chartData]="radarData" />
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CommonCoreCoverage {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private globalErrorService = inject(GlobalErrorService);
  private featureAnnouncementService = inject(FeatureAnnouncementService);

  readonly touchControl = this.fb.control(3, { nonNullable: true });

  readonly inventory = [
    { name: "primeng-custom-global-filter", type: "Filtro" },
    { name: "touchspin", type: "Control numérico" },
    { name: "page-title-report", type: "Header" },
    { name: "pdf-viewer-modal", type: "Modal PDF" },
  ];

  readonly breadcrumbs = [
    { label: "Sistema" },
    { label: "Mantenimiento" },
    { label: "Detalle", active: true },
  ];

  readonly advancedPieData = [
    { name: "Pagado", value: 62 },
    { name: "En revisión", value: 21 },
    { name: "Pendiente", value: 17 },
  ];

  readonly multiAxisData = {
    labels: ["Ene", "Feb", "Mar", "Abr"],
    datasets: [
      {
        type: "bar",
        label: "Solicitudes",
        backgroundColor: "#4d9fff",
        data: [18, 22, 16, 28],
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Monto (K)",
        borderColor: "#14b8a6",
        data: [120, 160, 140, 210],
        yAxisID: "y1",
      },
    ],
  };

  readonly radarData = {
    labels: ["UX", "A11y", "DS", "Mobile", "Charts", "Docs"],
    datasets: [
      {
        label: "Cobertura",
        data: [90, 72, 88, 81, 76, 84],
        borderColor: "#0b3164",
        backgroundColor: "rgba(11, 49, 100, 0.18)",
        pointBackgroundColor: "#0b3164",
      },
    ],
  };

  showToast() {
    this.messageService.add({
      severity: "success",
      summary: "Cobertura activa",
      detail: "El wrapper PrimeNG Toast se está renderizando correctamente.",
    });
  }

  showGlobalError() {
    this.globalErrorService.setGlobalError(
      "Error de demostración emitido desde el catálogo de componentes.",
    );
  }

  showWhatsNew() {
    this.featureAnnouncementService.showDialog.set(true);
  }
}
