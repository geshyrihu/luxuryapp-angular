import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { Loader } from "src/app/core/components/loader/loader";
import { EStatus, StatusBadge } from "src/app/core/components/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { NotificationItem } from "src/app/core/components/notification-center/notification-center";
import { CustomButtonDelete, CustomButtonEdit } from "src/app/core/components/buttons/web";
import { EmptyState } from "src/app/core/components/empty-state/empty-state";
import { DateRange } from "src/app/core/components/date-range/date-range";
import { NotificationCenter } from "src/app/core/components/notification-center/notification-center";
import { ConfirmDialog } from "src/app/core/components/confirm-dialog/confirm-dialog";
import { FileUpload } from "src/app/core/components/file-upload/file-upload";
import { Wizard, WizardStep } from "src/app/core/components/wizard/wizard";
import { CommonCoreCoverage } from "../../shared/common-core-coverage";
import { MenuItem, TreeNode } from "primeng/api";
import { ComparisonItem, ComparisonTable } from "src/app/core/components/comparison-table/comparison-table";
import { ActivityEntry, ActivityLog } from "src/app/core/components/activity-log/activity-log";
import { KanbanCard, KanbanStage, KanbanBoard } from "src/app/core/components/kanban-board/kanban-board";
import { TreeTableColumn, TreeTable } from "src/app/core/components/tree-table/tree-table";
import { ContextMenu } from "src/app/core/components/context-menu/context-menu";
import { SplitPane } from "src/app/core/components/split-pane/split-pane";
import { PaletteCommand, CommandPalette } from "src/app/core/components/command-palette/command-palette";
import { TourStep, Tour } from "src/app/core/components/tour/tour";
import { Gauge } from "src/app/core/components/gauge/gauge";
import { FunnelChart } from "src/app/core/components/funnel-chart/funnel-chart";
// 13.3.3 — Prioridad Baja
import { DashboardWidget, DashboardLayout } from "src/app/core/components/dashboard-layout/dashboard-layout";
import { DocumentPreviewer } from "src/app/core/components/document-previewer/document-previewer";
import { ApprovalNode, ApprovalWorkflow } from "src/app/core/components/approval-workflow/approval-workflow";
import { OrderStatusStep, OrderStatus } from "src/app/core/components/order-status/order-status";
import { LeadScoreCategory, LeadScoring } from "src/app/core/components/lead-scoring/lead-scoring";
import { AppProfileCard } from "src/app/core/components/profile-card/profile-card";
import { AppThemeSwitcher } from "src/app/core/components/theme-switcher/theme-switcher";
import { Customer360Data, AppCustomer360 } from "src/app/core/components/customer-360/customer-360";
import { AppPrintView } from "src/app/core/components/print-view/print-view";
import { AppLangSelector } from "src/app/core/components/lang-selector/lang-selector";
import { AppCommentThread } from "src/app/core/components/comment-thread/comment-thread";
import { AppEmailPreview } from "src/app/core/components/email-preview/email-preview";
import { FormField, AppFormBuilder } from "src/app/core/components/form-builder/form-builder";
import { AppSignaturePad } from "src/app/core/components/signature-pad/signature-pad";
import { AppColorPicker } from "src/app/core/components/color-picker/color-picker";
import { AppTristateSwitch } from "src/app/core/components/tristate-switch/tristate-switch";
import { AppDock } from "src/app/core/components/dock/dock";
import { AppQrCode } from "src/app/core/components/qr-code/qr-code";
import { HeatmapCell, AppHeatmap } from "src/app/core/components/heatmap/heatmap";
import { AppRealtimeIndicator } from "src/app/core/components/realtime-indicator/realtime-indicator";
import { AppInventoryLevel } from "src/app/core/components/inventory-level/inventory-level";
import { AppBarcodeInput } from "src/app/core/components/barcode-input/barcode-input";
import { GanttTask, AppGantt } from "src/app/core/components/gantt/gantt";
import { PivotDimension, PivotValue, PivotTable } from "src/app/core/components/pivot-table/pivot-table";
import { AppOtpInput } from "src/app/core/components/otp-input/otp-input";
import { AvatarItem, AvatarGroup } from "src/app/core/components/avatar-group/avatar-group";
import { KpiCard } from "src/app/core/components/kpi-card/kpi-card";
import { AppStatCard } from "src/app/core/components/stat-card/stat-card";
import { AppSlider } from "src/app/core/components/slider/slider";
import { AppRating } from "src/app/core/components/rating/rating";
import { AppTagInput } from "src/app/core/components/tag-input/tag-input";
import { Timeline, TimelineEvent } from "src/app/core/components/timeline/timeline";
import { AppPipelineCrm, PipelineStage } from "src/app/core/components/pipeline-crm/pipeline-crm";
import { DataGrid, DataGridColumn } from "src/app/core/components/data-grid/data-grid";
import { SkeletonPresets } from "src/app/core/components/skeleton-presets/skeleton-presets";

const CORE_LABELS: Record<string, string> = {
  actionmenu: "Action Menu",
  appicon: "App Icon",
  dataviewmobile: "Data View Mobile",
  loader: "Loader",
  notificationcenter: "Notification Center",
  primengcustomcaption: "PrimeNg Custom Caption",
  statusbadge: "Status Badge",
  wizard: "Wizard",
  emptystate: "Empty State",
  confirmdialog: "Confirm Dialog",
  daterange: "Date Range",
  fileupload: "File Upload",
  // Fase 6-10
  datagrid: "Data Grid",
  kpicard: "KPI Card",
  avatargroup: "Avatar Group",
  timeline: "Timeline",
  slider: "Slider",
  rating: "Rating / Stars",
  pipelinecrm: "Pipeline CRM",
  taginput: "Tag Input",
  statcard: "Stat Card",
  skeletonpresets: "Skeleton Presets",
  // 13.3.2
  comparisontable: "Comparison Table",
  activitylog: "Activity Log",
  kanbanboard: "Kanban Board",
  treetable: "Tree Table",
  contextmenu: "Context Menu",
  splitpane: "Split Pane",
  commandpalette: "Command Palette (Ctrl+K)",
  tour: "Tour / Onboarding",
  gauge: "Gauge / Speedometer",
  funnelchart: "Funnel Chart",
  // 13.3.3
  dashboardlayout: "Dashboard Layout",
  documentpreviewer: "Document Previewer",
  approvalworkflow: "Approval Workflow",
  orderstatus: "Order Status Tracker",
  leadscoring: "Lead Scoring",
  profilecard: "Profile Card (CRM)",
  themeswitcher: "Theme Switcher",
  customer360: "Customer 360",
  printview: "Print View",
  langselector: "Language / Region Selector",
  commentthread: "Comment Thread",
  emailpreview: "Email Template Preview",
  formbuilder: "Form Builder (JSON Schema)",
  signaturepad: "Signature Pad",
  colorpicker: "Color Picker",
  tristateswitch: "Tristate Switch",
  dock: "Dock (macOS-style)",
  qrcode: "QR Code Generator",
  heatmap: "Heatmap",
  realtimeindicator: "Realtime Indicator",
  inventorylevel: "Inventory Level",
  barcodeinput: "Barcode / QR Input",
  gantt: "Gantt Chart",
  pivottable: "Pivot Table",
  otpinput: "OTP Input",
};

