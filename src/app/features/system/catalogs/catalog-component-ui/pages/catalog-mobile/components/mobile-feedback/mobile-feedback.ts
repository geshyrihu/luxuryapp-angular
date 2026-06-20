import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { IonProgressBar, IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-feedback",
  standalone: true,
  imports: [CommonModule, CardModule, IonSpinner, IonProgressBar],
  template: `
    <p-card header="Feedback & Spinners">
      <div class="flex gap-4 align-items-center surface-100 p-3 border-round">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <ion-spinner name="dots" color="secondary"></ion-spinner>
        <ion-spinner name="lines" color="success"></ion-spinner>
        <div class="flex-grow-1">
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </div>
      </div>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileFeedback {}
