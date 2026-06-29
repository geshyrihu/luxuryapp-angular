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
import {
  IonInputCheckbox,
  IonInputCurrency,
  IonInputDate,
  IonInputFile,
  IonInputMultiselect,
  IonInputNumber,
  IonInputPassword,
  IonInputSearch,
  IonInputSelect,
  IonInputSelectBool,
  IonInputText,
  IonInputTextarea,
  IonInputTime,
  IonInputToggle,
} from "src/app/core/components/inputs/mobile";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import {
  IonButtonActiveDesactive,
  IonButtonAdd,
  IonButtonConfirm,
  IonButtonDelete,
  IonButtonDownload,
  IonButtonEdit,
  IonButtonItem,
  IonButtonSave,
  IonButtonSendEmail,
  IonButtonTracking,
  IonButtonViewPdf,
} from "src/app/core/components/mobile/buttons";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { TapToTop } from "src/app/core/components/mobile/tap-to-top/tap-to-top";

@Component({
  selector: "app-mobile-core-coverage",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionMenu,
    DataViewMobile,
    TapToTop,
    IonBadge,
    IonButtonAdd,
    IonButtonEdit,
    IonButtonSave,
    IonButtonDelete,
    IonButtonConfirm,
    IonButtonDownload,
    IonButtonSendEmail,
    IonButtonTracking,
    IonButtonViewPdf,
    IonButtonActiveDesactive,
    IonButtonItem,
    IonItem,
    IonItemDivider,
    IonInputText,
    IonInputTextarea,
    IonInputSearch,
    IonInputPassword,
    IonInputNumber,
    IonInputCurrency,
    IonInputDate,
    IonInputTime,
    IonInputSelect,
    IonInputMultiselect,
    IonInputSelectBool,
    IonInputFile,
    IonInputToggle,
    IonInputCheckbox,
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

      <section class="mobile-panel mobile-panel--gallery">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Target Views</span>
          <h4 class="mobile-panel__title">
            Pantallas objetivo del catalogo mobile
          </h4>
          <p class="mobile-panel__copy">
            La portada mobile ya no debe sentirse como una lista de controles.
            Debe ensenar flujos completos listos para producto: acciones,
            tareas, navegacion y operacion.
          </p>
        </div>

        <div class="mobile-gallery">
          <article class="mobile-phone">
            <div class="mobile-phone__status">
              <span>9:41</span>
              <span>LuxuryApp Mobile</span>
            </div>
            <div class="mobile-phone__screen">
              <div class="mobile-phone__topbar">
                <span class="mobile-phone__title">Acciones y formularios</span>
                <span class="mobile-phone__badge">Flow</span>
              </div>
              <div class="mobile-phone__body">
                <div class="mobile-phone__hero-card">
                  <div class="mobile-phone__hero-label">Corporate Flow</div>
                  <strong>Solicitud de autorizacion</strong>
                  <span
                    >Campos, CTA primario y acciones auxiliares dentro del mismo
                    contexto.</span
                  >
                </div>
                <div class="mobile-phone__cta-stack">
                  <button class="mobile-phone__cta mobile-phone__cta--primary">
                    Enviar aprobacion
                  </button>
                  <button
                    class="mobile-phone__cta mobile-phone__cta--secondary"
                  >
                    Guardar borrador
                  </button>
                </div>
                <div class="mobile-phone__micro-stats">
                  <div class="mobile-phone__micro-stat">
                    <span>SLA</span>
                    <strong>4h</strong>
                  </div>
                  <div class="mobile-phone__micro-stat">
                    <span>Owner</span>
                    <strong>PMO</strong>
                  </div>
                </div>
                <div class="mobile-phone__mini-list">
                  <div class="mobile-phone__mini-item">
                    <span>Monto solicitado</span>
                    <strong>$45,000 MXN</strong>
                  </div>
                  <div class="mobile-phone__mini-item">
                    <span>Centro de costo</span>
                    <strong>Infraestructura</strong>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article class="mobile-phone">
            <div class="mobile-phone__status">
              <span>9:41</span>
              <span>LuxuryApp Mobile</span>
            </div>
            <div class="mobile-phone__screen">
              <div class="mobile-phone__topbar">
                <span class="mobile-phone__title">Task overview</span>
                <span class="mobile-phone__badge">Ops</span>
              </div>
              <div class="mobile-phone__body">
                <div class="mobile-phone__stats">
                  <div class="mobile-phone__stat-card">
                    <span>Urgentes</span>
                    <strong>12</strong>
                  </div>
                  <div
                    class="mobile-phone__stat-card mobile-phone__stat-card--accent"
                  >
                    <span>Completadas</span>
                    <strong>48</strong>
                  </div>
                </div>
                <div class="mobile-phone__task-card">
                  <div class="mobile-phone__task-head">
                    <strong>Pending tasks</strong>
                    <span>Hoy</span>
                  </div>
                  <div class="mobile-phone__task-row">
                    <span>QA Infraestructura</span>
                    <span class="mobile-phone__pill">Alta</span>
                  </div>
                  <div class="mobile-phone__task-row">
                    <span>Actualizar checklist</span>
                    <span class="mobile-phone__pill mobile-phone__pill--muted"
                      >Media</span
                    >
                  </div>
                </div>
                <div class="mobile-phone__mini-list">
                  <div class="mobile-phone__mini-item">
                    <span>Team onboarding</span>
                    <strong>2.4 Early</strong>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article class="mobile-phone">
            <div class="mobile-phone__status">
              <span>9:41</span>
              <span>LuxuryApp Mobile</span>
            </div>
            <div class="mobile-phone__screen mobile-phone__screen--dark">
              <div class="mobile-phone__topbar mobile-phone__topbar--dark">
                <span class="mobile-phone__title">Operational view</span>
                <span class="mobile-phone__badge mobile-phone__badge--dark"
                  >Live</span
                >
              </div>
              <div class="mobile-phone__body">
                <div class="mobile-phone__dark-panel">
                  <div class="mobile-phone__dark-row">
                    <span>Open tasks</span>
                    <strong>08</strong>
                  </div>
                  <div class="mobile-phone__dark-row">
                    <span>Critical alerts</span>
                    <strong>02</strong>
                  </div>
                  <div class="mobile-phone__dark-meter">
                    <span>System health</span>
                    <div class="mobile-phone__dark-track">
                      <div class="mobile-phone__dark-fill"></div>
                    </div>
                  </div>
                </div>
                <div class="mobile-phone__dark-actions">
                  <button class="mobile-phone__icon-chip">Sync</button>
                  <button class="mobile-phone__icon-chip">Export</button>
                  <button class="mobile-phone__icon-chip">Alerts</button>
                </div>
                <div class="mobile-phone__dark-list">
                  <div class="mobile-phone__dark-row">
                    <span>Deploy checks</span>
                    <strong>11m</strong>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article class="mobile-phone">
            <div class="mobile-phone__status">
              <span>9:41</span>
              <span>LuxuryApp Mobile</span>
            </div>
            <div class="mobile-phone__screen">
              <div class="mobile-phone__topbar">
                <span class="mobile-phone__title">Navigation patterns</span>
                <span class="mobile-phone__badge">IA</span>
              </div>
              <div class="mobile-phone__body">
                <div class="mobile-phone__tabs">
                  <span class="mobile-phone__tab mobile-phone__tab--active"
                    >Overview</span
                  >
                  <span class="mobile-phone__tab">Security</span>
                  <span class="mobile-phone__tab">History</span>
                </div>
                <div class="mobile-phone__nav-card">
                  <strong>Infrastructure dashboard</strong>
                  <span
                    >Tabs, breadcrumbs suaves y acciones contextuales dentro de
                    la misma vista.</span
                  >
                </div>
                <div class="mobile-phone__tabs mobile-phone__tabs--subtle">
                  <span class="mobile-phone__tab mobile-phone__tab--active"
                    >Systems</span
                  >
                  <span class="mobile-phone__tab">Policies</span>
                </div>
                <div class="mobile-phone__mini-list">
                  <div class="mobile-phone__mini-item">
                    <span>Recent activity</span>
                    <strong>14 items</strong>
                  </div>
                  <div class="mobile-phone__mini-item">
                    <span>Feedback systems</span>
                    <strong>Online</strong>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Data View Mobile</span>
          <h4 class="mobile-panel__title">
            Casos de uso completos tipo bank-list
          </h4>
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
                    <ion-item
                      lines="full"
                      detail="false"
                      class="ion-no-padding"
                    >
                      <ion-label class="ion-text-wrap">
                        <div class="mobile-list-row">
                          <div>
                            <strong class="mobile-list-title">{{
                              item.shortName
                            }}</strong>
                            <div class="mobile-list-subtitle">
                              {{ item.code }} - {{ item.largeName }}
                            </div>
                          </div>
                          <ion-badge [color]="item.statusColor">{{
                            item.status
                          }}</ion-badge>
                        </div>
                        <p class="mobile-list-meta">
                          CLABE {{ item.clabe }} - {{ item.currency }}
                        </p>
                      </ion-label>

                      <app-action-menu slot="end">
                        <ng-container actions>
                          <ion-button-edit label="Editar" />
                          <ion-button-delete label="Eliminar" />
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
                    <ion-item
                      lines="full"
                      detail="false"
                      class="ion-no-padding"
                    >
                      <ion-label class="ion-text-wrap">
                        <div class="mobile-list-row">
                          <strong class="mobile-list-title">{{
                            item.shortName
                          }}</strong>
                          <ion-badge [color]="item.statusColor">{{
                            item.status
                          }}</ion-badge>
                        </div>
                        <p class="mobile-list-meta">
                          {{ item.code }} - {{ item.currency }} -
                          {{ item.region }}
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
                          <strong class="mobile-list-title">{{
                            item.title
                          }}</strong>
                          <div class="mobile-list-subtitle">
                            {{ item.code }}
                          </div>
                        </div>
                        <ion-badge [color]="item.badgeColor">{{
                          item.badge
                        }}</ion-badge>
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
                          <strong class="mobile-list-title">{{
                            item.title
                          }}</strong>
                          <ion-badge [color]="item.badgeColor">{{
                            item.status
                          }}</ion-badge>
                        </div>
                        <p class="mobile-list-meta">
                          {{ item.module }} - {{ item.time }}
                        </p>
                      </ion-label>
                    </ion-item>
                  }
                }
              </ion-list>
            </div>
          </div>
        </div>
      </section>

      <!-- --------------- CARDS --------------- -->
      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Cards</span>
          <h4 class="mobile-panel__title">Tarjetas y contenedores</h4>
        </div>
        <div class="mobile-stack">
          <!-- Standard Card with Image -->
          <div class="mobile-block">
            <div class="mobile-block__label">Standard Card</div>
            <div class="mobile-block__body">
              <div class="ds-card ds-card--image">
                <div
                  class="ds-card__img"
                  style="height:140px;background:linear-gradient(135deg,#00050e,#00050e);border-radius:12px 12px 0 0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:2rem;font-weight:700;"
                >
                  Project Aurora
                </div>
                <div class="ds-card__body">
                  <div class="ds-card__row">
                    <h4 class="ds-card__title">Project Aurora</h4>
                    <span class="material-symbols-outlined ds-icon-btn"
                      >more_vert</span
                    >
                  </div>
                  <p class="ds-card__desc">
                    Streamlined data analytics dashboard for enterprise cloud
                    infrastructures.
                  </p>
                  <div class="ds-card__tags">
                    <span class="ds-chip ds-chip--primary">Active</span>
                    <span class="ds-chip ds-chip--outline">v2.4.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Profile Card -->
          <div class="mobile-block">
            <div class="mobile-block__label">Profile Card</div>
            <div class="mobile-block__body">
              <div class="ds-card ds-card--profile">
                <div class="ds-avatar ds-avatar--lg">
                  <div
                    class="ds-avatar__img"
                    style="background:linear-gradient(135deg,#bad7ff,#b5c8e3);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.25rem;"
                  >
                    SJ
                  </div>
                  <span
                    class="ds-avatar__status ds-avatar__status--online"
                  ></span>
                </div>
                <div class="ds-card__profile-info">
                  <h4 class="ds-card__title">Sarah Jenkins</h4>
                  <p class="ds-card__desc">Senior UI Designer</p>
                </div>
                <button class="ds-btn ds-btn--primary ds-btn--sm">
                  Follow
                </button>
              </div>
            </div>
          </div>
          <!-- Minimalist Info Card -->
          <div class="mobile-block">
            <div class="mobile-block__label">Info Card (Accent Left)</div>
            <div class="mobile-block__body">
              <div class="ds-card ds-card--info">
                <span class="material-symbols-outlined ds-card__info-icon"
                  >info</span
                >
                <div>
                  <span class="ds-card__info-label">System Update</span>
                  <p class="ds-card__desc">
                    Memory optimization will be performed at 02:00 AM UTC.
                    Expect minor latency.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- Action Card -->
          <div class="mobile-block">
            <div class="mobile-block__label">Action Card</div>
            <div class="mobile-block__body">
              <div class="ds-card ds-card--action">
                <div class="ds-card__body">
                  <h4 class="ds-card__title">Confirmacion de despliegue</h4>
                  <p class="ds-card__desc">
                    Se requiere autorizacion jerarquica para proceder con el
                    despliegue a produccion de la version 2.4.1.
                  </p>
                </div>
                <div class="ds-card__actions">
                  <button class="ds-btn ds-btn--primary ds-btn--block">
                    AUTORIZAR
                  </button>
                  <button class="ds-btn ds-btn--outline ds-btn--block">
                    REVISAR
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Metric Card -->
          <div class="mobile-block">
            <div class="mobile-block__label">Metric Card (Bento)</div>
            <div class="mobile-block__body">
              <div class="ds-metric-grid">
                <div class="ds-metric">
                  <span class="material-symbols-outlined ds-metric__icon"
                    >verified_user</span
                  >
                  <span class="ds-metric__label">Status</span>
                  <span class="ds-metric__value">Secure</span>
                </div>
                <div class="ds-metric ds-metric--accent">
                  <span class="material-symbols-outlined ds-metric__icon"
                    >bolt</span
                  >
                  <span class="ds-metric__label">Up-time</span>
                  <span class="ds-metric__value">99.98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- --------------- CHIPS, BADGES & AVATARS --------------- -->
      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Display &amp; Indicators</span>
          <h4 class="mobile-panel__title">Chips, Badges y Avatars</h4>
        </div>
        <div class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Chips</div>
            <div class="mobile-block__body">
              <div class="ds-chip-row">
                <span class="ds-chip ds-chip--selected">
                  <span class="material-symbols-outlined ds-chip__icon"
                    >check</span
                  >
                  Selected
                </span>
                <span class="ds-chip ds-chip--input">
                  Design
                  <span class="material-symbols-outlined ds-chip__close"
                    >close</span
                  >
                </span>
                <span class="ds-chip ds-chip--suggestion">
                  <span class="material-symbols-outlined ds-chip__icon"
                    >add</span
                  >
                  Explore
                </span>
              </div>
            </div>
          </div>
          <div class="mobile-block">
            <div class="mobile-block__label">Badges</div>
            <div class="mobile-block__body">
              <div class="ds-badge-row">
                <div class="ds-badge-icon">
                  <span class="material-symbols-outlined">notifications</span>
                  <span class="ds-badge-count">12</span>
                </div>
                <div class="ds-badge-icon">
                  <span class="material-symbols-outlined">mail</span>
                  <span class="ds-badge-dot"></span>
                </div>
                <span class="ds-badge-label">In Progress</span>
                <span class="ds-badge-label ds-badge-label--high"
                  >High Priority</span
                >
              </div>
            </div>
          </div>
          <div class="mobile-block">
            <div class="mobile-block__label">Avatars</div>
            <div class="mobile-block__body">
              <div class="ds-avatar-row">
                <div class="ds-avatar">
                  <div
                    class="ds-avatar__img"
                    style="background:linear-gradient(135deg,#bad7ff,#b5c8e3);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;"
                  >
                    SJ
                  </div>
                  <span
                    class="ds-avatar__status ds-avatar__status--online"
                  ></span>
                </div>
                <div class="ds-avatar ds-avatar--md">
                  <div
                    class="ds-avatar__img"
                    style="background:#e9e7e9;display:flex;align-items:center;justify-content:center;color:#00050e;font-weight:700;border-radius:10px;"
                  >
                    JD
                  </div>
                </div>
                <div class="ds-avatar-stack">
                  <div
                    class="ds-avatar__img ds-avatar-stack__item"
                    style="background:#e4e2e4;display:flex;align-items:center;justify-content:center;color:#00050e;font-weight:600;font-size:0.75rem;width:32px;height:32px;border-radius:50%;border:2px solid #fff;"
                  >
                    A
                  </div>
                  <div
                    class="ds-avatar__img ds-avatar-stack__item"
                    style="background:#b5c8e3;display:flex;align-items:center;justify-content:center;color:#081d30;font-weight:600;font-size:0.75rem;width:32px;height:32px;border-radius:50%;border:2px solid #fff;"
                  >
                    B
                  </div>
                  <div class="ds-avatar-stack__item ds-avatar-stack__more">
                    +4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- --------------- FEEDBACK: ALERT BANNERS & PROGRESS --------------- -->
      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Feedback</span>
          <h4 class="mobile-panel__title">Alertas y progreso</h4>
        </div>
        <div class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Alert Banners</div>
            <div class="mobile-block__body">
              <div class="ds-alert ds-alert--success">
                <span class="material-symbols-outlined ds-alert__icon"
                  >check_circle</span
                >
                <span class="ds-alert__text"
                  >System update successful. All files synced.</span
                >
              </div>
              <div class="ds-alert ds-alert--warning">
                <span class="material-symbols-outlined ds-alert__icon"
                  >warning</span
                >
                <span class="ds-alert__text"
                  >Storage is reaching 90% capacity.</span
                >
              </div>
              <div class="ds-alert ds-alert--error">
                <span class="material-symbols-outlined ds-alert__icon"
                  >error</span
                >
                <span class="ds-alert__text"
                  >Failed to upload attachment. Please retry.</span
                >
              </div>
            </div>
          </div>
          <div class="mobile-block">
            <div class="mobile-block__label">Progress Indicators</div>
            <div class="mobile-block__body">
              <div class="ds-progress-row">
                <div>
                  <span class="ds-progress-label">Linear</span>
                  <div class="ds-progress-bar">
                    <div class="ds-progress-bar__fill" style="width:65%;"></div>
                  </div>
                </div>
                <div>
                  <span class="ds-progress-label">Circular</span>
                  <svg
                    class="ds-progress-circle"
                    viewBox="0 0 36 36"
                    width="48"
                    height="48"
                  >
                    <circle
                      class="ds-progress-circle__bg"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke-width="3"
                    />
                    <circle
                      class="ds-progress-circle__fg"
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke-width="3"
                      stroke-dasharray="100"
                      stroke-dashoffset="30"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- --------------- ALL MOBILE BUTTONS --------------- -->
      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">All Mobile Buttons</span>
          <h4 class="mobile-panel__title">Acciones y estados</h4>
        </div>

        <div class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Primary Actions</div>
            <div class="mobile-block__body">
              <ion-button-add label="Nuevo registro" />
              <ion-button-edit label="Editar perfil" />
              <ion-button-save label="Guardar cambios" />
              <ion-button-confirm label="Confirmar accion" />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Context And Utility</div>
            <div class="mobile-block__body">
              <ion-button-delete label="Eliminar" />
              <ion-button-download />
              <ion-button-send-email />
              <ion-button-tracking [badgeCount]="3" [ticketId]="228" />
              <ion-button-view-pdf
                url="https://example.com/demo.pdf"
                fileName="demo.pdf"
              />
              <ion-button-item ionicIcon="star-outline" label="Destacar" />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">State Buttons</div>
            <div class="mobile-block__body">
              <ion-button-active-desactive [state]="true" />
              <ion-button-active-desactive [state]="false" />
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
              <ion-input-text
                [control]="form.controls['texto']"
                label="Texto"
                placeholder="Nombre"
              />
              <ion-input-search
                placeholder="Buscar"
                [control]="form.controls['busqueda']"
                label="Buscar"
              />
              <ion-input-password
                [control]="form.controls['password']"
                label="Password"
                placeholder="********"
              />
              <ion-input-textarea
                [control]="form.controls['descripcion']"
                label="Textarea"
              />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Numeric And Date</div>
            <div class="mobile-block__body">
              <ion-input-number
                [control]="form.controls['numero']"
                label="Numero"
                placeholder="0"
              />
              <ion-input-currency
                [control]="form.controls['monto']"
                label="Monto"
              />
              <ion-input-date
                [control]="form.controls['fecha']"
                label="Fecha"
              />
              <ion-input-time [control]="form.controls['hora']" label="Hora" />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Selection</div>
            <div class="mobile-block__body">
              <ion-input-select
                [control]="form.controls['categoria']"
                label="Select"
                [data]="options"
              />
              <ion-input-multiselect
                [control]="form.controls['multi']"
                label="Multiselect"
                [options]="options"
              />
              <ion-input-select-bool
                [control]="form.controls['estado']"
                label="Activo/Inactivo"
              />
            </div>
          </div>

          <div class="mobile-block">
            <div class="mobile-block__label">Files And Toggles</div>
            <div class="mobile-block__body">
              <ion-input-file
                [control]="form.controls['archivo']"
                label="Archivo"
              />
              <ion-input-checkbox
                [control]="form.controls['check']"
                placeholder="Checkbox"
              />
              <ion-input-toggle
                [control]="form.controls['toggle']"
                placeholder="Toggle"
              />
            </div>
          </div>
        </form>
      </section>

      <!-- --------------- SELECTION CONTROLS --------------- -->
      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Selection Controls</span>
          <h4 class="mobile-panel__title">
            Switches, radios, checkboxes y sliders
          </h4>
        </div>
        <div class="mobile-stack">
          <div class="mobile-block">
            <div class="mobile-block__label">Switches</div>
            <div class="mobile-block__body">
              <div class="ds-switch-row">
                <span class="ds-switch-label">Enable Notifications</span>
                <label class="ds-switch">
                  <input type="checkbox" checked class="ds-switch__input" />
                  <span class="ds-switch__slider"></span>
                </label>
              </div>
              <div class="ds-switch-row">
                <span class="ds-switch-label ds-switch-label--muted"
                  >Dark Mode</span
                >
                <label class="ds-switch">
                  <input type="checkbox" class="ds-switch__input" />
                  <span class="ds-switch__slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="mobile-block">
            <div class="mobile-block__label">Checkboxes &amp; Radios</div>
            <div class="mobile-block__body">
              <div class="ds-selection-grid">
                <div>
                  <label class="ds-checkbox">
                    <input type="checkbox" checked class="ds-checkbox__input" />
                    <span class="ds-checkbox__label">Option A</span>
                  </label>
                  <label class="ds-checkbox">
                    <input type="checkbox" class="ds-checkbox__input" />
                    <span class="ds-checkbox__label">Option B</span>
                  </label>
                </div>
                <div>
                  <label class="ds-radio">
                    <input
                      type="radio"
                      name="v_radio"
                      checked
                      class="ds-radio__input"
                    />
                    <span class="ds-radio__label">Daily</span>
                  </label>
                  <label class="ds-radio">
                    <input
                      type="radio"
                      name="v_radio"
                      class="ds-radio__input"
                    />
                    <span class="ds-radio__label">Weekly</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="mobile-block">
            <div class="mobile-block__label">Radio Horizontal</div>
            <div class="mobile-block__body">
              <div class="ds-radio-row">
                <label class="ds-radio ds-radio--inline">
                  <input type="radio" name="h_radio" class="ds-radio__input" />
                  <span class="ds-radio__label">Yes</span>
                </label>
                <label class="ds-radio ds-radio--inline">
                  <input
                    type="radio"
                    name="h_radio"
                    checked
                    class="ds-radio__input"
                  />
                  <span class="ds-radio__label">No</span>
                </label>
                <label class="ds-radio ds-radio--inline">
                  <input type="radio" name="h_radio" class="ds-radio__input" />
                  <span class="ds-radio__label">Maybe</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mobile-block">
            <div class="mobile-block__label">Sliders</div>
            <div class="mobile-block__body">
              <div class="ds-slider-box">
                <div class="ds-slider-row">
                  <span class="ds-slider-label">Volume</span>
                  <span class="ds-slider-value">75%</span>
                </div>
                <input type="range" class="ds-slider" value="75" />
                <div class="ds-slider-row" style="margin-top:0.75rem;">
                  <span class="ds-slider-label">Price Range</span>
                  <span class="ds-slider-value">$240 - $860</span>
                </div>
                <div class="ds-range-track">
                  <div
                    class="ds-range-track__fill"
                    style="left:20%;right:30%;"
                  ></div>
                  <div class="ds-range-thumb" style="left:20%;"></div>
                  <div class="ds-range-thumb" style="left:70%;"></div>
                </div>
                <div class="ds-range-labels">
                  <span>$0</span>
                  <span>$1000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mobile-panel">
        <div class="mobile-panel__header">
          <span class="mobile-panel__eyebrow">Utilities</span>
          <h4 class="mobile-panel__title">
            Componentes mobile vivos dentro del modulo
          </h4>
          <p class="mobile-panel__copy">
            Esta vista tambien monta utilidades reales del core. Haz scroll en
            la pagina y el boton flotante aparecera automaticamente.
          </p>
        </div>
        <app-tap-to-top />
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
        color: var(--ds-text-secondary);
      }

      .mobile-hero__title,
      .mobile-panel__title {
        margin: 0.25rem 0 0;
        color: var(--ds-text-primary);
      }

      .mobile-hero__title {
        font-size: 1.35rem;
        line-height: 1.2;
      }

      .mobile-hero__copy {
        margin: 0.5rem 0 0;
        color: var(--ds-text-secondary);
        font-size: 0.92rem;
        line-height: 1.55;
      }

      .mobile-panel__copy {
        margin: 0.5rem 0 0;
        color: var(--ds-text-secondary);
        font-size: 0.86rem;
        line-height: 1.5;
      }

      .mobile-panel {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--ds-bg-surface) 98%, transparent),
          color-mix(in srgb, var(--ds-bg-elevated) 98%, transparent)
        );
        border: 1px solid
          color-mix(in srgb, var(--ds-text-primary) 8%, transparent);
        border-radius: 1.35rem;
        box-shadow: 0 18px 40px
          color-mix(in srgb, var(--ds-text-primary) 8%, transparent);
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

      .mobile-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
        gap: 1rem;
      }

      .mobile-phone {
        padding: 0.75rem;
        background: color-mix(in srgb, var(--ds-bg-surface) 96%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--ds-text-primary) 10%, transparent);
        border-radius: 1.5rem;
        box-shadow: 0 16px 36px
          color-mix(in srgb, var(--ds-text-primary) 8%, transparent);
      }

      .mobile-phone__status {
        display: flex;
        justify-content: space-between;
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--ds-text-secondary);
        margin-bottom: 0.65rem;
        padding: 0 0.2rem;
      }

      .mobile-phone__screen {
        background: linear-gradient(
          180deg,
          var(--ds-bg-surface) 0%,
          var(--ds-bg-elevated) 100%
        );
        border: 1px solid
          color-mix(in srgb, var(--ds-text-primary) 8%, transparent);
        border-radius: 1.1rem;
        overflow: hidden;
        min-height: 22rem;
      }

      .mobile-phone__screen--dark {
        background: linear-gradient(180deg, #07111f 0%, #0c1a2f 100%);
      }

      .mobile-phone__topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9rem 1rem 0.75rem;
        border-bottom: 1px solid
          color-mix(in srgb, var(--ds-text-primary) 8%, transparent);
        background: color-mix(
          in srgb,
          var(--ds-bg-surface) 88%,
          var(--ds-bg-elevated)
        );
      }

      .mobile-phone__topbar--dark {
        background: color-mix(in srgb, white 6%, transparent);
        border-bottom-color: color-mix(in srgb, white 10%, transparent);
      }

      .mobile-phone__title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--ds-text-primary);
      }

      .mobile-phone__topbar--dark .mobile-phone__title {
        color: white;
      }

      .mobile-phone__badge {
        font-size: 0.62rem;
        font-weight: 700;
        padding: 0.2rem 0.5rem;
        border-radius: 999px;
        background: var(--ds-bg-sunken);
        color: var(--ds-primary);
      }

      .mobile-phone__badge--dark {
        background: color-mix(in srgb, white 10%, transparent);
        color: white;
      }

      .mobile-phone__body {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.9rem;
      }

      .mobile-phone__hero-card,
      .mobile-phone__task-card,
      .mobile-phone__nav-card {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 0.9rem;
        border-radius: 0.95rem;
        background: color-mix(
          in srgb,
          var(--ds-bg-surface) 90%,
          var(--ds-bg-elevated)
        );
        border: 1px solid
          color-mix(in srgb, var(--ds-text-primary) 8%, transparent);
      }

      .mobile-phone__hero-card strong,
      .mobile-phone__task-card strong,
      .mobile-phone__nav-card strong,
      .mobile-phone__mini-item strong {
        color: var(--ds-text-primary);
      }

      .mobile-phone__hero-card span,
      .mobile-phone__nav-card span,
      .mobile-phone__mini-item span,
      .mobile-phone__task-head span {
        color: var(--ds-text-secondary);
      }

      .mobile-phone__hero-label {
        font-size: 0.62rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--ds-primary);
      }

      .mobile-phone__cta-stack {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .mobile-phone__micro-stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.45rem;
      }

      .mobile-phone__micro-stat {
        display: grid;
        gap: 0.2rem;
        padding: 0.7rem 0.75rem;
        border-radius: 0.8rem;
        background: color-mix(
          in srgb,
          var(--ds-primary) 7%,
          var(--ds-bg-surface)
        );
        border: 1px solid color-mix(in srgb, var(--ds-primary) 12%, transparent);
      }

      .mobile-phone__micro-stat span {
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ds-text-secondary);
      }

      .mobile-phone__micro-stat strong {
        color: var(--ds-text-primary);
      }

      .mobile-phone__cta {
        border: none;
        border-radius: 0.8rem;
        padding: 0.75rem 0.9rem;
        font-weight: 700;
        font-size: 0.78rem;
        cursor: pointer;
      }

      .mobile-phone__cta--primary {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
      }

      .mobile-phone__cta--secondary {
        background: var(--ds-bg-sunken);
        color: var(--ds-primary);
      }

      .mobile-phone__mini-list {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }

      .mobile-phone__mini-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        padding: 0.7rem 0.85rem;
        border-radius: 0.8rem;
        background: color-mix(
          in srgb,
          var(--ds-bg-elevated) 82%,
          var(--ds-bg-surface)
        );
      }

      .mobile-phone__stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.6rem;
      }

      .mobile-phone__stat-card {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.85rem;
        border-radius: 0.9rem;
        background: color-mix(
          in srgb,
          var(--ds-bg-elevated) 92%,
          var(--ds-bg-surface)
        );
        border: 1px solid
          color-mix(in srgb, var(--ds-text-primary) 8%, transparent);
      }

      .mobile-phone__stat-card span {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--ds-text-secondary);
      }

      .mobile-phone__stat-card strong {
        font-size: 1.2rem;
        color: var(--ds-text-primary);
      }

      .mobile-phone__stat-card--accent {
        background: var(--ds-primary);
        border-color: var(--ds-primary);
      }

      .mobile-phone__stat-card--accent span,
      .mobile-phone__stat-card--accent strong {
        color: var(--ds-on-primary);
      }

      .mobile-phone__task-head,
      .mobile-phone__task-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }

      .mobile-phone__pill {
        font-size: 0.62rem;
        font-weight: 700;
        padding: 0.2rem 0.45rem;
        border-radius: 999px;
        background: var(--ds-warning-light, #fef3c7);
        color: var(--ds-warning);
      }

      .mobile-phone__pill--muted {
        background: var(--ds-bg-sunken);
        color: var(--ds-text-secondary);
      }

      .mobile-phone__dark-panel {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.95rem;
        border-radius: 0.95rem;
        background: color-mix(in srgb, white 6%, transparent);
        border: 1px solid color-mix(in srgb, white 10%, transparent);
      }

      .mobile-phone__dark-row,
      .mobile-phone__dark-meter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        color: white;
      }

      .mobile-phone__dark-track {
        width: 5.4rem;
        height: 0.38rem;
        background: color-mix(in srgb, white 12%, transparent);
        border-radius: 999px;
        overflow: hidden;
      }

      .mobile-phone__dark-fill {
        width: 78%;
        height: 100%;
        background: linear-gradient(90deg, var(--ds-primary) 0%, #7fb1ff 100%);
      }

      .mobile-phone__dark-actions {
        display: flex;
        gap: 0.45rem;
        flex-wrap: wrap;
      }

      .mobile-phone__dark-list {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        padding: 0.7rem 0.8rem;
        border-radius: 0.85rem;
        background: color-mix(in srgb, white 5%, transparent);
        border: 1px solid color-mix(in srgb, white 8%, transparent);
      }

      .mobile-phone__icon-chip {
        border: 1px solid color-mix(in srgb, white 10%, transparent);
        background: color-mix(in srgb, white 6%, transparent);
        color: white;
        border-radius: 999px;
        padding: 0.45rem 0.7rem;
        font-size: 0.68rem;
        font-weight: 700;
      }

      .mobile-phone__tabs {
        display: flex;
        gap: 0.35rem;
        padding: 0.25rem;
        background: var(--ds-bg-sunken);
        border-radius: 0.8rem;
      }

      .mobile-phone__tabs--subtle {
        background: color-mix(
          in srgb,
          var(--ds-primary) 6%,
          var(--ds-bg-surface)
        );
      }

      .mobile-phone__tab {
        flex: 1;
        text-align: center;
        padding: 0.55rem 0.35rem;
        border-radius: 0.65rem;
        font-size: 0.68rem;
        font-weight: 700;
        color: var(--ds-text-secondary);
      }

      .mobile-phone__tab--active {
        background: var(--ds-bg-surface);
        color: var(--ds-primary);
      }

      .mobile-block {
        background: var(--ds-bg-elevated);
        border: 1px solid
          color-mix(in srgb, var(--ds-text-secondary) 20%, transparent);
        border-radius: 1rem;
        padding: 0.85rem;
      }

      .mobile-block__label {
        color: var(--ds-text-secondary);
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
        border: 1px solid
          color-mix(in srgb, var(--ds-text-secondary) 22%, transparent);
        border-radius: 1rem;
        background: linear-gradient(
          180deg,
          var(--ds-bg-surface) 0%,
          var(--ds-bg-elevated) 100%
        );
        box-shadow: inset 0 1px 0 color-mix(in srgb, white 90%, transparent);
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

      /* -------------------- CARDS -------------------- */
      .ds-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
      }
      .ds-card--image {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      .ds-card__img {
        border-radius: 12px 12px 0 0;
      }
      .ds-card__body {
        padding: 1rem;
      }
      .ds-card__row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.25rem;
      }
      .ds-card__title {
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
        margin: 0;
      }
      .ds-card__desc {
        font-size: 0.82rem;
        color: #64748b;
        margin: 0.25rem 0;
        line-height: 1.5;
      }
      .ds-card__tags {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }
      .ds-card--profile {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
      }
      .ds-card__profile-info {
        flex: 1;
      }
      .ds-card--info {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background: #f5f3f5;
        border-left: 4px solid #00050e;
        border-radius: 8px;
      }
      .ds-card__info-icon {
        color: #00050e;
        font-size: 1.25rem;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .ds-card__info-label {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #00050e;
        display: block;
        margin-bottom: 2px;
      }
      .ds-card--action {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
      }
      .ds-card__actions {
        display: flex;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
      }
      .ds-metric-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
      .ds-metric {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 0.75rem;
      }
      .ds-metric--accent {
        background: #00050e;
        border-color: #00050e;
      }
      .ds-metric--accent .ds-metric__label,
      .ds-metric--accent .ds-metric__value {
        color: #fff;
      }
      .ds-metric--accent .ds-metric__icon {
        color: #b5c8e3;
      }
      .ds-metric__icon {
        font-size: 1.25rem;
        color: #00050e;
        display: block;
        margin-bottom: 0.25rem;
      }
      .ds-metric__label {
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        display: block;
      }
      .ds-metric__value {
        font-size: 1.1rem;
        font-weight: 700;
        color: #0f172a;
      }

      /* -------------------- CHIPS -------------------- */
      .ds-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .ds-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 500;
      }
      .ds-chip--selected {
        background: #e9e7e9;
        color: #00050e;
      }
      .ds-chip--input {
        background: #f5f3f5;
        color: #0f172a;
        border: 1px solid #c4c6cd;
      }
      .ds-chip--suggestion {
        background: #fff;
        color: #00050e;
        border: 1px solid #00050e;
      }
      .ds-chip__icon,
      .ds-chip__close {
        font-size: 1rem;
      }
      .ds-chip__close {
        cursor: pointer;
        color: #64748b;
      }

      /* -------------------- BADGES -------------------- */
      .ds-badge-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .ds-badge-icon {
        position: relative;
        display: inline-flex;
        padding: 0.5rem;
        background: #f5f3f5;
        border-radius: 8px;
      }
      .ds-badge-icon .material-symbols-outlined {
        font-size: 1.25rem;
        color: #0f172a;
      }
      .ds-badge-count {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ba1a1a;
        color: #fff;
        font-size: 0.6rem;
        width: 1.25rem;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 2px solid #fff;
        font-weight: 700;
      }
      .ds-badge-dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 0.5rem;
        height: 0.5rem;
        background: #00050e;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      .ds-badge-label {
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        font-size: 0.72rem;
        font-weight: 600;
        background: #d0e1fb;
        color: #54647a;
      }
      .ds-badge-label--high {
        background: #ffdad6;
        color: #93000a;
      }

      /* -------------------- AVATARS -------------------- */
      .ds-avatar-row {
        display: flex;
        align-items: flex-end;
        gap: 0.75rem;
      }
      .ds-avatar {
        position: relative;
        width: 48px;
        height: 48px;
      }
      .ds-avatar--md {
        width: 40px;
        height: 40px;
      }
      .ds-avatar__img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        font-size: 0.9rem;
      }
      .ds-avatar__status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      .ds-avatar__status--online {
        background: #22c55e;
      }
      .ds-avatar-stack {
        display: flex;
      }
      .ds-avatar-stack__item {
        margin-left: -8px;
      }
      .ds-avatar-stack__item:first-child {
        margin-left: 0;
      }
      .ds-avatar-stack__more {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #e0e3e5;
        border: 2px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        font-weight: 700;
        color: #424656;
      }

      /* -------------------- ALERTS -------------------- */
      .ds-alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 10px;
        font-size: 0.82rem;
      }
      .ds-alert--success {
        background: #e8f5e9;
        border: 1px solid #a5d6a7;
        color: #1b5e20;
      }
      .ds-alert--warning {
        background: #fffde7;
        border: 1px solid #fff59d;
        color: #f57f17;
      }
      .ds-alert--error {
        background: #ffdad6;
        border: 1px solid #ef9a9a;
        color: #93000a;
      }
      .ds-alert__icon {
        font-size: 1.25rem;
        flex-shrink: 0;
      }
      .ds-alert--success .ds-alert__icon {
        color: #2e7d32;
      }
      .ds-alert--warning .ds-alert__icon {
        color: #fbc02d;
      }
      .ds-alert--error .ds-alert__icon {
        color: #ba1a1a;
      }
      .ds-alert__text {
        line-height: 1.4;
      }

      /* -------------------- PROGRESS -------------------- */
      .ds-progress-row {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }
      .ds-progress-label {
        display: block;
        font-size: 0.7rem;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .ds-progress-bar {
        width: 100%;
        height: 8px;
        background: #e0e3e5;
        border-radius: 999px;
        overflow: hidden;
        min-width: 100px;
        margin-top: 0.25rem;
      }
      .ds-progress-bar__fill {
        height: 100%;
        background: #00050e;
        border-radius: 999px;
      }
      .ds-progress-circle {
        display: block;
      }
      .ds-progress-circle__bg {
        stroke: #e0e3e5;
      }
      .ds-progress-circle__fg {
        stroke: #00050e;
      }

      /* -------------------- SWITCHES -------------------- */
      .ds-switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ds-switch-label {
        font-size: 0.9rem;
        color: #0f172a;
      }
      .ds-switch-label--muted {
        color: #94a3b8;
      }
      .ds-switch {
        position: relative;
        display: inline-flex;
        width: 44px;
        height: 26px;
        cursor: pointer;
      }
      .ds-switch__input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      .ds-switch__slider {
        position: absolute;
        inset: 0;
        background: #cbd5e1;
        border-radius: 999px;
        transition: 200ms;
      }
      .ds-switch__slider::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 50%;
        transition: 200ms;
      }
      .ds-switch__input:checked + .ds-switch__slider {
        background: #00050e;
      }
      .ds-switch__input:checked + .ds-switch__slider::after {
        transform: translateX(18px);
      }

      /* -------------------- CHECKBOXES & RADIOS -------------------- */
      .ds-selection-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .ds-checkbox,
      .ds-radio {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        margin-bottom: 0.35rem;
      }
      .ds-checkbox__input,
      .ds-radio__input {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: #00050e;
      }
      .ds-checkbox__label,
      .ds-radio__label {
        font-size: 0.88rem;
        color: #0f172a;
      }
      .ds-radio-row {
        display: flex;
        gap: 1rem;
      }
      .ds-radio--inline {
        margin-bottom: 0;
      }

      /* -------------------- SLIDERS -------------------- */
      .ds-slider-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 0.85rem;
      }
      .ds-slider-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.35rem;
      }
      .ds-slider-label {
        font-size: 0.8rem;
        color: #64748b;
        font-weight: 500;
      }
      .ds-slider-value {
        font-size: 0.8rem;
        color: #00050e;
        font-weight: 700;
      }
      .ds-slider {
        width: 100%;
        height: 6px;
        appearance: none;
        background: #e0e3e5;
        border-radius: 999px;
        outline: none;
        accent-color: #00050e;
      }
      .ds-slider::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #00050e;
        cursor: pointer;
      }
      .ds-range-track {
        position: relative;
        height: 6px;
        background: #e0e3e5;
        border-radius: 999px;
        margin: 0.75rem 0 0.35rem;
      }
      .ds-range-track__fill {
        position: absolute;
        height: 100%;
        background: #00050e;
        border-radius: 999px;
      }
      .ds-range-thumb {
        position: absolute;
        top: -8px;
        width: 22px;
        height: 22px;
        background: #fff;
        border: 2px solid #00050e;
        border-radius: 50%;
        transform: translateX(-50%);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      }
      .ds-range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.65rem;
        color: #94a3b8;
        font-weight: 600;
      }

      /* -------------------- BUTTONS -------------------- */
      .ds-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: all 150ms;
      }
      .ds-btn--primary {
        background: #00050e;
        color: #fff;
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .ds-btn--primary:hover {
        opacity: 0.9;
      }
      .ds-btn--outline {
        background: transparent;
        color: #00050e;
        border: 1px solid #00050e;
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .ds-btn--sm {
        padding: 0.4rem 0.85rem;
        font-size: 0.78rem;
        border-radius: 8px;
      }
      .ds-btn--block {
        flex: 1;
      }
      .material-symbols-outlined {
        font-variation-settings:
          "FILL" 0,
          "wght" 400,
          "GRAD" 0,
          "opsz" 24;
        vertical-align: middle;
      }
      .ds-icon-btn {
        cursor: pointer;
        color: #64748b;
        padding: 4px;
        border-radius: 4px;
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
