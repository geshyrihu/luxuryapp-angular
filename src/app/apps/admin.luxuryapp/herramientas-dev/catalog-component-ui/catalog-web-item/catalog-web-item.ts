import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import {
  WebButtonIconActiveDesactive,
  WebButtonIconAdd,
  WebButtonIconConfirm,
  WebButtonIconDelete,
  WebButtonIconDownload,
  WebButtonIconEdit,
  WebButtonIconItem,
  WebButtonIconSave,
  WebButtonIconSendEmail,
  WebButtonIconTracking,
  WebButtonIconViewPdf,
} from "@ui/buttons/web-icon";
import {
  WebButtonLabel,
  WebButtonLabelActiveDesactive,
  WebButtonLabelAdd,
  WebButtonLabelConfirm,
  WebButtonLabelDelete,
  WebButtonLabelDownload,
  WebButtonLabelEdit,
  WebButtonLabelItem,
  WebButtonLabelSave,
  WebButtonLabelSendEmail,
  WebButtonLabelTracking,
  WebButtonLabelViewPdf,
} from "@ui/buttons/web-label";
import {
  CustomInputCheckSignal,
  CustomInputCurrencySignal,
  CustomInputDateSignal,
  CustomInputMultiselectSignal,
  CustomInputNumberSignal,
  CustomInputSelectSignal,
  CustomInputTextAreaSignal,
  CustomInputTextSignal,
} from "@ui/inputs/web";
import { AccordionModule } from "@ui/web/primeng-accordion/primeng-accordion";
import { BadgeModule } from "@ui/web/primeng-badge/primeng-badge";
import { BreadcrumbModule } from "@ui/web/primeng-breadcrumb/primeng-breadcrumb";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { CheckboxModule } from "@ui/web/primeng-checkbox/primeng-checkbox";
import { DatePickerModule } from "@ui/web/primeng-datepicker/primeng-datepicker";
import { DialogModule } from "@ui/web/primeng-dialog/primeng-dialog";
import { DividerModule } from "@ui/web/primeng-divider/primeng-divider";
import { FloatLabelModule } from "@ui/web/primeng-floatlabel/primeng-floatlabel";
import { IconFieldModule } from "@ui/web/primeng-iconfield/primeng-iconfield";
import { InputIconModule } from "@ui/web/primeng-inputicon/primeng-inputicon";
import { InputNumberModule } from "@ui/web/primeng-inputnumber/primeng-inputnumber";
import { InputTextModule } from "@ui/web/primeng-inputtext/primeng-inputtext";
import { MessageModule } from "@ui/web/primeng-message/primeng-message";
import { MultiSelectModule } from "@ui/web/primeng-multiselect/primeng-multiselect";
import { PopoverModule } from "@ui/web/primeng-popover/primeng-popover";
import { ProgressBarModule } from "@ui/web/primeng-progressbar/primeng-progressbar";
import { ProgressSpinnerModule } from "@ui/web/primeng-progressspinner/primeng-progressspinner";
import { RadioButtonModule } from "@ui/web/primeng-radiobutton/primeng-radiobutton";
import { SelectModule } from "@ui/web/primeng-select/primeng-select";
import { SelectButtonModule } from "@ui/web/primeng-selectbutton/primeng-selectbutton";
import { SkeletonModule } from "@ui/web/primeng-skeleton/primeng-skeleton";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { TabsModule } from "@ui/web/primeng-tabs/primeng-tabs";
import { TagModule } from "@ui/web/primeng-tag/primeng-tag";
import { ToggleSwitchModule } from "@ui/web/primeng-toggleswitch/primeng-toggleswitch";
import { ToolbarModule } from "@ui/web/primeng-toolbar/primeng-toolbar";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { MobileButtons } from "../catalog-mobile/mobile-buttons/mobile-buttons";
import { MobileData } from "../catalog-mobile/mobile-data/mobile-data";
import { MobileFeedback } from "../catalog-mobile/mobile-feedback/mobile-feedback";
import { MobileForms } from "../catalog-mobile/mobile-forms/mobile-forms";
import { MobileInputs } from "../catalog-mobile/mobile-inputs/mobile-inputs";
import { MobileLists } from "../catalog-mobile/mobile-lists/mobile-lists";
import { MobileNavigation } from "../catalog-mobile/mobile-navigation/mobile-navigation";
import { MobileOverlays } from "../catalog-mobile/mobile-overlays/mobile-overlays";

const WEB_TO_MOBILE: Record<string, string | null> = {
  accordion: "data",
  badge: "feedback",
  breadcrumb: "navigation",
  button: "buttons",
  card: "data",
  checkbox: "inputs",
  datepicker: "forms",
  dialog: "overlays",
  divider: null,
  inputnumber: "inputs",
  inputtext: "inputs",
  message: "feedback",
  multiselect: "inputs",
  popover: "overlays",
  progressbar: "feedback",
  progressspinner: "feedback",
  radiobutton: "inputs",
  select: "inputs",
  selectbutton: "inputs",
  skeleton: "feedback",
  table: "data",
  tabs: "navigation",
  tag: "data",
  textarea: "forms",
  toast: "overlays",
  toggleswitch: "inputs",
  toolbar: null,
  tooltip: null,
  custominputs: "forms",
  calendar: null,
};

