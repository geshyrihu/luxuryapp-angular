import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AppTabBar } from "@ui/mobile/tab-bar/tab-bar";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import type { SegmentItem } from "@ui/shared/segmented-control/segmented-control";
import { SegmentedControl } from "@ui/shared/segmented-control/segmented-control";
import { AppBarcodeScanner } from "@ui/web/barcode-scanner/barcode-scanner";
import { AppBlockUI } from "@ui/web/block-ui/block-ui";
import { BottomNav } from "@ui/web/bottom-nav/bottom-nav";
import { Carousel } from "@ui/web/carousel/carousel";
import { AppCascadeSelect } from "@ui/web/cascade-select/cascade-select";
import { AdvancedPieChart } from "@ui/web/charts/advanced-pie-chart";
import { MultiAxisChart } from "@ui/web/charts/multi-axis-chart";
import { PrimengRadarChart } from "@ui/web/charts/primeng-radar-chart";
import { AppCheckbox } from "@ui/web/checkbox/checkbox";
import { AppChip } from "@ui/web/chip/chip";
import { ConfirmPopup } from "@ui/web/confirm-popup/confirm-popup";
import { AppContactCard } from "@ui/web/contact-card/contact-card";
import { DataView } from "@ui/web/data-view/data-view";
import { AppEditor } from "@ui/web/editor/editor";
import { ErrorBoundary } from "@ui/web/error-boundary/error-boundary";
import { FileUpload } from "@ui/web/file-upload/file-upload";
import { AppFluid } from "@ui/web/fluid/fluid";
import { Gallery } from "@ui/web/gallery/gallery";
import { GlobalErrorAlert } from "@ui/web/global-error-alert/global-error-alert";
import { HeaderCustomer } from "@ui/web/header-customer/haeder-customer";
import { AppIconField } from "@ui/web/iconfield/iconfield";
import { AppImageFallback } from "@ui/web/image-fallback/image-fallback";
import { AppImage } from "@ui/web/image/image";
import { InfiniteScroll } from "@ui/web/infinite-scroll/infinite-scroll";
import { AppInplace } from "@ui/web/inplace/inplace";
import { AppInputGroup } from "@ui/web/input-group/input-group";
import { AppInputIcon } from "@ui/web/inputicon/inputicon";
import { AppKnob } from "@ui/web/knob/knob";
import { AppLangSelector } from "@ui/web/lang-selector/lang-selector";
import { AppListbox } from "@ui/web/listbox/listbox";
import { MegaMenu } from "@ui/web/mega-menu/mega-menu";
import { AppMenu } from "@ui/web/menu/menu";
import { Menubar } from "@ui/web/menubar/menubar";
import { AppMeterGroup } from "@ui/web/meter-group/meter-group";
import { AppMultiSelect } from "@ui/web/multi-select/multi-select";
import { OfflineIndicator } from "@ui/web/offline-indicator/offline-indicator";
import { OrderList } from "@ui/web/order-list/order-list";
import { OrgChart } from "@ui/web/org-chart/org-chart";
import { AppPaginator } from "@ui/web/paginator/paginator";
import { AppPanelMenu } from "@ui/web/panel-menu/panel-menu";
import { AppPanel } from "@ui/web/panel/panel";
import { PickList } from "@ui/web/pick-list/pick-list";
import { AppPopover } from "@ui/web/popover/popover";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { CheckboxModule } from "@ui/web/primeng-checkbox/primeng-checkbox";
import { DividerModule } from "@ui/web/primeng-divider/primeng-divider";
import { TagModule } from "@ui/web/primeng-tag/primeng-tag";
import { PullToRefresh } from "@ui/web/pull-to-refresh/pull-to-refresh";
import { AppRadioButton } from "@ui/web/radio-button/radio-button";
import { CalendarRange } from "@ui/web/rango-calendario-mes-anio/calendar-range";
import { AppReceiptScanner } from "@ui/web/receipt-scanner/receipt-scanner";
import { ReportHeader } from "@ui/web/report-header/report-header";
import { RichTextEditor } from "@ui/web/rich-text-editor/rich-text-editor";
import { SessionTimeout } from "@ui/web/session-timeout/session-timeout";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { AppSteps } from "@ui/web/steps/steps";
import { TableCheckbox } from "@ui/web/table-checkbox/table-checkbox";
import { ScrollTop } from "@ui/web/tap-to-top/tap-to-top";
import { AppTerminal } from "@ui/web/terminal/terminal";
import { AppTerritoryMap } from "@ui/web/territory-map/territory-map";
import { AppThemeSwitcher } from "@ui/web/theme-switcher/theme-switcher";
import { CabeceraSolicitudPagoPdf } from "@ui/web/title-solicitud-pago-pdf/cabecera-solicitud-pago-pdf";
import { Touchspin } from "@ui/web/touchspin/touchspin";
import { AppTreeSelect } from "@ui/web/tree-select/tree-select";
import { Tree } from "@ui/web/tree/tree";
import { AppVirtualScroller } from "@ui/web/virtual-scroller/virtual-scroller";
import { MegaMenuItem, MenuItem, TreeNode } from "primeng/api";
import { WhatsNew } from "src/app/shared/ui/web/whats-new/whats-new";

