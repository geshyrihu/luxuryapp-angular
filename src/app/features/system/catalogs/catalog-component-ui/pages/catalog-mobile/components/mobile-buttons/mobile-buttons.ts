import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import {
  IonAvatar,
  IonBadge,
  IonChip,
  IonIcon,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import {
  IonButtonAdd,
  IonButtonDelete,
  IonButtonEdit,
  IonButtonSave,
} from "src/app/core/components/buttons/mobile";

@Component({
  selector: "app-mobile-buttons",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    TagModule,
    IonButtonAdd,
    IonButtonEdit,
    IonButtonDelete,
    IonButtonSave,
    IonList,
    IonLabel,
    IonAvatar,
    IonChip,
    IonBadge,
    IonIcon,
  ],
  template: `
    <p-card header="Ionic Custom Buttons">
      <div class="flex flex-column gap-4">
        <ion-list lines="none" class="bg-transparent">
          <ion-button-add label="Nuevo Registro" />
          <ion-button-edit label="Editar Perfil" />
          <ion-button-save label="Guardar" />
          <ion-button-delete label="Borrar Datos" />
        </ion-list>

        <p-divider></p-divider>

        <div class="flex align-items-center gap-3">
          <ion-avatar class="shadow-1">
            <img src="assets/images/default-avatar.png" alt="avatar" />
          </ion-avatar>
          <ion-chip color="primary">
            <ion-icon name="person-outline"></ion-icon>
            <ion-label>Usuario</ion-label>
          </ion-chip>
          <ion-badge color="success">Online</ion-badge>
        </div>
      </div>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileButtons {}
