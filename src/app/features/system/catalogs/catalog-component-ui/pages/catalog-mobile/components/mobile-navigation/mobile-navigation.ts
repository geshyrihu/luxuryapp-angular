import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-navigation",
  standalone: true,
  imports: [CommonModule, CardModule, IonFab, IonFabButton, IonIcon],
  template: `
    <p-card header="FAB Action">
      <div class="relative surface-100 border-round p-3" style="height: 60px;">
        <p class="m-0 text-xs text-secondary">
          El Floating Action Button (FAB) se sitúa en la esquina inferior derecha.
        </p>
        <ion-fab
          vertical="bottom"
          horizontal="end"
          style="position: absolute; bottom: 10px; right: 10px;"
        >
          <ion-fab-button size="small">
            <ion-icon name="add-outline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </div>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileNavigation {}
