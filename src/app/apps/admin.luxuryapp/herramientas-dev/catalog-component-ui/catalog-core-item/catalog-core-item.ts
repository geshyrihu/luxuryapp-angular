import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { Loader } from "@ui/mobile/loader/loader";
import {
  ActivityEntry,
  ActivityLog,
} from "@ui/shared/activity-log/activity-log";
import { Gauge } from "@ui/shared/gauge/gauge";
import { Tour, TourStep } from "@ui/shared/tour/tour";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import {
  CommandPalette,
  PaletteCommand,
} from "@ui/web/command-palette/command-palette";
import {
  ComparisonItem,
  ComparisonTable,
} from "@ui/web/comparison-table/comparison-table";
import { ConfirmDialog } from "@ui/web/confirm-dialog/confirm-dialog";
import { ContextMenu } from "@ui/web/context-menu/context-menu";
import { DateRange } from "@ui/web/date-range/date-range";
import { EmptyState } from "@ui/web/empty-state/empty-state";
import { FileUpload } from "@ui/web/file-upload/file-upload";
import { FunnelChart } from "@ui/web/funnel-chart/funnel-chart";
import { KanbanBoard, KanbanStage } from "@ui/web/kanban-board/kanban-board";
import {
  NotificationCenter,
  NotificationItem,
} from "@ui/web/notification-center/notification-center";
import { MenuItem, TreeNode } from "@ui/web/primeng-api/primeng-api";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { CheckboxModule } from "@ui/web/primeng-checkbox/primeng-checkbox";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { DividerModule } from "@ui/web/primeng-divider/primeng-divider";
import { TagModule } from "@ui/web/primeng-tag/primeng-tag";
import { SplitPane } from "@ui/web/split-pane/split-pane";
import { EStatus, StatusBadge } from "@ui/web/status-badge/status-badge";
import { TreeTable, TreeTableColumn } from "@ui/web/tree-table/tree-table";
import { Wizard, WizardStep } from "@ui/web/wizard/wizard";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
// 13.3.3 demos de prioridad baja
import {
  ApprovalNode,
  ApprovalWorkflow,
} from "@ui/shared/approval-workflow/approval-workflow";
import { AvatarGroup } from "@ui/shared/avatar-group/avatar-group";
import { AppInventoryLevel } from "@ui/shared/inventory-level/inventory-level";
import { KpiCard } from "@ui/shared/kpi-card/kpi-card";
import {
  LeadScoreCategory,
  LeadScoring,
} from "@ui/shared/lead-scoring/lead-scoring";
import {
  OrderStatus,
  OrderStatusStep,
} from "@ui/shared/order-status/order-status";
import { AppRealtimeIndicator } from "@ui/shared/realtime-indicator/realtime-indicator";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import { AppTristateSwitch } from "@ui/shared/tristate-switch/tristate-switch";
import { AppBarcodeInput } from "@ui/web/barcode-input/barcode-input";
import { AppColorPicker } from "@ui/web/color-picker/color-picker";
import { AppCommentThread } from "@ui/web/comment-thread/comment-thread";
import {
  AppCustomer360,
  Customer360Data,
} from "@ui/web/customer-360/customer-360";
import {
  DashboardLayout,
  DashboardWidget,
} from "@ui/web/dashboard-layout/dashboard-layout";
import { DataGrid, DataGridColumn } from "@ui/web/data-grid/data-grid";
import { AppDock } from "@ui/web/dock/dock";
import { DocumentPreviewer } from "@ui/web/document-previewer/document-previewer";
import { AppEmailPreview } from "@ui/web/email-preview/email-preview";
import { AppFormBuilder, FormField } from "@ui/web/form-builder/form-builder";
import { AppGantt, GanttTask } from "@ui/web/gantt/gantt";
import { AppHeatmap, HeatmapCell } from "@ui/web/heatmap/heatmap";
import { AppLangSelector } from "@ui/web/lang-selector/lang-selector";
import { AppOtpInput } from "@ui/web/otp-input/otp-input";
import {
  AppPipelineCrm,
  PipelineStage,
} from "@ui/web/pipeline-crm/pipeline-crm";
import {
  PivotDimension,
  PivotTable,
  PivotValue,
} from "@ui/web/pivot-table/pivot-table";
import { AppPrintView } from "@ui/web/print-view/print-view";
import { AppProfileCard } from "@ui/web/profile-card/profile-card";
import { AppQrCode } from "@ui/web/qr-code/qr-code";
import { AppRating } from "@ui/web/rating/rating";
import { AppSignaturePad } from "@ui/web/signature-pad/signature-pad";
import { WebSkeletonPresets as SkeletonPresets } from "@ui/web/skeleton-presets/skeleton-presets";
import { AppSlider } from "@ui/web/slider/slider";
import { AppTagInput } from "@ui/web/tag-input/tag-input";
import { AppThemeSwitcher } from "@ui/web/theme-switcher/theme-switcher";
import { Timeline, TimelineEvent } from "@ui/web/timeline/timeline";

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
    ButtonModule,
    CheckboxModule,
    DividerModule,
    TagModule,
    ActionMenu,
    AppIcon,
    DataViewMobile,
    Loader,
    StatusBadge,
    PrimeNgCustomCaption,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    EmptyState,
    DateRange,
    NotificationCenter,
    ConfirmDialog,
    FileUpload,
    Wizard,
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
        @case ("actionmenu") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Action Menu - uso correcto en web</h3>
            </div>

            <div class="card-body">
              <p class="text-sm text-secondary m-0 mb-3">
                Dentro de <code>app-action-menu</code> los botones muestran
                <strong>icono + label alineados</strong>. Siempre agrega
                <code>[showLabelOnDesktop]="true"</code> y un
                <code>label</code> explócito.
              </p>
              <div class="flex gap-4">
                <div>
                  <p class="text-xs font-bold text-secondary mb-2">Correcto</p>
                  <app-action-menu>
                    <ng-container actions>
                      <il-button-edit label="Editar" />
                      <il-button-delete label="Eliminar" />
                    </ng-container>
                  </app-action-menu>
                </div>
                <div>
                  <p class="text-xs font-bold text-secondary mb-2">
                    Incorrecto (sin label)
                  </p>
                  <app-action-menu>
                    <ng-container actions>
                      <il-button-edit />
                      <il-button-delete />
                    </ng-container>
                  </app-action-menu>
                </div>
              </div>
              <p-divider />
              <p class="text-xs text-secondary m-0">
                <strong>Regla DS:</strong> Todos los
                <code>il-button-*</code> dentro de
                <code>&lt;app-action-menu&gt;</code> deben tener
                <code>label="..."</code> para mostrar texto.
              </p>
            </div>
          </div>
        }
        @case ("appicon") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">App Icon</h3>
            </div>

            <div class="card-body">
              <div class="flex gap-3 text-2xl text-primary">
                <app-icon icon="material-symbols-light:person" />
                <app-icon icon="material-symbols-light:settings" />
                <app-icon icon="material-symbols-light:notifications" />
              </div>
            </div>
          </div>
        }
        @case ("dataviewmobile") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Data View Mobile</h3>
            </div>

            <div class="card-body">
              <app-data-view-mobile [data]="groupedData" [isGrouped]="true">
                <ng-template #header let-group
                  ><strong>{{ group.section }}</strong></ng-template
                >
                <ng-template #body let-item>{{ item.title }}</ng-template>
              </app-data-view-mobile>
            </div>
          </div>
        }
        @case ("loader") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Loader</h3>
            </div>

            <div class="card-body">
              <app-loader />
            </div>
          </div>
        }
        @case ("notificationcenter") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Notification Center</h3>
            </div>

            <div class="card-body">
              <app-notification-center
                [notifications]="sampleNotifications"
                [unreadCount]="2"
              />
            </div>
          </div>
        }
        @case ("primengcustomcaption") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">PrimeNg Custom Caption</h3>
            </div>

            <div class="card-body">
              <primeng-custom-caption
                label="Agregar Insumo"
                [rolAuth]="true"
                [showSearch]="true"
              />
            </div>
          </div>
        }
        @case ("statusbadge") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Status Badge</h3>
            </div>

            <div class="card-body">
              <div class="flex gap-2 flex-wrap">
                <app-status-badge [status]="EStatus.Concluido" />
                <app-status-badge [status]="EStatus.Pendiente" />
                <app-status-badge [status]="EStatus.Proceso" />
                <app-status-badge [status]="EStatus.Cancelado" />
                <app-status-badge [status]="EStatus.noAutorizado" />
              </div>
            </div>
          </div>
        }
        @case ("wizard") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Wizard</h3>
            </div>

            <div class="card-body">
              <app-wizard
                [steps]="wizardSteps"
                [linear]="true"
                finishLabel="Finalizar"
                [(activeStep)]="wizardActiveStep"
              >
                <div step="1"><strong>Paso 1</strong></div>
                <div step="2"><strong>Paso 2</strong></div>
                <div step="3"><strong>Paso 3</strong></div>
              </app-wizard>
            </div>
          </div>
        }
        @case ("emptystate") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Empty State</h3>
            </div>

            <div class="card-body">
              <app-empty-state
                icon="material-symbols-light:move-to-inbox-outline"
                title="Sin resultados"
                message="No se encontraron registros."
                actionLabel="Nuevo registro"
                actionIcon="material-symbols-light:add"
              />
            </div>
          </div>
        }
        @case ("confirmdialog") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Confirm Dialog</h3>
            </div>

            <div class="card-body">
              <p-button
                label="Abrir confirmación"
                severity="danger"
                (onClick)="confirmVisible.set(true)"
              />
              <app-confirm-dialog
                [(visible)]="confirmVisible"
                title="Eliminar registro"
                message="óEstós seguro?"
                type="danger"
                confirmLabel="Eliminar"
              />
            </div>
          </div>
        }
        @case ("daterange") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Date Range</h3>
            </div>

            <div class="card-body"><app-date-range /></div>
          </div>
        }
        @case ("fileupload") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">File Upload</h3>
            </div>

            <div class="card-body">
              <app-file-upload
                chooseLabel="Subir archivos"
                accept="image/*,.pdf"
                [maxFileSize]="5000000"
                [multiple]="true"
              />
            </div>
          </div>
        }

        <!-- Fase 6-10 -->
        @case ("datagrid") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Data Grid - Editable + Sort + Filter</h3>
            </div>

            <div class="card-body">
              <app-data-grid
                [data]="gridData"
                [columns]="gridColumns"
                dataKey="id"
                [paginator]="true"
                [rows]="5"
              />
            </div>
          </div>
        }
        @case ("kpicard") {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card
                label="Ingresos"
                [value]="124500"
                format="currency"
                prefix="$"
                [trend]="12.4"
                icon="material-symbols-light:trending-up"
              />
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card
                label="Clientes"
                [value]="348"
                [trend]="-3.1"
                icon="material-symbols-light:group"
              />
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card
                label="Conversión"
                [value]="68"
                format="percent"
                suffix="%"
                [trend]="5.2"
                icon="material-symbols-light:percent"
              />
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <app-kpi-card
                label="Tickets"
                [value]="12"
                [trend]="0"
                icon="material-symbols-light:confirmation-number"
                subtitle="sin tendencia"
              />
            </div>
          </div>
        }
        @case ("avatargroup") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Avatar Group - Stacked con overflow</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-4">
                <div>
                  <p class="text-sm font-bold mb-2">Mx. 4 visibles:</p>
                  <app-avatar-group
                    [avatars]="CATALOG_DEMO_AVATARS"
                    [maxVisible]="4"
                  />
                </div>
                <div>
                  <p class="text-sm font-bold mb-2">Mx. 3 visibles:</p>
                  <app-avatar-group
                    [avatars]="CATALOG_DEMO_AVATARS"
                    [maxVisible]="3"
                  />
                </div>
              </div>
            </div>
          </div>
        }
        @case ("timeline") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Timeline - Eventos verticales</h3>
            </div>

            <div class="card-body">
              <app-timeline
                [events]="timelineEvents"
                align="left"
                layout="vertical"
              />
            </div>
          </div>
        }
        @case ("slider") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Slider - Rango simple y doble</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-4">
                <div>
                  <p class="text-sm font-bold mb-2">Simple:</p>
                  <app-slider
                    label="Presupuesto"
                    [min]="0"
                    [max]="100000"
                    [step]="1000"
                    prefix="$"
                    [(value)]="sliderValue"
                  />
                </div>
                <div>
                  <p class="text-sm font-bold mb-2">Rango:</p>
                  <app-slider
                    label="Rango de precio"
                    [min]="0"
                    [max]="500"
                    [step]="10"
                    prefix="$"
                    [range]="true"
                    [(value)]="sliderRangeValue"
                  />
                </div>
                <div>
                  <p class="text-sm font-bold mb-2">Deshabilitado:</p>
                  <app-slider
                    label="Solo lectura"
                    [min]="0"
                    [max]="100"
                    [disabled]="true"
                    [(value)]="sliderDisabledValue"
                  />
                </div>
              </div>
            </div>
          </div>
        }
        @case ("rating") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Rating / Stars</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-3">
                <app-rating
                  label="Calidad del servicio"
                  [(value)]="ratingValue"
                  [stars]="5"
                />
                <app-rating
                  label="Solo lectura (4/5)"
                  [(value)]="ratingReadonly"
                  [readonly]="true"
                />
                <app-rating
                  label="Sin cancelar"
                  [(value)]="ratingNoCanel"
                  [allowCancel]="false"
                />
              </div>
            </div>
          </div>
        }
        @case ("pipelinecrm") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Pipeline CRM - Stages visuales</h3>
            </div>

            <div class="card-body">
              <app-pipeline-crm
                title="Pipeline de Ventas Q3"
                [stages]="pipelineStages"
              />
            </div>
          </div>
        }
        @case ("taginput") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Tag Input - Autocomplete con chips</h3>
            </div>

            <div class="card-body">
              <app-tag-input
                label="Etiquetas del proyecto"
                placeholder="Escribe para buscar..."
                [suggestions]="tagSuggestions"
              />
            </div>
          </div>
        }
        @case ("statcard") {
          <div class="grid">
            <div class="col-12 md:col-6">
              <app-stat-card
                label="Ventas del mes"
                [value]="84320"
                format="currency"
                prefix="$"
                icon="material-symbols-light:payments"
                [sparkline]="[30, 55, 40, 65, 60, 80, 84]"
                [trend]="8.3"
              />
            </div>
            <div class="col-12 md:col-6">
              <app-stat-card
                label="Nuevos clientes"
                [value]="47"
                icon="material-symbols-light:person-add"
                [sparkline]="[10, 14, 12, 18, 15, 20, 47]"
                [trend]="-2.1"
              />
            </div>
          </div>
        }
        @case ("skeletonpresets") {
          <div class="grid">
            <div class="col-12 md:col-6">
              <web-skeleton-presets variant="card" />
              <p class="text-xs text-secondary mt-1 text-center">card</p>
            </div>
            <div class="col-12 md:col-6">
              <web-skeleton-presets variant="table" [rows]="3" />
              <p class="text-xs text-secondary mt-1 text-center">table</p>
            </div>
            <div class="col-12 md:col-6">
              <web-skeleton-presets variant="form" [fields]="2" />
              <p class="text-xs text-secondary mt-1 text-center">form</p>
            </div>
            <div class="col-12 md:col-6">
              <web-skeleton-presets variant="avatar" />
              <p class="text-xs text-secondary mt-1 text-center">avatar</p>
            </div>
          </div>
        }

        <!-- 13.3.2 -->
        @case ("comparisontable") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                Comparison Table - Comparativa de features
              </h3>
            </div>

            <div class="card-body">
              <app-comparison-table
                [items]="comparisonItems"
                highlightColumn="Pro"
                [showCheckmark]="true"
              />
            </div>
          </div>
        }
        @case ("activitylog") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Activity Log - Historial CRM</h3>
            </div>

            <div class="card-body">
              <app-activity-log
                title="Actividad del cliente"
                [entries]="activityEntries"
                [groupByDate]="true"
              />
            </div>
          </div>
        }
        @case ("kanbanboard") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Kanban Board - Tablero drag & drop</h3>
            </div>

            <div class="card-body">
              <app-kanban-board [stages]="kanbanStages" [showAddCard]="false" />
            </div>
          </div>
        }
        @case ("treetable") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Tree Table - Tabla jerrquica</h3>
            </div>

            <div class="card-body">
              <app-tree-table [nodes]="treeNodes" [columns]="treeColumns" />
            </div>
          </div>
        }
        @case ("contextmenu") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Context Menu - Click derecho</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-3">
                <p class="text-sm text-secondary m-0">
                  Haz clic derecho sobre el siguiente elemento:
                </p>
                <app-context-menu [items]="contextMenuItems">
                  <div
                    class="border-round-lg p-4 text-center cursor-pointer"
                    style="border:2px dashed var(--ds-border-strong);background:var(--ds-bg-elevated);"
                  >
                    <p class="m-0 font-bold">área de contexto</p>
                    <p class="m-0 text-xs text-secondary mt-1">
                      Clic derecho aqu
                    </p>
                  </div>
                </app-context-menu>
              </div>
            </div>
          </div>
        }
        @case ("splitpane") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Split Pane - Paneles redimensionables</h3>
            </div>

            <div class="card-body">
              <app-split-pane
                direction="horizontal"
                height="280px"
                [sizes]="[40, 60]"
                [minSizes]="[20, 20]"
              >
                <div
                  left-panel
                  class="h-full"
                  style="background:var(--ds-bg-elevated);padding:0.75rem;"
                >
                  <p class="font-bold text-sm m-0 mb-2">Panel izquierdo</p>
                  <ul class="text-sm m-0" style="padding-left:1rem;">
                    <li>Registro A</li>
                    <li>Registro B</li>
                    <li>Registro C</li>
                  </ul>
                </div>
                <div
                  right-panel
                  class="h-full"
                  style="background:var(--ds-bg-surface);padding:0.75rem;"
                >
                  <p class="font-bold text-sm m-0">Panel derecho (detalle)</p>
                  <p class="text-sm text-secondary mt-2">
                    Selecciona un elemento para ver su detalle aqu.
                  </p>
                </div>
              </app-split-pane>
            </div>
          </div>
        }
        @case ("commandpalette") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Command Palette - Ctrl+K</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-3">
                <p class="text-sm text-secondary m-0">
                  El Command Palette es un dilogo global. Haz clic para abrirlo:
                </p>
                <p-button
                  label="Abrir Command Palette (Ctrl+K)"
                  (onClick)="cmdPaletteVisible.set(true)"
                >
                  <ng-template #icon>
                    <app-icon icon="material-symbols-light:search" />
                  </ng-template>
                </p-button>
                <p class="text-xs text-secondary m-0">
                  Tambin puedes presionar <kbd>Ctrl+K</kbd> cuando el dilogo est
                  registrado.
                </p>
              </div>
              <app-command-palette
                [(visible)]="cmdPaletteVisible"
                [commands]="paletteCommands"
              />
            </div>
          </div>
        }
        @case ("tour") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Tour / Onboarding - Paso a paso</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-3">
                <p class="text-sm text-secondary m-0">
                  Inicia el tour para ver el componente de onboarding en accin:
                </p>
                <p-button
                  label="Iniciar Tour"
                  (onClick)="tourVisible.set(true)"
                >
                  <ng-template #icon>
                    <app-icon icon="material-symbols-light:route" />
                  </ng-template>
                </p-button>
              </div>
              <app-tour [(visible)]="tourVisible" [steps]="tourSteps" />
            </div>
          </div>
        }
        @case ("gauge") {
          <div class="grid">
            <div class="col-12 md:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">CPU - 72%</h3>
                </div>

                <div class="card-body">
                  <div class="flex justify-content-center">
                    <app-gauge
                      [value]="72"
                      [min]="0"
                      [max]="100"
                      [size]="140"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Ocupacin - 45%</h3>
                </div>

                <div class="card-body">
                  <div class="flex justify-content-center">
                    <app-gauge
                      [value]="45"
                      [min]="0"
                      [max]="100"
                      [size]="140"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Temperatura - 88%</h3>
                </div>

                <div class="card-body">
                  <div class="flex justify-content-center">
                    <app-gauge
                      [value]="88"
                      [min]="0"
                      [max]="100"
                      [size]="140"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        @case ("funnelchart") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Funnel Chart - Pipeline de ventas</h3>
            </div>

            <div class="card-body">
              <app-funnel-chart
                title="Embudo de Ventas Q3"
                [labels]="[
                  'Leads',
                  'Contactados',
                  'Propuesta',
                  'Negociacin',
                  'Cerrados',
                ]"
                [values]="[1200, 820, 430, 210, 95]"
              />
            </div>
          </div>
        }

        <!-- 13.3.3 -->
        @case ("otpinput") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">OTP Input - 2FA / Verificacin</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-4">
                <div>
                  <p class="text-sm font-bold mb-2">
                    6 dgitos (predeterminado):
                  </p>
                  <app-otp-input [(value)]="otpValue" />
                  <p class="text-xs text-secondary mt-1">
                    Valor:
                    <strong>{{ otpValue() || "-" }}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
        @case ("profilecard") {
          <div class="grid">
            <div class="col-12 md:col-6">
              <app-profile-card
                name="Ana Martnez"
                role="Gerente de Ventas"
                email="a.martinez@luxuryapp.mx"
                phone="+52 55 1234 5678"
                company="Grupo LuxuryApp SA"
              />
            </div>
            <div class="col-12 md:col-6">
              <app-profile-card
                name="Carlos Ruiz"
                role="Director Tcnico"
                email="c.ruiz@luxuryapp.mx"
                company="LuxuryApp Tech"
              />
            </div>
          </div>
        }
        @case ("themeswitcher") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                Theme Switcher - Light / Dark / High Contrast
              </h3>
            </div>

            <div class="card-body">
              <app-theme-switcher />
            </div>
          </div>
        }
        @case ("langselector") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Language / Region Selector</h3>
            </div>

            <div class="card-body">
              <app-lang-selector [(selectedCode)]="langCode" />
              <p class="text-xs text-secondary mt-2">
                Seleccionado: <strong>{{ langCode() }}</strong>
              </p>
            </div>
          </div>
        }
        @case ("colorpicker") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Color Picker - Hex / RGB / HSB</h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-4">
                <div>
                  <p class="text-sm font-bold mb-2">Inline:</p>
                  <app-color-picker
                    [(value)]="colorValue"
                    [inline]="true"
                    label="Color de etiqueta"
                  />
                </div>
                <div>
                  <p class="text-sm font-bold mb-2">Popover:</p>
                  <app-color-picker
                    [(value)]="colorValue"
                    label="Color (popover)"
                  />
                  <p class="text-xs text-secondary mt-1">
                    Valor: <strong>{{ colorValue() }}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
        @case ("tristateswitch") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                Tristate Switch - S / No / Indeterminado
              </h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-3">
                <app-tristate-switch
                  [(value)]="tristateValue"
                  label="Autorizacin del cliente"
                />
                <p class="text-xs text-secondary">
                  Estado:
                  <strong>{{
                    tristateValue() === null
                      ? "Indeterminado"
                      : tristateValue()
                        ? "S"
                        : "No"
                  }}</strong>
                </p>
                <app-tristate-switch
                  [(value)]="tristateValue2"
                  label="Revisin completada"
                  hint="Null = pendiente"
                />
              </div>
            </div>
          </div>
        }
        @case ("signaturepad") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Signature Pad - Firma digital</h3>
            </div>

            <div class="card-body">
              <app-signature-pad
                label="Firma del cliente"
                hint="Dibuja tu firma con el mouse o dedo"
                placeholder="Firma aqu"
              />
            </div>
          </div>
        }
        @case ("qrcode") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">QR Code Generator</h3>
            </div>

            <div class="card-body">
              <div class="grid">
                <div class="col-12 md:col-4">
                  <app-qr-code
                    data="https://luxuryapp.mx"
                    label="Sitio web"
                    [allowDownload]="true"
                    [showData]="true"
                  />
                </div>
                <div class="col-12 md:col-4">
                  <app-qr-code
                    data="OC-2026-0892"
                    label="Orden de compra"
                    [size]="120"
                  />
                </div>
                <div class="col-12 md:col-4">
                  <app-qr-code
                    data="CURP-MARI800101HDFRZN09"
                    label="CURP del empleado"
                    [size]="120"
                  />
                </div>
              </div>
            </div>
          </div>
        }
        @case ("barcodeinput") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Barcode / QR Input - Escaneo + teclado</h3>
            </div>

            <div class="card-body">
              <app-barcode-input />
            </div>
          </div>
        }
        @case ("realtimeindicator") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                Realtime Indicator - Estado de conexin live
              </h3>
            </div>

            <div class="card-body">
              <div class="flex flex-column gap-3">
                <app-realtime-indicator
                  status="live"
                  lastUpdate="hace 2s"
                  [latencyMs]="45"
                />
                <app-realtime-indicator
                  status="stale"
                  lastUpdate="hace 5 min"
                />
                <app-realtime-indicator status="offline" />
              </div>
            </div>
          </div>
        }
        @case ("inventorylevel") {
          <div class="grid">
            <div class="col-12 md:col-4">
              <app-inventory-level
                name="Cable 12AWG"
                sku="ELT-001"
                [current]="320"
                [max]="500"
                [reorderPoint]="100"
              />
            </div>
            <div class="col-12 md:col-4">
              <app-inventory-level
                name="Interruptor termo."
                sku="ELT-002"
                [current]="45"
                [max]="200"
                [reorderPoint]="50"
              />
            </div>
            <div class="col-12 md:col-4">
              <app-inventory-level
                name="Pintura blanca 1L"
                sku="MTL-010"
                [current]="8"
                [max]="100"
                [reorderPoint]="20"
              />
            </div>
          </div>
        }
        @case ("leadscoring") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                Lead Scoring - Puntuacin visual de lead CRM
              </h3>
            </div>

            <div class="card-body">
              <app-lead-scoring [categories]="leadCategories" />
            </div>
          </div>
        }
        @case ("approvalworkflow") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Approval Workflow - Flujo de aprobacin</h3>
            </div>

            <div class="card-body">
              <app-approval-workflow [nodes]="approvalNodes" />
            </div>
          </div>
        }
        @case ("orderstatus") {
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Horizontal</h3>
                </div>

                <div class="card-body">
                  <app-order-status [steps]="orderSteps" />
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Vertical</h3>
                </div>

                <div class="card-body">
                  <app-order-status [steps]="orderSteps" [vertical]="true" />
                </div>
              </div>
            </div>
          </div>
        }
        @case ("documentpreviewer") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Document Previewer - PDF inline</h3>
            </div>

            <div class="card-body">
              <app-document-previewer
                src="https://www.w3.org/WAI/WCAG21/wcag21.pdf"
                fileName="WCAG-2.1.pdf"
                [printable]="true"
              />
            </div>
          </div>
        }
        @case ("dashboardlayout") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Dashboard Layout - Grid de widgets</h3>
            </div>

            <div class="card-body">
              <app-dashboard-layout [widgets]="dashWidgets" [columns]="3">
              </app-dashboard-layout>
            </div>
          </div>
        }
        @case ("commentthread") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Comment Thread - Notas colaborativas</h3>
            </div>

            <div class="card-body">
              <app-comment-thread
                title="Notas del expediente"
                [comments]="sampleComments"
              />
            </div>
          </div>
        }
        @case ("emailpreview") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Email Template Previewer</h3>
            </div>

            <div class="card-body">
              <app-email-preview
                from="sistema@luxuryapp.mx"
                to="cliente@empresa.com"
                subject="Confirmacin de orden OC-2026-0892"
                [htmlContent]="emailHtml"
              />
            </div>
          </div>
        }
        @case ("formbuilder") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Form Builder - JSON Schema dinmico</h3>
            </div>

            <div class="card-body">
              <app-form-builder
                title="Formulario generado desde schema"
                [schema]="formSchema"
              />
            </div>
          </div>
        }
        @case ("printview") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Print View - Vista de impresin</h3>
            </div>

            <div class="card-body">
              <app-print-view
                title="Reporte de Gastos - Junio 2026"
                subtitle="Departamento de Operaciones"
              >
                <p>
                  Contenido del reporte que se optimiza para impresin con CSS
                  @media print.
                </p>
                <p>
                  Las reas de navegaciól y el sidebar quedan ocultos
                  automticamente.
                </p>
              </app-print-view>
            </div>
          </div>
        }
        @case ("customer360") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                Customer 360 - Vista completa de cliente CRM
              </h3>
            </div>

            <div class="card-body">
              <app-customer-360 [data]="customer360Data" />
            </div>
          </div>
        }
        @case ("dock") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Dock - macOS-style app dock</h3>
            </div>

            <div class="card-body">
              <div
                style="position:relative;height:140px;background:var(--ds-bg-elevated);border-radius:var(--ds-radius-lg,8px);overflow:hidden;"
              >
                <app-dock [items]="dockItems" position="bottom" />
              </div>
            </div>
          </div>
        }
        @case ("heatmap") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Heatmap - Actividad por hora/da</h3>
            </div>

            <div class="card-body">
              <app-heatmap
                title="Actividad semanal"
                [data]="heatmapData"
                [showValues]="true"
              />
            </div>
          </div>
        }
        @case ("gantt") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Gantt Chart - Cronograma de proyecto</h3>
            </div>

            <div class="card-body">
              <app-gantt title="Proyecto ERP Q3" [tasks]="ganttTasks" />
            </div>
          </div>
        }
        @case ("pivottable") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Pivot Table - Anlisis multidimensional</h3>
            </div>

            <div class="card-body">
              <app-pivot-table
                title="Ventas por rea y mes"
                [data]="pivotData"
                [rows]="pivotRows"
                [columns]="pivotColumns"
                [values]="pivotValues"
              />
            </div>
          </div>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogCoreItem {
  private route = inject(ActivatedRoute);
  item = signal("");
  private readonly dsPrimary = "var(--ds-primary)";
  private readonly dsSuccess = "var(--ds-success)";
  private readonly dsWarning = "var(--ds-warning)";
  private readonly dsHelp = "var(--ds-help)";
  private readonly dsDanger = "var(--ds-danger)";
  private readonly dsInfo = "var(--ds-info)";
  get label(): string {
    return CORE_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
    this.colorValue.set(this.resolvePrimaryColor());
  }
  EStatus = EStatus;
  confirmVisible = signal(false);
  wizardActiveStep = signal(1);

  readonly groupedData = [
    { section: "Hoy", title: "Revisin", status: "Pendiente" },
    { section: "Maana", title: "Junta", status: "Urgente" },
  ];

  readonly sampleNotifications: NotificationItem[] = [
    {
      id: "1",
      icon: "material-symbols-light:description",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ];

  readonly wizardSteps: WizardStep[] = [
    { value: 1, label: "Datos", icon: "material-symbols-light:description" },
    { value: 2, label: "Revisin", icon: "material-symbols-light:visibility-outline" },
    { value: 3, label: "Confirmar", icon: "material-symbols-light:check-circle-outline" },
  ];

  // Fase 6-10 demo data

  readonly gridColumns: DataGridColumn[] = [
    {
      field: "nombre",
      header: "Nombre",
      type: "text",
      editable: true,
      sortable: true,
      filterable: true,
    },
    {
      field: "area",
      header: "área",
      type: "select",
      editable: true,
      sortable: true,
      options: [
        { label: "Contabilidad", value: "Contabilidad" },
        { label: "Operaciones", value: "Operaciones" },
        { label: "RH", value: "RH" },
      ],
    },
    {
      field: "monto",
      header: "Monto",
      type: "currency",
      editable: true,
      sortable: true,
    },
    { field: "activo", header: "Activo", type: "boolean", editable: true },
  ];

  readonly gridData = [
    {
      id: 1,
      nombre: "Juan Garca",
      area: "Contabilidad",
      monto: 45000,
      activo: true,
    },
    {
      id: 2,
      nombre: "Mara Lpez",
      area: "Operaciones",
      monto: 38500,
      activo: true,
    },
    { id: 3, nombre: "Carlos Ruiz", area: "RH", monto: 52000, activo: false },
    {
      id: 4,
      nombre: "Ana Martnez",
      area: "Contabilidad",
      monto: 61000,
      activo: true,
    },
    {
      id: 5,
      nombre: "Luis Torres",
      area: "Operaciones",
      monto: 29000,
      activo: true,
    },
    {
      id: 6,
      nombre: "Laura Snchez",
      area: "RH",
      monto: 47500,
      activo: false,
    },
  ];

  readonly timelineEvents: TimelineEvent[] = [
    {
      title: "Solicitud recibida",
      description: "El cliente envié la solicitud de compra.",
      date: "10 Jun 2026",
      icon: "material-symbols-light:move-to-inbox",
      color: "var(--ds-primary)",
      badge: "Inicio",
      badgeColor: "primary",
    },
    {
      title: "Revisión de cródito",
      description: "Validación aprobada por el área financiera.",
      date: "12 Jun 2026",
      icon: "material-symbols-light:verified",
      color: "var(--ds-success)",
      badge: "OK",
      badgeColor: "success",
    },
    {
      title: "Orden generada",
      description: "PO-2026-0892 creada en el sistema ERP.",
      date: "13 Jun 2026",
      icon: "material-symbols-light:note-alt",
      color: "var(--ds-warning)",
      badge: "En proceso",
      badgeColor: "warning",
    },
    {
      title: "Entrega programada",
      description: "Entrega estimada para el 20 de junio.",
      date: "20 Jun 2026",
      icon: "material-symbols-light:local-shipping",
      color: "var(--ds-text-muted)",
    },
  ];

  sliderValue = signal<number | number[]>(35000);
  sliderRangeValue = signal<number | number[]>([100, 350]);
  sliderDisabledValue = signal<number | number[]>(60);

  ratingValue = signal<number | undefined>(3);
  ratingReadonly = signal<number | undefined>(4);
  ratingNoCanel = signal<number | undefined>(2);

  readonly pipelineStages: PipelineStage[] = [
    {
      id: "prospect",
      name: "Prospecto",
      color: "var(--ds-info)",
      deals: [
        {
          id: "d1",
          title: "Grupo Hotelero Reforma",
          company: "GHR S.A.",
          value: 85000,
          owner: "JG",
          priority: "high",
        },
        {
          id: "d2",
          title: "Centro Comercial Norte",
          company: "CCN SA",
          value: 42000,
          owner: "ML",
        },
      ],
    },
    {
      id: "proposal",
      name: "Propuesta",
      color: "var(--ds-warning)",
      deals: [
        {
          id: "d3",
          title: "Residencial del Valle",
          company: "RDV",
          value: 120000,
          owner: "CR",
          priority: "medium",
        },
      ],
    },
    {
      id: "negotiation",
      name: "Negociación",
      color: "var(--ds-primary)",
      deals: [
        {
          id: "d4",
          title: "Torre Corporativa Sur",
          company: "TCS",
          value: 250000,
          owner: "AM",
          priority: "high",
        },
      ],
    },
    {
      id: "closed",
      name: "Ganado",
      color: "var(--ds-success)",
      deals: [
        {
          id: "d5",
          title: "Plaza Loft",
          company: "PL SA",
          value: 78000,
          owner: "LT",
        },
      ],
    },
  ];

  readonly tagSuggestions = [
    "Angular",
    "PrimeNG",
    "Ionic",
    "TypeScript",
    "Design System",
    "CRM",
    "ERP",
    "Mobile",
    "Web",
    "Dashboard",
  ];

  // 13.3.3 demo data

  otpValue = signal<string>("");
  langCode = signal<string>("es-MX");
  colorValue = signal<string>("");
  tristateValue = signal<boolean | null>(null);
  tristateValue2 = signal<boolean | null>(true);

  readonly leadCategories: LeadScoreCategory[] = [
    {
      label: "Engagement",
      score: 85,
      maxScore: 100,
      color: "var(--ds-primary)",
    },
    {
      label: "Presupuesto",
      score: 60,
      maxScore: 100,
      color: "var(--ds-success)",
    },
    {
      label: "Autoridad",
      score: 90,
      maxScore: 100,
      color: "var(--ds-warning)",
    },
    { label: "Necesidad", score: 75, maxScore: 100, color: "var(--ds-info)" },
    { label: "Tiempo", score: 50, maxScore: 100, color: "var(--ds-danger)" },
  ];

  readonly approvalNodes: ApprovalNode[] = [
    {
      id: "1",
      label: "Solicitante",
      status: "approved",
      assignee: "Juan Garcóa",
      date: "10 Jun 2026",
      comment: "Solicitud generada.",
    },
    {
      id: "2",
      label: "Jefe de área",
      status: "approved",
      assignee: "Maróa López",
      date: "11 Jun 2026",
    },
    { id: "3", label: "Finanzas", status: "pending", assignee: "Carlos Ruiz" },
    {
      id: "4",
      label: "Dirección",
      status: "pending",
      assignee: "Ana Martónez",
    },
  ];

  readonly orderSteps: OrderStatusStep[] = [
    {
      label: "Solicitado",
      date: "10 Jun 2026",
      completed: true,
      active: false,
      icon: "material-symbols-light:description",
    },
    {
      label: "Aprobado",
      date: "11 Jun 2026",
      completed: true,
      active: false,
      icon: "material-symbols-light:check-circle",
    },
    {
      label: "En trónsito",
      date: "13 Jun 2026",
      completed: false,
      active: true,
      icon: "material-symbols-light:local-shipping",
    },
    {
      label: "Entregado",
      completed: false,
      active: false,
      icon: "material-symbols-light:add-home",
    },
  ];

  readonly dashWidgets: DashboardWidget[] = [
    { id: "w1", title: "KPIs Generales", cols: 2, rows: 1 },
    { id: "w2", title: "Grófica de Ventas", cols: 1, rows: 1 },
    { id: "w3", title: "Pipeline CRM", cols: 3, rows: 1 },
    { id: "w4", title: "Actividad Reciente", cols: 1, rows: 1 },
    { id: "w5", title: "Inventario Crótico", cols: 2, rows: 1 },
  ];

  readonly sampleComments = [
    {
      id: "1",
      author: "Juan Garcóa",
      authorInitials: "JG",
      content: "El cliente solicité extensión de plazo de pago a 45 dóas.",
      timestamp: new Date("2026-06-24T09:00:00"),
      read: true,
    },
    {
      id: "2",
      author: "Maróa López",
      authorInitials: "ML",
      content: "Confirmado con finanzas. Se aplicaré a partir de julio.",
      timestamp: new Date("2026-06-24T10:30:00"),
      read: false,
    },
  ];

  readonly emailHtml = `
    <div style="font-family:var(--ds-font-family-base, sans-serif);max-width:600px;margin:0 auto;color:var(--ds-text-primary);">
      <h2 style="color:var(--ds-primary);">Confirmación de Orden</h2>
      <p>Estimado cliente,</p>
      <p>Su orden <strong>OC-2026-0892</strong> ha sido aprobada y esté en proceso de entrega.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="background:var(--ds-bg-elevated);"><th style="padding:8px;text-align:left;">Concepto</th><th style="padding:8px;text-align:right;">Monto</th></tr>
        <tr><td style="padding:8px;">Material elóctrico</td><td style="padding:8px;text-align:right;">$45,000.00</td></tr>
        <tr><td style="padding:8px;">Mano de obra</td><td style="padding:8px;text-align:right;">$12,500.00</td></tr>
        <tr style="font-weight:bold;"><td style="padding:8px;">Total</td><td style="padding:8px;text-align:right;">$57,500.00</td></tr>
      </table>
      <p style="color:var(--ds-text-secondary);font-size:12px;">LuxuryApp ERP é sistema@luxuryapp.mx</p>
    </div>`;

  private resolvePrimaryColor(): string {
    if (typeof window === "undefined") {
      return "";
    }

    const primary = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--ds-primary")
      .trim();

    return primary || "";
  }

  readonly emailHtmlTokenized = `
    <div style="font-family:var(--ds-font-family-base, sans-serif);max-width:600px;margin:0 auto;color:var(--ds-text-primary);">
      <h2 style="color:var(--ds-primary);">Confirmación de Orden</h2>
      <p>Estimado cliente,</p>
      <p>Su orden <strong>OC-2026-0892</strong> ha sido aprobada y esté en proceso de entrega.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr style="background:var(--ds-bg-elevated);"><th style="padding:8px;text-align:left;">Concepto</th><th style="padding:8px;text-align:right;">Monto</th></tr>
        <tr><td style="padding:8px;">Material elóctrico</td><td style="padding:8px;text-align:right;">$45,000.00</td></tr>
        <tr><td style="padding:8px;">Mano de obra</td><td style="padding:8px;text-align:right;">$12,500.00</td></tr>
        <tr style="font-weight:bold;"><td style="padding:8px;">Total</td><td style="padding:8px;text-align:right;">$57,500.00</td></tr>
      </table>
      <p style="color:var(--ds-text-secondary);font-size:12px;">LuxuryApp ERP é sistema@luxuryapp.mx</p>
    </div>`;

  readonly formSchema: FormField[] = [
    {
      key: "nombre",
      type: "text",
      label: "Nombre completo",
      required: true,
      placeholder: "Juan Garcóa",
    },
    {
      key: "email",
      type: "email",
      label: "Correo electrónico",
      required: true,
    },
    {
      key: "area",
      type: "select",
      label: "área",
      required: true,
      options: [
        { label: "Contabilidad", value: "cont" },
        { label: "Operaciones", value: "ops" },
        { label: "RH", value: "rh" },
      ],
    },
    {
      key: "monto",
      type: "currency",
      label: "Monto solicitado",
      required: true,
      colspan: 2,
    },
    {
      key: "notas",
      type: "textarea",
      label: "Observaciones",
      rows: 3,
      colspan: 2,
    },
    { key: "urgente", type: "switch", label: "Solicitud urgente" },
  ];

  readonly customer360Data: Customer360Data = {
    name: "Grupo Hotelero Reforma SA",
    role: "Cliente Premium",
    company: "GHR SA de CV",
    email: "contacto@ghr.mx",
    phone: "+52 55 9876 5432",
    tags: ["Premium", "Hoteleróa", "CDMX"],
    totalRevenue: 2450000,
    openDeals: 3,
    lastContact: "24 Jun 2026",
    nps: 87,
    recentActivity: [
      {
        icon: "material-symbols-light:call",
        text: "Llamada de seguimiento Q3",
        time: "Hace 2 dóas",
      },
      {
        icon: "material-symbols-light:mail",
        text: "Propuesta enviada por email",
        time: "Hace 5 dóas",
      },
      {
        icon: "material-symbols-light:calendar-today",
        text: "Reunión de revisión anual",
        time: "Hace 2 sem.",
      },
    ],
    deals: [
      {
        title: "Remodelación Lobby",
        stage: "Negociación",
        value: 850000,
      },
      { title: "Mantenimiento anual", stage: "Propuesta", value: 420000 },
      { title: "Instalación AC", stage: "Prospecto" },
    ],
  };

  readonly dockItems: MenuItem[] = [
    { label: "Dashboard", icon: "material-symbols-light:dashboard", command: () => {} },
    { label: "CRM", icon: "material-symbols-light:group", command: () => {} },
    { label: "Reportes", icon: "material-symbols-light:bar-chart", command: () => {} },
    { label: "Inventario", icon: "material-symbols-light:package", command: () => {} },
    { label: "Config", icon: "material-symbols-light:settings", command: () => {} },
  ];

  readonly heatmapData: HeatmapCell[] = [
    ...[["Lun", "Mar", "Mié", "Jue", "Vie"]].flatMap((cols) =>
      [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ]
        .map((row, ri) =>
          cols.map((col, ci) => ({
            row,
            col,
            value: Math.round(10 + Math.sin(ri + ci) * 30 + Math.random() * 40),
          })),
        )
        .flat(),
    ),
  ];

  readonly ganttTasks: GanttTask[] = [
    {
      id: "g1",
      name: "Diseóo de arquitectura",
      group: "Planificación",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-07-07"),
      progress: 100,
      color: "var(--ds-primary)",
      assignee: "JG",
    },
    {
      id: "g2",
      name: "Desarrollo backend",
      group: "Desarrollo",
      startDate: new Date("2026-07-08"),
      endDate: new Date("2026-07-25"),
      progress: 60,
      assignee: "ML",
      dependencies: ["g1"],
    },
    {
      id: "g3",
      name: "Desarrollo frontend",
      group: "Desarrollo",
      startDate: new Date("2026-07-08"),
      endDate: new Date("2026-07-28"),
      progress: 40,
      assignee: "CR",
      dependencies: ["g1"],
    },
    {
      id: "g4",
      name: "QA & Testing",
      group: "Testing",
      startDate: new Date("2026-07-28"),
      endDate: new Date("2026-08-05"),
      progress: 0,
      color: "var(--ds-warning)",
      assignee: "AM",
      dependencies: ["g2", "g3"],
    },
    {
      id: "g5",
      name: "Despliegue producción",
      group: "Deploy",
      startDate: new Date("2026-08-06"),
      endDate: new Date("2026-08-08"),
      progress: 0,
      color: "var(--ds-success)",
      assignee: "LT",
      dependencies: ["g4"],
    },
  ];

  readonly pivotData = [
    { area: "Contabilidad", mes: "Enero", monto: 45000, unidades: 12 },
    { area: "Contabilidad", mes: "Febrero", monto: 52000, unidades: 15 },
    { area: "Operaciones", mes: "Enero", monto: 78000, unidades: 22 },
    { area: "Operaciones", mes: "Febrero", monto: 63000, unidades: 18 },
    { area: "RH", mes: "Enero", monto: 32000, unidades: 8 },
    { area: "RH", mes: "Febrero", monto: 41000, unidades: 11 },
  ];

  readonly pivotRows: PivotDimension[] = [
    { field: "area", label: "área", sort: "asc" },
  ];
  readonly pivotColumns: PivotDimension = { field: "mes", label: "Mes" };
  readonly pivotValues: PivotValue[] = [
    { field: "monto", label: "Monto", aggregator: "sum", format: "currency" },
    {
      field: "unidades",
      label: "Unidades",
      aggregator: "sum",
      format: "number",
    },
  ];

  // 13.3.2 demo data

  readonly comparisonItems: ComparisonItem[] = [
    {
      feature: "Usuarios ilimitados",
      Basico: false,
      Pro: true,
      Enterprise: true,
    },
    { feature: "Soporte 24/7", Basico: false, Pro: true, Enterprise: true },
    { feature: "API Access", Basico: false, Pro: true, Enterprise: true },
    { feature: "Exportar a Excel", Basico: true, Pro: true, Enterprise: true },
    {
      feature: "Dashboard personalizable",
      Basico: false,
      Pro: false,
      Enterprise: true,
    },
    { feature: "SSO / SAML", Basico: false, Pro: false, Enterprise: true },
  ];

  readonly activityEntries: ActivityEntry[] = [
    {
      id: "1",
      type: "call",
      title: "Llamada con el cliente",
      description: "Se discutié el presupuesto para Q3.",
      user: "Juan Garcóa",
      timestamp: new Date("2026-06-24T10:00:00"),
    },
    {
      id: "2",
      type: "email",
      title: "Propuesta enviada",
      description: "Propuesta comercial por $120,000 MXN.",
      user: "Maróa López",
      timestamp: new Date("2026-06-23T15:30:00"),
    },
    {
      id: "3",
      type: "meeting",
      title: "Reunión de seguimiento",
      description: "Revisión de avances del proyecto.",
      user: "Carlos Ruiz",
      timestamp: new Date("2026-06-22T09:00:00"),
    },
    {
      id: "4",
      type: "note",
      title: "Nota interna",
      description: "El cliente solicita entrega antes del 30 de junio.",
      user: "Ana Martónez",
      timestamp: new Date("2026-06-21T17:00:00"),
    },
    {
      id: "5",
      type: "approval",
      title: "Aprobación de cródito",
      description: "Aprobado por el área financiera.",
      user: "Sistema",
      timestamp: new Date("2026-06-20T12:00:00"),
    },
  ];

  readonly kanbanStages: KanbanStage[] = [
    {
      id: "todo",
      title: "Por hacer",
      color: "var(--ds-text-muted)",
      cards: [
        {
          id: "k1",
          title: "Actualizar documentación",
          stage: "todo",
          priority: "low",
          tags: ["docs"],
        },
        {
          id: "k2",
          title: "Revisar contratos Q3",
          stage: "todo",
          priority: "medium",
          tags: ["legal"],
        },
      ],
    },
    {
      id: "in-progress",
      title: "En progreso",
      color: "var(--ds-warning)",
      cards: [
        {
          id: "k3",
          title: "Integración con SAT",
          stage: "in-progress",
          priority: "high",
          assignee: "JG",
          value: 85000,
        },
      ],
    },
    {
      id: "review",
      title: "Revisión",
      color: "var(--ds-info)",
      cards: [
        {
          id: "k4",
          title: "Dashboard de finanzas",
          stage: "review",
          priority: "high",
          assignee: "ML",
        },
      ],
    },
    {
      id: "done",
      title: "Completado",
      color: "var(--ds-success)",
      cards: [
        {
          id: "k5",
          title: "Migración de base de datos",
          stage: "done",
          priority: "critical",
          assignee: "CR",
        },
      ],
    },
  ];

  readonly treeColumns: TreeTableColumn[] = [
    { field: "nombre", header: "Cuenta", sortable: true },
    { field: "tipo", header: "Tipo", sortable: true },
    { field: "saldo", header: "Saldo", sortable: true },
  ];

  readonly treeNodes: TreeNode[] = [
    {
      data: { nombre: "1000 - Activos", tipo: "Padre", saldo: "$2,450,000" },
      expanded: true,
      children: [
        {
          data: {
            nombre: "1100 - Activo Circulante",
            tipo: "Grupo",
            saldo: "$980,000",
          },
          children: [
            {
              data: {
                nombre: "1110 - Caja",
                tipo: "Detalle",
                saldo: "$45,000",
              },
            },
            {
              data: {
                nombre: "1120 - Bancos",
                tipo: "Detalle",
                saldo: "$935,000",
              },
            },
          ],
        },
        {
          data: {
            nombre: "1200 - Activo Fijo",
            tipo: "Grupo",
            saldo: "$1,470,000",
          },
          children: [
            {
              data: {
                nombre: "1210 - Equipo",
                tipo: "Detalle",
                saldo: "$1,470,000",
              },
            },
          ],
        },
      ],
    },
    {
      data: { nombre: "2000 - Pasivos", tipo: "Padre", saldo: "$890,000" },
      children: [
        {
          data: {
            nombre: "2100 - Proveedores",
            tipo: "Detalle",
            saldo: "$890,000",
          },
        },
      ],
    },
  ];

  readonly contextMenuItems: MenuItem[] = [
    { label: "Editar", icon: "material-symbols-light:edit" },
    { label: "Duplicar", icon: "material-symbols-light:content-copy" },
    { separator: true },
    { label: "Exportar PDF", icon: "material-symbols-light:picture-as-pdf" },
    { separator: true },
    { label: "Eliminar", icon: "material-symbols-light:delete", class: "text-danger" },
  ];

  cmdPaletteVisible = signal(false);
  readonly paletteCommands: PaletteCommand[] = [
    {
      id: "new-order",
      label: "Nueva Orden de Compra",
      description: "Crear una nueva OC en el sistema",
      icon: "material-symbols-light:add-circle",
      category: "Crear",
      action: () => {},
    },
    {
      id: "clients",
      label: "Ver Clientes",
      description: "Ir al listado de clientes",
      icon: "material-symbols-light:group",
      category: "Navegar",
      action: () => {},
    },
    {
      id: "reports",
      label: "Generar Reporte",
      description: "Generar reporte del mes actual",
      icon: "material-symbols-light:bar-chart",
      category: "Reportes",
      action: () => {},
    },
    {
      id: "settings",
      label: "Configuración",
      description: "Abrir preferencias del sistema",
      icon: "material-symbols-light:settings",
      category: "Sistema",
      shortcut: "Ctrl+,",
      action: () => {},
    },
  ];

  tourVisible = signal(false);
  readonly tourSteps: TourStep[] = [
    {
      title: "óBienvenido al sistema!",
      description:
        "Este tour te guiaré por las funciones principales. Puedes navegar con los botones o presionar Escape para salir.",
      icon: "material-symbols-light:waving-hand",
      position: "center",
    },
    {
      title: "Mené lateral",
      description:
        "Aqué encontrarós todos los módulos del ERP organizados por área.",
      icon: "material-symbols-light:menu",
      position: "center",
    },
    {
      title: "Design System",
      description:
        "El católogo de componentes esté disponible para SuperUsuarios en el mené lateral.",
      icon: "material-symbols-light:palette",
      position: "center",
    },
    {
      title: "óListo!",
      description:
        "Ya conoces lo bósico. Si necesitas ayuda, usa el Command Palette con Ctrl+K.",
      icon: "material-symbols-light:check-circle",
      position: "center",
    },
  ];
}
