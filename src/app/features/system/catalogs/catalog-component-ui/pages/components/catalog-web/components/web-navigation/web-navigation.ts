import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { MenuItem } from "primeng/api";
import { AccordionModule } from "primeng/accordion";
import { BadgeModule } from "primeng/badge";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { StepperModule } from "primeng/stepper";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

@Component({
  selector: "app-web-navigation",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TabsModule,
    AccordionModule,
    StepperModule,
    BreadcrumbModule,
    MenuModule,
    MenubarModule,
    DividerModule,
    TagModule,
    BadgeModule,
    AppIcon,
  ],
  template: `
    <div class="grid">

      <!-- -- Tabs ---------------------------------------------------- -->
      <div class="col-12">
        <p-card header="Tabs é p-tabs">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Usa tabs para organizar contenido relacionado en la misma vista.
            No uses mís de 6 tabs visibles; si hay mís, usa un mení desplegable o sección aparte.
          </p>

          <div class="grid">

            <!-- Bósicos -->
            <div class="col-12 lg:col-6">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Bósicos</span>
              <p-tabs value="0">
                <p-tablist>
                  <p-tab value="0">General</p-tab>
                  <p-tab value="1">Financiero</p-tab>
                  <p-tab value="2">Documentos</p-tab>
                  <p-tab value="3" [disabled]="true">Auditoróa</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel value="0">
                    <div class="p-3 surface-ground border-round text-sm text-color-secondary">
                      Información general del registro: nombre, órea, responsable, fechas y prioridad.
                    </div>
                  </p-tabpanel>
                  <p-tabpanel value="1">
                    <div class="p-3 surface-ground border-round text-sm text-color-secondary">
                      Datos financieros: importe, moneda, partida presupuestal y aprobaciones.
                    </div>
                  </p-tabpanel>
                  <p-tabpanel value="2">
                    <div class="p-3 surface-ground border-round text-sm text-color-secondary">
                      Archivos adjuntos, contratos, cotizaciones y documentos de soporte.
                    </div>
                  </p-tabpanel>
                  <p-tabpanel value="3">
                    <div class="p-3 surface-ground border-round text-sm text-color-secondary">
                      Historial de cambios, firmas y trazabilidad del proceso.
                    </div>
                  </p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>

            <!-- Con iconos y badges -->
            <div class="col-12 lg:col-6">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Con iconos y badges de notificación</span>
              <p-tabs value="inbox">
                <p-tablist>
                  @for (t of iconTabs; track t.value) {
                    <p-tab [value]="t.value">
                      <div class="flex align-items-center gap-2">
                        <app-icon [icon]="t.icon" />
                        <span>{{ t.label }}</span>
                        @if (t.badge) {
                          <p-badge [value]="t.badge.toString()" [severity]="t.badgeSeverity" />
                        }
                      </div>
                    </p-tab>
                  }
                </p-tablist>
                <p-tabpanels>
                  @for (t of iconTabs; track t.value) {
                    <p-tabpanel [value]="t.value">
                      <div class="p-3 surface-ground border-round text-sm text-color-secondary">
                        Contenido del panel <strong>{{ t.label }}</strong>.
                        @if (t.badge) { <p-tag [value]="t.badge + ' pendientes'" severity="danger" [rounded]="true" class="ml-2" /> }
                      </div>
                    </p-tabpanel>
                  }
                </p-tabpanels>
              </p-tabs>
            </div>

            <!-- Scrollable -->
            <div class="col-12">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Scrollable (muchos tabs)</span>
              <p-tabs value="t1" [scrollable]="true">
                <p-tablist>
                  @for (t of scrollableTabs; track t.value) {
                    <p-tab [value]="t.value">{{ t.label }}</p-tab>
                  }
                </p-tablist>
                <p-tabpanels>
                  @for (t of scrollableTabs; track t.value) {
                    <p-tabpanel [value]="t.value">
                      <p class="m-0 p-2 text-sm text-color-secondary">Módulo: <strong>{{ t.label }}</strong></p>
                    </p-tabpanel>
                  }
                </p-tabpanels>
              </p-tabs>
            </div>

          </div>
        </p-card>
      </div>

      <!-- -- Accordion ----------------------------------------------- -->
      <div class="col-12 lg:col-6">
        <p-card header="Accordion é p-accordion">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Ideal para FAQs, secciones colapsables de formulario y agrupación de contenido secundario.
          </p>

          <div class="flex flex-column gap-4">

            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Un panel activo a la vez</span>
              <p-accordion>
                @for (panel of accordionPanels; track panel.header) {
                  <p-accordion-panel [value]="panel.value">
                    <p-accordion-header>
                      <div class="flex align-items-center gap-2">
                        <app-icon [icon]="panel.icon" class="text-primary" />
                        <span>{{ panel.header }}</span>
                        @if (panel.tag) {
                          <p-tag [value]="panel.tag" [severity]="panel.tagSeverity" [rounded]="true" class="ml-auto" />
                        }
                      </div>
                    </p-accordion-header>
                    <p-accordion-content>
                      <p class="m-0 text-sm text-color-secondary line-height-3">{{ panel.content }}</p>
                    </p-accordion-content>
                  </p-accordion-panel>
                }
              </p-accordion>
            </div>

            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Míltiples paneles activos</span>
              <p-accordion [multiple]="true" [value]="['0']">
                @for (panel of accordionPanels.slice(0, 3); track panel.value) {
                  <p-accordion-panel [value]="panel.value">
                    <p-accordion-header>{{ panel.header }}</p-accordion-header>
                    <p-accordion-content>
                      <p class="m-0 text-sm text-color-secondary">{{ panel.content }}</p>
                    </p-accordion-content>
                  </p-accordion-panel>
                }
              </p-accordion>
            </div>

          </div>
        </p-card>
      </div>

      <!-- -- Breadcrumb -------------------------------------------- -->
      <div class="col-12 lg:col-6">
        <p-card header="Breadcrumb é p-breadcrumb">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Orienta al usuario sobre su ubicación en la jerarquóa de la aplicación.
            El óltimo ótem (página actual) va sin enlace ni cursor pointer.
          </p>

          <div class="flex flex-column gap-4">

            @for (bc of breadcrumbs; track bc.label) {
              <div>
                <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">{{ bc.label }}</span>
                <p-breadcrumb [model]="bc.items" [home]="homeItem" styleClass="border-none p-0 surface-ground border-round px-3 py-2" />
              </div>
            }

          </div>
        </p-card>
      </div>

      <!-- -- Stepper (Wizard) -------------------------------------- -->
      <div class="col-12">
        <p-card header="Stepper é Wizard de pasos">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Usa el stepper para flujos secuenciales obligatorios (alta de usuario, onboarding, flujo de aprobación).
            Cada paso debe ser completable de forma independiente.
          </p>

          <p-stepper [(value)]="activeStep" [linear]="true">
            <p-step-list>
              @for (s of steps; track s.value) {
                <p-step [value]="s.value">{{ s.label }}</p-step>
              }
            </p-step-list>
            <p-step-panels>

              <p-step-panel [value]="1">
                <ng-template #content let-activateCallback="activateCallback">
                  <div class="p-4 surface-ground border-round flex flex-column gap-3">
                    <strong class="flex align-items-center gap-2"><app-icon icon="icon.account" /> Datos Generales</strong>
                    <div class="grid text-sm">
                      @for (f of step1Fields; track f) {
                        <div class="col-12 md:col-6 surface-card border-1 border-round p-3">
                          <span class="text-color-secondary block text-xs mb-1">{{ f.label }}</span>
                          <strong>{{ f.value }}</strong>
                        </div>
                      }
                    </div>
                  </div>
                  <div class="flex justify-content-end mt-3">
                    <p-button label="Siguiente" icon="icon.arrow-right" iconPos="right"
                              (onClick)="activateCallback(2)" />
                  </div>
                </ng-template>
              </p-step-panel>

              <p-step-panel [value]="2">
                <ng-template #content let-activateCallback="activateCallback">
                  <div class="p-4 surface-ground border-round flex flex-column gap-3">
                    <strong class="flex align-items-center gap-2"><app-icon icon="icon.currency-usd" /> Datos Financieros</strong>
                    <div class="grid text-sm">
                      @for (f of step2Fields; track f) {
                        <div class="col-12 md:col-6 surface-card border-1 border-round p-3">
                          <span class="text-color-secondary block text-xs mb-1">{{ f.label }}</span>
                          <strong>{{ f.value }}</strong>
                        </div>
                      }
                    </div>
                  </div>
                  <div class="flex justify-content-between mt-3">
                    <p-button label="Anterior" icon="icon.arrow-left" severity="secondary" [outlined]="true"
                              (onClick)="activateCallback(1)" />
                    <p-button label="Siguiente" icon="icon.arrow-right" iconPos="right"
                              (onClick)="activateCallback(3)" />
                  </div>
                </ng-template>
              </p-step-panel>

              <p-step-panel [value]="3">
                <ng-template #content let-activateCallback="activateCallback">
                  <div class="p-4 surface-ground border-round flex flex-column gap-3">
                    <strong class="flex align-items-center gap-2"><app-icon icon="icon.file-check" /> Documentos</strong>
                    <div class="flex flex-column gap-2 text-sm">
                      @for (d of step3Docs; track d.name) {
                        <div class="flex align-items-center gap-2 surface-card border-1 border-round p-2">
                          <app-icon [icon]="d.icon" [style.color]="d.color" />
                          <span>{{ d.name }}</span>
                          <p-tag [value]="d.status" [severity]="d.severity" [rounded]="true" class="ml-auto" />
                        </div>
                      }
                    </div>
                  </div>
                  <div class="flex justify-content-between mt-3">
                    <p-button label="Anterior" icon="icon.arrow-left" severity="secondary" [outlined]="true"
                              (onClick)="activateCallback(2)" />
                    <p-button label="Siguiente" icon="icon.arrow-right" iconPos="right"
                              (onClick)="activateCallback(4)" />
                  </div>
                </ng-template>
              </p-step-panel>

              <p-step-panel [value]="4">
                <ng-template #content let-activateCallback="activateCallback">
                  <div class="p-4 surface-ground border-round flex flex-column align-items-center gap-3 text-center">
                    <app-icon icon="icon.check-circle" class="text-5xl" style="color:var(--ds-success)" />
                    <strong class="text-lg">óSolicitud enviada correctamente!</strong>
                    <p class="m-0 text-sm text-color-secondary">
                      El folio <strong>ERP-2026-042</strong> fue creado y notificado al órea de Dirección para su aprobación.
                    </p>
                    <p-button label="Nueva solicitud" icon="icon.plus"
                              (onClick)="activeStep.set(1)" />
                  </div>
                </ng-template>
              </p-step-panel>

            </p-step-panels>
          </p-stepper>
        </p-card>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebNavigation {
  activeStep = signal<number>(1);

  readonly homeItem: MenuItem = { icon: "icon.home", command: () => {} };

  readonly iconTabs = [
    { value: "inbox",    label: "Bandeja",    icon: "icon.inbox",         badge: 5,  badgeSeverity: "danger"  as const },
    { value: "sent",     label: "Enviados",   icon: "icon.send",          badge: null, badgeSeverity: undefined },
    { value: "pending",  label: "Pendientes", icon: "icon.clock-outline", badge: 3,  badgeSeverity: "warn"    as const },
    { value: "approved", label: "Aprobados",  icon: "icon.check-circle",  badge: null, badgeSeverity: undefined },
  ];

  readonly scrollableTabs = [
    "Dashboard", "Solicitudes", "Aprobaciones", "Finanzas", "Mantenimiento",
    "Compras", "RRHH", "Reportes", "Biblioteca", "Configuración",
  ].map((label, i) => ({ label, value: `t${i + 1}` }));

  readonly accordionPanels = [
    { value: "0", header: "Datos Generales",   icon: "icon.account",        tag: "Requerido",  tagSeverity: "danger"    as const, content: "Nombre, órea responsable, prioridad y fechas. Estos campos son obligatorios para crear el registro." },
    { value: "1", header: "Información Financiera", icon: "icon.currency-usd", tag: undefined, tagSeverity: undefined,             content: "Importe autorizado, partida presupuestal y moneda. Solo accesible para usuarios con rol Finanzas o superior." },
    { value: "2", header: "Documentos Adjuntos", icon: "icon.paperclip",     tag: "3 archivos", tagSeverity: "info"     as const, content: "Contratos, cotizaciones y documentos de soporte. Formatos aceptados: PDF, DOCX, XLSX (míx. 10 MB por archivo)." },
    { value: "3", header: "Historial y Auditoróa", icon: "icon.history",    tag: undefined,    tagSeverity: undefined,             content: "Registro inmutable de todos los cambios, aprobaciones y rechazos del ciclo de vida de este documento." },
  ];

  readonly breadcrumbs = [
    {
      label: "Módulo simple",
      items: [
        { label: "Sistema", command: () => {} },
        { label: "Catálogos", command: () => {} },
        { label: "Proveedores" },
      ] as MenuItem[],
    },
    {
      label: "Módulo con subvista",
      items: [
        { label: "Operaciones", command: () => {} },
        { label: "Mantenimiento", command: () => {} },
        { label: "órdenes de trabajo", command: () => {} },
        { label: "OT-2026-0089" },
      ] as MenuItem[],
    },
    {
      label: "ERP profundo",
      items: [
        { label: "Finanzas", command: () => {} },
        { label: "Cuentas por pagar", command: () => {} },
        { label: "Proveedores", command: () => {} },
        { label: "Facturas", command: () => {} },
        { label: "FAC-2026-0412" },
      ] as MenuItem[],
    },
  ];

  readonly steps = [
    { value: 1, label: "Datos generales" },
    { value: 2, label: "Financiero" },
    { value: 3, label: "Documentos" },
    { value: 4, label: "Confirmación" },
  ];

  readonly step1Fields = [
    { label: "Nombre",      value: "Solicitud de compra equipo TI" },
    { label: "órea",        value: "Sistemas" },
    { label: "Prioridad",   value: "Alta" },
    { label: "Responsable", value: "Carlos Martúnez" },
  ];

  readonly step2Fields = [
    { label: "Importe",    value: "$45,000 MXN" },
    { label: "Partida",    value: "TI-2026-Q2" },
    { label: "Moneda",     value: "MXN" },
    { label: "Presupuesto",value: "Disponible" },
  ];

  readonly step3Docs = [
    { name: "Cotización-Proveedor-A.pdf",  icon: "icon.file-pdf-box", color: "var(--ds-danger)",  status: "Adjuntado", severity: "success"   as const },
    { name: "Cotización-Proveedor-B.pdf",  icon: "icon.file-pdf-box", color: "var(--ds-danger)",  status: "Adjuntado", severity: "success"   as const },
    { name: "Justificación-túcnica.docx",  icon: "icon.file-word-box",color: "var(--ds-info)",    status: "Pendiente", severity: "warn"      as const },
  ];
}
