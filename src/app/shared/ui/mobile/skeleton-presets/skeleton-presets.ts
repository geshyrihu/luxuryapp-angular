import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { IonSkeletonText } from "@ionic/angular/standalone";

export type SkeletonPresetType =
  "card" | "table" | "chart" | "form" | "avatar" | "list" | "stat";

@Component({
  selector: "ili-skeleton-presets",

  imports: [IonSkeletonText],
  template: `
    @switch (variant()) {
      @case ("card") {
        <div class="sk-card">
          <ion-skeleton-text
            [animated]="true"
            style="width: 100%; height: 120px; border-radius: 8px;"
          />
          <ion-skeleton-text
            [animated]="true"
            style="width: 70%; height: 16px; margin-top: 0.75rem;"
          />
          <ion-skeleton-text
            [animated]="true"
            style="width: 50%; height: 14px; margin-top: 0.5rem;"
          />
        </div>
      }
      @case ("table") {
        <div class="sk-table">
          <ion-skeleton-text
            [animated]="true"
            style="width: 100%; height: 40px; border-radius: 6px;"
          />
          @for (r of repeatRows(); track r) {
            <ion-skeleton-text
              [animated]="true"
              style="width: 100%; height: 32px; border-radius: 4px; margin-top: 0.5rem;"
            />
          }
        </div>
      }
      @case ("chart") {
        <div class="sk-chart">
          <ion-skeleton-text
            [animated]="true"
            style="width: 100%; height: {{
              chartHeight()
            }}; border-radius: 8px;"
          />
        </div>
      }
      @case ("form") {
        <div class="sk-form">
          @for (f of formFields(); track f) {
            <div class="sk-form-row">
              <ion-skeleton-text
                [animated]="true"
                style="width: 120px; height: 12px; border-radius: 4px;"
              />
              <ion-skeleton-text
                [animated]="true"
                style="width: 100%; height: 36px; border-radius: 6px; margin-top: 0.25rem;"
              />
            </div>
          }
          <ion-skeleton-text
            [animated]="true"
            style="width: 120px; height: 36px; border-radius: 6px; margin-top: 0.75rem;"
          />
        </div>
      }
      @case ("avatar") {
        <div class="sk-avatar-row">
          @for (a of repeatRows(); track a) {
            <div class="sk-avatar-item">
              <ion-skeleton-text
                [animated]="true"
                style="width: 40px; height: 40px; border-radius: 50%;"
              />
              <ion-skeleton-text
                [animated]="true"
                style="width: 60px; height: 12px; border-radius: 4px; margin-top: 0.25rem;"
              />
            </div>
          }
        </div>
      }
      @case ("list") {
        <div class="sk-list">
          @for (l of repeatRows(); track l) {
            <div class="sk-list-row">
              <ion-skeleton-text
                [animated]="true"
                style="width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;"
              />
              <div class="sk-list-text">
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 40%; height: 14px; border-radius: 4px;"
                />
                <ion-skeleton-text
                  [animated]="true"
                  style="width: 70%; height: 12px; border-radius: 4px; margin-top: 0.25rem;"
                />
              </div>
            </div>
          }
        </div>
      }
      @case ("stat") {
        <div class="sk-stat">
          <ion-skeleton-text
            [animated]="true"
            style="width: 80px; height: 12px; border-radius: 4px;"
          />
          <ion-skeleton-text
            [animated]="true"
            style="width: 60%; height: 28px; border-radius: 6px; margin-top: 0.5rem;"
          />
          <ion-skeleton-text
            [animated]="true"
            style="width: 100px; height: 12px; border-radius: 4px; margin-top: 0.5rem;"
          />
        </div>
      }
    }
  `,
  styles: [
    `
      .sk-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        padding: 1rem;
      }
      .sk-table,
      .sk-chart,
      .sk-form,
      .sk-list,
      .sk-stat {
        display: flex;
        flex-direction: column;
      }
      .sk-form-row {
        margin-bottom: 1rem;
      }
      .sk-avatar-row {
        display: flex;
        gap: 1.25rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .sk-avatar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .sk-list-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      .sk-list-text {
        flex: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileSkeletonPresets {
  variant = input.required<SkeletonPresetType>();
  rows = input<number>(4);
  fields = input<number>(3);
  chartHeight = input<string>("250px");

  repeatRows = () => Array.from({ length: this.rows() });
  formFields = () => Array.from({ length: this.fields() });
}
