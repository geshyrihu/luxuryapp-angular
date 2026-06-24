import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-navigation",
  standalone: true,
  imports: [CommonModule, IonFab, IonFabButton, IonIcon],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">FAB Action</div>
      <div class="mobile-card-body">
        <div style="position:relative;height:80px;background:var(--ds-bg-elevated,#f4f5f8);border-radius:var(--ds-radius-lg,8px);padding:0.75rem;">
          <p style="margin:0;font-size:var(--ds-font-size-table,0.875rem);color:var(--ds-text-muted);">
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
export class MobileNavigation {}