const WEB_ITEM_LABELS: Record<string, string> = {
  accordion: "Accordion",
  badge: "Badge",
  breadcrumb: "Breadcrumb",
  button: "Button",
  card: "Card",
  checkbox: "Checkbox",
  datepicker: "DatePicker",
  dialog: "Dialog",
  divider: "Divider",
  inputnumber: "InputNumber",
  inputtext: "InputText",
  message: "Message",
  multiselect: "MultiSelect",
  popover: "Popover",
  progressbar: "ProgressBar",
  progressspinner: "ProgressSpinner",
  radiobutton: "RadioButton",
  select: "Select",
  selectbutton: "SelectButton",
  skeleton: "Skeleton",
  table: "Table",
  tabs: "Tabs",
  tag: "Tag",
  textarea: "Textarea",
  toast: "Toast",
  toggleswitch: "ToggleSwitch",
  toolbar: "Toolbar",
  tooltip: "Tooltip",
  custominputs: "Custom Inputs (Wrappers ERP)",
  calendar: "Calendar (FullCalendar + Google)",
};

@Component({
  selector: "app-catalog-web-item",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputMultiselectSignal,
    CustomInputCheckSignal,
    CustomInputTextAreaSignal,

    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CheckboxModule,
    DatePickerModule,
    DialogModule,
    DividerModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    PopoverModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    SelectModule,
    SelectButtonModule,
    SkeletonModule,
    TableModule,
    TabsModule,
    TagModule,
    ToggleSwitchModule,
    ToolbarModule,
    LxTooltipDirective,
    FullCalendarModule,
    AppIcon,
    WebButtonLabel,
    WebButtonLabelActiveDesactive,
    WebButtonLabelAdd,
    WebButtonLabelConfirm,
    WebButtonLabelDelete,
    WebButtonLabelDownload,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    WebButtonLabelSave,
    WebButtonLabelSendEmail,
    WebButtonLabelTracking,
    WebButtonLabelViewPdf,
    WebButtonIconActiveDesactive,
    WebButtonIconAdd,
    WebButtonIconConfirm,
    WebButtonIconDelete,
    WebButtonIconDownload,
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconSave,
    WebButtonIconSendEmail,
    WebButtonIconTracking,
    WebButtonIconViewPdf,
    MobileButtons,
    MobileInputs,
    MobileFeedback,
    MobileNavigation,
    MobileLists,
    MobileData,
    MobileForms,
    MobileOverlays,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
        <div class="flex align-items-center gap-2">
          <p class="text-secondary m-0">
            Componente PrimeNG: <strong>{{ item() }}</strong>
          </p>
          <span class="badge-mode">Split Web + Mobile</span>
        </div>
      </div>

      <div class="unified-split">
        <div class="unified-web">
          @switch (item()) {
            @case ("accordion") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Accordion - p-accordion</h3>
                </div>
                <div class="card-body">
                  <p-accordion>
                    <p-accordion-panel value="0">
                      <p-accordion-header>Sección 1</p-accordion-header>
                      <p-accordion-content
                        ><p class="m-0">
                          Contenido de la primera sección.
                        </p></p-accordion-content
                      >
                    </p-accordion-panel>
                    <p-accordion-panel value="1">
                      <p-accordion-header>Sección 2</p-accordion-header>
                      <p-accordion-content
                        ><p class="m-0">
                          Contenido de la segunda sección.
                        </p></p-accordion-content
                      >
                    </p-accordion-panel>
                    <p-accordion-panel value="2">
                      <p-accordion-header>Sección 3</p-accordion-header>
                      <p-accordion-content
                        ><p class="m-0">
                          Contenido de la tercera sección.
                        </p></p-accordion-content
                      >
                    </p-accordion-panel>
                  </p-accordion>
                </div>
              </div>
            }
            @case ("badge") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Badge - p-badge</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-wrap gap-3 align-items-center">
                    <p-badge value="3" severity="danger" />
                    <p-badge value="12" severity="warn" />
                    <p-badge value="5" severity="info" />
                    <p-badge value="8" severity="success" />
                    <p-badge severity="danger" />
                    <p-badge severity="warn" />
                  </div>
                </div>
              </div>
            }
            @case ("breadcrumb") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Breadcrumb - p-breadcrumb</h3>
                </div>
                <div class="card-body">
                  <p-breadcrumb
                    [model]="[
                      { label: 'Inicio' },
                      { label: 'Sistema' },
                      { label: 'Catálogos' },
                      { label: 'Proveedores' },
                    ]"
                    [home]="{ label: 'Inicio' }"
                  />
                </div>
              </div>
            }
            @case ("button") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Button - p-button</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-wrap gap-2">
                    <p-button label="Primary" />
                    <p-button label="Secondary" severity="secondary" />
                    <p-button label="Success" severity="success" />
                    <p-button label="Info" severity="info" />
                    <p-button label="Warning" severity="warn" />
                    <p-button label="Danger" severity="danger" />
                    <p-button label="Help" severity="help" />
                    <p-button label="Contrast" severity="contrast" />
                  </div>
                  <p-divider />
                  <div class="flex flex-wrap gap-2">
                    <p-button label="Small" size="small" />
                    <p-button label="Normal" />
                    <p-button label="Large" size="large" />
                    <p-button label="Disabled" [disabled]="true" />
                    <p-button label="Loading" [loading]="true" />
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Action Buttons - il-button-* / iw-button-*
                    </h3>
                  </div>
                  <div class="card-body">
                    <p class="text-sm text-secondary m-0 mb-3">
                      Botones ERP: <code>il-*</code> con label,
                      <code>iw-*</code> solo icono.
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <il-button label="Genórico" />
                      <il-button-add label="Crear" />
                      <il-button-edit label="Editar" />
                      <il-button-save label="Guardar" />
                      <il-button-delete label="Eliminar" />
                      <il-button-confirm label="Aprobar" />
                      <il-button-active-desactive
                        [state]="true"
                        activasLabel="Activos"
                        inactivasLabel="Inactivos"
                      />
                      <il-button-download />
                      <il-button-item />
                      <il-button-send-email />
                      <il-button-tracking [badgeCount]="5" [ticketId]="123" />
                      <il-button-view-pdf url="" fileName="doc.pdf" />

                      <iw-button-active-desactive [state]="true" />
                      <iw-button-add />
                      <iw-button-confirm />
                      <iw-button-delete />
                      <iw-button-download />
                      <iw-button-edit />
                      <iw-button-item />
                      <iw-button-save />
                      <iw-button-send-email />
                      <iw-button-tracking [badgeCount]="3" [ticketId]="228" />
                      <iw-button-view-pdf url="" fileName="doc.pdf" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Icon Button con borde - patron shell/layout
                    </h3>
                  </div>
                  <div class="card-body">
                    <p class="text-sm text-secondary m-0 mb-3">
                      Para botones de shell (sidebar toggle, header actions) que
                      requieren un aspecto específico con borde y tamaóo fijo,
                      usa
                      <code>&lt;button class="ds-icon-btn"&gt;</code> con tokens
                      DS en el SCSS. No uses <code>p-button</code> - sus
                      variantes cromíticas entran en conflicto con el estilo
                      propio del botón.
                    </p>

                    <!-- Ejemplo visual -->
                    <div class="flex align-items-center gap-3 mb-4">
                      <button type="button" class="ds-icon-btn">
                        <app-icon icon="material-symbols-light:menu" class="text-xl" />
                      </button>
                      <button type="button" class="ds-icon-btn">
                        <app-icon icon="material-symbols-light:notifications" class="text-xl" />
                      </button>
                      <button type="button" class="ds-icon-btn">
                        <app-icon icon="material-symbols-light:search" class="text-xl" />
                      </button>
                      <button type="button" class="ds-icon-btn" disabled>
                        <app-icon icon="material-symbols-light:settings" class="text-xl" />
                      </button>
                    </div>

                    <!-- Codigo de referencia -->
                    <p-divider />
                    <p class="text-sm font-bold mb-2">Estructura</p>
                    <pre
                      class="text-xs surface-ground p-3 border-round m-0"
                      style="overflow-x:auto"
                    ><code>{{ iconBtnHtml }}</code></pre>
                    <p class="text-sm font-bold mt-3 mb-2">
                      SCSS (con tokens DS)
                    </p>
                    <pre
                      class="text-xs surface-ground p-3 border-round m-0"
                      style="overflow-x:auto"
                    ><code>{{ iconBtnScss }}</code></pre>

                    <p-divider />
                    <p class="text-sm font-bold mb-2">Regla de uso</p>
                    <div class="grid">
                      <div class="col-12 md:col-4">
                        <div class="p-3 border-round surface-ground">
                          <p class="text-xs font-bold text-green-600 m-0 mb-1">
                            OK USA &lt;button class="..."&gt; cuando:
                          </p>
                          <ul class="text-xs m-0 pl-3">
                            <li>
                              El boton tiene borde, tamano y color propio
                              (layout shell)
                            </li>
                            <li>
                              Contiene <code>&lt;app-icon&gt;</code> o badge
                              complejo
                            </li>
                            <li>Los estilos usan <code>--ds-*</code> tokens</li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-12 md:col-4">
                        <div class="p-3 border-round surface-ground">
                          <p class="text-xs font-bold text-blue-600 m-0 mb-1">
                            OK USA &lt;p-button&gt; cuando:
                          </p>
                          <ul class="text-xs m-0 pl-3">
                            <li>Boton de accion generica en cualquier vista</li>
                            <li>
                              Necesitas severity (primary, danger, warn...)
                            </li>
                            <li>
                              Boton de texto, outlined o icon-only estandar
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-12 md:col-4">
                        <div class="p-3 border-round surface-ground">
                          <p class="text-xs font-bold text-purple-600 m-0 mb-1">
                            OK USA &lt;il-button-*&gt; / &lt;iw-button-*&gt;
                            cuando:
                          </p>
                          <ul class="text-xs m-0 pl-3">
                            <li>
                              Accion ERP (guardar, editar, eliminar,
                              descargar...)
                            </li>
                            <li>
                              Usa <code>il-*</code> si tiene label,
                              <code>iw-*</code> si es solo icono
                            </li>
                            <li>Es accion dentro de una tabla o formulario</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            @case ("card") {
              <div class="grid">
                <div class="col-12 md:col-6">
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">Card Simple</h3>
                    </div>
                    <div class="card-body">
                      <p class="m-0">
                        Contenido de la card. Usa este componente para agrupar
                        informacion relacionada.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-12 md:col-6">
                  <div class="card">
                    <div class="card-body">
                      header="Con Subheader" subheader="Subtitulo">
                      <p class="m-0">Card con subheader y footer opcional.</p>
                      <ng-template #footer
                        ><p-button label="Accion"
                      /></ng-template>
                    </div>
                  </div>
                </div>
              </div>
            }
            @case ("checkbox") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Checkbox - p-checkbox</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-column gap-3">
                    <div class="flex align-items-center gap-2">
                      <p-checkbox [binary]="true" inputId="chk1" /><label
                        for="chk1"
                        >Opcion 1</label
                      >
                    </div>
                    <div class="flex align-items-center gap-2">
                      <p-checkbox [binary]="true" inputId="chk2" /><label
                        for="chk2"
                        >Opcion 2</label
                      >
                    </div>
                    <div class="flex align-items-center gap-2">
                      <p-checkbox [binary]="true" inputId="chk3" /><label
                        for="chk3"
                        >Opcion 3</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            }
            @case ("datepicker") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">DatePicker - p-datepicker</h3>
                </div>
                <div class="card-body">
                  <p-datepicker
                    [(ngModel)]="dateVal"
                    dateFormat="dd/mm/yy"
                    appendTo="body"
                  />
                </div>
              </div>
            }
            @case ("dialog") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Dialog - p-dialog</h3>
                </div>
                <div class="card-body">
                  <p-button
                    label="Abrir Dialog"
                    (onClick)="dialogVisible.set(true)"
                  />
                  <p-dialog
                    header="Ejemplo de Dialog"
                    [(visible)]="dialogVisible"
                    [modal]="true"
                    [style]="{ width: 'min(92vw,30rem)' }"
                  >
                    <p>
                      Contenido del dialog. Reservalo para decisiones breves.
                    </p>
                    <ng-template #footer
                      ><p-button
                        label="Cerrar"
                        (onClick)="dialogVisible.set(false)"
                    /></ng-template>
                  </p-dialog>
                </div>
              </div>
            }
            @case ("divider") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Divider - p-divider</h3>
                </div>
                <div class="card-body">
                  <p>Contenido superior</p>
                  <p-divider />
                  <p>Contenido inferior</p>
                  <p-divider align="left"><b>Izquierda</b></p-divider>
                  <p>Texto con divider alineado.</p>
                </div>
              </div>
            }
            @case ("inputnumber") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">InputNumber - p-inputnumber</h3>
                </div>
                <div class="card-body">
                  <div class="grid">
                    <div class="col-6">
                      <p-inputnumber
                        [(ngModel)]="numVal"
                        [showButtons]="true"
                        [min]="0"
                        [max]="100"
                        class="w-full"
                      />
                    </div>
                    <div class="col-6">
                      <p-inputnumber
                        [(ngModel)]="numVal2"
                        mode="currency"
                        currency="MXN"
                        locale="es-MX"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
            @case ("inputtext") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">InputText - p-inputtext</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-column gap-3">
                    <input
                      pInputText
                      [(ngModel)]="textVal"
                      placeholder="Texto libre"
                      class="w-full"
                    />
                    <span p-fluid
                      ><input pInputText placeholder="Fluid (ancho completo)"
                    /></span>
                  </div>
                </div>
              </div>
            }
            @case ("message") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Message - p-message</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-column gap-2">
                    <p-message severity="info" text="Mensaje informativo" />
                    <p-message severity="success" text="Operacion exitosa" />
                    <p-message severity="warn" text="Advertencia" />
                    <p-message severity="error" text="Error critico" />
                    <p-message severity="secondary" text="Mensaje secundario" />
                    <p-message severity="contrast" text="Contraste" />
                  </div>
                </div>
              </div>
            }
            @case ("multiselect") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">MultiSelect - p-multiselect</h3>
                </div>
                <div class="card-body">
                  <p-multiselect
                    [options]="selectOptions"
                    [(ngModel)]="multiVal"
                    optionLabel="label"
                    placeholder="Selecciona opciones"
                    appendTo="body"
                    class="w-full"
                  />
                </div>
              </div>
            }
            @case ("popover") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Popover - p-popover</h3>
                </div>
                <div class="card-body">
                  <p-button
                    label="Abrir Popover"
                    #popoverBtn
                    (click)="popover.toggle($event)"
                  />
                  <p-popover #popover
                    ><div class="p-3">
                      Contenido del popover. Ideal para menus contextuales
                      rapidos.
                    </div></p-popover
                  >
                </div>
              </div>
            }
            @case ("progressbar") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">ProgressBar - p-progressbar</h3>
                </div>
                <div class="card-body">
                  <p-progressbar [value]="75" />
                  <p class="mt-3">
                    <p-progressbar [value]="50" [showValue]="false" />
                  </p>
                </div>
              </div>
            }
            @case ("progressspinner") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">
                    ProgressSpinner - p-progressspinner
                  </h3>
                </div>
                <div class="card-body">
                  <div class="flex gap-3">
                    <p-progressspinner strokeWidth="4" />
                    <p-progressspinner strokeWidth="8" />
                  </div>
                </div>
              </div>
            }
            @case ("radiobutton") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">RadioButton - p-radiobutton</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-column gap-2">
                    <div class="flex align-items-center gap-2">
                      <p-radiobutton
                        name="radio"
                        value="1"
                        [(ngModel)]="radioVal"
                      /><label>Opcion 1</label>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <p-radiobutton
                        name="radio"
                        value="2"
                        [(ngModel)]="radioVal"
                      /><label>Opcion 2</label>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <p-radiobutton
                        name="radio"
                        value="3"
                        [(ngModel)]="radioVal"
                      /><label>Opcion 3</label>
                    </div>
                  </div>
                </div>
              </div>
            }
            @case ("select") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Select - p-select</h3>
                </div>
                <div class="card-body">
                  <p-select
                    [options]="selectOptions"
                    [(ngModel)]="selectVal"
                    optionLabel="label"
                    placeholder="Selecciona una opcion"
                    appendTo="body"
                    class="w-full"
                  />
                </div>
              </div>
            }
            @case ("selectbutton") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">SelectButton - p-selectbutton</h3>
                </div>
                <div class="card-body">
                  <p-selectbutton
                    [options]="selectOptions"
                    [(ngModel)]="selectBtnVal"
                    optionLabel="label"
                  />
                </div>
              </div>
            }
            @case ("skeleton") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Skeleton - p-skeleton</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-column gap-2">
                    <p-skeleton width="100%" height="1rem" />
                    <p-skeleton width="75%" height="1rem" />
                    <p-skeleton width="50%" height="1rem" />
                    <div class="flex gap-2 mt-2">
                      <p-skeleton shape="circle" size="3rem" />
                      <div class="flex flex-column gap-2 flex-grow-1">
                        <p-skeleton width="100%" height="0.75rem" />
                        <p-skeleton width="60%" height="0.75rem" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            @case ("table") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Table - p-table</h3>
                </div>
                <div class="card-body">
                  <p-table [value]="tableData" class="p-datatable-sm">
                    <ng-template #header
                      ><tr>
                        <th>Nombre</th>
                        <th>Status</th>
                        <th>Acciones</th>
                      </tr></ng-template
                    >
                    <ng-template #body let-row>
                      <tr>
                        <td>{{ row.name }}</td>
                        <td><p-tag [value]="row.status" severity="info" /></td>
                        <td>
                          <p-button
                            [rounded]="true"
                            [text]="true"
                          >
                            <ng-template #icon>
                              <app-icon icon="material-symbols-light:visibility" />
                            </ng-template>
                          </p-button>
                        </td>
                      </tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            }
            @case ("tabs") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Tabs - p-tabs</h3>
                </div>
                <div class="card-body">
                  <p-tabs value="0">
                    <p-tablist>
                      <p-tab value="0">General</p-tab>
                      <p-tab value="1">Detalle</p-tab>
                      <p-tab value="2">Documentos</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                      <p-tabpanel value="0"
                        ><p class="m-0">Contenido General.</p></p-tabpanel
                      >
                      <p-tabpanel value="1"
                        ><p class="m-0">Contenido de Detalle.</p></p-tabpanel
                      >
                      <p-tabpanel value="2"
                        ><p class="m-0">Documentos adjuntos.</p></p-tabpanel
                      >
                    </p-tabpanels>
                  </p-tabs>
                </div>
              </div>
            }
            @case ("tag") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Tag - p-tag</h3>
                </div>
                <div class="card-body">
                  <div class="flex flex-wrap gap-2">
                    <p-tag value="Success" severity="success" />
                    <p-tag value="Info" severity="info" />
                    <p-tag value="Warning" severity="warn" />
                    <p-tag value="Danger" severity="danger" />
                    <p-tag value="Secondary" severity="secondary" />
                    <p-tag
                      value="Contrast"
                      severity="contrast"
                      [rounded]="true"
                    />
                  </div>
                </div>
              </div>
            }
            @case ("textarea") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Textarea - p-textarea</h3>
                </div>
                <div class="card-body">
                  <custom-input-textarea-signal
                    [onlyInput]="true"
                    [noMargin]="true"
                    [horizontal]="false"
                    rows="4"
                    [(ngModel)]="textAreaVal"
                    [ngModelOptions]="{ standalone: true }"
                    placeholder="Escribe aqué..."
                    customClass="w-full"
                  />
                </div>
              </div>
            }
            @case ("toast") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Toast - p-toast</h3>
                </div>
                <div class="card-body">
                  <p-message
                    severity="info"
                    text="Las notificaciones Toast se muestran globalmente mediante MessageService. Inyecta MessageService y llama a add() con severity, summary y detail."
                  />
                </div>
              </div>
            }
            @case ("toggleswitch") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">ToggleSwitch - p-toggleswitch</h3>
                </div>
                <div class="card-body">
                  <div class="flex align-items-center gap-3">
                    <p-toggleswitch [(ngModel)]="toggleVal" />
                    <span>{{ toggleVal() ? "Activado" : "Desactivado" }}</span>
                  </div>
                </div>
              </div>
            }
            @case ("toolbar") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Toolbar - p-toolbar</h3>
                </div>
                <div class="card-body">
                  <p-toolbar>
                    <ng-template #start
                      ><strong>Toolbar Title</strong></ng-template
                    >
                    <ng-template #end>
                      <div class="flex gap-2">
                        <p-button label="Nuevo" size="small"
                        >
                          <ng-template #icon>
                            <app-icon icon="material-symbols-light:add" />
                          </ng-template>
                        </p-button>
                        <p-button
                          label="Exportar"
                          severity="secondary"
                          size="small"
                        />
                      </div>
                    </ng-template>
                  </p-toolbar>
                </div>
              </div>
            }
            @case ("tooltip") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Tooltip - p-tooltip</h3>
                </div>
                <div class="card-body">
                  <div class="flex gap-3">
                    <p-button
                      label="Hover me"
                      lxTooltip="Tooltip arriba"
                      tooltipPosition="top"
                    />
                    <p-button
                      label="Hover me"
                      lxTooltip="Tooltip derecha"
                      severity="secondary"
                      tooltipPosition="right"
                    />
                    <p-button
                      label="Hover me"
                      lxTooltip="Tooltip abajo"
                      severity="info"
                      tooltipPosition="bottom"
                    />
                  </div>
                </div>
              </div>
            }
            @case ("custominputs") {
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">
                    Custom Inputs - Wrappers ERP (horizontal layout)
                  </h3>
                </div>
                <div class="card-body">
                  <p class="text-sm text-secondary mb-4 m-0">
                    Wrappers sobre PrimeNG con deteccion automatica de
                    plataforma (web/mobile), validacion integrada y layout
                    horizontal/vertical.
                  </p>
                  <form
                    [formGroup]="customInputsForm"
                    class="flex flex-column gap-1"
                  >
                    <custom-input-text-signal
                      [control]="customInputsForm.controls['nombre']"
                      label="Nombre completo"
                      placeholder="Juan Garcia"
                    />
                    <custom-input-password
                      [control]="customInputsForm.controls['password']"
                      label="Contrasena"
                    />
                    <custom-input-number-signal
                      [control]="customInputsForm.controls['cantidad']"
                      label="Cantidad"
                      [min]="0"
                      [max]="9999"
                    />
                    <custom-input-currency-signal
                      [control]="customInputsForm.controls['monto']"
                      label="Monto (MXN)"
                    />
                    <custom-input-decimal
                      [control]="customInputsForm.controls['decimal']"
                      label="Porcentaje (%)"
                    />
                    <custom-input-date-signal
                      [control]="customInputsForm.controls['fecha']"
                      label="Fecha de evento"
                    />
                    <custom-input-time
                      [control]="customInputsForm.controls['hora']"
                      label="Hora"
                    />
                    <custom-input-select-signal
                      [control]="customInputsForm.controls['area']"
                      [data]="inputSelectOptions"
                      label="Area"
                    />
                    <custom-input-select-bool
                      [control]="customInputsForm.controls['activo']"
                      label="Estado"
                    />
                    <custom-input-multiselect-signal
                      [control]="customInputsForm.controls['roles']"
                      [data]="inputSelectOptions"
                      label="Roles"
                    />
                    <custom-input-check-signal
                      [control]="customInputsForm.controls['terminos']"
                      placeholder="Acepto terminos y condiciones"
                    />
                    <custom-input-switch
                      [control]="customInputsForm.controls['notificaciones']"
                      label="Notificaciones push"
                    />
                    <custom-input-text-area-signal
                      [control]="customInputsForm.controls['notas']"
                      label="Notas"
                      placeholder="Escribe aqui..."
                    />
                  </form>
                </div>
              </div>
              <div class="card">
                <div class="card-body">
                  header="Custom Inputs - Vertical layout (onlyInput)"
                  class="mt-3" >
                  <div class="grid">
                    <div class="col-12 md:col-4">
                      <custom-input-text-signal
                        [control]="customInputsForm.controls['nombre']"
                        label="Nombre"
                        [horizontal]="false"
                      />
                    </div>
                    <div class="col-12 md:col-4">
                      <custom-input-currency-signal
                        [control]="customInputsForm.controls['monto']"
                        label="Monto"
                        [horizontal]="false"
                      />
                    </div>
                    <div class="col-12 md:col-4">
                      <custom-input-select-signal
                        [control]="customInputsForm.controls['area']"
                        [data]="inputSelectOptions"
                        label="Area"
                        [horizontal]="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            @case ("calendar") {
              <div class="flex flex-column gap-4">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">
                      FullCalendar - Integracion Google Calendar
                    </h3>
                  </div>
                  <div class="card-body">
                    <p class="catalog-helper-text text-sm m-0 mb-3">
                      Usa <code>&#64;fullcalendar/angular</code> v6 con plugins
                      <code>dayGridPlugin</code> + <code>timeGridPlugin</code>.
                      Eventos propios en
                      <strong class="catalog-token-primary">--ds-primary</strong
                      >, eventos de otros condominios en
                      <strong class="catalog-token-muted"
                        >--ds-text-muted</strong
                      >.
                    </p>
                    <div class="catalog-calendar-frame">
                      <full-calendar
                        [options]="calendarDemoOptions"
                        [events]="CATALOG_DEMO_EVENTS"
                      />
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Estados de sincronizacion - p-tag severity
                    </h3>
                  </div>
                  <div class="card-body">
                    <p class="catalog-helper-text text-sm m-0 mb-3">
                      Usar <code>p-tag [severity]</code> con la funcion
                      <code>getStatusSeverity()</code>
                      en lugar de clases de color hardcodeadas.
                    </p>
                    <div class="flex flex-wrap gap-3">
                      <div class="flex align-items-center gap-2">
                        <p-tag
                          value="Sincronizado con Google"
                          severity="success"
                        />
                        <span class="catalog-helper-text text-sm">success</span>
                      </div>
                      <div class="flex align-items-center gap-2">
                        <p-tag value="Solo local (historico)" severity="info" />
                        <span class="catalog-helper-text text-sm">info</span>
                      </div>
                      <div class="flex align-items-center gap-2">
                        <p-tag value="Solo local" severity="warn" />
                        <span class="catalog-helper-text text-sm">warn</span>
                      </div>
                      <div class="flex align-items-center gap-2">
                        <p-tag
                          value="Pendiente de sincronizar"
                          severity="secondary"
                        />
                        <span class="catalog-helper-text text-sm"
                          >secondary</span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Tabla de eventos - patron ERP</h3>
                  </div>
                  <div class="card-body">
                    <p class="catalog-helper-text text-sm m-0 mb-3">
                      Debajo del calendario:
                      <code>p-table class="custom-table "</code>
                      con paginacion, busqueda y botones de accion DS.
                    </p>
                    <p-table
                      [value]="calendarTableDemo"
                      class="custom-table "
                      [rows]="4"
                    >
                      <ng-template #header>
                        <tr>
                          <th>TITULO</th>
                          <th>ASUNTO</th>
                          <th>INICIO</th>
                          <th>INVITADOS</th>
                          <th>ESTADO</th>
                        </tr>
                      </ng-template>
                      <ng-template #body let-item>
                        <tr>
                          <td>{{ item.title }}</td>
                          <td>{{ item.subject }}</td>
                          <td>{{ item.start }}</td>
                          <td class="text-center">{{ item.guests }}</td>
                          <td>
                            <p-tag
                              [value]="item.statusLabel"
                              [severity]="item.severity"
                            />
                          </td>
                        </tr>
                      </ng-template>
                    </p-table>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <div class="unified-mobile">
          <div class="phone-card">
            <div class="phone-dynamic-island"></div>
            <div class="phone-screen">
              @switch (mobileItem()) {
                @case ("buttons") {
                  <app-mobile-buttons />
                }
                @case ("inputs") {
                  <app-mobile-inputs />
                }
                @case ("feedback") {
                  <app-mobile-feedback />
                }
                @case ("navigation") {
                  <app-mobile-navigation />
                }
                @case ("lists") {
                  <app-mobile-lists />
                }
                @case ("data") {
                  <app-mobile-data />
                }
                @case ("forms") {
                  <app-mobile-forms />
                }
                @case ("overlays") {
                  <app-mobile-overlays />
                }
                @default {
                  <div
                    class="flex align-items-center justify-content-center h-full text-secondary text-sm p-3"
                  >
                    Sin equivalente mobile para este componente
                  </div>
                }
              }
            </div>
            <div class="phone-home-bar"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .catalog-helper-text {
        color: var(--ds-text-secondary);
      }
      .catalog-token-primary {
        color: var(--ds-primary);
      }
      .catalog-token-muted {
        color: var(--ds-text-muted);
      }
      .catalog-calendar-frame {
        height: 500px;
      }
      .badge-mode {
        background: #6366f1;
        color: white;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
      .unified-split {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }
      .unified-web {
        flex: 3;
        min-width: 0;
      }
      .unified-mobile {
        flex: 1;
        position: sticky;
        top: 5rem;
        align-self: flex-start;
        max-width: 340px;
      }
      .phone-card {
        background: #1a1a2e;
        border-radius: 40px;
        padding: 12px 8px;
        box-shadow:
          0 20px 60px rgba(0, 0, 0, 0.4),
          inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        position: relative;
      }
      .phone-dynamic-island {
        width: 110px;
        height: 26px;
        background: #0d0d1a;
        border-radius: 20px;
        margin: 0 auto 10px;
      }
      .phone-screen {
        background: var(--ds-bg-page);
        border-radius: 28px;
        overflow-y: auto;
        height: 640px;
        padding: 0.5rem;
        scroll-behavior: smooth;
      }
      .phone-screen::-webkit-scrollbar {
        width: 3px;
      }
      .phone-screen::-webkit-scrollbar-thumb {
        background: var(--ds-border);
        border-radius: 3px;
      }
      .phone-home-bar {
        width: 120px;
        height: 4px;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 2px;
        margin: 8px auto 2px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogWebItem {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  item = signal("");
  private readonly calendarEventOwnColor = "var(--ds-primary)";
  private readonly calendarEventExternalColor = "var(--ds-text-muted)";
  private readonly calendarEventTextColor = "var(--ds-on-primary)";
  get label(): string {
    return WEB_ITEM_LABELS[this.item()] ?? this.item();
  }

  mobileItem = computed(() => WEB_TO_MOBILE[this.item()] ?? null);

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }

  // Icon button demo
  readonly iconBtnHtml = `<button type="button" class="ds-icon-btn" (click)="accion()">
  <app-icon icon="material-symbols-light:menu" class="text-xl" />
</button>`;

  readonly iconBtnScss = `.mi-clase-boton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: var(--ds-bg-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  color: var(--ds-text-primary);
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;

  &:hover {
    background-color: var(--ds-bg-sunken);
    border-color: var(--ds-border-strong);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}`;

  // Custom inputs form
  readonly customInputsForm: FormGroup = this.fb.group({
    nombre: ["Juan Garcia"],
    password: [""],
    cantidad: [5],
    monto: [12500],
    decimal: [3.14],
    fecha: [null],
    hora: [null],
    area: [null],
    activo: [null],
    roles: [[]],
    terminos: [false],
    notificaciones: [true],
    notas: [""],
  });

  readonly inputSelectOptions = [
    { label: "Contabilidad", value: 1 },
    { label: "Operaciones", value: 2 },
    { label: "Recursos Humanos", value: 3 },
    { label: "TI", value: 4 },
    { label: "Direccion General", value: 5 },
  ];

  // Shared state
  dialogVisible = signal(false);
  selectOptions = [
    { label: "Opcion 1", value: 1 },
    { label: "Opcion 2", value: 2 },
    { label: "Opcion 3", value: 3 },
  ];
  dateVal: Date | null = null;
  numVal = 50;
  numVal2 = 12500;
  textVal = "";
  textAreaVal = "";
  multiVal: any[] = [];
  radioVal = "1";
  selectVal: any = null;
  selectBtnVal: any = null;
  toggleVal = signal(false);
  tableData = [
    { name: "Registro A", status: "Activo" },
    { name: "Registro B", status: "Inactivo" },
    { name: "Registro C", status: "Pendiente" },
  ];

  // Calendar demo
  readonly calendarDemoOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    locale: "es",
    locales: [esLocale],
    initialView: "dayGridMonth",
    height: 480,
    dayMaxEvents: 3,
    nowIndicator: true,
    editable: false,
    selectable: false,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: { today: "Hoy", month: "Mes", week: "Semana", day: "Dia" },
  };

  readonly calendarTableDemo = [
    {
      title: "Junta Comite",
      subject: "Junta mensual",
      start: "10/06/2026 19:00",
      guests: 4,
      statusLabel: "Sincronizado con Google",
      severity: "success",
    },
    {
      title: "Asamblea General",
      subject: "Asamblea",
      start: "15/06/2026 10:00",
      guests: 12,
      statusLabel: "Solo local (historico)",
      severity: "info",
    },
    {
      title: "Reunion Proveedores",
      subject: "Reunion",
      start: "20/06/2026 09:00",
      guests: 2,
      statusLabel: "Solo local",
      severity: "warn",
    },
    {
      title: "Comite Finanzas",
      subject: "Junta mensual",
      start: "28/06/2026 11:00",
      guests: 5,
      statusLabel: "Pendiente de sincronizar",
      severity: "secondary",
    },
  ];
}
