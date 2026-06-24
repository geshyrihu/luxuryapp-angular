import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { BitacoraFiltroFechaForm } from "src/app/core/components/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { AdvancedPieChart } from "src/app/core/components/charts/advanced-pie-chart";
import { MultiAxisChart } from "src/app/core/components/charts/multi-axis-chart";
import { PrimengRadarChart } from "src/app/core/components/charts/primeng-radar-chart";
import { GlobalErrorAlert } from "src/app/core/components/global-error-alert/global-error-alert";
import { HeaderCustomer } from "src/app/core/components/header-customer/haeder-customer";
import { Mesanio } from "src/app/core/components/mesanio/mesanio";
import { PrimeNgCustomGlobalFilter } from "src/app/core/components/primeng-custom-global-filter/primeng-custom-global-filter";
import { PrimeNgCustomToast } from "src/app/core/components/primeng-custom-toast/primeng-custom-toast";
import { CalendarRange } from "src/app/core/components/rango-calendario-mes-anio/calendar-range";
import { RangoCalendarioyyyymmdd } from "src/app/core/components/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { ReportHeader } from "src/app/core/components/report-header/report-header";
import { PageTitleReportMaintenance } from "src/app/core/components/title-page-report-maintenance/page-title-report-maintenance";
import { PageTitleReport } from "src/app/core/components/title-page-report/page-title-report";
import { CabeceraSolicitudPagoPdf } from "src/app/core/components/title-solicitud-pago-pdf/cabecera-solicitud-pago-pdf";
import { Touchspin } from "src/app/core/components/touchspin/touchspin";
import { FeatureAnnouncementService } from "src/app/core/services/feature-announcement.service";
import { GlobalErrorService } from "src/app/core/services/global-error.service";

// --- Fase 9 — Segunda Ronda ---
import { AppSlider } from "src/app/core/components/slider/slider";
import { AppRating } from "src/app/core/components/rating/rating";
import { AppOtpInput } from "src/app/core/components/otp-input/otp-input";
import { AppProfileCard } from "src/app/core/components/profile-card/profile-card";
import { AppThemeSwitcher } from "src/app/core/components/theme-switcher/theme-switcher";
import {
  AppPipelineCrm,
  type PipelineStage,
} from "src/app/core/components/pipeline-crm/pipeline-crm";
import { AppTagInput } from "src/app/core/components/tag-input/tag-input";
import { AppContactCard } from "src/app/core/components/contact-card/contact-card";
import { AppBottomNav, type BottomNavItem } from "src/app/core/components/bottom-nav/bottom-nav";
import { AppTabBar, type TabBarItem } from "src/app/core/components/tab-bar/tab-bar";
import { AppStatCard } from "src/app/core/components/stat-card/stat-card";
import { AppCustomer360, type Customer360Data } from "src/app/core/components/customer-360/customer-360";
import { AppPrintView } from "src/app/core/components/print-view/print-view";
import { AppLangSelector } from "src/app/core/components/lang-selector/lang-selector";
import { AppCommentThread, type Comment } from "src/app/core/components/comment-thread/comment-thread";
import { AppEmailPreview } from "src/app/core/components/email-preview/email-preview";

