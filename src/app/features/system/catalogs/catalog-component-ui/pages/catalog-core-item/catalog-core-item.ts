import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { Loader } from "src/app/core/components/shared/loader/loader";
import { EStatus, StatusBadge } from "src/app/core/components/shared/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { NotificationItem } from "src/app/core/components/shared/notification-center/notification-center";
import { CustomButtonDelete, CustomButtonEdit } from "src/app/core/components/buttons/web";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { DateRange } from "src/app/core/components/shared/date-range/date-range";
import { NotificationCenter } from "src/app/core/components/shared/notification-center/notification-center";
import { ConfirmDialog } from "src/app/core/components/shared/confirm-dialog/confirm-dialog";
import { FileUpload } from "src/app/core/components/shared/file-upload/file-upload";
import { Wizard, WizardStep } from "src/app/core/components/shared/wizard/wizard";
import { CommonCoreCoverage } from "../../shared/common-core-coverage";
import { MenuItem, TreeNode } from "primeng/api";
import { ComparisonItem, ComparisonTable } from "src/app/core/components/shared/comparison-table/comparison-table";
import { ActivityEntry, ActivityLog } from "src/app/core/components/shared/activity-log/activity-log";
import { KanbanCard, KanbanStage, KanbanBoard } from "src/app/core/components/shared/kanban-board/kanban-board";
import { TreeTableColumn, TreeTable } from "src/app/core/components/shared/tree-table/tree-table";
import { ContextMenu } from "src/app/core/components/shared/context-menu/context-menu";
import { SplitPane } from "src/app/core/components/shared/split-pane/split-pane";
import { PaletteCommand, CommandPalette } from "src/app/core/components/shared/command-palette/command-palette";
import { TourStep, Tour } from "src/app/core/components/shared/tour/tour";
import { Gauge } from "src/app/core/components/shared/gauge/gauge";
import { FunnelChart } from "src/app/core/components/shared/funnel-chart/funnel-chart";
// 13.3.3 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Prioridad Baja
import { DashboardWidget, DashboardLayout } from "src/app/core/components/shared/dashboard-layout/dashboard-layout";
import { DocumentPreviewer } from "src/app/core/components/shared/document-previewer/document-previewer";
import { ApprovalNode, ApprovalWorkflow } from "src/app/core/components/shared/approval-workflow/approval-workflow";
import { OrderStatusStep, OrderStatus } from "src/app/core/components/shared/order-status/order-status";
import { LeadScoreCategory, LeadScoring } from "src/app/core/components/shared/lead-scoring/lead-scoring";
import { AppProfileCard } from "src/app/core/components/shared/profile-card/profile-card";
import { AppThemeSwitcher } from "src/app/core/components/shared/theme-switcher/theme-switcher";
import { Customer360Data, AppCustomer360 } from "src/app/core/components/shared/customer-360/customer-360";
import { AppPrintView } from "src/app/core/components/shared/print-view/print-view";
import { AppLangSelector } from "src/app/core/components/shared/lang-selector/lang-selector";
import { AppCommentThread } from "src/app/core/components/shared/comment-thread/comment-thread";
import { AppEmailPreview } from "src/app/core/components/shared/email-preview/email-preview";
import { FormField, AppFormBuilder } from "src/app/core/components/shared/form-builder/form-builder";
import { AppSignaturePad } from "src/app/core/components/shared/signature-pad/signature-pad";
import { AppColorPicker } from "src/app/core/components/shared/color-picker/color-picker";
import { AppTristateSwitch } from "src/app/core/components/shared/tristate-switch/tristate-switch";
import { AppDock } from "src/app/core/components/shared/dock/dock";
import { AppQrCode } from "src/app/core/components/shared/qr-code/qr-code";
import { HeatmapCell, AppHeatmap } from "src/app/core/components/shared/heatmap/heatmap";
import { AppRealtimeIndicator } from "src/app/core/components/shared/realtime-indicator/realtime-indicator";
import { AppInventoryLevel } from "src/app/core/components/shared/inventory-level/inventory-level";
import { AppBarcodeInput } from "src/app/core/components/shared/barcode-input/barcode-input";
import { GanttTask, AppGantt } from "src/app/core/components/shared/gantt/gantt";
import { PivotDimension, PivotValue, PivotTable } from "src/app/core/components/shared/pivot-table/pivot-table";
import { AppOtpInput } from "src/app/core/components/shared/otp-input/otp-input";
import { AvatarItem, AvatarGroup } from "src/app/core/components/shared/avatar-group/avatar-group";
import { KpiCard } from "src/app/core/components/shared/kpi-card/kpi-card";
import { AppStatCard } from "src/app/core/components/shared/stat-card/stat-card";
import { AppSlider } from "src/app/core/components/shared/slider/slider";
import { AppRating } from "src/app/core/components/shared/rating/rating";
import { AppTagInput } from "src/app/core/components/shared/tag-input/tag-input";
import { Timeline, TimelineEvent } from "src/app/core/components/shared/timeline/timeline";
import { AppPipelineCrm, PipelineStage } from "src/app/core/components/shared/pipeline-crm/pipeline-crm";
import { DataGrid, DataGridColumn } from "src/app/core/components/shared/data-grid/data-grid";
import { SkeletonPresets } from "src/app/core/components/shared/skeleton-presets/skeleton-presets";

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
          <p-card header="Action Menu ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â uso correcto en web">
            <p class="text-sm text-secondary m-0 mb-3">
              Dentro de <code>app-action-menu</code> los botones muestran <strong>icono + label alineados</strong>.
              Siempre agrega <code>[showLabelOnDesktop]="true"</code> y un <code>label</code> explÃƒÆ’Ã‚Â­cito.
            </p>
            <div class="flex gap-4">
              <div>
                <p class="text-xs font-bold text-secondary mb-2">ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Correcto</p>
                <app-action-menu>
                  <ng-container actions>
                    <custom-button-edit label="Editar" [showLabelOnDesktop]="true" />
                    <custom-button-delete label="Eliminar" [showLabelOnDesktop]="true" />
                  </ng-container>
                </app-action-menu>
              </div>
              <div>
                <p class="text-xs font-bold text-secondary mb-2">ÃƒÂ¢Ã‚ÂÃ…â€™ Incorrecto (sin label)</p>
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
            <p-button label="Abrir confirmaciÃƒÆ’Ã‚Â³n" severity="danger" (onClick)="confirmVisible.set(true)" />
            <app-confirm-dialog [(visible)]="confirmVisible" title="Eliminar registro" message="Ãƒâ€šÃ‚Â¿EstÃƒÆ’Ã‚Â¡s seguro?" type="danger" confirmLabel="Eliminar" />
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

        <!-- ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Fase 6-10 ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ -->
        @case ('datagrid') {
          <p-card header="Data Grid ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Editable + Sort + Filter">
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
              <app-kpi-card label="ConversiÃƒÆ’Ã‚Â³n" [value]="68" format="percent" suffix="%" [trend]="5.2" icon="mdi:percent" />
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card label="Tickets" [value]="12" [trend]="0" icon="mdi:ticket-outline" subtitle="sin tendencia" />
            </div>
          </div>
        }
        @case ('avatargroup') {
          <p-card header="Avatar Group ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Stacked con overflow">
            <div class="flex flex-column gap-4">
              <div>
                <p class="text-sm font-bold mb-2">MÃƒÆ’Ã‚Â¡x. 4 visibles:</p>
                <app-avatar-group [avatars]="avatarList" [maxVisible]="4" />
              </div>
              <div>
                <p class="text-sm font-bold mb-2">MÃƒÆ’Ã‚Â¡x. 3 visibles:</p>
                <app-avatar-group [avatars]="avatarList" [maxVisible]="3" />
              </div>
            </div>
          </p-card>
        }
        @case ('timeline') {
          <p-card header="Timeline ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Eventos verticales">
            <app-timeline [events]="timelineEvents" align="left" layout="vertical" />
          </p-card>
        }
        @case ('slider') {
          <p-card header="Slider ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Rango simple y doble">
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
          <p-card header="Pipeline CRM ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Stages visuales">
            <app-pipeline-crm title="Pipeline de Ventas Q3" [stages]="pipelineStages" />
          </p-card>
        }
        @case ('taginput') {
          <p-card header="Tag Input ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Autocomplete con chips">
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

        <!-- ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 13.3.2 ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ -->
        @case ('comparisontable') {
          <p-card header="Comparison Table ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Comparativa de features">
            <app-comparison-table [items]="comparisonItems" highlightColumn="Pro" [showCheckmark]="true" />
          </p-card>
        }
        @case ('activitylog') {
          <p-card header="Activity Log ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Historial CRM">
            <app-activity-log title="Actividad del cliente" [entries]="activityEntries" [groupByDate]="true" />
          </p-card>
        }
        @case ('kanbanboard') {
          <p-card header="Kanban Board ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Tablero drag & drop">
            <app-kanban-board [stages]="kanbanStages" [showAddCard]="false" />
          </p-card>
        }
        @case ('treetable') {
          <p-card header="Tree Table ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Tabla jerÃƒÆ’Ã‚Â¡rquica">
            <app-tree-table [nodes]="treeNodes" [columns]="treeColumns" />
          </p-card>
        }
        @case ('contextmenu') {
          <p-card header="Context Menu ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Click derecho">
            <div class="flex flex-column gap-3">
              <p class="text-sm text-secondary m-0">Haz clic derecho sobre el siguiente elemento:</p>
              <app-context-menu [items]="contextMenuItems">
                <div
                  class="border-round-lg p-4 text-center cursor-pointer"
                  style="border:2px dashed var(--ds-border-strong);background:var(--ds-bg-elevated);"
                >
                  <p class="m-0 font-bold">ÃƒÆ’Ã‚Ârea de contexto</p>
                  <p class="m-0 text-xs text-secondary mt-1">Clic derecho aquÃƒÆ’Ã‚Â­</p>
                </div>
              </app-context-menu>
            </div>
          </p-card>
        }
        @case ('splitpane') {
          <p-card header="Split Pane ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Paneles redimensionables">
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
                <p class="text-sm text-secondary mt-2">Selecciona un elemento para ver su detalle aquÃƒÆ’Ã‚Â­.</p>
              </div>
            </app-split-pane>
          </p-card>
        }
        @case ('commandpalette') {
          <p-card header="Command Palette ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Ctrl+K">
            <div class="flex flex-column gap-3">
              <p class="text-sm text-secondary m-0">El Command Palette es un diÃƒÆ’Ã‚Â¡logo global. Haz clic para abrirlo:</p>
              <p-button label="Abrir Command Palette (Ctrl+K)" icon="mdi:magnify" (onClick)="cmdPaletteVisible.set(true)" />
              <p class="text-xs text-secondary m-0">TambiÃƒÆ’Ã‚Â©n puedes presionar <kbd>Ctrl+K</kbd> cuando el diÃƒÆ’Ã‚Â¡logo estÃƒÆ’Ã‚Â© registrado.</p>
            </div>
            <app-command-palette [(visible)]="cmdPaletteVisible" [commands]="paletteCommands" />
          </p-card>
        }
        @case ('tour') {
          <p-card header="Tour / Onboarding ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Paso a paso">
            <div class="flex flex-column gap-3">
              <p class="text-sm text-secondary m-0">Inicia el tour para ver el componente de onboarding en acciÃƒÆ’Ã‚Â³n:</p>
              <p-button label="Iniciar Tour" icon="mdi:map-marker-path" (onClick)="tourVisible.set(true)" />
            </div>
            <app-tour [(visible)]="tourVisible" [steps]="tourSteps" />
          </p-card>
        }
        @case ('gauge') {
          <div class="grid">
            <div class="col-12 md:col-4">
              <p-card header="CPU ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 72%">
                <div class="flex justify-content-center">
                  <app-gauge [value]="72" [min]="0" [max]="100" [size]="140" />
                </div>
              </p-card>
            </div>
            <div class="col-12 md:col-4">
              <p-card header="OcupaciÃƒÆ’Ã‚Â³n ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 45%">
                <div class="flex justify-content-center">
                  <app-gauge [value]="45" [min]="0" [max]="100" [size]="140" />
                </div>
              </p-card>
            </div>
            <div class="col-12 md:col-4">
              <p-card header="Temperatura ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 88%">
                <div class="flex justify-content-center">
                  <app-gauge [value]="88" [min]="0" [max]="100" [size]="140" />
                </div>
              </p-card>
            </div>
          </div>
        }
        @case ('funnelchart') {
          <p-card header="Funnel Chart ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Pipeline de ventas">
            <app-funnel-chart
              title="Embudo de Ventas Q3"
              [labels]="['Leads', 'Contactados', 'Propuesta', 'NegociaciÃƒÆ’Ã‚Â³n', 'Cerrados']"
              [values]="[1200, 820, 430, 210, 95]"
            />
          </p-card>
        }

        <!-- ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 13.3.3 ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ -->
        @case ('otpinput') {
          <p-card header="OTP Input ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 2FA / VerificaciÃƒÆ’Ã‚Â³n">
            <div class="flex flex-column gap-4">
              <div>
                <p class="text-sm font-bold mb-2">6 dÃƒÆ’Ã‚Â­gitos (predeterminado):</p>
                <app-otp-input [(value)]="otpValue" />
                <p class="text-xs text-secondary mt-1">Valor: <strong>{{ otpValue() || 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â' }}</strong></p>
              </div>
            </div>
          </p-card>
        }
        @case ('profilecard') {
          <div class="grid">
            <div class="col-12 md:col-6">
              <app-profile-card
                name="Ana MartÃƒÆ’Ã‚Â­nez"
                role="Gerente de Ventas"
                email="a.martinez@luxuryapp.mx"
                phone="+52 55 1234 5678"
                company="Grupo LuxuryApp SA"
              />
            </div>
            <div class="col-12 md:col-6">
              <app-profile-card
                name="Carlos Ruiz"
                role="Director TÃƒÆ’Ã‚Â©cnico"
                email="c.ruiz@luxuryapp.mx"
                company="LuxuryApp Tech"
              />
            </div>
          </div>
        }
        @case ('themeswitcher') {
          <p-card header="Theme Switcher ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Light / Dark / High Contrast">
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
          <p-card header="Color Picker ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Hex / RGB / HSB">
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
          <p-card header="Tristate Switch ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â SÃƒÆ’Ã‚Â­ / No / Indeterminado">
            <div class="flex flex-column gap-3">
              <app-tristate-switch [(value)]="tristateValue" label="AutorizaciÃƒÆ’Ã‚Â³n del cliente" />
              <p class="text-xs text-secondary">Estado: <strong>{{ tristateValue() === null ? 'Indeterminado' : tristateValue() ? 'SÃƒÆ’Ã‚Â­' : 'No' }}</strong></p>
              <app-tristate-switch [(value)]="tristateValue2" label="RevisiÃƒÆ’Ã‚Â³n completada" hint="Null = pendiente" />
            </div>
          </p-card>
        }
        @case ('signaturepad') {
          <p-card header="Signature Pad ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Firma digital">
            <app-signature-pad label="Firma del cliente" hint="Dibuja tu firma con el mouse o dedo" placeholder="Firma aquÃƒÆ’Ã‚Â­" />
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
          <p-card header="Barcode / QR Input ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Escaneo + teclado">
            <app-barcode-input />
          </p-card>
        }
        @case ('realtimeindicator') {
          <p-card header="Realtime Indicator ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Estado de conexiÃƒÆ’Ã‚Â³n live">
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
          <p-card header="Lead Scoring ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â PuntuaciÃƒÆ’Ã‚Â³n visual de lead CRM">
            <app-lead-scoring [categories]="leadCategories" />
          </p-card>
        }
        @case ('approvalworkflow') {
          <p-card header="Approval Workflow ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Flujo de aprobaciÃƒÆ’Ã‚Â³n">
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
          <p-card header="Document Previewer ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â PDF inline">
            <app-document-previewer
              src="https://www.w3.org/WAI/WCAG21/wcag21.pdf"
              fileName="WCAG-2.1.pdf"
              [printable]="true"
            />
          </p-card>
        }
        @case ('dashboardlayout') {
          <p-card header="Dashboard Layout ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Grid de widgets">
            <app-dashboard-layout [widgets]="dashWidgets" [columns]="3">
            </app-dashboard-layout>
          </p-card>
        }
        @case ('commentthread') {
          <p-card header="Comment Thread ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Notas colaborativas">
            <app-comment-thread title="Notas del expediente" [comments]="sampleComments" />
          </p-card>
        }
        @case ('emailpreview') {
          <p-card header="Email Template Previewer">
            <app-email-preview
              from="sistema@luxuryapp.mx"
              to="cliente@empresa.com"
              subject="ConfirmaciÃƒÆ’Ã‚Â³n de orden OC-2026-0892"
              [htmlContent]="emailHtml"
            />
          </p-card>
        }
        @case ('formbuilder') {
          <p-card header="Form Builder ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â JSON Schema dinÃƒÆ’Ã‚Â¡mico">
            <app-form-builder title="Formulario generado desde schema" [schema]="formSchema" />
          </p-card>
        }
        @case ('printview') {
          <p-card header="Print View ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Vista de impresiÃƒÆ’Ã‚Â³n">
            <app-print-view title="Reporte de Gastos ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Junio 2026" subtitle="Departamento de Operaciones">
              <p>Contenido del reporte que se optimiza para impresiÃƒÆ’Ã‚Â³n con CSS @media print.</p>
              <p>Las ÃƒÆ’Ã‚Â¡reas de navegaciÃƒÆ’Ã‚Â³n y el sidebar quedan ocultos automÃƒÆ’Ã‚Â¡ticamente.</p>
            </app-print-view>
          </p-card>
        }
        @case ('customer360') {
          <p-card header="Customer 360 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Vista completa de cliente CRM">
            <app-customer-360 [data]="customer360Data" />
          </p-card>
        }
        @case ('dock') {
          <p-card header="Dock ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â macOS-style app dock">
            <div style="position:relative;height:140px;background:var(--ds-bg-elevated);border-radius:var(--ds-radius-lg,8px);overflow:hidden;">
              <app-dock [items]="dockItems" position="bottom" />
            </div>
          </p-card>
        }
        @case ('heatmap') {
          <p-card header="Heatmap ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Actividad por hora/dÃƒÆ’Ã‚Â­a">
            <app-heatmap title="Actividad semanal" [data]="heatmapData" [showValues]="true" />
          </p-card>
        }
        @case ('gantt') {
          <p-card header="Gantt Chart ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Cronograma de proyecto">
            <app-gantt title="Proyecto ERP Q3" [tasks]="ganttTasks" />
          </p-card>
        }
        @case ('pivottable') {
          <p-card header="Pivot Table ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â AnÃƒÆ’Ã‚Â¡lisis multidimensional">
            <app-pivot-table
              title="Ventas por ÃƒÆ’Ã‚Â¡rea y mes"
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
  private readonly dsPrimary = "var(--ds-primary)";
  private readonly dsSuccess = "var(--ds-success)";
  private readonly dsWarning = "var(--ds-warning)";
  private readonly dsHelp = "var(--ds-help)";
  private readonly dsDanger = "var(--ds-danger)";
  private readonly dsInfo = "var(--ds-info)";
  get label(): string { return CORE_LABELS[this.item()] ?? this.item(); }

  constructor() {
    this.route.paramMap.subscribe(p => this.item.set(p.get('item') ?? ''));
    this.colorValue.set(this.resolvePrimaryColor());
  }
  EStatus = EStatus;
  confirmVisible = signal(false);
  wizardActiveStep = signal(1);

  readonly groupedData = [{ section: 'Hoy', title: 'RevisiÃƒÆ’Ã‚Â³n', status: 'Pendiente' }, { section: 'MaÃƒÆ’Ã‚Â±ana', title: 'Junta', status: 'Urgente' }];

  readonly sampleNotifications: NotificationItem[] = [
    { id: "1", icon: "mdi:file-document", title: "Documento aprobado", description: "Aprobado.", time: "Hace 5 min", read: false, severity: "success" },
  ];

  readonly wizardSteps: WizardStep[] = [
    { value: 1, label: "Datos", icon: "mdi:file-document-outline" },
    { value: 2, label: "RevisiÃƒÆ’Ã‚Â³n", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ];

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Fase 6-10 demo data ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  readonly gridColumns: DataGridColumn[] = [
    { field: 'nombre', header: 'Nombre', type: 'text', editable: true, sortable: true, filterable: true },
    { field: 'area', header: 'ÃƒÆ’Ã‚Ârea', type: 'select', editable: true, sortable: true, options: [{ label: 'Contabilidad', value: 'Contabilidad' }, { label: 'Operaciones', value: 'Operaciones' }, { label: 'RH', value: 'RH' }] },
    { field: 'monto', header: 'Monto', type: 'currency', editable: true, sortable: true },
    { field: 'activo', header: 'Activo', type: 'boolean', editable: true },
  ];

  readonly gridData = [
    { id: 1, nombre: 'Juan GarcÃƒÆ’Ã‚Â­a', area: 'Contabilidad', monto: 45000, activo: true },
    { id: 2, nombre: 'MarÃƒÆ’Ã‚Â­a LÃƒÆ’Ã‚Â³pez', area: 'Operaciones', monto: 38500, activo: true },
    { id: 3, nombre: 'Carlos Ruiz', area: 'RH', monto: 52000, activo: false },
    { id: 4, nombre: 'Ana MartÃƒÆ’Ã‚Â­nez', area: 'Contabilidad', monto: 61000, activo: true },
    { id: 5, nombre: 'Luis Torres', area: 'Operaciones', monto: 29000, activo: true },
    { id: 6, nombre: 'Laura SÃƒÆ’Ã‚Â¡nchez', area: 'RH', monto: 47500, activo: false },
  ];

  readonly avatarList: AvatarItem[] = [
    { label: 'JG', color: this.dsPrimary, tooltip: 'Juan GarcÃƒÆ’Ã‚Â­a' },
    { label: 'ML', color: this.dsSuccess, tooltip: 'MarÃƒÆ’Ã‚Â­a LÃƒÆ’Ã‚Â³pez' },
    { label: 'CR', color: this.dsWarning, tooltip: 'Carlos Ruiz' },
    { label: 'AM', color: this.dsHelp, tooltip: 'Ana MartÃƒÆ’Ã‚Â­nez' },
    { label: 'LT', color: this.dsDanger, tooltip: 'Luis Torres' },
    { label: 'LS', color: this.dsInfo, tooltip: 'Laura SÃƒÆ’Ã‚Â¡nchez' },
  ];

  readonly avatarListTokenized: AvatarItem[] = [
    { label: 'JG', color: this.dsPrimary, tooltip: 'Juan GarcÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a' },
    { label: 'ML', color: this.dsSuccess, tooltip: 'MarÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a LÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³pez' },
    { label: 'CR', color: this.dsWarning, tooltip: 'Carlos Ruiz' },
    { label: 'AM', color: this.dsHelp, tooltip: 'Ana MartÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­nez' },
    { label: 'LT', color: this.dsDanger, tooltip: 'Luis Torres' },
    { label: 'LS', color: this.dsInfo, tooltip: 'Laura SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡nchez' },
  ];

  readonly timelineEvents: TimelineEvent[] = [
    { title: 'Solicitud recibida', description: 'El cliente enviÃƒÆ’Ã‚Â³ la solicitud de compra.', date: '10 Jun 2026', icon: 'mdi:inbox-arrow-down', color: 'var(--ds-primary)', badge: 'Inicio', badgeColor: 'primary' },
    { title: 'RevisiÃƒÆ’Ã‚Â³n de crÃƒÆ’Ã‚Â©dito', description: 'ValidaciÃƒÆ’Ã‚Â³n aprobada por el ÃƒÆ’Ã‚Â¡rea financiera.', date: '12 Jun 2026', icon: 'mdi:shield-check', color: 'var(--ds-success)', badge: 'OK', badgeColor: 'success' },
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
    { id: 'negotiation', name: 'NegociaciÃƒÆ’Ã‚Â³n', color: 'var(--ds-primary)', deals: [
      { id: 'd4', title: 'Torre Corporativa Sur', company: 'TCS', value: 250000, owner: 'AM', priority: 'high' },
    ]},
    { id: 'closed', name: 'Ganado', color: 'var(--ds-success)', deals: [
      { id: 'd5', title: 'Plaza Loft', company: 'PL SA', value: 78000, owner: 'LT' },
    ]},
  ];

  readonly tagSuggestions = ['Angular', 'PrimeNG', 'Ionic', 'TypeScript', 'Design System', 'CRM', 'ERP', 'Mobile', 'Web', 'Dashboard'];

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 13.3.3 demo data ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  otpValue = signal<string>('');
  langCode = signal<string>('es-MX');
  colorValue = signal<string>('');
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
    { id: '1', label: 'Solicitante', status: 'approved', assignee: 'Juan GarcÃƒÆ’Ã‚Â­a', date: '10 Jun 2026', comment: 'Solicitud generada.' },
    { id: '2', label: 'Jefe de ÃƒÆ’Ã‚Ârea', status: 'approved', assignee: 'MarÃƒÆ’Ã‚Â­a LÃƒÆ’Ã‚Â³pez', date: '11 Jun 2026' },
    { id: '3', label: 'Finanzas', status: 'pending', assignee: 'Carlos Ruiz' },
    { id: '4', label: 'DirecciÃƒÆ’Ã‚Â³n', status: 'pending', assignee: 'Ana MartÃƒÆ’Ã‚Â­nez' },
  ];

  readonly orderSteps: OrderStatusStep[] = [
    { label: 'Solicitado', date: '10 Jun 2026', completed: true, active: false, icon: 'mdi:file-document' },
    { label: 'Aprobado', date: '11 Jun 2026', completed: true, active: false, icon: 'mdi:check-circle' },
    { label: 'En trÃƒÆ’Ã‚Â¡nsito', date: '13 Jun 2026', completed: false, active: true, icon: 'mdi:truck-delivery' },
    { label: 'Entregado', completed: false, active: false, icon: 'mdi:home-check' },
  ];

  readonly dashWidgets: DashboardWidget[] = [
    { id: 'w1', title: 'KPIs Generales', cols: 2, rows: 1 },
    { id: 'w2', title: 'GrÃƒÆ’Ã‚Â¡fica de Ventas', cols: 1, rows: 1 },
    { id: 'w3', title: 'Pipeline CRM', cols: 3, rows: 1 },
    { id: 'w4', title: 'Actividad Reciente', cols: 1, rows: 1 },
    { id: 'w5', title: 'Inventario CrÃƒÆ’Ã‚Â­tico', cols: 2, rows: 1 },
  ];

  readonly sampleComments = [
    { id: '1', author: 'Juan GarcÃƒÆ’Ã‚Â­a', authorInitials: 'JG', content: 'El cliente solicitÃƒÆ’Ã‚Â³ extensiÃƒÆ’Ã‚Â³n de plazo de pago a 45 dÃƒÆ’Ã‚Â­as.', timestamp: new Date('2026-06-24T09:00:00'), read: true },
    { id: '2', author: 'MarÃƒÆ’Ã‚Â­a LÃƒÆ’Ã‚Â³pez', authorInitials: 'ML', content: 'Confirmado con finanzas. Se aplicarÃƒÆ’Ã‚Â¡ a partir de julio.', timestamp: new Date('2026-06-24T10:30:00'), read: false },
  ];

  readonly emailHtml = `
    <div style="font-family:var(--ds-font-family-base, sans-serif);max-width:600px;margin:0 auto;color:var(--ds-text-primary);">
      <h2 style="color:var(--ds-primary);">ConfirmaciÃƒÆ’Ã‚Â³n de Orden</h2>
      <p>Estimado cliente,</p>
      <p>Su orden <strong>OC-2026-0892</strong> ha sido aprobada y estÃƒÆ’Ã‚Â¡ en proceso de entrega.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="background:var(--ds-bg-elevated);"><th style="padding:8px;text-align:left;">Concepto</th><th style="padding:8px;text-align:right;">Monto</th></tr>
        <tr><td style="padding:8px;">Material elÃƒÆ’Ã‚Â©ctrico</td><td style="padding:8px;text-align:right;">$45,000.00</td></tr>
        <tr><td style="padding:8px;">Mano de obra</td><td style="padding:8px;text-align:right;">$12,500.00</td></tr>
        <tr style="font-weight:bold;"><td style="padding:8px;">Total</td><td style="padding:8px;text-align:right;">$57,500.00</td></tr>
      </table>
      <p style="color:var(--ds-text-secondary);font-size:12px;">LuxuryApp ERP Ãƒâ€šÃ‚Â· sistema@luxuryapp.mx</p>
    </div>`;

  private resolvePrimaryColor(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    const primary = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--ds-primary')
      .trim();

    return primary || '';
  }

  readonly emailHtmlTokenized = `
    <div style="font-family:var(--ds-font-family-base, sans-serif);max-width:600px;margin:0 auto;color:var(--ds-text-primary);">
      <h2 style="color:var(--ds-primary);">ConfirmaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de Orden</h2>
      <p>Estimado cliente,</p>
      <p>Su orden <strong>OC-2026-0892</strong> ha sido aprobada y estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ en proceso de entrega.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="background:var(--ds-bg-elevated);"><th style="padding:8px;text-align:left;">Concepto</th><th style="padding:8px;text-align:right;">Monto</th></tr>
        <tr><td style="padding:8px;">Material elÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©ctrico</td><td style="padding:8px;text-align:right;">$45,000.00</td></tr>
        <tr><td style="padding:8px;">Mano de obra</td><td style="padding:8px;text-align:right;">$12,500.00</td></tr>
        <tr style="font-weight:bold;"><td style="padding:8px;">Total</td><td style="padding:8px;text-align:right;">$57,500.00</td></tr>
      </table>
      <p style="color:var(--ds-text-secondary);font-size:12px;">LuxuryApp ERP ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· sistema@luxuryapp.mx</p>
    </div>`;

  readonly formSchema: FormField[] = [
    { key: 'nombre', type: 'text', label: 'Nombre completo', required: true, placeholder: 'Juan GarcÃƒÆ’Ã‚Â­a' },
    { key: 'email', type: 'email', label: 'Correo electrÃƒÆ’Ã‚Â³nico', required: true },
    { key: 'area', type: 'select', label: 'ÃƒÆ’Ã‚Ârea', required: true, options: [{ label: 'Contabilidad', value: 'cont' }, { label: 'Operaciones', value: 'ops' }, { label: 'RH', value: 'rh' }] },
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
    tags: ['Premium', 'HotelerÃƒÆ’Ã‚Â­a', 'CDMX'],
    totalRevenue: 2450000,
    openDeals: 3,
    lastContact: '24 Jun 2026',
    nps: 87,
    recentActivity: [
      { icon: 'mdi:phone', text: 'Llamada de seguimiento Q3', time: 'Hace 2 dÃƒÆ’Ã‚Â­as' },
      { icon: 'mdi:email', text: 'Propuesta enviada por email', time: 'Hace 5 dÃƒÆ’Ã‚Â­as' },
      { icon: 'mdi:calendar', text: 'ReuniÃƒÆ’Ã‚Â³n de revisiÃƒÆ’Ã‚Â³n anual', time: 'Hace 2 sem.' },
    ],
    deals: [
      { title: 'RemodelaciÃƒÆ’Ã‚Â³n Lobby', stage: 'NegociaciÃƒÆ’Ã‚Â³n', value: 850000 },
      { title: 'Mantenimiento anual', stage: 'Propuesta', value: 420000 },
      { title: 'InstalaciÃƒÆ’Ã‚Â³n AC', stage: 'Prospecto' },
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
    ...[['Lun', 'Mar', 'MiÃƒÆ’Ã‚Â©', 'Jue', 'Vie']].flatMap(cols =>
      ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((row, ri) =>
        cols.map((col, ci) => ({ row, col, value: Math.round(10 + Math.sin(ri + ci) * 30 + Math.random() * 40) }))
      ).flat()
    ),
  ];

  readonly ganttTasks: GanttTask[] = [
    { id: 'g1', name: 'DiseÃƒÆ’Ã‚Â±o de arquitectura', group: 'PlanificaciÃƒÆ’Ã‚Â³n', startDate: new Date('2026-07-01'), endDate: new Date('2026-07-07'), progress: 100, color: 'var(--ds-primary)', assignee: 'JG' },
    { id: 'g2', name: 'Desarrollo backend', group: 'Desarrollo', startDate: new Date('2026-07-08'), endDate: new Date('2026-07-25'), progress: 60, assignee: 'ML', dependencies: ['g1'] },
    { id: 'g3', name: 'Desarrollo frontend', group: 'Desarrollo', startDate: new Date('2026-07-08'), endDate: new Date('2026-07-28'), progress: 40, assignee: 'CR', dependencies: ['g1'] },
    { id: 'g4', name: 'QA & Testing', group: 'Testing', startDate: new Date('2026-07-28'), endDate: new Date('2026-08-05'), progress: 0, color: 'var(--ds-warning)', assignee: 'AM', dependencies: ['g2', 'g3'] },
    { id: 'g5', name: 'Despliegue producciÃƒÆ’Ã‚Â³n', group: 'Deploy', startDate: new Date('2026-08-06'), endDate: new Date('2026-08-08'), progress: 0, color: 'var(--ds-success)', assignee: 'LT', dependencies: ['g4'] },
  ];

  readonly pivotData = [
    { area: 'Contabilidad', mes: 'Enero', monto: 45000, unidades: 12 },
    { area: 'Contabilidad', mes: 'Febrero', monto: 52000, unidades: 15 },
    { area: 'Operaciones', mes: 'Enero', monto: 78000, unidades: 22 },
    { area: 'Operaciones', mes: 'Febrero', monto: 63000, unidades: 18 },
    { area: 'RH', mes: 'Enero', monto: 32000, unidades: 8 },
    { area: 'RH', mes: 'Febrero', monto: 41000, unidades: 11 },
  ];

  readonly pivotRows: PivotDimension[] = [{ field: 'area', label: 'ÃƒÆ’Ã‚Ârea', sort: 'asc' }];
  readonly pivotColumns: PivotDimension = { field: 'mes', label: 'Mes' };
  readonly pivotValues: PivotValue[] = [
    { field: 'monto', label: 'Monto', aggregator: 'sum', format: 'currency' },
    { field: 'unidades', label: 'Unidades', aggregator: 'sum', format: 'number' },
  ];

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ 13.3.2 demo data ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  readonly comparisonItems: ComparisonItem[] = [
    { feature: 'Usuarios ilimitados', Basico: false, Pro: true, Enterprise: true },
    { feature: 'Soporte 24/7', Basico: false, Pro: true, Enterprise: true },
    { feature: 'API Access', Basico: false, Pro: true, Enterprise: true },
    { feature: 'Exportar a Excel', Basico: true, Pro: true, Enterprise: true },
    { feature: 'Dashboard personalizable', Basico: false, Pro: false, Enterprise: true },
    { feature: 'SSO / SAML', Basico: false, Pro: false, Enterprise: true },
  ];

  readonly activityEntries: ActivityEntry[] = [
    { id: '1', type: 'call', title: 'Llamada con el cliente', description: 'Se discutiÃƒÆ’Ã‚Â³ el presupuesto para Q3.', user: 'Juan GarcÃƒÆ’Ã‚Â­a', timestamp: new Date('2026-06-24T10:00:00') },
    { id: '2', type: 'email', title: 'Propuesta enviada', description: 'Propuesta comercial por $120,000 MXN.', user: 'MarÃƒÆ’Ã‚Â­a LÃƒÆ’Ã‚Â³pez', timestamp: new Date('2026-06-23T15:30:00') },
    { id: '3', type: 'meeting', title: 'ReuniÃƒÆ’Ã‚Â³n de seguimiento', description: 'RevisiÃƒÆ’Ã‚Â³n de avances del proyecto.', user: 'Carlos Ruiz', timestamp: new Date('2026-06-22T09:00:00') },
    { id: '4', type: 'note', title: 'Nota interna', description: 'El cliente solicita entrega antes del 30 de junio.', user: 'Ana MartÃƒÆ’Ã‚Â­nez', timestamp: new Date('2026-06-21T17:00:00') },
    { id: '5', type: 'approval', title: 'AprobaciÃƒÆ’Ã‚Â³n de crÃƒÆ’Ã‚Â©dito', description: 'Aprobado por el ÃƒÆ’Ã‚Â¡rea financiera.', user: 'Sistema', timestamp: new Date('2026-06-20T12:00:00') },
  ];

  readonly kanbanStages: KanbanStage[] = [
    { id: 'todo', title: 'Por hacer', color: 'var(--ds-text-muted)', cards: [
      { id: 'k1', title: 'Actualizar documentaciÃƒÆ’Ã‚Â³n', stage: 'todo', priority: 'low', tags: ['docs'] },
      { id: 'k2', title: 'Revisar contratos Q3', stage: 'todo', priority: 'medium', tags: ['legal'] },
    ]},
    { id: 'in-progress', title: 'En progreso', color: 'var(--ds-warning)', cards: [
      { id: 'k3', title: 'IntegraciÃƒÆ’Ã‚Â³n con SAT', stage: 'in-progress', priority: 'high', assignee: 'JG', value: 85000 },
    ]},
    { id: 'review', title: 'RevisiÃƒÆ’Ã‚Â³n', color: 'var(--ds-info)', cards: [
      { id: 'k4', title: 'Dashboard de finanzas', stage: 'review', priority: 'high', assignee: 'ML' },
    ]},
    { id: 'done', title: 'Completado', color: 'var(--ds-success)', cards: [
      { id: 'k5', title: 'MigraciÃƒÆ’Ã‚Â³n de base de datos', stage: 'done', priority: 'critical', assignee: 'CR' },
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
    { id: 'settings', label: 'ConfiguraciÃƒÆ’Ã‚Â³n', description: 'Abrir preferencias del sistema', icon: 'mdi:cog', category: 'Sistema', shortcut: 'Ctrl+,', action: () => {} },
  ];

  tourVisible = signal(false);
  readonly tourSteps: TourStep[] = [
    { title: 'Ãƒâ€šÃ‚Â¡Bienvenido al sistema!', description: 'Este tour te guiarÃƒÆ’Ã‚Â¡ por las funciones principales. Puedes navegar con los botones o presionar Escape para salir.', icon: 'mdi:hand-wave', position: 'center' },
    { title: 'MenÃƒÆ’Ã‚Âº lateral', description: 'AquÃƒÆ’Ã‚Â­ encontrarÃƒÆ’Ã‚Â¡s todos los mÃƒÆ’Ã‚Â³dulos del ERP organizados por ÃƒÆ’Ã‚Â¡rea.', icon: 'mdi:menu', position: 'center' },
    { title: 'Design System', description: 'El catÃƒÆ’Ã‚Â¡logo de componentes estÃƒÆ’Ã‚Â¡ disponible para SuperUsuarios en el menÃƒÆ’Ã‚Âº lateral.', icon: 'mdi:palette', position: 'center' },
    { title: 'Ãƒâ€šÃ‚Â¡Listo!', description: 'Ya conoces lo bÃƒÆ’Ã‚Â¡sico. Si necesitas ayuda, usa el Command Palette con Ctrl+K.', icon: 'mdi:check-circle', position: 'center' },
  ];
}

