import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { BadgeModule } from "primeng/badge";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { FloatLabelModule } from "primeng/floatlabel";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { PopoverModule } from "primeng/popover";
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import {
  CustomButton,
  CustomBtnActiveDesactive,
  CustomButtonAdd,
  CustomButtonConfirm,
  CustomButtonDelete,
  CustomButtonDownload,
  CustomButtonEdit,
  CustomButtonItem,
  CustomButtonSave,
  CustomButtonSendEmail,
  CustomButtonTracking,
  CustomButtonViewPdf,
} from "src/app/core/components/buttons/web";

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
};

@Component({
  selector: "app-catalog-web-item",
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
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
    TextareaModule,
    ToggleSwitchModule,
    ToolbarModule,
    TooltipModule,
    AppIcon,
    CustomButton,
    CustomBtnActiveDesactive,
    CustomButtonAdd,
    CustomButtonConfirm,
    CustomButtonDelete,
    CustomButtonDownload,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButtonSave,
    CustomButtonSendEmail,
    CustomButtonTracking,
    CustomButtonViewPdf,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
        <p class="text-secondary">Componente PrimeNG: <strong>{{ item() }}</strong></p>
      </div>

      @switch (item()) {
        @case ('accordion') {
          <p-card header="Accordion — p-accordion">
            <p-accordion>
              <p-accordion-panel value="0">
                <p-accordion-header>Sección 1</p-accordion-header>
                <p-accordion-content><p class="m-0">Contenido de la primera sección.</p></p-accordion-content>
              </p-accordion-panel>
              <p-accordion-panel value="1">
                <p-accordion-header>Sección 2</p-accordion-header>
                <p-accordion-content><p class="m-0">Contenido de la segunda sección.</p></p-accordion-content>
              </p-accordion-panel>
              <p-accordion-panel value="2">
                <p-accordion-header>Sección 3</p-accordion-header>
                <p-accordion-content><p class="m-0">Contenido de la tercera sección.</p></p-accordion-content>
              </p-accordion-panel>
            </p-accordion>
          </p-card>
        }
        @case ('badge') {
          <p-card header="Badge — p-badge">
            <div class="flex flex-wrap gap-3 align-items-center">
              <p-badge value="3" severity="danger" />
              <p-badge value="12" severity="warn" />
              <p-badge value="5" severity="info" />
              <p-badge value="8" severity="success" />
              <p-badge severity="danger" />
              <p-badge severity="warn" />
            </div>
          </p-card>
        }
        @case ('breadcrumb') {
          <p-card header="Breadcrumb — p-breadcrumb">
            <p-breadcrumb [model]="[{label:'Inicio'},{label:'Sistema'},{label:'Catálogos'},{label:'Proveedores'}]" [home]="{icon:'mdi:home'}" />
          </p-card>
        }
        @case ('button') {
          <p-card header="Button — p-button">
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
          </p-card>
          <div class="mt-3">
            <p-card header="Action Buttons (Custom)">
              <div class="flex flex-wrap gap-2">
                <custom-button label="Genérico" />
                <custom-button-add label="Crear" />
                <custom-button-edit label="Editar" />
                <custom-button-save label="Guardar" />
                <custom-button-delete label="Eliminar" />
                <custom-button-confirm label="Aprobar" />
                <custom-button-download />
                <custom-button-view-pdf />
                <custom-button-send-email />
              </div>
            </p-card>
          </div>
        }
        @case ('card') {
          <div class="grid">
            <div class="col-12 md:col-6">
              <p-card header="Card Simple">
                <p class="m-0">Contenido de la card. Usa este componente para agrupar información relacionada.</p>
              </p-card>
            </div>
            <div class="col-12 md:col-6">
              <p-card header="Con Subheader" subheader="Subtítulo">
                <p class="m-0">Card con subheader y footer opcional.</p>
                <ng-template #footer><p-button label="Acción" /></ng-template>
              </p-card>
            </div>
          </div>
        }
        @case ('checkbox') {
          <p-card header="Checkbox — p-checkbox">
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center gap-2"><p-checkbox [binary]="true" inputId="chk1" /><label for="chk1">Opción 1</label></div>
              <div class="flex align-items-center gap-2"><p-checkbox [binary]="true" inputId="chk2" /><label for="chk2">Opción 2</label></div>
              <div class="flex align-items-center gap-2"><p-checkbox [binary]="true" inputId="chk3" /><label for="chk3">Opción 3</label></div>
            </div>
          </p-card>
        }
        @case ('datepicker') {
          <p-card header="DatePicker — p-datepicker">
            <p-datepicker [(ngModel)]="dateVal" dateFormat="dd/mm/yy" appendTo="body" />
          </p-card>
        }
        @case ('dialog') {
          <p-card header="Dialog — p-dialog">
            <p-button label="Abrir Dialog" (onClick)="dialogVisible.set(true)" />
            <p-dialog header="Ejemplo de Dialog" [(visible)]="dialogVisible" [modal]="true" [style]="{width:'min(92vw,30rem)'}">
              <p>Contenido del dialog. Resérvalo para decisiones breves.</p>
              <ng-template #footer><p-button label="Cerrar" (onClick)="dialogVisible.set(false)" /></ng-template>
            </p-dialog>
          </p-card>
        }
        @case ('divider') {
          <p-card header="Divider — p-divider">
            <p>Contenido superior</p>
            <p-divider />
            <p>Contenido inferior</p>
            <p-divider align="left"><b>Izquierda</b></p-divider>
            <p>Texto con divider alineado.</p>
          </p-card>
        }
        @case ('inputnumber') {
          <p-card header="InputNumber — p-inputnumber">
            <div class="grid">
              <div class="col-6"><p-inputnumber [(ngModel)]="numVal" [showButtons]="true" [min]="0" [max]="100" class="w-full" /></div>
              <div class="col-6"><p-inputnumber [(ngModel)]="numVal2" mode="currency" currency="MXN" locale="es-MX" class="w-full" /></div>
            </div>
          </p-card>
        }
        @case ('inputtext') {
          <p-card header="InputText — p-inputtext">
            <div class="flex flex-column gap-3">
              <input pInputText [(ngModel)]="textVal" placeholder="Texto libre" class="w-full" />
              <span p-fluid><input pInputText placeholder="Fluid (ancho completo)" /></span>
            </div>
          </p-card>
        }
        @case ('message') {
          <p-card header="Message — p-message">
            <div class="flex flex-column gap-2">
              <p-message severity="info" text="Mensaje informativo" />
              <p-message severity="success" text="Operación exitosa" />
              <p-message severity="warn" text="Advertencia" />
              <p-message severity="error" text="Error crítico" />
              <p-message severity="secondary" text="Mensaje secundario" />
              <p-message severity="contrast" text="Contraste" />
            </div>
          </p-card>
        }
        @case ('multiselect') {
          <p-card header="MultiSelect — p-multiselect">
            <p-multiselect [options]="selectOptions" [(ngModel)]="multiVal" optionLabel="label" placeholder="Selecciona opciones" appendTo="body" class="w-full" />
          </p-card>
        }
        @case ('popover') {
          <p-card header="Popover — p-popover">
            <p-button label="Abrir Popover" #popoverBtn (click)="popover.toggle($event)" />
            <p-popover #popover><div class="p-3">Contenido del popover. Ideal para menús contextuales rápidos.</div></p-popover>
          </p-card>
        }
        @case ('progressbar') {
          <p-card header="ProgressBar — p-progressbar">
            <p-progressBar [value]="75" />
            <p class="mt-3"><p-progressBar [value]="50" [showValue]="false" /></p>
          </p-card>
        }
        @case ('progressspinner') {
          <p-card header="ProgressSpinner — p-progressspinner">
            <div class="flex gap-3">
              <p-progressSpinner strokeWidth="4" />
              <p-progressSpinner strokeWidth="8" />
            </div>
          </p-card>
        }
        @case ('radiobutton') {
          <p-card header="RadioButton — p-radiobutton">
            <div class="flex flex-column gap-2">
              <div class="flex align-items-center gap-2"><p-radioButton name="radio" value="1" [(ngModel)]="radioVal" /><label>Opción 1</label></div>
              <div class="flex align-items-center gap-2"><p-radioButton name="radio" value="2" [(ngModel)]="radioVal" /><label>Opción 2</label></div>
              <div class="flex align-items-center gap-2"><p-radioButton name="radio" value="3" [(ngModel)]="radioVal" /><label>Opción 3</label></div>
            </div>
          </p-card>
        }
        @case ('select') {
          <p-card header="Select — p-select">
            <p-select [options]="selectOptions" [(ngModel)]="selectVal" optionLabel="label" placeholder="Selecciona una opción" appendTo="body" class="w-full" />
          </p-card>
        }
        @case ('selectbutton') {
          <p-card header="SelectButton — p-selectbutton">
            <p-selectButton [options]="selectOptions" [(ngModel)]="selectBtnVal" optionLabel="label" />
          </p-card>
        }
        @case ('skeleton') {
          <p-card header="Skeleton — p-skeleton">
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
          </p-card>
        }
        @case ('table') {
          <p-card header="Table — p-table">
            <p-table [value]="tableData" styleClass="p-datatable-sm">
              <ng-template #header><tr><th>Nombre</th><th>Status</th><th>Acciones</th></tr></ng-template>
              <ng-template #body let-row>
                <tr><td>{{ row.name }}</td><td><p-tag [value]="row.status" severity="info" /></td><td><p-button icon="mdi:eye" [rounded]="true" [text]="true" /></td></tr>
              </ng-template>
            </p-table>
          </p-card>
        }
        @case ('tabs') {
          <p-card header="Tabs — p-tabs">
            <p-tabs value="0">
              <p-tablist>
                <p-tab value="0">General</p-tab>
                <p-tab value="1">Detalle</p-tab>
                <p-tab value="2">Documentos</p-tab>
              </p-tablist>
              <p-tabpanels>
                <p-tabpanel value="0"><p class="m-0">Contenido General.</p></p-tabpanel>
                <p-tabpanel value="1"><p class="m-0">Contenido de Detalle.</p></p-tabpanel>
                <p-tabpanel value="2"><p class="m-0">Documentos adjuntos.</p></p-tabpanel>
              </p-tabpanels>
            </p-tabs>
          </p-card>
        }
        @case ('tag') {
          <p-card header="Tag — p-tag">
            <div class="flex flex-wrap gap-2">
              <p-tag value="Success" severity="success" />
              <p-tag value="Info" severity="info" />
              <p-tag value="Warning" severity="warn" />
              <p-tag value="Danger" severity="danger" />
              <p-tag value="Secondary" severity="secondary" />
              <p-tag value="Contrast" severity="contrast" [rounded]="true" />
            </div>
          </p-card>
        }
        @case ('textarea') {
          <p-card header="Textarea — p-textarea">
            <textarea pTextarea rows="4" [(ngModel)]="textAreaVal" placeholder="Escribe aquí..." class="w-full"></textarea>
          </p-card>
        }
        @case ('toast') {
          <p-card header="Toast — p-toast">
            <p-message severity="info" text="Las notificaciones Toast se muestran globalmente mediante MessageService. Inyecta MessageService y llama a add() con severity, summary y detail." />
          </p-card>
        }
        @case ('toggleswitch') {
          <p-card header="ToggleSwitch — p-toggleswitch">
            <div class="flex align-items-center gap-3">
              <p-toggleSwitch [(ngModel)]="toggleVal" />
              <span>{{ toggleVal() ? 'Activado' : 'Desactivado' }}</span>
            </div>
          </p-card>
        }
        @case ('toolbar') {
          <p-card header="Toolbar — p-toolbar">
            <p-toolbar>
              <ng-template #start><strong>Toolbar Title</strong></ng-template>
              <ng-template #end>
                <div class="flex gap-2">
                  <p-button label="Nuevo" icon="mdi:plus" size="small" />
                  <p-button label="Exportar" severity="secondary" size="small" />
                </div>
              </ng-template>
            </p-toolbar>
          </p-card>
        }
        @case ('tooltip') {
          <p-card header="Tooltip — p-tooltip">
            <div class="flex gap-3">
              <p-button label="Hover me" pTooltip="Tooltip arriba" tooltipPosition="top" />
              <p-button label="Hover me" pTooltip="Tooltip derecha" severity="secondary" tooltipPosition="right" />
              <p-button label="Hover me" pTooltip="Tooltip abajo" severity="info" tooltipPosition="bottom" />
            </div>
          </p-card>
        }
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogWebItem {
  private route = inject(ActivatedRoute);
  item = signal('');
  get label(): string { return WEB_ITEM_LABELS[this.item()] ?? this.item(); }

  constructor() {
    this.route.paramMap.subscribe(p => this.item.set(p.get('item') ?? ''));
  }

  // Shared state
  dialogVisible = signal(false);
  selectOptions = [
    { label: 'Opción 1', value: 1 },
    { label: 'Opción 2', value: 2 },
    { label: 'Opción 3', value: 3 },
  ];
  dateVal: Date | null = null;
  numVal = 50;
  numVal2 = 12500;
  textVal = '';
  textAreaVal = '';
  multiVal: any[] = [];
  radioVal = '1';
  selectVal: any = null;
  selectBtnVal: any = null;
  toggleVal = signal(false);
  tableData = [
    { name: 'Registro A', status: 'Activo' },
    { name: 'Registro B', status: 'Inactivo' },
    { name: 'Registro C', status: 'Pendiente' },
  ];
}
