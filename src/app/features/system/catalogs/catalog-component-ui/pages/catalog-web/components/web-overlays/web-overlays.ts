import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DrawerModule } from "primeng/drawer";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TextareaModule } from "primeng/textarea";
import { Popover, PopoverModule } from "primeng/popover";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";

@Component({
  selector: "app-web-overlays",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    DrawerModule,
    PopoverModule,
    TooltipModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ToastModule,
    MessageModule,
    DividerModule,
    TagModule,
    InputTextModule,
    TextareaModule,
    AppIcon,
    CustomButtonEdit,
    CustomButtonDelete,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast position="top-right" />
    <p-confirmdialog />
    <p-confirmpopup />

    <div class="grid">

      <!-- ── Dialogs ──────────────────────────────────────────────── -->
      <div class="col-12">
        <p-card header="Dialogs — p-dialog">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Reserva los dialogs para decisiones breves (confirmar, editar un campo, ver un detalle).
            Si el usuario necesita capturar información extensa, navega a una pantalla dedicada.
          </p>

          <div class="grid">

            <!-- Informativo -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="surface-ground border-round p-4 flex flex-column align-items-center gap-3 text-center">
                <app-icon icon="mdi:information-outline" class="text-4xl" style="color:var(--ds-info)" />
                <div>
                  <strong class="block">Informativo</strong>
                  <p class="m-0 text-sm text-color-secondary mt-1">Detalle de registro o ayuda contextual.</p>
                </div>
                <p-button label="Abrir" size="small" severity="info" [outlined]="true"
                          (onClick)="dialogs.info.set(true)" />
              </div>
            </div>

            <!-- Con formulario -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="surface-ground border-round p-4 flex flex-column align-items-center gap-3 text-center">
                <app-icon icon="mdi:form-select" class="text-4xl text-primary" />
                <div>
                  <strong class="block">Con formulario</strong>
                  <p class="m-0 text-sm text-color-secondary mt-1">Edición rápida de un campo o un grupo pequeño.</p>
                </div>
                <p-button label="Abrir" size="small" (onClick)="dialogs.form.set(true)" />
              </div>
            </div>

            <!-- Confirmación destructiva -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="surface-ground border-round p-4 flex flex-column align-items-center gap-3 text-center">
                <app-icon icon="mdi:alert-outline" class="text-4xl" style="color:var(--ds-danger)" />
                <div>
                  <strong class="block">Confirmación destructiva</strong>
                  <p class="m-0 text-sm text-color-secondary mt-1">Siempre confirma acciones irreversibles.</p>
                </div>
                <p-button label="Eliminar" size="small" severity="danger"
                          (onClick)="dialogs.danger.set(true)" />
              </div>
            </div>

            <!-- Fullscreen / large -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="surface-ground border-round p-4 flex flex-column align-items-center gap-3 text-center">
                <app-icon icon="mdi:fullscreen" class="text-4xl text-primary" />
                <div>
                  <strong class="block">Grande / Fullscreen</strong>
                  <p class="m-0 text-sm text-color-secondary mt-1">Para vistas complejas de solo consulta.</p>
                </div>
                <p-button label="Abrir" size="small" severity="secondary" [outlined]="true"
                          (onClick)="dialogs.large.set(true)" />
              </div>
            </div>

          </div>

          <!-- Dialog: Informativo -->
          <p-dialog header="Detalle del Registro" [(visible)]="dialogs.info"
                    [modal]="true" [style]="{width: 'min(92vw, 30rem)'}" [draggable]="false">
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center gap-3 p-3 surface-ground border-round">
                <app-icon icon="mdi:file-document-outline" class="text-3xl text-primary" />
                <div>
                  <strong class="block">ERP-2026-042</strong>
                  <span class="text-sm text-color-secondary">Solicitud de compra — Sistemas</span>
                </div>
                <p-tag value="Pendiente" severity="warn" [rounded]="true" class="ml-auto" />
              </div>
              <div class="grid text-sm">
                @for (f of detailFields; track f.label) {
                  <div class="col-6">
                    <span class="text-color-secondary block text-xs">{{ f.label }}</span>
                    <span class="font-semibold">{{ f.value }}</span>
                  </div>
                }
              </div>
            </div>
            <ng-template #footer>
              <p-button label="Cerrar" severity="secondary" [outlined]="true" (onClick)="dialogs.info.set(false)" />
              <p-button label="Editar" icon="mdi:pencil" (onClick)="dialogs.info.set(false)" />
            </ng-template>
          </p-dialog>

          <!-- Dialog: Formulario -->
          <p-dialog header="Editar Nombre" [(visible)]="dialogs.form"
                    [modal]="true" [style]="{width: 'min(92vw, 28rem)'}" [draggable]="false">
            <div class="flex flex-column gap-3 pt-1">
              <div>
                <label class="block text-sm font-medium mb-1">Nombre del registro *</label>
                <input pInputText [(ngModel)]="editName" class="w-full" placeholder="Nombre breve y auditable" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Observaciones</label>
                <textarea pTextarea [(ngModel)]="editObs" rows="3" class="w-full"
                          placeholder="Descripción breve sin lenguaje ambiguo."></textarea>
              </div>
            </div>
            <ng-template #footer>
              <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dialogs.form.set(false)" />
              <p-button label="Guardar" icon="mdi:content-save" (onClick)="saveForm()" />
            </ng-template>
          </p-dialog>

          <!-- Dialog: Destructivo -->
          <p-dialog header="Confirmar Eliminación" [(visible)]="dialogs.danger"
                    [modal]="true" [style]="{width: 'min(92vw, 26rem)'}" [draggable]="false">
            <div class="flex align-items-start gap-3">
              <div class="flex-shrink-0 border-round p-2 mt-1" style="background:var(--ds-danger-light)">
                <app-icon icon="mdi:trash-can-outline" style="color:var(--ds-danger)" class="text-2xl" />
              </div>
              <div>
                <strong class="block text-color">¿Eliminar ERP-2026-042?</strong>
                <p class="m-0 mt-1 text-sm text-color-secondary line-height-3">
                  Esta acción es irreversible. Se eliminará el registro y todos sus documentos asociados.
                </p>
              </div>
            </div>
            <ng-template #footer>
              <p-button label="Cancelar" severity="secondary" [outlined]="true" (onClick)="dialogs.danger.set(false)" />
              <p-button label="Sí, eliminar" severity="danger" icon="mdi:trash-can" (onClick)="deleteRecord()" />
            </ng-template>
          </p-dialog>

          <!-- Dialog: Grande -->
          <p-dialog header="Vista Completa — Solicitudes del Mes" [(visible)]="dialogs.large"
                    [modal]="true" [maximizable]="true" [style]="{width: 'min(96vw, 64rem)'}" [draggable]="false">
            <div class="flex flex-column gap-3">
              <p-message severity="info" text="Este dialog es ideal para reportes de solo consulta. Para edición extensa, usa una vista dedicada." />
              <div class="surface-ground border-round p-4 text-center text-color-secondary">
                <app-icon icon="mdi:table-large" class="text-5xl mb-3 block mx-auto" />
                <span class="text-sm">Tabla completa ERP iría aquí — con paginación, filtros y export PDF.</span>
              </div>
            </div>
            <ng-template #footer>
              <p-button label="Cerrar" severity="secondary" (onClick)="dialogs.large.set(false)" />
              <p-button label="Exportar PDF" icon="mdi:file-pdf-box" />
            </ng-template>
          </p-dialog>
        </p-card>
      </div>

      <!-- ── Drawer (Side Panel) ─────────────────────────────────── -->
      <div class="col-12 lg:col-6">
        <p-card header="Drawer — Panel lateral / inferior">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Úsalo para filtros avanzados, detalles contextuales o navegación secundaria
            sin abandonar la vista actual.
          </p>
          <div class="flex flex-wrap gap-2">
            <p-button label="Drawer derecho"  icon="mdi:dock-right"   (onClick)="drawers.right.set(true)" />
            <p-button label="Drawer izquierdo" icon="mdi:dock-left"   severity="secondary" [outlined]="true" (onClick)="drawers.left.set(true)" />
            <p-button label="Drawer inferior"  icon="mdi:dock-bottom" severity="secondary" [outlined]="true" (onClick)="drawers.bottom.set(true)" />
          </div>

          <p-drawer header="Filtros Avanzados" [(visible)]="drawers.right" position="right"
                    [style]="{width: 'min(92vw, 24rem)'}">
            <div class="flex flex-column gap-3">
              @for (f of drawerFilters; track f.label) {
                <div>
                  <label class="block text-xs font-bold text-color-secondary uppercase mb-1"
                         style="letter-spacing:.06em">{{ f.label }}</label>
                  <input pInputText [placeholder]="f.placeholder" class="w-full" />
                </div>
              }
            </div>
            <ng-template #footer>
              <div class="flex gap-2 w-full">
                <p-button label="Limpiar" severity="secondary" [outlined]="true" class="flex-grow-1"
                          (onClick)="drawers.right.set(false)" />
                <p-button label="Aplicar" icon="mdi:filter" class="flex-grow-1"
                          (onClick)="drawers.right.set(false)" />
              </div>
            </ng-template>
          </p-drawer>

          <p-drawer header="Navegación" [(visible)]="drawers.left" position="left"
                    [style]="{width: 'min(92vw, 20rem)'}">
            <nav class="flex flex-column gap-1">
              @for (n of drawerNav; track n.label) {
                <button class="flex align-items-center gap-3 p-3 border-round text-left w-full border-none bg-transparent text-color cursor-pointer hover:surface-hover">
                  <app-icon [icon]="n.icon" class="text-xl flex-shrink-0 text-color-secondary" />
                  <span class="text-sm font-medium">{{ n.label }}</span>
                </button>
              }
            </nav>
          </p-drawer>

          <p-drawer header="Detalle rápido" [(visible)]="drawers.bottom" position="bottom"
                    [style]="{height: '280px'}">
            <div class="flex flex-column gap-2 text-sm">
              <div class="p-3 surface-ground border-round flex align-items-center gap-3">
                <app-icon icon="mdi:file-document-outline" class="text-2xl text-primary" />
                <div>
                  <strong class="block">ERP-2026-042 — Solicitud de compra</strong>
                  <span class="text-color-secondary">Sistemas · $45,000 MXN</span>
                </div>
                <p-tag value="Pendiente" severity="warn" [rounded]="true" class="ml-auto" />
              </div>
              <p class="m-0 text-color-secondary">
                El drawer inferior es ideal para mobile como alternativa a un modal completo.
              </p>
            </div>
          </p-drawer>
        </p-card>
      </div>

      <!-- ── Popover & ConfirmPopup ───────────────────────────────── -->
      <div class="col-12 lg:col-6">
        <p-card header="Popover & ConfirmPopup">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            El popover muestra contenido contextual anclado al elemento que lo dispara.
            El ConfirmPopup es la versión inline de la confirmación destructiva.
          </p>

          <div class="flex flex-column gap-4">

            <!-- Info Popover -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Popover informativo</span>
              <p-button label="Ver contexto" icon="mdi:information-outline"
                        severity="secondary" [outlined]="true" (onClick)="infoPopover.toggle($event)" />
              <p-popover #infoPopover>
                <div class="flex flex-column gap-2" style="max-width:260px">
                  <strong class="text-sm">Regla de presupuesto</strong>
                  <p class="m-0 text-sm text-color-secondary line-height-3">
                    El importe máximo para aprobación directa por Supervisor es $50,000 MXN.
                    Solicitudes mayores requieren firma de Dirección.
                  </p>
                  <p-tag value="Nivel 2 · Operaciones" severity="info" [rounded]="true" />
                </div>
              </p-popover>
            </div>

            <!-- Actions Popover -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">Popover de acciones</span>
              <p-button label="Opciones" icon="mdi:dots-vertical"
                        severity="secondary" [outlined]="true" (onClick)="actionsPopover.toggle($event)" />
              <p-popover #actionsPopover>
                <div class="flex flex-column gap-1" style="min-width:180px">
                  @for (a of popoverActions; track a.label) {
                    <button class="flex align-items-center gap-2 p-2 border-round w-full border-none bg-transparent cursor-pointer text-left hover:surface-hover"
                            [style.color]="a.color || 'inherit'"
                            (click)="actionsPopover.hide(); showToast(a.label)">
                      <app-icon [icon]="a.icon" class="text-base" />
                      <span class="text-sm">{{ a.label }}</span>
                    </button>
                  }
                </div>
              </p-popover>
            </div>

            <p-divider />

            <!-- ConfirmPopup -->
            <div>
              <span class="text-xs font-bold text-color-secondary uppercase mb-2 block" style="letter-spacing:.06em">ConfirmPopup (inline)</span>
              <div class="flex gap-2">
                <custom-button-edit label="Editar" (clicked)="showToast('Edición abierta')" />
                <custom-button-delete label="Eliminar" (clicked)="confirmDelete($event)" />
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <!-- ── Tooltips ──────────────────────────────────────────────── -->
      <div class="col-12">
        <p-card header="Tooltips — pTooltip">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Los tooltips complementan icons y controles icónicos.
            <strong>Nunca sustituyen labels en acciones críticas</strong> — un botón importante
            debe tener label visible, no solo tooltip.
          </p>

          <div class="grid">
            <!-- Posiciones -->
            <div class="col-12 md:col-6">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Posiciones</span>
              <div class="flex flex-wrap gap-2">
                @for (pos of tooltipPositions; track pos) {
                  <p-button [label]="pos" [pTooltip]="'Tooltip ' + pos" [tooltipPosition]="pos"
                            severity="secondary" [outlined]="true" size="small" />
                }
              </div>
            </div>

            <!-- Delay y variantes -->
            <div class="col-12 md:col-6">
              <span class="text-xs font-bold text-color-secondary uppercase mb-3 block" style="letter-spacing:.06em">Variantes</span>
              <div class="flex flex-wrap gap-2">
                <p-button icon="mdi:pencil" [rounded]="true" [text]="true"
                          pTooltip="Editar registro" tooltipPosition="top" />
                <p-button icon="mdi:trash-can" [rounded]="true" [text]="true" severity="danger"
                          pTooltip="Eliminar permanentemente" tooltipPosition="top" />
                <p-button icon="mdi:download" [rounded]="true" [text]="true" severity="secondary"
                          pTooltip="Descargar PDF" tooltipPosition="top" />
                <p-button icon="mdi:eye" [rounded]="true" [text]="true" severity="info"
                          pTooltip="Vista previa" tooltipPosition="top" />
                <p-button label="Con delay" severity="secondary" [outlined]="true" size="small"
                          pTooltip="Aparece después de 800 ms" tooltipPosition="top" [tooltipOptions]="{showDelay: 800}" />
              </div>
            </div>
          </div>

          <p-divider class="my-3" />

          <!-- Reglas -->
          <div class="grid">
            @for (r of tooltipRules; track r.titulo) {
              <div class="col-12 md:col-4">
                <div class="flex align-items-start gap-2">
                  <app-icon [icon]="r.icon" [style.color]="r.color" class="text-lg flex-shrink-0 mt-1" />
                  <div>
                    <strong class="block text-sm">{{ r.titulo }}</strong>
                    <span class="text-xs text-color-secondary">{{ r.desc }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebOverlays {
  private confirmSvc = inject(ConfirmationService);
  private msgSvc = inject(MessageService);

  // Dialog visibility
  dialogs = {
    info:   signal(false),
    form:   signal(false),
    danger: signal(false),
    large:  signal(false),
  };

  // Drawer visibility
  drawers = {
    right:  signal(false),
    left:   signal(false),
    bottom: signal(false),
  };

  // Form fields
  editName = "Solicitud de compra equipo TI";
  editObs  = "";

  readonly detailFields = [
    { label: "Área",      value: "Sistemas" },
    { label: "Importe",   value: "$45,000" },
    { label: "Fecha",     value: "01/06/2026" },
    { label: "Solicitó",  value: "Carlos M." },
    { label: "Prioridad", value: "Alta" },
    { label: "Vence",     value: "30/06/2026" },
  ];

  readonly drawerFilters = [
    { label: "Folio",       placeholder: "ERP-2026-..." },
    { label: "Departamento",placeholder: "Ej: Sistemas" },
    { label: "Fecha inicio",placeholder: "dd/mm/aaaa" },
    { label: "Fecha fin",   placeholder: "dd/mm/aaaa" },
  ];

  readonly drawerNav = [
    { label: "Dashboard",     icon: "mdi:view-dashboard" },
    { label: "Solicitudes",   icon: "mdi:file-document" },
    { label: "Aprobaciones",  icon: "mdi:check-circle" },
    { label: "Reportes",      icon: "mdi:chart-bar" },
    { label: "Configuración", icon: "mdi:cog" },
  ];

  readonly popoverActions = [
    { label: "Ver detalle",  icon: "mdi:magnify" },
    { label: "Exportar PDF", icon: "mdi:file-pdf-box" },
    { label: "Duplicar",     icon: "mdi:content-copy" },
    { label: "Eliminar",     icon: "mdi:trash-can", color: "var(--ds-danger)" },
  ];

  readonly tooltipPositions = ["top", "bottom", "left", "right"];

  readonly tooltipRules = [
    { titulo: "Complementa, no sustituye", icon: "mdi:check-circle", color: "var(--ds-success)", desc: "Úsalo en botones icónicos donde el label no cabe. Acciones críticas siempre necesitan label visible." },
    { titulo: "Texto conciso",             icon: "mdi:check-circle", color: "var(--ds-success)", desc: "Máximo una oración. Si necesitas más de una línea, usa un Popover informativo." },
    { titulo: "Sin tooltips en mobile",    icon: "mdi:close-circle", color: "var(--ds-danger)",  desc: "Hover no existe en pantallas táctiles. Los labels deben ser suficientes en mobile." },
  ];

  saveForm() {
    this.dialogs.form.set(false);
    this.msgSvc.add({ severity: "success", summary: "Guardado", detail: `Nombre: ${this.editName}`, life: 3000 });
  }

  deleteRecord() {
    this.dialogs.danger.set(false);
    this.msgSvc.add({ severity: "success", summary: "Eliminado", detail: "ERP-2026-042 fue eliminado.", life: 3000 });
  }

  confirmDelete(event: Event) {
    this.confirmSvc.confirm({
      target: event.target as EventTarget,
      message: "¿Eliminar este registro?",
      icon: "mdi:trash-can",
      rejectLabel: "Cancelar",
      acceptLabel: "Eliminar",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => this.msgSvc.add({ severity: "success", summary: "Eliminado", life: 3000 }),
      reject: () => this.msgSvc.add({ severity: "secondary", summary: "Cancelado", life: 2000 }),
    });
  }

  showToast(label: string) {
    this.msgSvc.add({ severity: "info", summary: label, life: 2000 });
  }
}
