import { Component, input } from "@angular/core";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonList,
  IonPopover,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { ellipsisVertical } from "ionicons/icons";
import { ButtonModule } from "primeng/button";
import { PopoverModule } from "primeng/popover";

/**
 * 🍔 ACTION MENU
 * -------------------------------------------------------------------------
 * Menú contextual versátil.
 * Se adapta como un camaleón: Popover de Ionic en móvil 📱, Popover de PrimeNG en escritorio 🖥️.
 * ¡Lo mejor de dos mundos!
 */
@Component({
  selector: "app-action-menu",
  imports: [
    PopoverModule,
    ButtonModule,
    IonButton,
    IonIcon,
    IonPopover,
    IonContent,
    IonList,
  ],
  template: `
    @if (mobileMode()) {
      <!-- 📱 MODO MÓVIL (IONIC) -->
      <ion-button fill="clear" (click)="presentPopover($event)">
        <ion-icon slot="icon-only" name="ellipsis-vertical"></ion-icon>
      </ion-button>
      <ion-popover
        [isOpen]="isOpen"
        [event]="popoverEvent"
        (didDismiss)="isOpen = false"
        dismissOnSelect="true"
        side="bottom"
        alignment="end"
      >
        <ng-template>
          <ion-content class="ion-no-padding">
            <ion-list
              lines="none"
              class="ion-no-padding"
              style="min-width: 150px;"
            >
              <ng-content></ng-content>
            </ion-list>
          </ion-content>
        </ng-template>
      </ion-popover>
    } @else {
      <!-- 🖥️ MODO ESCRITORIO (PRIMENG) -->
      <div class="action-menu">
        <button
          pButton
          type="button"
          icon="icon icon-pi-ellipsis-v"
          class="p-button-rounded p-button-text action-menu-button"
          (click)="popover.toggle($event)"
        ></button>

        <p-popover #popover appendTo="body">
          <div class="menu-container">
            <ng-content></ng-content>
          </div>
        </p-popover>
      </div>
    }
  `,
  styles: [
    `
      .menu-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
        min-width: 150px;
      }

      .menu-container ::ng-deep button {
        width: 100%;
        justify-content: flex-start;
      }
    `,
  ],
})
export class ActionMenu {
  // <--- Inputs --->
  mobileMode = input<boolean>(false);

  isOpen = false;
  popoverEvent: any;

  constructor() {
    addIcons({ ellipsisVertical });
  }

  presentPopover(e: Event) {
    e.stopPropagation();
    this.popoverEvent = e;
    this.isOpen = true;
  }
}
