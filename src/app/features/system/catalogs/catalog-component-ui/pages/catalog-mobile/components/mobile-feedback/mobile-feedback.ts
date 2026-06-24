import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonProgressBar, IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-feedback",
  standalone: true,
  imports: [CommonModule, IonSpinner, IonProgressBar],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Feedback & Spinners</div>
      <div class="mobile-card-body">
        <div class="flex gap-4 align-items-center flex-wrap">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <ion-spinner name="dots" color="secondary"></ion-spinner>
          <ion-spinner name="lines" color="success"></ion-spinner>
          <div class="flex-grow-1" style="min-width:120px">
            <ion-progress-bar type="indeterminate"></ion-progress-bar>
          </div>
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
export class MobileFeedback {}
