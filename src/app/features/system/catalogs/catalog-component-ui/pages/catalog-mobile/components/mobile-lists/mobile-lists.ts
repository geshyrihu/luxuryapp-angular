import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonBadge, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonReorder, IonReorderGroup } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { createOutline, trashOutline } from "ionicons/icons";

@Component({
  selector: "app-mobile-lists",
  standalone: true,
  imports: [CommonModule, IonBadge, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonReorder, IonReorderGroup],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Ionic List Patterns</div>
      <div class="mobile-card-body flex flex-column gap-4">
        <div>
          <div class="font-bold text-sm mb-2">Sliding Items (Swipe Actions)</div>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-item-sliding>
              <ion-item>
                <ion-label>
                  <strong>Solicitud de Compra</strong>
                  <p class="text-xs text-secondary">SC-2026-041</p>
                </ion-label>
                <ion-badge color="warning" slot="end">Pendiente</ion-badge>
              </ion-item>
              <ion-item-options side="start">
                <ion-item-option color="primary" (click)="onEdit()">
                  <ion-icon slot="icon-only" name="create-outline" />
                </ion-item-option>
              </ion-item-options>
              <ion-item-options side="end">
                <ion-item-option color="danger" (click)="onDelete()">
                  <ion-icon slot="icon-only" name="trash-outline" />
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>

            <ion-item-sliding>
              <ion-item>
                <ion-label>
                  <strong>Reporte de Inspección</strong>
                  <p class="text-xs text-secondary">RI-2026-009</p>
                </ion-label>
                <ion-badge color="success" slot="end">Cerrado</ion-badge>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option color="danger">
                  <ion-icon slot="icon-only" name="trash-outline" />
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </ion-list>
        </div>

        <div>
          <div class="font-bold text-sm mb-2">Reorderable List</div>
          <ion-list lines="full" style="border:1px solid var(--ds-border,#e2e8f0);border-radius:12px;overflow:hidden;">
            <ion-reorder-group [disabled]="false" (ionItemReorder)="onReorder($event)">
              <ion-item>
                <ion-label>Item 1</ion-label>
                <ion-reorder slot="end" />
              </ion-item>
              <ion-item>
                <ion-label>Item 2</ion-label>
                <ion-reorder slot="end" />
              </ion-item>
              <ion-item>
                <ion-label>Item 3</ion-label>
                <ion-reorder slot="end" />
              </ion-item>
            </ion-reorder-group>
          </ion-list>
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
export class MobileLists {
  onEdit(): void {
    console.log("Edit clicked");
  }

  onDelete(): void {
    console.log("Delete clicked");
  }

  onReorder(event: CustomEvent): void {
    event.detail.complete();
  }

  constructor() {
    addIcons({ createOutline, trashOutline });
  }
}
