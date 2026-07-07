import { Component, ViewEncapsulation, inject, DestroyRef } from "@angular/core";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonIcon } from "@ionic/angular/standalone";
import { ModalBase } from "@ui/base/modal.base";

@Component({
  selector: "ili-modal",
  standalone: true,
  imports: [IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonIcon],
  template: `
    <ion-modal
      [isOpen]="visible()"
      (didDismiss)="onDismiss()"
      [breakpoints]="[0, 0.5, 0.75, 0.95]"
      [initialBreakpoint]="0.75"
      handleBehavior="cycle"
    >
      <ng-template>
        <ion-header>
          <ion-toolbar>
            @if (closable()) {
              <ion-buttons slot="start">
                <ion-button (click)="onDismiss()">
                  <ion-icon name="close" slot="icon-only" />
                </ion-button>
              </ion-buttons>
            }
            <ion-title>{{ header() }}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ng-content />
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileModal extends ModalBase {}