const EXTRAS_LABELS: Record<string, string> = {
  forms: "Forms & Inputs",
  data: "Data Display",
  feedback: "Feedback & Status",
  navigation: "Navigation",
  overlays: "Overlays & Surfaces",
  business: "Business Components",
};

@Component({
  selector: "app-catalog-web-extras",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    TagModule,
    AppIcon,
    AppCheckbox,
    AppCascadeSelect,
    AppMultiSelect,
    AppKnob,
    AppListbox,
    AppInputGroup,
    AppInputIcon,
    AppIconField,
    AppRadioButton,
    AppEditor,
    FileUpload,
    AppChip,
    AppFluid,
    AppInplace,
    AppPanel,
    AppPanelMenu,
    MegaMenu,
    AppMenu,
    Menubar,
    BottomNav,
    AppSteps,
    AppPaginator,
    AppBlockUI,
    AppSpinner,
    AppMeterGroup,
    InfiniteScroll,
    PullToRefresh,
    AppPopover,
    ConfirmPopup,
    AppContactCard,
    AppImage,
    AppImageFallback,
    AppTerminal,
    Carousel,
    Gallery,
    Tree,
    AppTreeSelect,
    OrderList,
    PickList,
    OrgChart,
    AppVirtualScroller,
    DataView,
    ScrollTop,
    OfflineIndicator,
    AppLangSelector,
    AppThemeSwitcher,
    SegmentedControl,
    TableCheckbox,
    Touchspin,
    GlobalErrorAlert,
    ErrorBoundary,
    AppTabBar,
    HeaderCustomer,
    CabeceraSolicitudPagoPdf,
    ReportHeader,
    AppBarcodeScanner,
    AppReceiptScanner,
    RichTextEditor,
    AppTerritoryMap,
    CalendarRange,
    AdvancedPieChart,
    MultiAxisChart,
    PrimengRadarChart,
    WhatsNew,
    SessionTimeout,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ("forms") {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-checkbox</h3>
                </div>
                <div class="card-body flex flex-column gap-3">
                  <app-checkbox
                    label="Option A"
                    [checked]="true"
                  ></app-checkbox>
                  <app-checkbox label="Option B"></app-checkbox>
                  <app-checkbox
                    label="Option C (disabled)"
                    [disabled]="true"
                  ></app-checkbox>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-radio-button</h3>
                </div>
                <div class="card-body flex flex-column gap-3">
                  <app-radio-button
                    value="1"
                    label="Option 1"
                  ></app-radio-button>
                  <app-radio-button
                    value="2"
                    label="Option 2"
                  ></app-radio-button>
                  <app-radio-button
                    value="3"
                    label="Option 3 (disabled)"
                  ></app-radio-button>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-chip</h3>
                </div>
                <div class="card-body flex gap-2 flex-wrap">
                  <app-chip label="React" [removable]="true"></app-chip>
                  <app-chip label="Angular" color="primary"></app-chip>
                  <app-chip label="Vue" icon="mdi:vuejs"></app-chip>
                  <app-chip
                    label="Svelte"
                    [removable]="true"
                    color="warn"
                  ></app-chip>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-cascade-select</h3>
                </div>
                <div class="card-body">
                  <app-cascade-select
                    [options]="cascadeOptions"
                    optionLabel="name"
                    placeholder="Select category"
                  ></app-cascade-select>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-multi-select</h3>
                </div>
                <div class="card-body">
                  <app-multi-select
                    [options]="multiOptions"
                    optionLabel="label"
                    placeholder="Choose options"
                  ></app-multi-select>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-listbox</h3>
                </div>
                <div class="card-body">
                  <app-listbox
                    [options]="listboxOptions"
                    optionLabel="label"
                    styleClass="w-full"
                  ></app-listbox>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-knob</h3>
                </div>
                <div class="card-body text-center">
                  <app-knob
                    [value]="60"
                    [min]="0"
                    [max]="100"
                    [size]="80"
                    color="var(--ds-primary)"
                  ></app-knob>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-input-group</h3>
                </div>
                <div class="card-body">
                  <app-input-group addonBefore="$" addonAfter=".00">
                    <input
                      type="text"
                      pInputText
                      class="w-full"
                      placeholder="Amount"
                    />
                  </app-input-group>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-iconfield / app-inputicon</h3>
                </div>
                <div class="card-body">
                  <app-iconfield iconPosition="left">
                    <app-inputicon>
                      <app-icon icon="mdi:magnify" />
                    </app-inputicon>
                    <input
                      type="text"
                      pInputText
                      placeholder="Search..."
                      class="w-full"
                    />
                  </app-iconfield>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-editor</h3>
                </div>
                <div class="card-body">
                  <app-editor
                    placeholder="Start typing..."
                    style="height:120px"
                  ></app-editor>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-file-upload</h3>
                </div>
                <div class="card-body">
                  <app-file-upload
                    chooseLabel="Upload Files"
                    accept=".pdf,.jpg"
                    [maxFileSize]="5000000"
                    [multiple]="true"
                  ></app-file-upload>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-fluid</h3>
                </div>
                <div class="card-body">
                  <app-fluid>
                    <div class="p-3 border-round bg-gray-100">
                      Fluid container fills width
                    </div>
                  </app-fluid>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-inplace</h3>
                </div>
                <div class="card-body">
                  <app-inplace [closable]="true">
                    <span inplaceDisplay>Click to edit this text</span>
                    <div inplaceContent>
                      <input
                        type="text"
                        value="Edit me"
                        class="w-full p-2 border-round border-1"
                      />
                    </div>
                  </app-inplace>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-touchspin</h3>
                </div>
                <div class="card-body">
                  <app-touchspin
                    [control]="touchspinControl"
                    [minValue]="0"
                    [maxValue]="100"
                    [step]="1"
                  ></app-touchspin>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-table-checkbox</h3>
                </div>
                <div class="card-body">
                  <app-table-checkbox
                    [checked]="true"
                    label="Select all"
                  ></app-table-checkbox>
                </div>
              </div>
            </div>
          </div>
        }

        @case ("data") {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-carousel</h3>
                </div>
                <div class="card-body">
                  <app-carousel
                    [value]="carouselItems"
                    [numVisible]="2"
                    [circular]="true"
                    [showIndicators]="true"
                  >
                    <ng-template let-item>
                      <div class="p-4 text-center">{{ item }}</div>
                    </ng-template>
                  </app-carousel>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-gallery</h3>
                </div>
                <div class="card-body">
                  <app-gallery
                    [images]="galleryImages"
                    thumbnailPosition="bottom"
                  ></app-gallery>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-tree</h3>
                </div>
                <div class="card-body">
                  <app-tree
                    [value]="treeData"
                    selectionMode="single"
                  ></app-tree>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-tree-select</h3>
                </div>
                <div class="card-body">
                  <app-tree-select
                    [options]="treeSelectOptions"
                    placeholder="Select item"
                  ></app-tree-select>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-order-list</h3>
                </div>
                <div class="card-body">
                  <app-order-list
                    [value]="['Item A', 'Item B', 'Item C']"
                  ></app-order-list>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-pick-list</h3>
                </div>
                <div class="card-body">
                  <app-pick-list
                    [source]="pickSource"
                    [target]="pickTarget"
                  ></app-pick-list>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-org-chart</h3>
                </div>
                <div class="card-body">
                  <app-org-chart [value]="orgChartNodes"></app-org-chart>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-virtual-scroller</h3>
                </div>
                <div class="card-body">
                  <app-virtual-scroller
                    [items]="['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']"
                    [itemSize]="40"
                    scrollHeight="150px"
                  ></app-virtual-scroller>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-data-view</h3>
                </div>
                <div class="card-body">
                  <app-data-view
                    [data]="dataViewItems"
                    layout="list"
                    [showPaginator]="true"
                    [rows]="5"
                  ></app-data-view>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-paginator</h3>
                </div>
                <div class="card-body">
                  <app-paginator
                    [totalRecords]="100"
                    [rows]="10"
                    [page]="0"
                  ></app-paginator>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-terminal</h3>
                </div>
                <div class="card-body">
                  <app-terminal
                    welcomeMessage="Welcome to Terminal"
                    prompt="$"
                  ></app-terminal>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-segmented-control</h3>
                </div>
                <div class="card-body">
                  <app-segmented-control
                    [items]="segmentItems"
                    value="day"
                  ></app-segmented-control>
                </div>
              </div>
            </div>
          </div>
        }

        @case ("feedback") {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-block-ui</h3>
                </div>
                <div class="card-body">
                  <app-block-ui [blocked]="true" [fullScreen]="false">
                    <div class="p-4 text-center">Content behind block</div>
                  </app-block-ui>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-spinner</h3>
                </div>
                <div class="card-body text-center">
                  <app-spinner
                    [size]="40"
                    color="var(--ds-primary)"
                  ></app-spinner>
                  <div class="mt-2 text-sm text-secondary">Loading...</div>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-meter-group</h3>
                </div>
                <div class="card-body">
                  <app-meter-group
                    [value]="meterValues"
                    [min]="0"
                    [max]="100"
                  ></app-meter-group>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-infinite-scroll</h3>
                </div>
                <div class="card-body">
                  <app-infinite-scroll
                    [loading]="false"
                    threshold="100px"
                  ></app-infinite-scroll>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-pull-to-refresh</h3>
                </div>
                <div class="card-body">
                  <app-pull-to-refresh>
                    <div class="p-3 text-center">Pull down to refresh</div>
                  </app-pull-to-refresh>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-scroll-top</h3>
                </div>
                <div class="card-body">
                  <app-scroll-top></app-scroll-top>
                  <div class="text-sm text-secondary">
                    Scroll down to see button
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-offline-indicator</h3>
                </div>
                <div class="card-body">
                  <app-offline-indicator></app-offline-indicator>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-global-error-alert</h3>
                </div>
                <div class="card-body">
                  <app-global-error-alert></app-global-error-alert>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-error-boundary</h3>
                </div>
                <div class="card-body">
                  <app-error-boundary
                    title="Something went wrong"
                    message="Please try again"
                    [showRetry]="true"
                  ></app-error-boundary>
                </div>
              </div>
            </div>
          </div>
        }

        @case ("navigation") {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-bottom-nav</h3>
                </div>
                <div class="card-body">
                  <app-bottom-nav
                    [items]="bottomNavItems"
                    activeId="home"
                  ></app-bottom-nav>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-menu</h3>
                </div>
                <div class="card-body">
                  <app-menu [model]="menuItems"></app-menu>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-menubar</h3>
                </div>
                <div class="card-body">
                  <app-menubar [items]="menubarItems"></app-menubar>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-mega-menu</h3>
                </div>
                <div class="card-body">
                  <app-mega-menu
                    [items]="megaMenuItems"
                    orientation="horizontal"
                  ></app-mega-menu>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-steps</h3>
                </div>
                <div class="card-body">
                  <app-steps [model]="stepItems" [activeIndex]="1"></app-steps>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-panel-menu</h3>
                </div>
                <div class="card-body">
                  <app-panel-menu [model]="panelMenuItems"></app-panel-menu>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-lang-selector</h3>
                </div>
                <div class="card-body">
                  <app-lang-selector></app-lang-selector>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-theme-switcher</h3>
                </div>
                <div class="card-body">
                  <app-theme-switcher></app-theme-switcher>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-tab-bar</h3>
                </div>
                <div class="card-body">
                  <app-tab-bar
                    [tabs]="tabBarItems"
                    activeId="home"
                  ></app-tab-bar>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-image</h3>
                </div>
                <div class="card-body">
                  <app-image
                    src="https://via.placeholder.com/150"
                    alt="Placeholder"
                    width="150"
                    [preview]="true"
                  ></app-image>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-image-fallback</h3>
                </div>
                <div class="card-body">
                  <app-image-fallback
                    src="https://invalid.url/image.png"
                    alt="Fallback demo"
                    width="150"
                    height="150"
                  ></app-image-fallback>
                </div>
              </div>
            </div>
          </div>
        }

        @case ("overlays") {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-panel</h3>
                </div>
                <div class="card-body">
                  <app-panel header="Panel Header" [toggleable]="true">
                    <p>Panel content goes here</p>
                  </app-panel>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-popover</h3>
                </div>
                <div class="card-body">
                  <app-popover dismissable="true">
                    <p>Popover content</p>
                  </app-popover>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-confirm-popup</h3>
                </div>
                <div class="card-body">
                  <app-confirm-popup
                    key="demo"
                    message="Are you sure?"
                    acceptLabel="Yes"
                    rejectLabel="No"
                  ></app-confirm-popup>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-contact-card</h3>
                </div>
                <div class="card-body">
                  <app-contact-card
                    name="John Doe"
                    role="Software Engineer"
                    company="LuxuryApp"
                    email="john@luxuryapp.com"
                    phone="+1 555-0001"
                  ></app-contact-card>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-carousel</h3>
                </div>
                <div class="card-body">
                  <app-carousel
                    [value]="carouselItems"
                    [numVisible]="1"
                    [circular]="true"
                  ></app-carousel>
                </div>
              </div>
            </div>
          </div>
        }

        @case ("business") {
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-header-customer</h3>
                </div>
                <div class="card-body">
                  <app-header-customer
                    title="Acme Corp"
                    subTitle="Premium Customer"
                  ></app-header-customer>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-cabecera-solicitud-pago-pdf</h3>
                </div>
                <div class="card-body">
                  <app-cabecera-solicitud-pago-pdf
                    titulo="Payment Request"
                    folio="INV-2024-001"
                    factura="F-001"
                  ></app-cabecera-solicitud-pago-pdf>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-report-header</h3>
                </div>
                <div class="card-body">
                  <app-report-header
                    nameCustomer="Acme Corp"
                    logoCustomer="https://via.placeholder.com/80"
                  ></app-report-header>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-barcode-scanner</h3>
                </div>
                <div class="card-body">
                  <app-barcode-scanner
                    label="Scan Barcode"
                    idleLabel="Point camera at barcode"
                  ></app-barcode-scanner>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-receipt-scanner</h3>
                </div>
                <div class="card-body">
                  <app-receipt-scanner
                    accept="image/*"
                    [maxMb]="5"
                    [mobile]="false"
                  ></app-receipt-scanner>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-rich-text-editor</h3>
                </div>
                <div class="card-body">
                  <app-rich-text-editor
                    placeholder="Write something..."
                    height="150px"
                  ></app-rich-text-editor>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-territory-map</h3>
                </div>
                <div class="card-body">
                  <app-territory-map
                    [territories]="territories"
                    title="Sales Territories"
                  ></app-territory-map>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-calendar-range</h3>
                </div>
                <div class="card-body">
                  <app-calendar-range></app-calendar-range>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-advanced-pie-chart</h3>
                </div>
                <div class="card-body">
                  <app-advanced-pie-chart
                    [dataGrafico]="pieChartData"
                  ></app-advanced-pie-chart>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-multi-axis-chart</h3>
                </div>
                <div class="card-body">
                  <app-multi-axis-chart
                    [data]="multiAxisData"
                  ></app-multi-axis-chart>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-primeng-radar-chart</h3>
                </div>
                <div class="card-body">
                  <app-primeng-radar-chart
                    [chartData]="radarData"
                  ></app-primeng-radar-chart>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-whats-new</h3>
                </div>
                <div class="card-body">
                  <app-whats-new></app-whats-new>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-4">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">app-session-timeout</h3>
                </div>
                <div class="card-body">
                  <app-session-timeout></app-session-timeout>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogWebExtras {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  item = signal("");
  touchspinControl = this.fb.control(25);

  constructor() {
    this.route.paramMap.subscribe((p) =>
      this.item.set(p.get("item") ?? "forms"),
    );
  }

  get label(): string {
    return EXTRAS_LABELS[this.item()] ?? this.item();
  }

  readonly cascadeOptions = [
    {
      name: "Electronics",
      children: [{ name: "Laptops" }, { name: "Phones" }],
    },
    { name: "Clothing", children: [{ name: "Men" }, { name: "Women" }] },
  ];

  readonly multiOptions = [
    { label: "Angular", value: "ng" },
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ];

  readonly listboxOptions = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
  ];

  readonly carouselItems = ["Slide 1", "Slide 2", "Slide 3", "Slide 4"];

  readonly galleryImages = [
    { src: "https://via.placeholder.com/300x200/003d9b/ffffff?text=Image+1" },
    { src: "https://via.placeholder.com/300x200/006837/ffffff?text=Image+2" },
    { src: "https://via.placeholder.com/300x200/b45309/ffffff?text=Image+3" },
  ];

  readonly treeData: TreeNode[] = [
    { label: "Root", children: [{ label: "Child 1" }, { label: "Child 2" }] },
  ];

  readonly treeSelectOptions = [
    { label: "Node 1", children: [{ label: "Node 1.1" }] },
    { label: "Node 2" },
  ];

  readonly pickSource = ["Option A", "Option B", "Option C"];
  readonly pickTarget: string[] = [];

  readonly orgChartNodes = [
    {
      label: "CEO",
      type: "person",
      children: [{ label: "CTO", type: "person" }],
    },
  ];

  readonly dataViewItems = [
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 200 },
    { id: 3, name: "Product C", price: 300 },
  ];

  readonly meterValues = [
    { label: "Used", value: 60, color: "var(--ds-primary)" },
    { label: "Free", value: 40, color: "var(--ds-success)" },
  ];

  readonly segmentItems: SegmentItem[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  readonly bottomNavItems = [
    { id: "home", label: "Home", icon: "mdi:home" },
    { id: "search", label: "Search", icon: "mdi:magnify" },
    { id: "profile", label: "Profile", icon: "mdi:account" },
  ];

  readonly menuItems: MenuItem[] = [
    { label: "New", icon: "mdi:plus" },
    { label: "Open", icon: "mdi:folder" },
    { separator: true },
    { label: "Save", icon: "mdi:content-save" },
  ];

  readonly menubarItems: MenuItem[] = [
    { label: "File", items: [{ label: "New" }, { label: "Open" }] },
    { label: "Edit", items: [{ label: "Cut" }, { label: "Copy" }] },
  ];

  readonly megaMenuItems: MegaMenuItem[] = [
    {
      label: "Products",
      items: [[{ label: "Electronics" }, { label: "Clothing" }]],
    },
    { label: "Services", items: [[{ label: "Consulting" }]] },
  ];

  readonly stepItems: MenuItem[] = [
    { label: "Cart" },
    { label: "Payment" },
    { label: "Done" },
  ];

  readonly panelMenuItems: MenuItem[] = [
    { label: "Dashboard", icon: "mdi:view-dashboard" },
    { label: "Reports", icon: "mdi:file-chart" },
  ];

  readonly tabBarItems = [
    { id: "home", label: "Home", icon: "mdi:home" },
    { id: "search", label: "Search", icon: "mdi:magnify" },
    { id: "settings", label: "Settings", icon: "mdi:cog" },
  ];

  readonly territories = [
    { id: "1", name: "North America", color: "#003d9b" },
    { id: "2", name: "Europe", color: "#006837" },
    { id: "3", name: "Asia Pacific", color: "#b45309" },
  ];

  readonly pieChartData = [
    { name: "Product A", value: 35 },
    { name: "Product B", value: 25 },
    { name: "Product C", value: 20 },
    { name: "Product D", value: 20 },
  ];

  readonly multiAxisData = null;

  readonly radarData = {
    labels: ["Quality", "Speed", "Price", "Service", "Support"],
    datasets: [
      {
        label: "Current",
        data: [65, 59, 90, 81, 56],
        fill: true,
        borderColor: "#003d9b",
        backgroundColor: "rgba(0,61,155,0.2)",
      },
    ],
  };
}
