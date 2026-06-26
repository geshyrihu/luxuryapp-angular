import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonAccordion, IonAccordionGroup, IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonNote, IonRow, IonThumbnail } from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-data",
  standalone: true,
  imports: [CommonModule, IonAccordion, IonAccordionGroup, IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonNote, IonRow, IonThumbnail],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Data Display (Ionic)</div>
      <div class="mobile-card-body flex flex-column gap-4">
        <div>
          <div class="font-bold text-sm mb-2">Avatar + Badge + Chips</div>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center gap-3">
              <ion-avatar>
                <img src="assets/images/default-avatar.png" alt="avatar" />
              </ion-avatar>
              <div>
                <span class="font-bold text-sm block">John Doe</span>
                <span class="text-xs text-secondary">Administrador</span>
              </div>
              <ion-badge color="success">Activo</ion-badge>
            </div>

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
        </div>

        <div>
          <div class="font-bold text-sm mb-2">Thumbnail List</div>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-item>
              <ion-thumbnail slot="start">
                <img src="assets/images/default-avatar.png" alt="thumb" />
              </ion-thumbnail>
              <ion-label>
                <strong>Documento 1</strong>
                <ion-note>PDF • 2.3 MB</ion-note>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-thumbnail slot="start">
                <img src="assets/images/default-avatar.png" alt="thumb" />
              </ion-thumbnail>
              <ion-label>
                <strong>Documento 2</strong>
                <ion-note>PDF • 1.1 MB</ion-note>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>

        <div>
          <div class="font-bold text-sm mb-2">Card</div>
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
                <ion-label>Último Acceso</ion-label>
                <span class="text-xs text-secondary" slot="end">15 Jun 2026</span>
              </ion-item>
              <ion-item lines="none" style="--padding-start:0;">
                <ion-label>Facturación</ion-label>
                <span class="text-xs font-bold" slot="end">$12,450.00</span>
              </ion-item>
            </ion-card-content>
          </ion-card>
        </div>

        <div>
          <div class="font-bold text-sm mb-2">Accordion (ion-accordion-group)</div>
          <ion-accordion-group style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-accordion value="first">
              <ion-item slot="header" color="light">
                <ion-label>Datos Generales</ion-label>
              </ion-item>
              <div slot="content" style="padding:0.75rem 1rem;">
                <p class="text-sm m-0">Nombre: Juan García · RFC: GACJ800101ABC</p>
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
                <p class="text-sm m-0">INE · Constancia de situación fiscal · CURP</p>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </div>

        <div>
          <div class="font-bold text-sm mb-2">Eventos de Calendario (patrón Google Calendar)</div>
          <p class="text-xs text-secondary mb-2">
            Lista de eventos usando <code>ion-item</code> + tonal color de estado.
            Ícono primario = evento propio, gris = evento de otro condominio.
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
                  <p class="text-xs m-0 mt-1" style="color:var(--ds-text-secondary);">{{ ev.date }} · {{ ev.guests }} invitados</p>
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
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
    .status-chip { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 99px; white-space: nowrap; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileData {
  readonly calendarEvents = [
    { id: 1, title: "Junta Comité",       date: "10 Jun 19:00", guests: 4, own: true,  statusLabel: "Sincronizado",   statusBg: "var(--ds-success-light,#d1fae5)", statusColor: "var(--ds-success,#006837)" },
    { id: 2, title: "Asamblea General",   date: "15 Jun 10:00", guests: 12, own: true,  statusLabel: "Local (hist.)",  statusBg: "var(--ds-info-light,#afecff)",   statusColor: "var(--ds-info,#006477)" },
    { id: 3, title: "Reunión Proveedores",date: "20 Jun 09:00", guests: 2, own: false, statusLabel: "Solo local",      statusBg: "var(--ds-warning-light,#fef3c7)",statusColor: "var(--ds-warning,#b45309)" },
    { id: 4, title: "Comité Finanzas",    date: "28 Jun 11:00", guests: 5, own: true,  statusLabel: "Pendiente sync", statusBg: "var(--ds-bg-elevated,#f4f5f8)",  statusColor: "var(--ds-text-secondary,#64748b)" },
  ];
}