@Component({
  selector: "app-catalog-core-item",
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    TagModule,
    ActionMenu,
    AppIcon,
    DataViewMobile,
    Loader,
    StatusBadge,
    PrimeNgCustomCaption,
    CustomButtonDelete,
    CustomButtonEdit,
    EmptyState,
    DateRange,
    NotificationCenter,
    ConfirmDialog,
    FileUpload,
    Wizard,
    CommonCoreCoverage,
    // 13.3.3
    DashboardLayout,
    DocumentPreviewer,
    ApprovalWorkflow,
    OrderStatus,
    LeadScoring,
    AppProfileCard,
    AppThemeSwitcher,
    AppCustomer360,
    AppPrintView,
    AppLangSelector,
    AppCommentThread,
    AppEmailPreview,
    AppFormBuilder,
    AppSignaturePad,
    AppColorPicker,
    AppTristateSwitch,
    AppDock,
    AppQrCode,
    AppHeatmap,
    AppRealtimeIndicator,
    AppInventoryLevel,
    AppBarcodeInput,
    AppGantt,
    PivotTable,
    AppOtpInput,
    // 13.3.2
    ComparisonTable,
    ActivityLog,
    KanbanBoard,
    TreeTable,
    ContextMenu,
    SplitPane,
    CommandPalette,
    Tour,
    Gauge,
    FunnelChart,
    // Fase 6-10
    AvatarGroup,
    KpiCard,
    AppStatCard,
    AppSlider,
    AppRating,
    AppTagInput,
    Timeline,
    AppPipelineCrm,
    DataGrid,
    SkeletonPresets,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ('actionmenu') {
          <p-card header="Action Menu — uso correcto en web">
            <p class="text-sm text-secondary m-0 mb-3">
              Dentro de <code>app-action-menu</code> los botones muestran <strong>icono + label alineados</strong>.
              Siempre agrega <code>[showLabelOnDesktop]="true"</code> y un <code>label</code> explícito.
            </p>
            <div class="flex gap-4">
              <div>
                <p class="text-xs font-bold text-secondary mb-2">✅ Correcto</p>
                <app-action-menu>
                  <ng-container actions>
                    <custom-button-edit label="Editar" [showLabelOnDesktop]="true" />
                    <custom-button-delete label="Eliminar" [showLabelOnDesktop]="true" />
                  </ng-container>
                </app-action-menu>
              </div>
              <div>
                <p class="text-xs font-bold text-secondary mb-2">❌ Incorrecto (sin label)</p>
                <app-action-menu>
                  <ng-container actions>
                    <custom-button-edit />
                    <custom-button-delete />
                  </ng-container>
                </app-action-menu>
              </div>
            </div>
            <p-divider />
            <p class="text-xs text-secondary m-0">
              <strong>Regla DS:</strong> Todos los <code>custom-button-*</code> dentro de <code>&lt;app-action-menu&gt;</code>
              deben tener <code>[showLabelOnDesktop]="true"</code> + <code>label="..."</code> para mostrar texto en web.
              En mobile el label ya aparece por defecto (Ionic list item).
            </p>
          </p-card>
        }
        @case ('appicon') {
          <p-card header="App Icon">
            <div class="flex gap-3 text-2xl text-primary">
              <app-icon icon="mdi:account" />
              <app-icon icon="mdi:cog" />
              <app-icon icon="mdi:bell" />
            </div>
          </p-card>
        }
        @case ('dataviewmobile') {
          <p-card header="Data View Mobile">
            <app-data-view-mobile [data]="groupedData" groupKey="section">
              <ng-template #header let-group><strong>{{ group.section }}</strong></ng-template>
              <ng-template #body let-item>{{ item.title }}</ng-template>
            </app-data-view-mobile>
          </p-card>
        }
        @case ('loader') {
          <p-card header="Loader">
            <app-loader />
          </p-card>
        }
        @case ('notificationcenter') {
          <p-card header="Notification Center">
            <app-notification-center [notifications]="sampleNotifications" [unreadCount]="2" />
          </p-card>
        }
        @case ('primengcustomcaption') {
          <p-card header="PrimeNg Custom Caption">
            <primeng-custom-caption label="Agregar Insumo" [rolAuth]="true" [showSearch]="true" />
          </p-card>
        }
        @case ('statusbadge') {
          <p-card header="Status Badge">
            <div class="flex gap-2 flex-wrap">
              <app-status-badge [status]="EStatus.Concluido" />
              <app-status-badge [status]="EStatus.Pendiente" />
              <app-status-badge [status]="EStatus.Proceso" />
              <app-status-badge [status]="EStatus.Cancelado" />
              <app-status-badge [status]="EStatus.noAutorizado" />
            </div>
          </p-card>
        }
        @case ('wizard') {
          <p-card header="Wizard">
            <app-wizard [steps]="wizardSteps" [linear]="true" finishLabel="Finalizar" [(activeStep)]="wizardActiveStep">
              <div step="1"><strong>Paso 1</strong></div>
              <div step="2"><strong>Paso 2</strong></div>
              <div step="3"><strong>Paso 3</strong></div>
            </app-wizard>
          </p-card>
        }
        @case ('emptystate') {
          <p-card header="Empty State">
            <app-empty-state icon="mdi:inbox-outline" title="Sin resultados" message="No se encontraron registros." actionLabel="Nuevo registro" actionIcon="mdi:plus" />
          </p-card>
        }
        @case ('confirmdialog') {
          <p-card header="Confirm Dialog">
            <p-button label="Abrir confirmación" severity="danger" (onClick)="confirmVisible.set(true)" />
            <app-confirm-dialog [(visible)]="confirmVisible" title="Eliminar registro" message="¿Estás seguro?" type="danger" confirmLabel="Eliminar" />
          </p-card>
        }
        @case ('daterange') {
          <p-card header="Date Range"><app-date-range /></p-card>
        }
        @case ('fileupload') {
          <p-card header="File Upload">
            <app-file-upload chooseLabel="Subir archivos" accept="image/*,.pdf" [maxFileSize]="5000000" [multiple]="true" />
          </p-card>
        }

        <!-- ─── Fase 6-10 ─── -->
        @case ('datagrid') {
          <p-card header="Data Grid — Editable + Sort + Filter">
            <app-data-grid
              [data]="gridData"
              [columns]="gridColumns"
              dataKey="id"
              [paginator]="true"
              [rows]="5"
            />
          </p-card>
        }
        @case ('kpicard') {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card label="Ingresos" [value]="124500" format="currency" prefix="$" [trend]="12.4" icon="mdi:trending-up" />
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card label="Clientes" [value]="348" [trend]="-3.1" icon="mdi:account-group" />
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card label="Conversión" [value]="68" format="percent" suffix="%" [trend]="5.2" icon="mdi:percent" />
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card label="Tickets" [value]="12" [trend]="0" icon="mdi:ticket-outline" subtitle="sin tendencia" />
            </div>
          </div>
        }
        @case ('avatargroup') {
          <p-card header="Avatar Group — Stacked con overflow">
            <div class="flex flex-column gap-4">
              <div>
                <p class="text-sm font-bold mb-2">Máx. 4 visibles:</p>
                <app-avatar-group [avatars]="avatarList" [maxVisible]="4" />
              </div>
              <div>
                <p class="text-sm font-bold mb-2">Máx. 3 visibles:</p>
                <app-avatar-group [avatars]="avatarList" [maxVisible]="3" />
              </div>
            </div>
          </p-card>
        }
        @case ('timeline') {
          <p-card header="Timeline — Eventos verticales">
            <app-timeline [events]="timelineEvents" align="left" layout="vertical" />
          </p-card>
        }
        @case ('slider') {
          <p-card header="Slider — Rango simple y doble">
            <div class="flex flex-column gap-4">
              <div>
                <p class="text-sm font-bold mb-2">Simple:</p>
                <app-slider label="Presupuesto" [min]="0" [max]="100000" [step]="1000" prefix="$" [(value)]="sliderValue" />
              </div>
              <div>
                <p class="text-sm font-bold mb-2">Rango:</p>
                <app-slider label="Rango de precio" [min]="0" [max]="500" [step]="10" prefix="$" [range]="true" [(value)]="sliderRangeValue" />
              </div>
              <div>
                <p class="text-sm font-bold mb-2">Deshabilitado:</p>
                <app-slider label="Solo lectura" [min]="0" [max]="100" [disabled]="true" [(value)]="sliderDisabledValue" />
              </div>
            </div>
          </p-card>
        }
        @case ('rating') {
          <p-card header="Rating / Stars">
            <div class="flex flex-column gap-3">
              <app-rating label="Calidad del servicio" [(value)]="ratingValue" [stars]="5" />
              <app-rating label="Solo lectura (4/5)" [(value)]="ratingReadonly" [readonly]="true" />
              <app-rating label="Sin cancelar" [(value)]="ratingNoCanel" [allowCancel]="false" />
            </div>
          </p-card>
        }
        @case ('pipelinecrm') {
          <p-card header="Pipeline CRM — Stages visuales">
            <app-pipeline-crm title="Pipeline de Ventas Q3" [stages]="pipelineStages" />
          </p-card>
        }
        @case ('taginput') {
          <p-card header="Tag Input — Autocomplete con chips">
            <app-tag-input label="Etiquetas del proyecto" placeholder="Escribe para buscar..." [suggestions]="tagSuggestions" />
          </p-card>
        }
        @case ('statcard') {
          <div class="grid">
            <div class="col-12 md:col-6">
              <app-stat-card label="Ventas del mes" [value]="84320" format="currency" prefix="$" icon="mdi:cash-multiple" [sparkline]="[30,55,40,65,60,80,84]" [trend]="8.3" />
            </div>
            <div class="col-12 md:col-6">
              <app-stat-card label="Nuevos clientes" [value]="47" icon="mdi:account-plus" [sparkline]="[10,14,12,18,15,20,47]" [trend]="-2.1" />
            </div>
          </div>
        }
        @case ('skeletonpresets') {
          <div class="grid">
            <div class="col-12 md:col-6"><app-skeleton-presets variant="card" /><p class="text-xs text-secondary mt-1 text-center">card</p></div>
            <div class="col-12 md:col-6"><app-skeleton-presets variant="table" [rows]="3" /><p class="text-xs text-secondary mt-1 text-center">table</p></div>
            <div class="col-12 md:col-6"><app-skeleton-presets variant="form" [fields]="2" /><p class="text-xs text-secondary mt-1 text-center">form</p></div>
            <div class="col-12 md:col-6"><app-skeleton-presets variant="avatar" /><p class="text-xs text-secondary mt-1 text-center">avatar</p></div>
          </div>
        }

        <!-- ─── 13.3.2 ─── -->
        @case ('comparisontable') {
          <p-card header="Comparison Table — Comparativa de features">
            <app-comparison-table [items]="comparisonItems" highlightColumn="Pro" [showCheckmark]="true" />
          </p-card>
        }
        @case ('activitylog') {
          <p-card header="Activity Log — Historial CRM">
            <app-activity-log title="Actividad del cliente" [entries]="activityEntries" [groupByDate]="true" />
          </p-card>
        }
        @case ('kanbanboard') {
          <p-card header="Kanban Board — Tablero drag & drop">
            <app-kanban-board [stages]="kanbanStages" [showAddCard]="false" />
          </p-card>
        }
        @case ('treetable') {
          <p-card header="Tree Table — Tabla jerárquica">
            <app-tree-table [nodes]="treeNodes" [columns]="treeColumns" />
          </p-card>
        }
        @case ('contextmenu') {
          <p-card header="Context Menu — Click derecho">
            <div class="flex flex-column gap-3">
              <p class="text-sm text-secondary m-0">Haz clic derecho sobre el siguiente elemento:</p>
              <app-context-menu [items]="contextMenuItems">
                <div
                  class="border-round-lg p-4 text-center cursor-pointer"
                  style="border:2px dashed var(--ds-border-strong);background:var(--ds-bg-elevated);"
                >
                  <p class="m-0 font-bold">Área de contexto</p>
                  <p class="m-0 text-xs text-secondary mt-1">Clic derecho aquí</p>
                </div>
              </app-context-menu>
            </div>
          </p-card>
        }
        @case ('splitpane') {
          <p-card header="Split Pane — Paneles redimensionables">
            <app-split-pane direction="horizontal" height="280px" [sizes]="[40,60]" [minSizes]="[20,20]">
              <div left-panel class="h-full" style="background:var(--ds-bg-elevated);padding:0.75rem;">
                <p class="font-bold text-sm m-0 mb-2">Panel izquierdo</p>
                <ul class="text-sm m-0" style="padding-left:1rem;">
                  <li>Registro A</li>
                  <li>Registro B</li>
                  <li>Registro C</li>
                </ul>
              </div>
              <div right-panel class="h-full" style="background:var(--ds-bg-surface);padding:0.75rem;">
                <p class="font-bold text-sm m-0">Panel derecho (detalle)</p>
                <p class="text-sm text-secondary mt-2">Selecciona un elemento para ver su detalle aquí.</p>
              </div>
            </app-split-pane>
          </p-card>
        }
        @case ('commandpalette') {
          <p-card header="Command Palette — Ctrl+K">
            <div class="flex flex-column gap-3">
              <p class="text-sm text-secondary m-0">El Command Palette es un diálogo global. Haz clic para abrirlo:</p>
              <p-button label="Abrir Command Palette (Ctrl+K)" icon="mdi:magnify" (onClick)="cmdPaletteVisible.set(true)" />
              <p class="text-xs text-secondary m-0">También puedes presionar <kbd>Ctrl+K</kbd> cuando el diálogo esté registrado.</p>
            </div>
            <app-command-palette [(visible)]="cmdPaletteVisible" [commands]="paletteCommands" />
          </p-card>
        }
        @case ('tour') {
          <p-card header="Tour / Onboarding — Paso a paso">
            <div class="flex flex-column gap-3">
              <p class="text-sm text-secondary m-0">Inicia el tour para ver el componente de onboarding en acción:</p>
              <p-button label="Iniciar Tour" icon="mdi:map-marker-path" (onClick)="tourVisible.set(true)" />
            </div>
            <app-tour [(visible)]="tourVisible" [steps]="tourSteps" />
          </p-card>
        }
        @case ('gauge') {
          <div class="grid">
            <div class="col-12 md:col-4">
              <p-card header="CPU — 72%">
                <div class="flex justify-content-center">
                  <app-gauge [value]="72" [min]="0" [max]="100" [size]="140" />
                </div>
              </p-card>
            </div>
            <div class="col-12 md:col-4">
              <p-card header="Ocupación — 45%">
                <div class="flex justify-content-center">
                  <app-gauge [value]="45" [min]="0" [max]="100" [size]="140" />
                </div>
              </p-card>
            </div>
            <div class="col-12 md:col-4">
              <p-card header="Temperatura — 88%">
                <div class="flex justify-content-center">
                  <app-gauge [value]="88" [min]="0" [max]="100" [size]="140" />
                </div>
              </p-card>
            </div>
          </div>
        }
        @case ('funnelchart') {
          <p-card header="Funnel Chart — Pipeline de ventas">
            <app-funnel-chart
              title="Embudo de Ventas Q3"
              [labels]="['Leads', 'Contactados', 'Propuesta', 'Negociación', 'Cerrados']"
              [values]="[1200, 820, 430, 210, 95]"
            />
          </p-card>
        }

        <!-- ─── 13.3.3 ─── -->
        @case ('otpinput') {
          <p-card header="OTP Input — 2FA / Verificación">
            <div class="flex flex-column gap-4">
              <div>
                <p class="text-sm font-bold mb-2">6 dígitos (predeterminado):</p>
                <app-otp-input [(value)]="otpValue" />
                <p class="text-xs text-secondary mt-1">Valor: <strong>{{ otpValue() || '—' }}</strong></p>
              </div>
            </div>
          </p-card>
        }
        @case ('profilecard') {
          <div class="grid">
            <div class="col-12 md:col-6">
              <app-profile-card
                name="Ana Martínez"
                role="Gerente de Ventas"
                email="a.martinez@luxuryapp.mx"
                phone="+52 55 1234 5678"
                company="Grupo LuxuryApp SA"
              />
            </div>
            <div class="col-12 md:col-6">
              <app-profile-card
                name="Carlos Ruiz"
                role="Director Técnico"
                email="c.ruiz@luxuryapp.mx"
                company="LuxuryApp Tech"
              />
            </div>
          </div>
        }
        @case ('themeswitcher') {
          <p-card header="Theme Switcher — Light / Dark / High Contrast">
            <app-theme-switcher />
          </p-card>
        }
        @case ('langselector') {
          <p-card header="Language / Region Selector">
            <app-lang-selector [(selectedCode)]="langCode" />
            <p class="text-xs text-secondary mt-2">Seleccionado: <strong>{{ langCode() }}</strong></p>
          </p-card>
        }
        @case ('colorpicker') {
          <p-card header="Color Picker — Hex / RGB / HSB">
            <div class="flex flex-column gap-4">
              <div>
                <p class="text-sm font-bold mb-2">Inline:</p>
                <app-color-picker [(value)]="colorValue" [inline]="true" label="Color de etiqueta" />
              </div>
              <div>
                <p class="text-sm font-bold mb-2">Popover:</p>
                <app-color-picker [(value)]="colorValue" label="Color (popover)" />
                <p class="text-xs text-secondary mt-1">Valor: <strong>{{ colorValue() }}</strong></p>
              </div>
            </div>
          </p-card>
        }
        @case ('tristateswitch') {
          <p-card header="Tristate Switch — Sí / No / Indeterminado">
            <div class="flex flex-column gap-3">
              <app-tristate-switch [(value)]="tristateValue" label="Autorización del cliente" />
              <p class="text-xs text-secondary">Estado: <strong>{{ tristateValue() === null ? 'Indeterminado' : tristateValue() ? 'Sí' : 'No' }}</strong></p>
              <app-tristate-switch [(value)]="tristateValue2" label="Revisión completada" hint="Null = pendiente" />
            </div>
          </p-card>
        }
        @case ('signaturepad') {
          <p-card header="Signature Pad — Firma digital">
            <app-signature-pad label="Firma del cliente" hint="Dibuja tu firma con el mouse o dedo" placeholder="Firma aquí" />
          </p-card>
        }
        @case ('qrcode') {
          <p-card header="QR Code Generator">
            <div class="grid">
              <div class="col-12 md:col-4">
                <app-qr-code data="https://luxuryapp.mx" label="Sitio web" [allowDownload]="true" [showData]="true" />
              </div>
              <div class="col-12 md:col-4">
                <app-qr-code data="OC-2026-0892" label="Orden de compra" [size]="120" />
              </div>
              <div class="col-12 md:col-4">
                <app-qr-code data="CURP-MARI800101HDFRZN09" label="CURP del empleado" [size]="120" />
              </div>
            </div>
          </p-card>
        }
        @case ('barcodeinput') {
          <p-card header="Barcode / QR Input — Escaneo + teclado">
            <app-barcode-input />
          </p-card>
        }
        @case ('realtimeindicator') {
          <p-card header="Realtime Indicator — Estado de conexión live">
            <div class="flex flex-column gap-3">
              <app-realtime-indicator status="live" lastUpdate="hace 2s" [latencyMs]="45" />
              <app-realtime-indicator status="stale" lastUpdate="hace 5 min" />
              <app-realtime-indicator status="offline" />
            </div>
          </p-card>
        }
        @case ('inventorylevel') {
          <div class="grid">
            <div class="col-12 md:col-4">
              <app-inventory-level name="Cable 12AWG" sku="ELT-001" [current]="320" [max]="500" [reorderPoint]="100" />
            </div>
            <div class="col-12 md:col-4">
              <app-inventory-level name="Interruptor termo." sku="ELT-002" [current]="45" [max]="200" [reorderPoint]="50" />
            </div>
            <div class="col-12 md:col-4">
              <app-inventory-level name="Pintura blanca 1L" sku="MTL-010" [current]="8" [max]="100" [reorderPoint]="20" />
            </div>
          </div>
        }
        @case ('leadscoring') {
          <p-card header="Lead Scoring — Puntuación visual de lead CRM">
            <app-lead-scoring [categories]="leadCategories" />
          </p-card>
        }
        @case ('approvalworkflow') {
          <p-card header="Approval Workflow — Flujo de aprobación">
            <app-approval-workflow [nodes]="approvalNodes" />
          </p-card>
        }
        @case ('orderstatus') {
          <div class="grid">
            <div class="col-12 md:col-6">
              <p-card header="Horizontal">
                <app-order-status [steps]="orderSteps" />
              </p-card>
            </div>
            <div class="col-12 md:col-6">
              <p-card header="Vertical">
                <app-order-status [steps]="orderSteps" [vertical]="true" />
              </p-card>
            </div>
          </div>
        }
        @case ('documentpreviewer') {
          <p-card header="Document Previewer — PDF inline">
            <app-document-previewer
              src="https://www.w3.org/WAI/WCAG21/wcag21.pdf"
              fileName="WCAG-2.1.pdf"
              [printable]="true"
            />
          </p-card>
        }
        @case ('dashboardlayout') {
          <p-card header="Dashboard Layout — Grid de widgets">
            <app-dashboard-layout [widgets]="dashWidgets" [columns]="3">
            </app-dashboard-layout>
          </p-card>
        }
        @case ('commentthread') {
          <p-card header="Comment Thread — Notas colaborativas">
            <app-comment-thread title="Notas del expediente" [comments]="sampleComments" />
          </p-card>
        }
        @case ('emailpreview') {
          <p-card header="Email Template Previewer">
            <app-email-preview
              from="sistema@luxuryapp.mx"
              to="cliente@empresa.com"
              subject="Confirmación de orden OC-2026-0892"
              [htmlContent]="emailHtml"
            />
          </p-card>
        }
        @case ('formbuilder') {
          <p-card header="Form Builder — JSON Schema dinámico">
            <app-form-builder title="Formulario generado desde schema" [schema]="formSchema" />
          </p-card>
        }
        @case ('printview') {
          <p-card header="Print View — Vista de impresión">
            <app-print-view title="Reporte de Gastos — Junio 2026" subtitle="Departamento de Operaciones">
              <p>Contenido del reporte que se optimiza para impresión con CSS @media print.</p>
              <p>Las áreas de navegación y el sidebar quedan ocultos automáticamente.</p>
            </app-print-view>
          </p-card>
        }
        @case ('customer360') {
          <p-card header="Customer 360 — Vista completa de cliente CRM">
            <app-customer-360 [data]="customer360Data" />
          </p-card>
        }
        @case ('dock') {
          <p-card header="Dock — macOS-style app dock">
            <div style="position:relative;height:140px;background:var(--ds-bg-elevated);border-radius:var(--ds-radius-lg,8px);overflow:hidden;">
              <app-dock [items]="dockItems" position="bottom" />
            </div>
          </p-card>
        }
        @case ('heatmap') {
          <p-card header="Heatmap — Actividad por hora/día">
            <app-heatmap title="Actividad semanal" [data]="heatmapData" [showValues]="true" />
          </p-card>
        }
        @case ('gantt') {
          <p-card header="Gantt Chart — Cronograma de proyecto">
            <app-gantt title="Proyecto ERP Q3" [tasks]="ganttTasks" />
          </p-card>
        }
        @case ('pivottable') {
          <p-card header="Pivot Table — Análisis multidimensional">
            <app-pivot-table
              title="Ventas por área y mes"
              [data]="pivotData"
              [rows]="pivotRows"
              [columns]="pivotColumns"
              [values]="pivotValues"
            />
          </p-card>
        }
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogCoreItem {
  private route = inject(ActivatedRoute);
  item = signal('');
  get label(): string { return CORE_LABELS[this.item()] ?? this.item(); }

  constructor() {
    this.route.paramMap.subscribe(p => this.item.set(p.get('item') ?? ''));
  }
  EStatus = EStatus;
  confirmVisible = signal(false);
  wizardActiveStep = signal(1);

  readonly groupedData = [{ section: 'Hoy', title: 'Revisión', status: 'Pendiente' }, { section: 'Mañana', title: 'Junta', status: 'Urgente' }];

  readonly sampleNotifications: NotificationItem[] = [
    { id: "1", icon: "mdi:file-document", title: "Documento aprobado", description: "Aprobado.", time: "Hace 5 min", read: false, severity: "success" },
  ];

  readonly wizardSteps: WizardStep[] = [
    { value: 1, label: "Datos", icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisión", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ];

  // ─── Fase 6-10 demo data ───────────────────────────────────────

  readonly gridColumns: DataGridColumn[] = [
    { field: 'nombre', header: 'Nombre', type: 'text', editable: true, sortable: true, filterable: true },
    { field: 'area', header: 'Área', type: 'select', editable: true, sortable: true, options: [{ label: 'Contabilidad', value: 'Contabilidad' }, { label: 'Operaciones', value: 'Operaciones' }, { label: 'RH', value: 'RH' }] },
    { field: 'monto', header: 'Monto', type: 'currency', editable: true, sortable: true },
    { field: 'activo', header: 'Activo', type: 'boolean', editable: true },
  ];

  readonly gridData = [
    { id: 1, nombre: 'Juan García', area: 'Contabilidad', monto: 45000, activo: true },
    { id: 2, nombre: 'María López', area: 'Operaciones', monto: 38500, activo: true },
    { id: 3, nombre: 'Carlos Ruiz', area: 'RH', monto: 52000, activo: false },
    { id: 4, nombre: 'Ana Martínez', area: 'Contabilidad', monto: 61000, activo: true },
    { id: 5, nombre: 'Luis Torres', area: 'Operaciones', monto: 29000, activo: true },
    { id: 6, nombre: 'Laura Sánchez', area: 'RH', monto: 47500, activo: false },
  ];

  readonly avatarList: AvatarItem[] = [
    { label: 'JG', color: '#003d9b', tooltip: 'Juan García' },
    { label: 'ML', color: '#006837', tooltip: 'María López' },
    { label: 'CR', color: '#b45309', tooltip: 'Carlos Ruiz' },
    { label: 'AM', color: '#7c3aed', tooltip: 'Ana Martínez' },
    { label: 'LT', color: '#ba1a1a', tooltip: 'Luis Torres' },
    { label: 'LS', color: '#006477', tooltip: 'Laura Sánchez' },
  ];

  readonly timelineEvents: TimelineEvent[] = [
    { title: 'Solicitud recibida', description: 'El cliente envió la solicitud de compra.', date: '10 Jun 2026', icon: 'mdi:inbox-arrow-down', color: 'var(--ds-primary)', badge: 'Inicio', badgeColor: 'primary' },
    { title: 'Revisión de crédito', description: 'Validación aprobada por el área financiera.', date: '12 Jun 2026', icon: 'mdi:shield-check', color: 'var(--ds-success)', badge: 'OK', badgeColor: 'success' },
    { title: 'Orden generada', description: 'PO-2026-0892 creada en el sistema ERP.', date: '13 Jun 2026', icon: 'mdi:file-document-edit', color: 'var(--ds-warning)', badge: 'En proceso', badgeColor: 'warning' },
    { title: 'Entrega programada', description: 'Entrega estimada para el 20 de junio.', date: '20 Jun 2026', icon: 'mdi:truck-delivery', color: 'var(--ds-text-muted)' },
  ];

  sliderValue = signal<number | number[]>(35000);
  sliderRangeValue = signal<number | number[]>([100, 350]);
  sliderDisabledValue = signal<number | number[]>(60);

  ratingValue = signal<number | undefined>(3);
  ratingReadonly = signal<number | undefined>(4);
  ratingNoCanel = signal<number | undefined>(2);

  readonly pipelineStages: PipelineStage[] = [
    { id: 'prospect', name: 'Prospecto', color: 'var(--ds-info)', deals: [
      { id: 'd1', title: 'Grupo Hotelero Reforma', company: 'GHR S.A.', value: 85000, owner: 'JG', priority: 'high' },
      { id: 'd2', title: 'Centro Comercial Norte', company: 'CCN SA', value: 42000, owner: 'ML' },
    ]},
    { id: 'proposal', name: 'Propuesta', color: 'var(--ds-warning)', deals: [
      { id: 'd3', title: 'Residencial del Valle', company: 'RDV', value: 120000, owner: 'CR', priority: 'medium' },
    ]},
    { id: 'negotiation', name: 'Negociación', color: 'var(--ds-primary)', deals: [
      { id: 'd4', title: 'Torre Corporativa Sur', company: 'TCS', value: 250000, owner: 'AM', priority: 'high' },
    ]},
    { id: 'closed', name: 'Ganado', color: 'var(--ds-success)', deals: [
      { id: 'd5', title: 'Plaza Loft', company: 'PL SA', value: 78000, owner: 'LT' },
    ]},
  ];

  readonly tagSuggestions = ['Angular', 'PrimeNG', 'Ionic', 'TypeScript', 'Design System', 'CRM', 'ERP', 'Mobile', 'Web', 'Dashboard'];

  // ─── 13.3.3 demo data ─────────────────────────────────────────

  otpValue = signal<string>('');
  langCode = signal<string>('es-MX');
  colorValue = signal<string>('#003d9b');
  tristateValue = signal<boolean | null>(null);
  tristateValue2 = signal<boolean | null>(true);

  readonly leadCategories: LeadScoreCategory[] = [
    { label: 'Engagement', score: 85, maxScore: 100, color: 'var(--ds-primary)' },
    { label: 'Presupuesto', score: 60, maxScore: 100, color: 'var(--ds-success)' },
    { label: 'Autoridad', score: 90, maxScore: 100, color: 'var(--ds-warning)' },
    { label: 'Necesidad', score: 75, maxScore: 100, color: 'var(--ds-info)' },
    { label: 'Tiempo', score: 50, maxScore: 100, color: 'var(--ds-danger)' },
  ];

  readonly approvalNodes: ApprovalNode[] = [
    { id: '1', label: 'Solicitante', status: 'approved', assignee: 'Juan García', date: '10 Jun 2026', comment: 'Solicitud generada.' },
    { id: '2', label: 'Jefe de Área', status: 'approved', assignee: 'María López', date: '11 Jun 2026' },
    { id: '3', label: 'Finanzas', status: 'pending', assignee: 'Carlos Ruiz' },
    { id: '4', label: 'Dirección', status: 'pending', assignee: 'Ana Martínez' },
  ];

  readonly orderSteps: OrderStatusStep[] = [
    { label: 'Solicitado', date: '10 Jun 2026', completed: true, active: false, icon: 'mdi:file-document' },
    { label: 'Aprobado', date: '11 Jun 2026', completed: true, active: false, icon: 'mdi:check-circle' },
    { label: 'En tránsito', date: '13 Jun 2026', completed: false, active: true, icon: 'mdi:truck-delivery' },
    { label: 'Entregado', completed: false, active: false, icon: 'mdi:home-check' },
  ];

  readonly dashWidgets: DashboardWidget[] = [
    { id: 'w1', title: 'KPIs Generales', cols: 2, rows: 1 },
    { id: 'w2', title: 'Gráfica de Ventas', cols: 1, rows: 1 },
    { id: 'w3', title: 'Pipeline CRM', cols: 3, rows: 1 },
    { id: 'w4', title: 'Actividad Reciente', cols: 1, rows: 1 },
    { id: 'w5', title: 'Inventario Crítico', cols: 2, rows: 1 },
  ];

  readonly sampleComments = [
    { id: '1', author: 'Juan García', authorInitials: 'JG', content: 'El cliente solicitó extensión de plazo de pago a 45 días.', timestamp: new Date('2026-06-24T09:00:00'), read: true },
    { id: '2', author: 'María López', authorInitials: 'ML', content: 'Confirmado con finanzas. Se aplicará a partir de julio.', timestamp: new Date('2026-06-24T10:30:00'), read: false },
  ];

  readonly emailHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#003d9b;">Confirmación de Orden</h2>
      <p>Estimado cliente,</p>
      <p>Su orden <strong>OC-2026-0892</strong> ha sido aprobada y está en proceso de entrega.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="background:#f4f5f8;"><th style="padding:8px;text-align:left;">Concepto</th><th style="padding:8px;text-align:right;">Monto</th></tr>
        <tr><td style="padding:8px;">Material eléctrico</td><td style="padding:8px;text-align:right;">$45,000.00</td></tr>
        <tr><td style="padding:8px;">Mano de obra</td><td style="padding:8px;text-align:right;">$12,500.00</td></tr>
        <tr style="font-weight:bold;"><td style="padding:8px;">Total</td><td style="padding:8px;text-align:right;">$57,500.00</td></tr>
      </table>
      <p style="color:#6b7280;font-size:12px;">LuxuryApp ERP · sistema@luxuryapp.mx</p>
    </div>`;

  readonly formSchema: FormField[] = [
    { key: 'nombre', type: 'text', label: 'Nombre completo', required: true, placeholder: 'Juan García' },
    { key: 'email', type: 'email', label: 'Correo electrónico', required: true },
    { key: 'area', type: 'select', label: 'Área', required: true, options: [{ label: 'Contabilidad', value: 'cont' }, { label: 'Operaciones', value: 'ops' }, { label: 'RH', value: 'rh' }] },
    { key: 'monto', type: 'currency', label: 'Monto solicitado', required: true, colspan: 2 },
    { key: 'notas', type: 'textarea', label: 'Observaciones', rows: 3, colspan: 2 },
    { key: 'urgente', type: 'switch', label: 'Solicitud urgente' },
  ];

  readonly customer360Data: Customer360Data = {
    name: 'Grupo Hotelero Reforma SA',
    role: 'Cliente Premium',
    company: 'GHR SA de CV',
    email: 'contacto@ghr.mx',
    phone: '+52 55 9876 5432',
    tags: ['Premium', 'Hotelería', 'CDMX'],
    totalRevenue: 2450000,
    openDeals: 3,
    lastContact: '24 Jun 2026',
    nps: 87,
    recentActivity: [
      { icon: 'mdi:phone', text: 'Llamada de seguimiento Q3', time: 'Hace 2 días' },
      { icon: 'mdi:email', text: 'Propuesta enviada por email', time: 'Hace 5 días' },
      { icon: 'mdi:calendar', text: 'Reunión de revisión anual', time: 'Hace 2 sem.' },
    ],
    deals: [
      { title: 'Remodelación Lobby', stage: 'Negociación', value: 850000 },
      { title: 'Mantenimiento anual', stage: 'Propuesta', value: 420000 },
      { title: 'Instalación AC', stage: 'Prospecto' },
    ],
  };

  readonly dockItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'mdi:view-dashboard', command: () => {} },
    { label: 'CRM', icon: 'mdi:account-group', command: () => {} },
    { label: 'Reportes', icon: 'mdi:chart-bar', command: () => {} },
    { label: 'Inventario', icon: 'mdi:package-variant', command: () => {} },
    { label: 'Config', icon: 'mdi:cog', command: () => {} },
  ];

  readonly heatmapData: HeatmapCell[] = [
    ...[['Lun', 'Mar', 'Mié', 'Jue', 'Vie']].flatMap(cols =>
      ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((row, ri) =>
        cols.map((col, ci) => ({ row, col, value: Math.round(10 + Math.sin(ri + ci) * 30 + Math.random() * 40) }))
      ).flat()
    ),
  ];

  readonly ganttTasks: GanttTask[] = [
    { id: 'g1', name: 'Diseño de arquitectura', group: 'Planificación', startDate: new Date('2026-07-01'), endDate: new Date('2026-07-07'), progress: 100, color: 'var(--ds-primary)', assignee: 'JG' },
    { id: 'g2', name: 'Desarrollo backend', group: 'Desarrollo', startDate: new Date('2026-07-08'), endDate: new Date('2026-07-25'), progress: 60, assignee: 'ML', dependencies: ['g1'] },
    { id: 'g3', name: 'Desarrollo frontend', group: 'Desarrollo', startDate: new Date('2026-07-08'), endDate: new Date('2026-07-28'), progress: 40, assignee: 'CR', dependencies: ['g1'] },
    { id: 'g4', name: 'QA & Testing', group: 'Testing', startDate: new Date('2026-07-28'), endDate: new Date('2026-08-05'), progress: 0, color: 'var(--ds-warning)', assignee: 'AM', dependencies: ['g2', 'g3'] },
    { id: 'g5', name: 'Despliegue producción', group: 'Deploy', startDate: new Date('2026-08-06'), endDate: new Date('2026-08-08'), progress: 0, color: 'var(--ds-success)', assignee: 'LT', dependencies: ['g4'] },
  ];

  readonly pivotData = [
    { area: 'Contabilidad', mes: 'Enero', monto: 45000, unidades: 12 },
    { area: 'Contabilidad', mes: 'Febrero', monto: 52000, unidades: 15 },
    { area: 'Operaciones', mes: 'Enero', monto: 78000, unidades: 22 },
    { area: 'Operaciones', mes: 'Febrero', monto: 63000, unidades: 18 },
    { area: 'RH', mes: 'Enero', monto: 32000, unidades: 8 },
    { area: 'RH', mes: 'Febrero', monto: 41000, unidades: 11 },
  ];

  readonly pivotRows: PivotDimension[] = [{ field: 'area', label: 'Área', sort: 'asc' }];
  readonly pivotColumns: PivotDimension = { field: 'mes', label: 'Mes' };
  readonly pivotValues: PivotValue[] = [
    { field: 'monto', label: 'Monto', aggregator: 'sum', format: 'currency' },
    { field: 'unidades', label: 'Unidades', aggregator: 'sum', format: 'number' },
  ];

  // ─── 13.3.2 demo data ─────────────────────────────────────────

  readonly comparisonItems: ComparisonItem[] = [
    { feature: 'Usuarios ilimitados', Básico: false, Pro: true, Enterprise: true },
    { feature: 'Soporte 24/7', Básico: false, Pro: true, Enterprise: true },
    { feature: 'API Access', Básico: false, Pro: true, Enterprise: true },
    { feature: 'Exportar a Excel', Básico: true, Pro: true, Enterprise: true },
    { feature: 'Dashboard personalizable', Básico: false, Pro: false, Enterprise: true },
    { feature: 'SSO / SAML', Básico: false, Pro: false, Enterprise: true },
  ];

  readonly activityEntries: ActivityEntry[] = [
    { id: '1', type: 'call', title: 'Llamada con el cliente', description: 'Se discutió el presupuesto para Q3.', user: 'Juan García', timestamp: new Date('2026-06-24T10:00:00') },
    { id: '2', type: 'email', title: 'Propuesta enviada', description: 'Propuesta comercial por $120,000 MXN.', user: 'María López', timestamp: new Date('2026-06-23T15:30:00') },
    { id: '3', type: 'meeting', title: 'Reunión de seguimiento', description: 'Revisión de avances del proyecto.', user: 'Carlos Ruiz', timestamp: new Date('2026-06-22T09:00:00') },
    { id: '4', type: 'note', title: 'Nota interna', description: 'El cliente solicita entrega antes del 30 de junio.', user: 'Ana Martínez', timestamp: new Date('2026-06-21T17:00:00') },
    { id: '5', type: 'approval', title: 'Aprobación de crédito', description: 'Aprobado por el área financiera.', user: 'Sistema', timestamp: new Date('2026-06-20T12:00:00') },
  ];

  readonly kanbanStages: KanbanStage[] = [
    { id: 'todo', title: 'Por hacer', color: 'var(--ds-text-muted)', cards: [
      { id: 'k1', title: 'Actualizar documentación', stage: 'todo', priority: 'low', tags: ['docs'] },
      { id: 'k2', title: 'Revisar contratos Q3', stage: 'todo', priority: 'medium', tags: ['legal'] },
    ]},
    { id: 'in-progress', title: 'En progreso', color: 'var(--ds-warning)', cards: [
      { id: 'k3', title: 'Integración con SAT', stage: 'in-progress', priority: 'high', assignee: 'JG', value: 85000 },
    ]},
    { id: 'review', title: 'Revisión', color: 'var(--ds-info)', cards: [
      { id: 'k4', title: 'Dashboard de finanzas', stage: 'review', priority: 'high', assignee: 'ML' },
    ]},
    { id: 'done', title: 'Completado', color: 'var(--ds-success)', cards: [
      { id: 'k5', title: 'Migración de base de datos', stage: 'done', priority: 'critical', assignee: 'CR' },
    ]},
  ];

  readonly treeColumns: TreeTableColumn[] = [
    { field: 'nombre', header: 'Cuenta', sortable: true },
    { field: 'tipo', header: 'Tipo', sortable: true },
    { field: 'saldo', header: 'Saldo', sortable: true },
  ];

  readonly treeNodes: TreeNode[] = [
    { data: { nombre: '1000 - Activos', tipo: 'Padre', saldo: '$2,450,000' }, expanded: true, children: [
      { data: { nombre: '1100 - Activo Circulante', tipo: 'Grupo', saldo: '$980,000' }, children: [
        { data: { nombre: '1110 - Caja', tipo: 'Detalle', saldo: '$45,000' } },
        { data: { nombre: '1120 - Bancos', tipo: 'Detalle', saldo: '$935,000' } },
      ]},
      { data: { nombre: '1200 - Activo Fijo', tipo: 'Grupo', saldo: '$1,470,000' }, children: [
        { data: { nombre: '1210 - Equipo', tipo: 'Detalle', saldo: '$1,470,000' } },
      ]},
    ]},
    { data: { nombre: '2000 - Pasivos', tipo: 'Padre', saldo: '$890,000' }, children: [
      { data: { nombre: '2100 - Proveedores', tipo: 'Detalle', saldo: '$890,000' } },
    ]},
  ];

  readonly contextMenuItems: MenuItem[] = [
    { label: 'Editar', icon: 'mdi:pencil' },
    { label: 'Duplicar', icon: 'mdi:content-copy' },
    { separator: true },
    { label: 'Exportar PDF', icon: 'mdi:file-pdf-box' },
    { separator: true },
    { label: 'Eliminar', icon: 'mdi:delete', styleClass: 'text-danger' },
  ];

  cmdPaletteVisible = signal(false);
  readonly paletteCommands: PaletteCommand[] = [
    { id: 'new-order', label: 'Nueva Orden de Compra', description: 'Crear una nueva OC en el sistema', icon: 'mdi:plus-circle', category: 'Crear', action: () => {} },
    { id: 'clients', label: 'Ver Clientes', description: 'Ir al listado de clientes', icon: 'mdi:account-group', category: 'Navegar', action: () => {} },
    { id: 'reports', label: 'Generar Reporte', description: 'Generar reporte del mes actual', icon: 'mdi:chart-bar', category: 'Reportes', action: () => {} },
    { id: 'settings', label: 'Configuración', description: 'Abrir preferencias del sistema', icon: 'mdi:cog', category: 'Sistema', shortcut: 'Ctrl+,', action: () => {} },
  ];

  tourVisible = signal(false);
  readonly tourSteps: TourStep[] = [
    { title: '¡Bienvenido al sistema!', description: 'Este tour te guiará por las funciones principales. Puedes navegar con los botones o presionar Escape para salir.', icon: 'mdi:hand-wave', position: 'center' },
    { title: 'Menú lateral', description: 'Aquí encontrarás todos los módulos del ERP organizados por área.', icon: 'mdi:menu', position: 'center' },
    { title: 'Design System', description: 'El catálogo de componentes está disponible para SuperUsuarios en el menú lateral.', icon: 'mdi:palette', position: 'center' },
    { title: '¡Listo!', description: 'Ya conoces lo básico. Si necesitas ayuda, usa el Command Palette con Ctrl+K.', icon: 'mdi:check-circle', position: 'center' },
  ];
}