// --- Fase 9.3 ---
import { AppColorPicker } from "src/app/core/components/color-picker/color-picker";
import { AppTristateSwitch } from "src/app/core/components/tristate-switch/tristate-switch";
import { AppDock } from "src/app/core/components/dock/dock";
import { AppFormBuilder, type FormField } from "src/app/core/components/form-builder/form-builder";
import { AppSignaturePad } from "src/app/core/components/signature-pad/signature-pad";
import { AppQrCode } from "src/app/core/components/qr-code/qr-code";
import { AppHeatmap, type HeatmapCell } from "src/app/core/components/heatmap/heatmap";
import { AppRealtimeIndicator } from "src/app/core/components/realtime-indicator/realtime-indicator";
import { AppInventoryLevel } from "src/app/core/components/inventory-level/inventory-level";
import { AppReceiptScanner } from "src/app/core/components/receipt-scanner/receipt-scanner";
import { AppBarcodeInput } from "src/app/core/components/barcode-input/barcode-input";
import { AppBarcodeScanner } from "src/app/core/components/barcode-scanner/barcode-scanner";
import { AppTerritoryMap, type Territory } from "src/app/core/components/territory-map/territory-map";
import { AppGantt, type GanttTask } from "src/app/core/components/gantt/gantt";

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

    GlobalErrorAlert,
    AdvancedPieChart,
    MultiAxisChart,
    PrimengRadarChart,

    // Fase 9.1
    AppSlider,
    AppRating,
    AppOtpInput,
    AppProfileCard,
    AppThemeSwitcher,
    AppPipelineCrm,
    // Fase 9.2
    AppTagInput,
    AppContactCard,
    AppBottomNav,
    AppTabBar,
    AppStatCard,
    AppCustomer360,
    AppPrintView,
    AppLangSelector,
    AppCommentThread,
    AppEmailPreview,
    // Fase 9.3
    AppColorPicker,
    AppTristateSwitch,
    AppDock,
    AppFormBuilder,
    AppSignaturePad,
    AppQrCode,
    AppHeatmap,
    AppRealtimeIndicator,
    AppInventoryLevel,
    AppReceiptScanner,
    AppBarcodeInput,
    AppBarcodeScanner,
    AppTerritoryMap,
    AppGantt,
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
            <div
              class="p-3 surface-ground border-round text-sm text-color-secondary"
            >
              <code>app-whats-new</code> — se muestra vía signal
              <code>FeatureAnnouncementService.showDialog</code>. El componente
              no se monta aquí para evitar auto-apertura en catálogo.
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="Selectores de Fecha y Cantidad">
          <div class="flex flex-column gap-4">
            <app-touchspin
              [control]="touchControl"
              [minValue]="1"
              [maxValue]="10"
            />
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
              <div
                class="surface-ground border-round p-4 text-center text-sm text-color-secondary"
              >
                <span class="block font-bold mb-1">app-pdf-viewer-modal</span>
                Se abre vía <code>DynamicDialogService</code> con
                <code>pdfSrc</code> real. No se monta inline para evitar
                peticiones a rutas de demostración.
              </div>
            </div>
            <div class="col-12 xl:col-6">
              <div
                class="surface-ground border-round p-4 text-center text-sm text-color-secondary"
              >
                <span class="block font-bold mb-1"
                  >app-custom-input-upload-pdf-signal</span
                >
                Upload masivo de PDFs. Se abre vía
                <code>DynamicDialogService</code>, no como input de formulario
                inline.
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

      <!-- ═══════════════════════════════════════════════════════════════════
           FASE 9 — SEGUNDA RONDA (ANALISIS-PROMPT-V2)
      ═══════════════════════════════════════════════════════════════════════ -->

      <div class="col-12">
        <p-divider align="center">
          <span class="text-sm font-semibold text-color-secondary">Fase 9 — Segunda Ronda V2</span>
        </p-divider>
      </div>

      <!-- Slider -->
      <div class="col-12 lg:col-6">
        <p-card header="app-slider — Slider / Range slider">
          <div class="flex flex-column gap-4">
            <app-slider
              label="Presupuesto mensual"
              [min]="0"
              [max]="100000"
              [step]="1000"
              prefix="$"
              [(value)]="sliderSingle"
            />
            <app-slider
              label="Rango de precio"
              [min]="0"
              [max]="1000"
              [step]="10"
              [range]="true"
              suffix=" MXN"
              [(value)]="sliderRange"
            />
            <app-slider
              label="Scoring de lead (deshabilitado)"
              [max]="10"
              [disabled]="true"
              [(value)]="sliderDisabled"
            />
          </div>
        </p-card>
      </div>

      <!-- Rating -->
      <div class="col-12 lg:col-6">
        <p-card header="app-rating — Rating / Stars">
          <div class="flex flex-column gap-4">
            <app-rating label="Satisfacción del cliente" [(value)]="ratingValue" />
            <app-rating label="Evaluación de proveedor (3 estrellas)" [stars]="3" [(value)]="ratingShort" />
            <app-rating label="Solo lectura" [readonly]="true" [(value)]="ratingReadonly" />
          </div>
        </p-card>
      </div>

      <!-- OTP Input -->
      <div class="col-12 lg:col-6">
        <p-card header="app-otp-input — OTP / 2FA">
          <div class="flex flex-column gap-4">
            <app-otp-input
              label="Código de verificación (6 dígitos)"
              hint="Ingresa el código que recibiste por SMS"
              [length]="6"
              [(value)]="otpValue"
            />
            <app-otp-input
              label="PIN de operación (4 dígitos, enmascarado)"
              [length]="4"
              [mask]="true"
              [(value)]="otpPin"
            />
          </div>
        </p-card>
      </div>

      <!-- Profile Card -->
      <div class="col-12 lg:col-6">
        <p-card header="app-profile-card — Tarjeta de contacto CRM">
          <div class="flex flex-column gap-3">
            <app-profile-card
              name="Ana García Mendoza"
              role="Gerente de Ventas"
              email="ana.garcia@luxuryapp.mx"
              phone="+52 55 1234 5678"
              company="Luxury Tower SA de CV"
              badge="Premium"
              [online]="true"
            />
            <app-profile-card
              name="Carlos Ruiz"
              role="Director Técnico"
              company="Inmobiliaria Central"
              [compact]="true"
              [online]="false"
            />
          </div>
        </p-card>
      </div>

      <!-- Theme Switcher -->
      <div class="col-12 lg:col-6">
        <p-card header="app-theme-switcher — Toggle Light / Dark">
          <div class="flex align-items-center gap-3">
            <app-theme-switcher />
            <span class="text-sm text-color-secondary">
              Aplica / remueve <code>body.theme-dark</code>. Persiste en
              <code>localStorage</code>. Respeta <code>prefers-color-scheme</code>
              en la primera visita.
            </span>
          </div>
        </p-card>
      </div>

      <!-- Pipeline CRM -->
      <div class="col-12">
        <p-card header="app-pipeline-crm — Pipeline CRM / Deal Stages">
          <app-pipeline-crm
            title="Pipeline Comercial"
            [stages]="pipelineStages"
          />
        </p-card>
      </div>

      <!-- ───────── FASE 9.2 ───────── -->

      <!-- Tag Input -->
      <div class="col-12 lg:col-6">
        <p-card header="app-tag-input — Tags con autocomplete">
          <div class="flex flex-column gap-4">
            <app-tag-input
              label="Etiquetas del lead"
              hint="Selecciona o escribe para crear"
              [suggestions]="tagSuggestions"
              [(value)]="selectedTags"
            />
            <app-tag-input
              label="Sin sugerencias (libre)"
              [(value)]="freeTags"
            />
          </div>
        </p-card>
      </div>

      <!-- Contact Card -->
      <div class="col-12 lg:col-6">
        <p-card header="app-contact-card — Tarjeta compacta CRM">
          <div class="flex flex-column gap-2">
            <app-contact-card
              name="Lucía Fernández Mora"
              role="CFO"
              company="Grupo Inmobiliario del Norte"
              email="lucia@ginorte.mx"
              phone="+52 81 9988 7766"
              status="vip"
            />
            <app-contact-card
              name="Roberto Salinas"
              role="Gerente Compras"
              company="Materiales Regios SA"
              status="prospect"
            />
            <app-contact-card
              name="Diana Torres"
              role="Directora Legal"
              email="diana@torreslaw.mx"
              status="active"
              [selected]="true"
            />
          </div>
        </p-card>
      </div>

      <!-- Bottom Nav + Tab Bar -->
      <div class="col-12 lg:col-6">
        <p-card header="app-bottom-nav — Navegación móvil inferior">
          <div class="surface-ground border-round overflow-hidden" style="max-width:375px; margin:0 auto;">
            <div class="p-3 text-center text-sm text-color-secondary" style="height:80px;">
              Contenido de la pantalla
            </div>
            <app-bottom-nav [items]="bottomNavItems" [(activeId)]="activeBottomNav" />
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="app-tab-bar — Tabs de sección">
          <div class="flex flex-column gap-3">
            <app-tab-bar [tabs]="tabBarItems" [(activeId)]="activeTab" />
            <div class="p-3 surface-ground border-round text-sm text-color-secondary">
              Panel activo: <strong>{{ activeTab }}</strong>
            </div>
            <app-tab-bar [tabs]="tabBarItemsCompact" [(activeId)]="activeTabCompact" [compact]="true" />
          </div>
        </p-card>
      </div>

      <!-- Stat Cards con sparklines -->
      <div class="col-12">
        <p-card header="app-stat-card — KPI con sparkline">
          <div class="grid">
            <div class="col-12 sm:col-6 xl:col-3">
              <app-stat-card
                label="Ventas del mes"
                [value]="1280000"
                format="currency"
                icon="mdi:trending-up"
                [trend]="12.5"
                subtitle="vs mes anterior"
                [sparkline]="sparkSales"
              />
            </div>
            <div class="col-12 sm:col-6 xl:col-3">
              <app-stat-card
                label="Leads activos"
                [value]="84"
                icon="mdi:account-multiple-outline"
                iconColor="var(--ds-info)"
                iconBg="var(--ds-info-light, #afecff)"
                [trend]="-3.2"
                subtitle="esta semana"
                [sparkline]="sparkLeads"
              />
            </div>
            <div class="col-12 sm:col-6 xl:col-3">
              <app-stat-card
                label="Tasa de cierre"
                [value]="34"
                suffix="%"
                icon="mdi:check-circle-outline"
                iconColor="var(--ds-success)"
                iconBg="#d1fae5"
                [trend]="5.1"
                [sparkline]="sparkClose"
              />
            </div>
            <div class="col-12 sm:col-6 xl:col-3">
              <app-stat-card
                label="Ticket promedio"
                [value]="187500"
                format="currency"
                icon="mdi:currency-usd"
                iconColor="var(--ds-warning)"
                iconBg="var(--ds-warning-light, #fef3c7)"
                [trend]="8.0"
                [sparkline]="sparkTicket"
              />
            </div>
          </div>
        </p-card>
      </div>

      <!-- Customer 360 -->
      <div class="col-12 xl:col-8">
        <p-card header="app-customer-360 — Vista 360 de cliente CRM">
          <app-customer-360 [data]="customer360" />
        </p-card>
      </div>

      <!-- Lang Selector + Print View -->
      <div class="col-12 xl:col-4">
        <p-card header="app-lang-selector + app-print-view">
          <div class="flex flex-column gap-4">
            <app-lang-selector [(selectedCode)]="selectedLang" />
            <p-divider />
            <app-print-view title="Reporte de Ventas" subtitle="Junio 2026" [showBorder]="false">
              <div class="p-3 surface-ground border-round text-sm text-color-secondary">
                Contenido del reporte a imprimir (proyectado vía ng-content)
              </div>
            </app-print-view>
          </div>
        </p-card>
      </div>

      <!-- Comment Thread -->
      <div class="col-12 lg:col-6">
        <p-card header="app-comment-thread — Notas colaborativas">
          <app-comment-thread
            title="Notas del deal"
            [comments]="demoComments"
            (submit)="onCommentSubmit($event)"
          />
        </p-card>
      </div>

      <!-- Email Preview -->
      <div class="col-12 lg:col-6">
        <p-card header="app-email-preview — Vista previa de plantilla">
          <app-email-preview
            from="CRM LuxuryApp &lt;crm@luxuryapp.mx&gt;"
            to="ana.garcia@cliente.mx"
            subject="Propuesta comercial — Penthouse Santa Fe"
            [tags]="['VIP', 'Seguimiento', 'Q2-2026']"
            [htmlContent]="demoEmailHtml"
          />
        </p-card>
      </div>

      <!-- ───────── FASE 9.3 ───────── -->

      <!-- Color picker + Tristate switch -->
      <div class="col-12 lg:col-6">
        <p-card header="app-color-picker + app-tristate-switch">
          <div class="flex flex-column gap-4">
            <app-color-picker label="Color de etiqueta" [(value)]="pickerColor" hint="Formato HEX" />
            <app-color-picker label="Inline" [inline]="true" [(value)]="pickerColorInline" />
            <p-divider />
            <app-tristate-switch label="Permiso heredado" [(value)]="tristateVal" hint="Ciclo: Activado → Heredado → Desactivado" />
            <app-tristate-switch label="Notificaciones (deshabilitado)" [disabled]="true" [(value)]="tristateDisabled" />
          </div>
        </p-card>
      </div>

      <!-- Form builder -->
      <div class="col-12 lg:col-6">
        <p-card header="app-form-builder — Formulario dinámico desde schema">
          <app-form-builder
            title="Formulario de Lead"
            [schema]="demoSchema"
            [initial]="demoFormValues"
            (formSubmit)="onFormSubmit($event)"
          />
        </p-card>
      </div>

      <!-- Signature pad + QR code -->
      <div class="col-12 lg:col-6">
        <p-card header="app-signature-pad — Captura de firma digital">
          <app-signature-pad
            label="Firma del responsable"
            hint="Dibuja con el mouse. Ctrl+click para confirmar."
            [width]="400"
            [height]="140"
          />
        </p-card>
      </div>

      <div class="col-12 lg:col-6">
        <p-card header="app-qr-code — Generador de QR">
          <div class="flex flex-wrap gap-4 justify-content-center">
            <app-qr-code
              label="Orden #ORD-2026-0421"
              data="https://luxuryapp.mx/orders/ORD-2026-0421"
              [size]="160"
              [showData]="true"
            />
            <app-qr-code
              label="Contacto vCard"
              data="BEGIN:VCARD\nVERSION:3.0\nFN:Ana Garcia\nORG:LuxuryApp\nEND:VCARD"
              [size]="160"
              [allowDownload]="true"
            />
          </div>
        </p-card>
      </div>

      <!-- Heatmap -->
      <div class="col-12 lg:col-8">
        <p-card header="app-heatmap — Mapa de calor de actividad">
          <app-heatmap
            title="Actividad de ventas por día y hora"
            [data]="heatmapData"
            [showValues]="true"
          />
        </p-card>
      </div>

      <!-- Realtime + Inventory -->
      <div class="col-12 lg:col-4">
        <p-card header="app-realtime-indicator + app-inventory-level">
          <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
              <app-realtime-indicator status="live" lastUpdate="hace 2s" [latencyMs]="42" />
              <app-realtime-indicator status="paused" lastUpdate="hace 5min" />
              <app-realtime-indicator status="error" />
              <app-realtime-indicator status="connecting" />
            </div>
            <p-divider />
            <app-inventory-level name="Cemento Portland" [current]="350" [max]="1000" sku="CEM-001" [reorderPoint]="200" />
            <app-inventory-level name="Varilla 3/8" [current]="45" [max]="500" sku="VAR-038" [reorderPoint]="100" />
            <app-inventory-level name="Pintura blanca" [current]="5" [max]="200" sku="PNT-BLC" [reorderPoint]="40" />
          </div>
        </p-card>
      </div>

      <!-- Scanners -->
      <div class="col-12 lg:col-4">
        <p-card header="app-receipt-scanner — Captura de recibos">
          <app-receipt-scanner
            accept="image/*,application/pdf"
            [maxMb]="10"
            [mobile]="false"
          />
        </p-card>
      </div>

      <div class="col-12 lg:col-4">
        <p-card header="app-barcode-input — Lookup por código">
          <div class="flex flex-column gap-3">
            <app-barcode-input
              label="Buscar producto"
              hint="Escanea o escribe el código de barras"
              (searched)="onBarcodeSearch($event)"
            />
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-4">
        <p-card header="app-barcode-scanner — Escáner con cámara">
          <app-barcode-scanner
            label="Escanear código"
            [continuous]="false"
            (detected)="onBarcodeDetected($event)"
          />
        </p-card>
      </div>

      <!-- Territory map -->
      <div class="col-12">
        <p-card header="app-territory-map — Territorios de ventas CRM">
          <app-territory-map
            title="Territorios México"
            [territories]="territories"
          />
        </p-card>
      </div>

      <!-- Gantt -->
      <div class="col-12">
        <p-card header="app-gantt — Diagrama de Gantt">
          <app-gantt
            title="Plan de Mantenimiento Q3-2026"
            [tasks]="ganttTasks"
          />
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

  // ── Fase 9.1 demo data ──────────────────────────────────────────────
  sliderSingle = 25000;
  sliderRange: [number, number] = [200, 750];
  sliderDisabled = 7;

  ratingValue: number | undefined = 4;
  ratingShort: number | undefined = 2;
  ratingReadonly: number | undefined = 5;

  otpValue = "";
  otpPin   = "";

  // ── Fase 9.2 demo data ──────────────────────────────────────────────
  selectedTags: string[] = ["CRM", "Enterprise"];
  freeTags: string[] = [];
  readonly tagSuggestions = ["CRM", "Enterprise", "VIP", "Prospect", "Caliente", "Frío", "Seguimiento", "Urgente"];

  readonly bottomNavItems: BottomNavItem[] = [
    { id: "home",     icon: "mdi:home-outline",        activeIcon: "mdi:home",         label: "Inicio",       badge: 0 },
    { id: "contacts", icon: "mdi:account-outline",     activeIcon: "mdi:account",      label: "Contactos" },
    { id: "deals",    icon: "mdi:briefcase-outline",   activeIcon: "mdi:briefcase",    label: "Deals",        badge: 3 },
    { id: "reports",  icon: "mdi:chart-bar",           label: "Reportes" },
    { id: "profile",  icon: "mdi:account-circle-outline", activeIcon: "mdi:account-circle", label: "Perfil" },
  ];
  activeBottomNav = "home";

  readonly tabBarItems: TabBarItem[] = [
    { id: "overview",  label: "Resumen",   icon: "mdi:view-dashboard-outline" },
    { id: "activity",  label: "Actividad", icon: "mdi:history",               badge: 5 },
    { id: "documents", label: "Docs",      icon: "mdi:file-multiple-outline" },
    { id: "settings",  label: "Config",    icon: "mdi:cog-outline",           disabled: true },
  ];
  activeTab = "overview";

  readonly tabBarItemsCompact: TabBarItem[] = [
    { id: "all",     label: "Todos" },
    { id: "open",    label: "Abiertos", badge: 8 },
    { id: "closed",  label: "Cerrados" },
    { id: "pending", label: "Pendientes", badge: 2 },
  ];
  activeTabCompact = "open";

  readonly sparkSales  = [820, 940, 880, 1050, 990, 1120, 1280];
  readonly sparkLeads  = [91, 88, 95, 84, 79, 88, 84];
  readonly sparkClose  = [28, 30, 29, 33, 31, 35, 34];
  readonly sparkTicket = [155, 162, 170, 158, 175, 180, 188];

  readonly customer360: Customer360Data = {
    name: "Ana García Mendoza",
    role: "Directora Comercial",
    company: "Grupo Inmobiliario del Norte SA de CV",
    email: "ana.garcia@ginorte.mx",
    phone: "+52 81 8800 1234",
    tags: ["VIP", "Recurrente", "Q2"],
    totalRevenue: 3_850_000,
    openDeals: 4,
    lastContact: "hace 2 días",
    nps: 9,
    recentActivity: [
      { icon: "mdi:phone-outline",    text: "Llamada — propuesta Penthouse Santa Fe",  time: "hace 2 días" },
      { icon: "mdi:email-outline",    text: "Email enviado con brochure actualizado",   time: "hace 4 días" },
      { icon: "mdi:calendar-outline", text: "Reunión agendada para el 28 Jun",          time: "hace 1 semana" },
    ],
    deals: [
      { title: "Penthouse Santa Fe",      stage: "Negociación", value: 1_200_000 },
      { title: "Torre Reforma 360",       stage: "Propuesta",   value: 950_000 },
      { title: "Residencial Pedregal II", stage: "Contacto",    value: 680_000 },
    ],
  };

  selectedLang = "es-MX";

  readonly demoComments: Comment[] = [
    {
      id: "c1",
      authorName: "Laura Pérez",
      text: "Cliente muy interesado en el Penthouse. Solicita visita guiada la próxima semana.",
      timestamp: "hace 3 días",
      reactions: [{ emoji: "👍", count: 2 }, { emoji: "📌", count: 1 }],
    },
    {
      id: "c2",
      authorName: "Carlos Ruiz",
      text: "Revisé el expediente financiero. Califica para financiamiento sin aval.",
      timestamp: "hace 1 día",
      edited: true,
    },
  ];

  readonly demoEmailHtml = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#003d9b;padding:24px;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:20px;">LuxuryApp CRM</h1>
      </div>
      <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <p style="color:#041b3c;">Estimada <strong>Ana</strong>,</p>
        <p style="color:#434654;line-height:1.6;">
          Adjunto encontrará nuestra propuesta comercial actualizada para el
          <strong>Penthouse Santa Fe</strong>. Incluye las modificaciones de
          acabados que solicitó en nuestra última reunión.
        </p>
        <div style="background:#f9f9ff;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0;font-size:13px;color:#737685;">Valor de operación</p>
          <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#003d9b;">$1,200,000 MXN</p>
        </div>
        <a href="#" style="background:#003d9b;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;">
          Ver propuesta completa
        </a>
        <p style="color:#737685;font-size:12px;margin-top:24px;">
          LuxuryApp CRM · Torre Corporativa, CDMX · crm@luxuryapp.mx
        </p>
      </div>
    </div>
  `;

  onCommentSubmit(text: string): void {
    this.messageService.add({ severity: "success", summary: "Comentario añadido", detail: text });
  }

  readonly pipelineStages: PipelineStage[] = [
    {
      id: "lead",
      name: "Prospecto",
      color: "#737685",
      deals: [
        { id: "d1", title: "Hotel Camino Real", company: "GHL Hotels", value: 450000, owner: "Ana García", daysInStage: 3, priority: "high" },
        { id: "d2", title: "Torre Reforma 90", company: "Grupo Inmob.", value: 180000, owner: "Carlos R.", daysInStage: 8 },
      ],
    },
    {
      id: "contact",
      name: "Contacto",
      color: "#006477",
      deals: [
        { id: "d3", title: "Residencial Pedregal", company: "Arq. Mendoza", value: 320000, owner: "Laura P.", daysInStage: 12, priority: "medium" },
      ],
    },
    {
      id: "proposal",
      name: "Propuesta",
      color: "#003d9b",
      deals: [
        { id: "d4", title: "Club Náutico Vallarta", company: "Marina Dev.", value: 900000, owner: "Ana García", daysInStage: 20, priority: "high" },
        { id: "d5", title: "Departamentos Lomas", company: "Inmob. Lomas", value: 210000, owner: "Miguel T.", daysInStage: 5 },
      ],
    },
    {
      id: "negotiation",
      name: "Negociación",
      color: "#b45309",
      deals: [
        { id: "d6", title: "Centro Corporativo Sur", company: "CorpDev MX", value: 1200000, owner: "Carlos R.", daysInStage: 18, priority: "high" },
      ],
    },
    {
      id: "closed",
      name: "Cerrado",
      color: "#006837",
      deals: [
        { id: "d7", title: "Penthouse Santa Fe", company: "Elite Props.", value: 560000, owner: "Laura P.", daysInStage: 2 },
      ],
    },
  ];

  // ── Fase 9.3 demo data ──────────────────────────────────────────────
  pickerColor       = "003d9b";
  pickerColorInline = "c9a84c";
  tristateVal:      true | false | null = null;
  tristateDisabled: true | false | null = true;

  readonly demoSchema: FormField[] = [
    { key: "nombre",   type: "text",     label: "Nombre completo", required: true, colspan: 2 },
    { key: "email",    type: "email",    label: "Correo electrónico", required: true },
    { key: "empresa",  type: "text",     label: "Empresa" },
    { key: "origen",   type: "select",   label: "Origen del lead", options: [{ label: "Web", value: "web" }, { label: "Referido", value: "ref" }, { label: "Evento", value: "event" }] },
    { key: "monto",    type: "currency", label: "Presupuesto estimado" },
    { key: "activo",   type: "switch",   label: "Lead activo", hint: "Desactiva para archivar" },
    { key: "notas",    type: "textarea", label: "Notas", rows: 3, colspan: 2 },
  ];
  demoFormValues = { activo: true, origen: "web" };

  onFormSubmit(vals: Record<string, unknown>): void {
    this.messageService.add({ severity: "success", summary: "Formulario enviado", detail: JSON.stringify(vals).slice(0, 60) + "..." });
  }

  readonly heatmapData: HeatmapCell[] = (() => {
    const days  = ["Lun", "Mar", "Mie", "Jue", "Vie"];
    const hours = ["9am", "10am", "11am", "12pm", "1pm", "3pm", "4pm", "5pm"];
    const cells: HeatmapCell[] = [];
    const seed = [8, 14, 22, 12, 6, 28, 18, 4, 20, 30, 10, 16, 24, 2, 26, 7, 15, 19, 11, 3, 27, 13, 21, 5, 17, 23, 9, 29, 1, 25, 0, 20, 8, 16, 4, 12, 28, 6, 22, 18];
    let i = 0;
    for (const row of hours) for (const col of days) cells.push({ row, col, value: seed[i++ % seed.length] });
    return cells;
  })();

  onBarcodeSearch(code: string): void {
    this.messageService.add({ severity: "info", summary: "Busqueda", detail: "Codigo: " + code });
  }

  onBarcodeDetected(result: { value: string; format: string }): void {
    this.messageService.add({ severity: "success", summary: "Detectado", detail: result.format + ": " + result.value });
  }

  readonly territories: Territory[] = [
    { id: "t1", name: "CDMX Norte",   region: "Centro",    owner: "Ana Garcia",    accounts: 42, revenue: 1_850_000, target: 2_000_000, color: "#003d9b", active: true },
    { id: "t2", name: "CDMX Sur",     region: "Centro",    owner: "Carlos Ruiz",   accounts: 38, revenue: 1_200_000, target: 1_500_000, color: "#006477", active: true },
    { id: "t3", name: "Monterrey",    region: "Norte",     owner: "Laura Perez",   accounts: 55, revenue: 2_400_000, target: 2_200_000, color: "#006837", active: true },
    { id: "t4", name: "Guadalajara",  region: "Occidente", owner: "Miguel Torres", accounts: 29, revenue: 980_000,  target: 1_300_000, color: "#b45309", active: true },
    { id: "t5", name: "Bajio",        region: "Centro",    owner: "Diana Lopez",   accounts: 18, revenue: 450_000,  target: 800_000,  color: "#7c3aed", active: false },
  ];

  readonly ganttTasks: GanttTask[] = (() => {
    const today = new Date();
    const d = (offset: number) => { const x = new Date(today); x.setDate(x.getDate() + offset); return x; };
    return [
      { id: "g1", name: "Diagnostico inicial",   startDate: d(-10), endDate: d(-4),  progress: 100, color: "#006837", assignee: "Equipo A" },
      { id: "g2", name: "Sustitucion bombas",     startDate: d(-6),  endDate: d(2),   progress: 70,  color: "#003d9b", assignee: "Equipo B" },
      { id: "g3", name: "Revision electrica",     startDate: d(0),   endDate: d(6),   progress: 20,  color: "#006477", assignee: "Equipo A" },
      { id: "g4", name: "Pintura fachada",        startDate: d(3),   endDate: d(12),  progress: 0,   color: "#b45309", assignee: "Contratista" },
      { id: "g5", name: "Pruebas y entrega",      startDate: d(10),  endDate: d(15),  progress: 0,   color: "#7c3aed", assignee: "Supervision" },
    ];
  })();
}
