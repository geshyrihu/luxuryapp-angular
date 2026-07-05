import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonAccordion, IonAccordionGroup, IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonNote, IonRow, IonThumbnail } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { calendarOutline, mailOutline, notificationsOutline } from "ionicons/icons";
import { MOBILE_SHOWCASE_STYLES } from "../../../../../shared/mobile-showcase-styles";

@Component({
  selector: "app-mobile-data",
  standalone: true,
  imports: [CommonModule, IonAccordion, IonAccordionGroup, IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonNote, IonRow, IonThumbnail],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Data Display (Ionic)</div>
      <div class="mobile-card-body flex flex-column gap-4">

        <!-- --- CARDS --- -->
        <div>
          <div class="font-bold text-sm mb-2">Cards (DS patterns)</div>
          <div class="flex flex-column gap-3">
            <!-- Profile Card with Status -->
            <div class="ds-card ds-card--profile">
              <ion-avatar slot="start" class="ds-avatar-lg">
                <img src="assets/images/default-avatar.png" alt="avatar" />
              </ion-avatar>
              <div class="ds-card__profile-info">
                <span class="font-bold text-sm block">John Doe</span>
                <span class="text-xs text-secondary">Administrador</span>
              </div>
              <ion-badge color="success">Activo</ion-badge>
            </div>
            <!-- Info Card with Left Accent -->
            <div class="ds-card ds-card--info-accent">
              <div class="ds-card__icon-box">
                <ion-icon name="calendar-outline" class="text-primary" style="font-size:1.25rem;"></ion-icon>
              </div>
              <div>
                <span class="ds-card__info-label">Próximo Evento</span>
                <p class="text-sm m-0">Asamblea General é 15 Jun 10:00</p>
              </div>
            </div>
            <!-- Metric Card (Bento style) -->
            <div class="ds-metric-row">
              <div class="ds-metric-card">
                <span class="ds-metric-card__value">12</span>
                <span class="ds-metric-card__label">Activos</span>
              </div>
              <div class="ds-metric-card ds-metric-card--primary">
                <span class="ds-metric-card__value">4</span>
                <span class="ds-metric-card__label">Pendientes</span>
              </div>
              <div class="ds-metric-card">
                <span class="ds-metric-card__value">48</span>
                <span class="ds-metric-card__label">Completados</span>
              </div>
              <div class="ds-metric-card ds-metric-card--accent">
                <span class="ds-metric-card__value">98%</span>
                <span class="ds-metric-card__label">Eficiencia</span>
              </div>
            </div>
            <!-- Project Card with Progress -->
            <div class="ds-card ds-card--project">
              <div class="ds-card__project-header">
                <span class="font-bold text-sm">Auditoría Q3 2024</span>
                <span class="ds-chip-status ds-chip-status--active">ON TRACK</span>
              </div>
              <div class="ds-progress-compact">
                <div class="ds-progress-compact__header">
                  <span class="text-xs text-secondary">Progreso</span>
                  <span class="text-xs font-bold text-primary">68%</span>
                </div>
                <div class="ds-progress-compact__track">
                  <div class="ds-progress-compact__fill" style="width:68%;"></div>
                </div>
              </div>
              <div class="ds-card__project-footer">
                <div class="ds-avatar-stack-compact">
                  <div class="ds-avatar-mini ds-avatar-mini--primary">A</div>
                  <div class="ds-avatar-mini ds-avatar-mini--secondary">B</div>
                  <div class="ds-avatar-mini ds-avatar-mini--more">+3</div>
                </div>
                <span class="text-xs text-secondary">Vence en 12 días</span>
              </div>
            </div>
          </div>
        </div>

        <!-- --- CHIPS --- -->
        <div>
          <div class="font-bold text-sm mb-2">Chips (ion-chip)</div>
          <div class="flex align-items-center gap-2 flex-wrap">
            <ion-chip color="primary">
              <ion-icon name="mail-outline"></ion-icon>
              <ion-label>Correo</ion-label>
            </ion-chip>
            <ion-chip color="secondary">
              <ion-icon name="notifications-outline"></ion-icon>
              <ion-label>Notificaciones</ion-label>
            </ion-chip>
            <ion-badge color="danger">3</ion-badge>
          </div>
        </div>

        <!-- --- AVATARS --- -->
        <div>
          <div class="font-bold text-sm mb-2">Avatars (DS variants)</div>
          <div class="ds-avatar-bar">
            <div class="ds-avatar-status">
              <ion-avatar class="ds-avatar-md">
                <img src="assets/images/default-avatar.png" alt="avatar" />
              </ion-avatar>
              <span class="ds-avatar-status__dot ds-avatar-status__dot--online"></span>
            </div>
            <div class="ds-avatar-initials ds-avatar-initials--primary">JD</div>
            <div class="ds-avatar-stack">
              <div class="ds-avatar-stack__item ds-avatar-stack__item--primary">A</div>
              <div class="ds-avatar-stack__item ds-avatar-stack__item--secondary">B</div>
              <div class="ds-avatar-stack__item ds-avatar-stack__more">+4</div>
            </div>
          </div>
        </div>

        <!-- --- THUMBNAIL LIST --- -->
        <div>
          <div class="font-bold text-sm mb-2">Thumbnail List</div>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-item>
              <ion-thumbnail slot="start">
                <img src="assets/images/default-avatar.png" alt="thumb" />
              </ion-thumbnail>
              <ion-label>
                <strong>Documento 1</strong>
                <ion-note>PDF é 2.3 MB</ion-note>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-thumbnail slot="start">
                <img src="assets/images/default-avatar.png" alt="thumb" />
              </ion-thumbnail>
              <ion-label>
                <strong>Documento 2</strong>
                <ion-note>PDF é 1.1 MB</ion-note>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>

        <!-- --- ION-CARD --- -->
        <div>
          <div class="font-bold text-sm mb-2">ion-card</div>
          <ion-card style="margin:0;">
            <ion-card-header>
              <ion-card-title>Resumen del Cliente</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item lines="full" style="--padding-start:0;">
                <ion-label>Cliente</ion-label>
                <ion-badge color="primary" slot="end">Premium</ion-badge>
              </ion-item>
              <ion-item lines="full" style="--padding-start:0;">
                <ion-label>óltimo Acceso</ion-label>
                <span class="text-xs text-secondary" slot="end">15 Jun 2026</span>
              </ion-item>
              <ion-item lines="none" style="--padding-start:0;">
                <ion-label>Facturación</ion-label>
                <span class="text-xs font-bold" slot="end">$12,450.00</span>
              </ion-item>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- --- ACCORDION --- -->
        <div>
          <div class="font-bold text-sm mb-2">Accordion (ion-accordion-group)</div>
          <ion-accordion-group style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-accordion value="first">
              <ion-item slot="header" color="light">
                <ion-label>Datos Generales</ion-label>
              </ion-item>
              <div slot="content" style="padding:0.75rem 1rem;">
                <p class="text-sm m-0">Nombre: Juan García ó RFC: GACJ800101ABC</p>
              </div>
            </ion-accordion>
            <ion-accordion value="second">
              <ion-item slot="header" color="light">
                <ion-label>Domicilio Fiscal</ion-label>
              </ion-item>
              <div slot="content" style="padding:0.75rem 1rem;">
                <p class="text-sm m-0">Av. Reforma 1234, CDMX, CP 06600</p>
              </div>
            </ion-accordion>
            <ion-accordion value="third">
              <ion-item slot="header" color="light">
                <ion-label>Documentos</ion-label>
              </ion-item>
              <div slot="content" style="padding:0.75rem 1rem;">
                <p class="text-sm m-0">INE é Constancia de situación fiscal ó CURP</p>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </div>

        <!-- --- CALENDAR EVENTS --- -->
        <div>
          <div class="font-bold text-sm mb-2">Eventos de Calendario (patrón Google Calendar)</div>
          <p class="text-xs text-secondary mb-2">
            Lista de eventos usando <code>ion-item</code> + tonal color de estado.
          </p>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            @for (ev of calendarEvents; track ev.id) {
              <ion-item detail="false" class="ion-no-padding">
                <div slot="start" class="flex align-items-center justify-content-center flex-shrink-0 ml-3 mr-2 border-round-lg"
                     [style.background]="ev.own ? 'var(--ds-primary-50,#edf1ff)' : 'var(--ds-bg-elevated,#f4f5f8)'"
                     style="width:38px;height:38px;">
                  <ion-icon name="calendar-outline"
                            [style.color]="ev.own ? 'var(--ds-primary)' : 'var(--ds-text-muted)'">
                  </ion-icon>
                </div>
                <ion-label class="ion-text-wrap">
                  <h3 class="font-semibold m-0">{{ ev.title }}</h3>
                  <p class="text-xs m-0 mt-1" style="color:var(--ds-text-secondary);">{{ ev.date }} é {{ ev.guests }} invitados</p>
                </ion-label>
                <div slot="end" class="mr-3">
                  <span class="status-chip"
                        [style.background]="ev.statusBg"
                        [style.color]="ev.statusColor">
                    {{ ev.statusLabel }}
                  </span>
                </div>
              </ion-item>
            }
          </ion-list>
        </div>

        <!-- --- GRID --- -->
        <div>
          <div class="font-bold text-sm mb-2">Grid Layout (ion-grid)</div>
          <ion-grid style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;padding:0.5rem;">
            <ion-row>
              <ion-col size="6">
                <div style="background:var(--ds-primary-50,#edf1ff);border-radius:8px;padding:0.5rem;text-align:center;">
                  <div class="text-xs font-bold" style="color:var(--ds-primary);">col-6</div>
                  <div class="text-xs text-secondary">$14,200</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div style="background:var(--ds-primary-50,#edf1ff);border-radius:8px;padding:0.5rem;text-align:center;">
                  <div class="text-xs font-bold" style="color:var(--ds-primary);">col-6</div>
                  <div class="text-xs text-secondary">$8,900</div>
                </div>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="4">
                <div style="background:var(--ds-bg-elevated,#f4f5f8);border-radius:8px;padding:0.5rem;text-align:center;">
                  <div class="text-xs font-bold">col-4</div>
                </div>
              </ion-col>
              <ion-col size="4">
                <div style="background:var(--ds-bg-elevated,#f4f5f8);border-radius:8px;padding:0.5rem;text-align:center;">
                  <div class="text-xs font-bold">col-4</div>
                </div>
              </ion-col>
              <ion-col size="4">
                <div style="background:var(--ds-bg-elevated,#f4f5f8);border-radius:8px;padding:0.5rem;text-align:center;">
                  <div class="text-xs font-bold">col-4</div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
    </div>
  `,
  styles: [MOBILE_SHOWCASE_STYLES, `
    .status-chip { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; white-space: nowrap; }

    /* DS Cards */
    .ds-card--profile { display:flex; align-items:center; gap:0.75rem; padding:0.85rem; background:var(--ds-bg-surface); border:1px solid var(--ds-border); border-radius:12px; }
    .ds-card__profile-info { flex:1; }
    .ds-card--info-accent { display:flex; align-items:flex-start; gap:0.75rem; padding:0.85rem; background:var(--ds-bg-sunken); border-left:4px solid var(--ds-primary); border-radius:8px; }
    .ds-card__icon-box { flex-shrink:0; margin-top:2px; }
    .ds-card__info-label { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--ds-primary); display:block; margin-bottom:2px; }
    .ds-card--project { background:var(--ds-bg-surface); border:1px solid var(--ds-border); border-radius:12px; padding:0.85rem; }
    .ds-card__project-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; }
    .ds-card__project-footer { display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; }
    .ds-chip-status { font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; padding:2px 8px; border-radius:99px; }
    .ds-chip-status--active { background:var(--ds-info-light, #cae6ff); color:var(--ds-info, #002033); }

    /* Metric Row */
    .ds-metric-row { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
    .ds-metric-card { background:var(--ds-bg-elevated); border:1px solid var(--ds-border); border-radius:10px; padding:0.65rem; text-align:center; }
    .ds-metric-card--primary { background:var(--ds-primary); border-color:var(--ds-primary); }
    .ds-metric-card--primary .ds-metric-card__value,
    .ds-metric-card--primary .ds-metric-card__label { color:var(--ds-on-primary); }
    .ds-metric-card--accent { background:var(--ds-warning-light, #fef3c7); border-color:var(--ds-warning); }
    .ds-metric-card__value { font-size:1.25rem; font-weight:700; color:var(--ds-text-primary); display:block; }
    .ds-metric-card__label { font-size:0.65rem; font-weight:600; color:var(--ds-text-secondary); text-transform:uppercase; letter-spacing:0.04em; }

    /* Progress Compact */
    .ds-progress-compact { margin:0.5rem 0; }
    .ds-progress-compact__header { display:flex; justify-content:space-between; margin-bottom:0.25rem; }
    .ds-progress-compact__track { height:6px; background:var(--ds-border-strong); border-radius:999px; overflow:hidden; }
    .ds-progress-compact__fill { height:100%; background:var(--ds-primary); border-radius:999px; }

    /* Avatar Stack */
    .ds-avatar-bar { display:flex; align-items:center; gap:0.75rem; }
    .ds-avatar-status { position:relative; width:40px; height:40px; }
    .ds-avatar-md { width:40px; height:40px; }
    .ds-avatar-status__dot { position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; border:2px solid var(--ds-bg-surface); }
    .ds-avatar-status__dot--online { background:var(--ds-success); }
    .ds-avatar-initials { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; }
    .ds-avatar-initials--primary { background:var(--ds-primary-50, #f2f0f2); color:var(--ds-primary); }
    .ds-avatar-stack { display:flex; }
    .ds-avatar-stack__item { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:700; margin-left:-8px; border:2px solid var(--ds-bg-surface); }
    .ds-avatar-stack__item:first-child { margin-left:0; }
    .ds-avatar-stack__item--primary { background:var(--ds-primary-50, #f2f0f2); color:var(--ds-primary); }
    .ds-avatar-stack__item--secondary { background:var(--ds-primary-100, #b5c8e3); color:var(--ds-primary-dark, var(--ds-primary)); }
    .ds-avatar-stack__more { background:var(--ds-border-strong); color:var(--ds-text-secondary); }
    .ds-avatar-stack-compact { display:flex; }
    .ds-avatar-mini { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:700; margin-left:-6px; border:2px solid var(--ds-bg-surface); }
    .ds-avatar-mini:first-child { margin-left:0; }
    .ds-avatar-mini--primary { background:var(--ds-primary-100, #bad7ff); color:var(--ds-on-primary); }
    .ds-avatar-mini--secondary { background:var(--ds-primary-100, #b5c8e3); color:var(--ds-primary-dark, var(--ds-primary)); }
    .ds-avatar-mini--more { background:var(--ds-border-strong); color:var(--ds-text-secondary); }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileData {
  readonly calendarEvents = [
    { id: 1, title: "Junta Comité",       date: "10 Jun 19:00", guests: 4, own: true,  statusLabel: "Sincronizado",   statusBg: "var(--ds-success-light,#d1fae5)", statusColor: "var(--ds-success,#006837)" },
    { id: 2, title: "Asamblea General",   date: "15 Jun 10:00", guests: 12, own: true,  statusLabel: "Local (hist.)",  statusBg: "var(--ds-info-light,#cae6ff)",   statusColor: "var(--ds-info,#002033)" },
    { id: 3, title: "Reunión Proveedores",date: "20 Jun 09:00", guests: 2, own: false, statusLabel: "Solo local",      statusBg: "var(--ds-warning-light,#fef3c7)",statusColor: "var(--ds-warning,#b45309)" },
    { id: 4, title: "Comité Finanzas",    date: "28 Jun 11:00", guests: 5, own: true,  statusLabel: "Pendiente sync", statusBg: "var(--ds-bg-elevated,#f4f5f8)",  statusColor: "var(--ds-text-secondary,#64748b)" },
  ];

  constructor() {
    addIcons({ calendarOutline, mailOutline, notificationsOutline });
  }
}

