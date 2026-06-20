import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
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
    CardModule,
    IonAvatar,
    IonBadge,
    IonChip,
    IonIcon,
    IonItem,
    IonLabel,
  ],
  template: `
    <p-card header="Data Display (Ionic)">
      <div class="flex flex-column gap-4">
        <div class="flex align-items-center gap-3">
          <ion-avatar class="shadow-1">
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
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileData {}
