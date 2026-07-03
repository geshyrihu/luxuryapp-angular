import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonBadge,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import {
  IonButtonDelete,
  IonButtonEdit,
} from "src/app/core/components/buttons/legacy/buttons-mobiil";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { TapToTop } from "src/app/core/components/mobile/tap-to-top/tap-to-top";
import { MOBILE_SHOWCASE_STYLES } from "../../../../../shared/mobile-showcase-styles";

@Component({
  selector: "app-mobile-utilities",
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonItem,
    IonLabel,
    IonList,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    DataViewMobile,
    TapToTop,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Mobile Utilities</div>
      <div class="mobile-card-body flex flex-column gap-4">
        <div>
          <div class="section-label">Action Menu</div>
          <p class="section-desc">
            Menu contextual reutilizable para listas y tarjetas mobile.
          </p>
          <div class="utility-surface">
            <div class="utility-row">
              <div>
                <strong class="utility-title">Solicitud SC-2026-041</strong>
                <div class="utility-subtitle">
                  Opciones rapidas para una fila mobile
                </div>
              </div>
              <app-action-menu>
                <ion-button-edit label="Editar" />
                <ion-button-delete label="Eliminar" />
              </app-action-menu>
            </div>
          </div>
        </div>

        <div>
          <div class="section-label">Data View Mobile</div>
          <p class="section-desc">
            Vista maestra para listados mobile con template proyectado.
          </p>
          <div class="utility-frame">
            <app-data-view-mobile
              [data]="utilityRows"
              [globalFilterFields]="['title', 'folio', 'status']"
              [showAdd]="false"
              [viewchildBreadcrumb]="false"
              [trackByProperty]="'id'"
            >
              <ng-template #listItemTemplate let-item>
                <ion-item lines="full" detail="false" class="ion-no-padding">
                  <ion-label class="ion-text-wrap">
                    <div class="utility-row">
                      <div>
                        <strong class="utility-title">{{ item.title }}</strong>
                        <div class="utility-subtitle">{{ item.folio }}</div>
                      </div>
                      <ion-badge [color]="item.badgeColor">{{
                        item.status
                      }}</ion-badge>
                    </div>
                  </ion-label>
                </ion-item>
              </ng-template>
            </app-data-view-mobile>
          </div>
        </div>

        <div>
          <div class="section-label">Tap To Top</div>
          <p class="section-desc">
            Boton flotante para volver al inicio. En esta pantalla ya esta
            montado y aparece cuando haces scroll suficiente.
          </p>
          <div class="utility-surface utility-surface--muted">
            <strong class="utility-title">Componente activo en vivo</strong>
            <div class="utility-subtitle">
              Desplazate dentro del catalogo mobile y veras el boton flotante en
              la esquina.
            </div>
          </div>
          <app-tap-to-top />
        </div>
      </div>
    </div>
  `,
  styles: [
    MOBILE_SHOWCASE_STYLES,
    `
      .utility-surface {
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: 12px;
        padding: 0.9rem;
        background: var(--ds-bg-surface);
      }

      .utility-surface--muted {
        background: var(--ds-bg-elevated, #f4f5f8);
      }

      .utility-frame {
        min-height: 18rem;
        max-height: 18rem;
        overflow: hidden;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: 12px;
        background: var(--ds-bg-surface);
      }

      .utility-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .utility-title {
        color: var(--ds-text-primary);
        font-size: 0.95rem;
      }

      .utility-subtitle {
        color: var(--ds-text-secondary);
        font-size: 0.8rem;
        margin-top: 0.15rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileUtilities {
  readonly utilityRows = [
    {
      id: 1,
      title: "Solicitud de compra",
      folio: "SC-2026-041",
      status: "Pendiente",
      badgeColor: "warning",
    },
    {
      id: 2,
      title: "Reporte de inspeccion",
      folio: "RI-2026-009",
      status: "Cerrado",
      badgeColor: "success",
    },
    {
      id: 3,
      title: "Bitacora operativa",
      folio: "BO-2026-118",
      status: "Proceso",
      badgeColor: "primary",
    },
  ];
}

