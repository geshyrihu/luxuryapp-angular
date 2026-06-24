import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import {
  IonAvatar,
  IonBadge,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-data",
  standalone: true,
  imports: [
    CommonModule,
    IonAvatar,
    IonBadge,
    IonChip,
    IonIcon,
    IonItem,
    IonLabel,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Data Display (Ionic)</div>
      <div class="mobile-card-body">
        <div class="flex flex-column gap-4">
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

          <ion-item lines="full">
            <ion-label>Tipo de Usuario</ion-label>
            <ion-badge color="primary" slot="end">Premium</ion-badge>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Último Acceso</ion-label>
            <span class="text-xs text-secondary" slot="end">15 Jun 2026</span>
          </ion-item>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileData {}
