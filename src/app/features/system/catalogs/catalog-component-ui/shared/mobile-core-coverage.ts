import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonBadge,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
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
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputFile } from "src/app/core/components/inputs/web/custom-input-file-signal";
import { CustomInputHour } from "src/app/core/components/inputs/web/custom-input-hour-signal";
import { CustomInputMultiselectSignal } from "src/app/core/components/inputs/web/custom-input-multiselect-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputPassword } from "src/app/core/components/inputs/web/custom-input-password-signal";
import { CustomInputSelectBool } from "src/app/core/components/inputs/web/custom-input-select-bool-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-mobile-core-coverage",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionMenu,
    DataViewMobile,
    IonBadge,
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
    IonItem,
    IonItemDivider,
    CustomInputCheckSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputFile,
    CustomInputHour,
    CustomInputMultiselectSignal,
    CustomInputNumberSignal,
    CustomInputPassword,
    CustomSearchInput,
    CustomInputSelectBool,
    CustomInputSelectSignal,
    CustomInputSwitch,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    IonLabel,
    IonList,
  ],
  template: `
    <div class="mobile-showcase">
      <section class="mobile-hero">
        <div class="mobile-hero__eyebrow">Ionic Mobile System</div>
        <h3 class="mobile-hero__title">Native-feeling mobile patterns</h3>
        <p class="mobile-hero__copy">
          La vitrina mobile ahora prioriza ritmo vertical, superficies suaves y
          bloques mas cercanos a una app real que a una galeria web.
        </p>
      </section>

      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Data View Mobile</span>
          <h4 class="mobile-panel__title">Casos de uso completos tipo bank-list</h4>
        </div>

        <div class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Bank List</div>
            <div class="mobile-block__body">
              <div class="mobile-dataview-frame">
                <app-data-view-mobile
                  class="mobile-force-render"
                  [data]="bankRows"
                  [globalFilterFields]="bankFilterFields"
                  [showAdd]="true"
                  [trackByProperty]="'id'"
                  [viewchildBreadcrumb]="false"
                >
                  <div customFilters class="mobile-filter-pills">
                    <span class="mobile-filter-pill is-active">Todos</span>
                    <span class="mobile-filter-pill">Activos</span>
                    <span class="mobile-filter-pill">SPEI</span>
                  </div>

                  <ng-template #listItemTemplate let-item>
                    <ion-item lines="full" detail="false" class="ion-no-padding">
                      <ion-label class="ion-text-wrap">
                        <div class="mobile-list-row">
                          <div>
                            <strong class="mobile-list-title">{{ item.shortName }}</strong>
                            <div class="mobile-list-subtitle">
                              {{ item.code }} - {{ item.largeName }}
                            </div>
                          </div>
                          <ion-badge [color]="item.statusColor">{{ item.status }}</ion-badge>
                        </div>
                        <p class="mobile-list-meta">
                          CLABE {{ item.clabe }} · {{ item.currency }}
                        </p>
                      </ion-label>

                      <app-action-menu slot="end">
                        <ng-container actions>
                          <custom-button-edit label="Editar" />
                          <custom-button-delete label="Eliminar" />
                        </ng-container>
                      </app-action-menu>
                    </ion-item>
                  </ng-template>
                </app-data-view-mobile>
              </div>
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Grouped Data View</div>
            <div class="mobile-block__body">
              <div class="mobile-dataview-frame mobile-dataview-frame--compact">
                <app-data-view-mobile
                  class="mobile-force-render"
                  [data]="[]"
                  [isGrouped]="true"
                  [groupedData]="bankGroups"
                  [showAdd]="false"
                  [viewchildBreadcrumb]="false"
                  [trackByProperty]="'id'"
                >
                  <ng-template #listItemTemplate let-item>
                    <ion-item lines="full" detail="false" class="ion-no-padding">
                      <ion-label class="ion-text-wrap">
                        <div class="mobile-list-row">
                          <strong class="mobile-list-title">{{ item.shortName }}</strong>
                          <ion-badge [color]="item.statusColor">{{ item.status }}</ion-badge>
                        </div>
                        <p class="mobile-list-meta">
                          {{ item.code }} · {{ item.currency }} · {{ item.region }}
                        </p>
                      </ion-label>
                    </ion-item>
                  </ng-template>
                </app-data-view-mobile>
              </div>
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Loading And Empty States</div>
            <div class="mobile-block__body">
              <div class="mobile-dataview-frame mobile-dataview-frame--state">
                <app-data-view-mobile
                  class="mobile-force-render"
                  [data]="[]"
                  [loading]="true"
                  [showAdd]="false"
                  [viewchildBreadcrumb]="false"
                />
              </div>

              <div class="mobile-dataview-frame mobile-dataview-frame--state">
                <app-data-view-mobile
                  class="mobile-force-render"
                  [data]="[]"
                  [loading]="false"
                  [showAdd]="false"
                  [viewchildBreadcrumb]="false"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Mobile Lists</span>
          <h4 class="mobile-panel__title">Listados y vistas de consulta</h4>
        </div>

        <div class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Master List</div>
            <div class="mobile-block__body">
              <ion-list lines="full" class="mobile-list-shell">
                @for (item of masterList; track item.id) {
                <ion-item detail="false">
                  <ion-label class="ion-text-wrap">
                    <div class="mobile-list-row">
                      <div>
                        <strong class="mobile-list-title">{{ item.title }}</strong>
                        <div class="mobile-list-subtitle">{{ item.code }}</div>
                      </div>
                      <ion-badge [color]="item.badgeColor">{{ item.badge }}</ion-badge>
                    </div>
                    <p class="mobile-list-meta">{{ item.detail }}</p>
                  </ion-label>
                </ion-item>
                }
              </ion-list>
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Grouped List</div>
            <div class="mobile-block__body">
              <ion-list lines="none" class="mobile-list-shell">
                @for (group of groupedList | keyvalue; track group.key) {
                <ion-item-divider sticky="true">
                  <ion-label>{{ group.key }}</ion-label>
                </ion-item-divider>
                @for (item of group.value; track item.id) {
                <ion-item detail="false">
                  <ion-label class="ion-text-wrap">
                    <div class="mobile-list-row">
                      <strong class="mobile-list-title">{{ item.title }}</strong>
                      <ion-badge [color]="item.badgeColor">{{ item.status }}</ion-badge>
                    </div>
                    <p class="mobile-list-meta">{{ item.module }} · {{ item.time }}</p>
                  </ion-label>
                </ion-item>
                }
                }
              </ion-list>
            </div>
          </div>
        </div>
      </section>

      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">All Mobile Buttons</span>
          <h4 class="mobile-panel__title">Acciones y estados</h4>
        </div>

        <div class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Primary Actions</div>
            <div class="mobile-block__body">
              <custom-button-add label="Nuevo registro" />
              <custom-button-add label="FAB agregar" [fabMode]="true" />
              <custom-button-edit label="Editar perfil" />
              <custom-button-save label="Guardar cambios" [submitting]="false" />
              <custom-button-confirm label="Confirmar accion" />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Context And Utility</div>
            <div class="mobile-block__body">
              <custom-button-delete label="Eliminar" />
              <custom-button-download />
              <custom-button-send-email />
              <custom-button-tracking [badgeCount]="3" [ticketId]="228" />
              <custom-button-view-pdf
                [url]="'https://example.com/demo.pdf'"
                [fileName]="'demo.pdf'"
              />
              <custom-button-item icon="mdi:star" label="Destacar" />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">State Buttons</div>
            <div class="mobile-block__body">
              <custom-button-active-desactive [state]="true" />
              <custom-button-active-desactive [state]="false" />
            </div>
          </div>
        </div>
      </section>

      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">All Mobile Inputs</span>
          <h4 class="mobile-panel__title">Captura, seleccion y adjuntos</h4>
        </div>

        <form [formGroup]="form" class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Text And Search</div>
            <div class="mobile-block__body">
              <custom-input-text-signal
                [control]="form.controls['texto']"
                label="Texto"
                placeholder="Nombre"
              />
              <custom-search-input-signal
                placeholder="Buscar"
                (searchChange)="form.controls['busqueda'].setValue($event)"
              />
              <custom-input-password-signal
                [control]="form.controls['password']"
                label="Contrasena"
                placeholder="********"
              />
              <custom-input-textarea-signal
                [control]="form.controls['descripcion']"
                label="Textarea"
                [rows]="4"
              />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Numeric And Date</div>
            <div class="mobile-block__body">
              <custom-input-number-signal
                [control]="form.controls['numero']"
                label="Numero"
                placeholder="0"
              />
              <custom-input-currency-signal
                [control]="form.controls['monto']"
                label="Monto"
              />
              <custom-input-date-signal
                [control]="form.controls['fecha']"
                label="Fecha"
              />
              <custom-input-hour-signal
                [control]="form.controls['hora']"
                label="Hora"
              />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Selection</div>
            <div class="mobile-block__body">
              <custom-input-select-signal
                [control]="form.controls['categoria']"
                label="Select"
                [data]="options"
              />
              <custom-input-multiselect-signal
                [control]="form.controls['multi']"
                label="Multiselect"
                [options]="options"
              />
              <custom-input-select-signal-bool
                [control]="form.controls['estado']"
                label="Activo/Inactivo"
              />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Files And Toggles</div>
            <div class="mobile-block__body">
              <custom-input-file-signal
                [control]="form.controls['archivo']"
                label="Archivo"
              />
              <custom-input-check-signal
                [control]="form.controls['check']"
                label="Checkbox"
              />
              <custom-input-switch-signal
                [control]="form.controls['toggle']"
                label="Toggle"
              />
            </div>
          </div>
        </form>
      </section>
    </div>
  `,
  styles: [
    `
      .mobile-showcase {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .mobile-hero {
        padding: 1rem 1rem 0.5rem;
      }

      .mobile-hero__eyebrow,
      .mobile-panel__eyebrow,
      .mobile-block__label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .mobile-hero__eyebrow,
      .mobile-panel__eyebrow {
        color: #6b7280;
      }

      .mobile-hero__title,
      .mobile-panel__title {
        margin: 0.25rem 0 0;
        color: #111827;
      }

      .mobile-hero__title {
        font-size: 1.35rem;
        line-height: 1.2;
      }

      .mobile-hero__copy {
        margin: 0.5rem 0 0;
        color: #6b7280;
        font-size: 0.92rem;
        line-height: 1.55;
      }

      .mobile-panel {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 1.35rem;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        padding: 1rem;
      }

      .mobile-panel__header {
        margin-bottom: 0.85rem;
      }

      .mobile-panel__title {
        font-size: 1.05rem;
      }

      .mobile-stack {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }

      .mobile-block {
        background: #f8fafc;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 1rem;
        padding: 0.85rem;
      }

      .mobile-block__label {
        color: #475569;
        margin-bottom: 0.65rem;
      }

      .mobile-block__body {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .mobile-list-shell {
        background: transparent;
        border-radius: 0.9rem;
        overflow: hidden;
      }

      .mobile-dataview-frame {
        min-height: 26rem;
        max-height: 26rem;
        overflow: hidden;
        border: 1px solid rgba(148, 163, 184, 0.22);
        border-radius: 1rem;
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
      }

      .mobile-dataview-frame--compact {
        min-height: 20rem;
        max-height: 20rem;
      }

      .mobile-dataview-frame--state {
        min-height: 12rem;
        max-height: 12rem;
      }

      .mobile-force-render {
        display: block;
        height: 100%;
      }

      .mobile-force-render .md\\:hidden {
        display: flex !important;
      }

      .mobile-filter-pills {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem 0;
        overflow-x: auto;
      }

      .mobile-filter-pill {
        border: 1px solid rgba(148, 163, 184, 0.28);
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
        background: #fff;
        color: #475569;
        font-size: 0.74rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .mobile-filter-pill.is-active {
        background: #0f172a;
        border-color: #0f172a;
        color: #fff;
      }

      .mobile-list-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .mobile-list-title {
        color: #0f172a;
        font-size: 0.96rem;
      }

      .mobile-list-subtitle,
      .mobile-list-meta {
        color: #64748b;
        font-size: 0.82rem;
      }

      .mobile-list-meta {
        margin: 0.3rem 0 0;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileCoreCoverage {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    texto: ["Usuario mobile"],
    busqueda: [""],
    password: ["12345678"],
    descripcion: ["Componente mobile de demostracion."],
    numero: [10],
    monto: [889.4],
    fecha: ["2026-06-20"],
    hora: ["13:30"],
    categoria: [1],
    multi: [[1, 3]],
    estado: [true],
    archivo: [null],
    check: [true],
    toggle: [true],
  });

  readonly options = [
    { label: "Alta", value: 1 },
    { label: "Media", value: 2 },
    { label: "Baja", value: 3 },
  ];

  readonly bankFilterFields = ["code", "shortName", "largeName", "currency"];

  readonly bankRows = [
    {
      id: 1,
      code: "BAN-001",
      shortName: "Banorte",
      largeName: "Banco Mercantil del Norte",
      clabe: "072180004567890123",
      currency: "MXN",
      status: "Activo",
      statusColor: "success",
      region: "Nacional",
    },
    {
      id: 2,
      code: "BAN-002",
      shortName: "BBVA",
      largeName: "BBVA Mexico",
      clabe: "012320001234567890",
      currency: "USD",
      status: "Revision",
      statusColor: "warning",
      region: "Internacional",
    },
    {
      id: 3,
      code: "BAN-003",
      shortName: "Santander",
      largeName: "Banco Santander Mexico",
      clabe: "014180009876543210",
      currency: "EUR",
      status: "Activo",
      statusColor: "success",
      region: "Tesoreria",
    },
  ];

  readonly bankGroups = {
    Nacional: [
      {
        id: 1,
        code: "BAN-001",
        shortName: "Banorte",
        currency: "MXN",
        status: "Activo",
        statusColor: "success",
        region: "Nacional",
      },
    ],
    Internacional: [
      {
        id: 2,
        code: "BAN-002",
        shortName: "BBVA",
        currency: "USD",
        status: "Revision",
        statusColor: "warning",
        region: "Internacional",
      },
    ],
    Tesoreria: [
      {
        id: 3,
        code: "BAN-003",
        shortName: "Santander",
        currency: "EUR",
        status: "Activo",
        statusColor: "success",
        region: "Tesoreria",
      },
    ],
  };

  readonly masterList = [
    {
      id: 1,
      title: "Solicitud de compra",
      code: "SC-2026-041",
      detail: "Pendiente de autorizacion por Gerencia",
      badge: "Pendiente",
      badgeColor: "warning",
    },
    {
      id: 2,
      title: "Bitacora de mantenimiento",
      code: "BM-2026-118",
      detail: "Actualizada hace 25 minutos por Operaciones",
      badge: "Proceso",
      badgeColor: "primary",
    },
    {
      id: 3,
      title: "Reporte de inspeccion",
      code: "RI-2026-009",
      detail: "Cerrado y enviado al cliente",
      badge: "Cerrado",
      badgeColor: "success",
    },
  ];

  readonly groupedList = {
    Hoy: [
      {
        id: 1,
        title: "Recorrido de areas comunes",
        module: "Operaciones",
        time: "09:00",
        status: "En curso",
        badgeColor: "primary",
      },
      {
        id: 2,
        title: "Seguimiento a proveedor",
        module: "Compras",
        time: "11:30",
        status: "Pendiente",
        badgeColor: "warning",
      },
    ],
    Manana: [
      {
        id: 3,
        title: "Cierre de auditoria interna",
        module: "Calidad",
        time: "08:15",
        status: "Programado",
        badgeColor: "medium",
      },
    ],
  };
}
