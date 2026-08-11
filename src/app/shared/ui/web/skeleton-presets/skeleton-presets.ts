import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { SkeletonModule } from "primeng/skeleton";

export type SkeletonPresetType =
  "card" | "table" | "chart" | "form" | "avatar" | "list" | "stat";

@Component({
  selector: "web-skeleton-presets",

  imports: [SkeletonModule],
  template: `
    @switch (variant()) {
      @case ("card") {
        <div class="sk-card">
          <p-skeleton width="100%" height="120px" borderRadius="8px" />
          <p-skeleton width="70%" height="16px" styleClass="sk-mt-3" />
          <p-skeleton width="50%" height="14px" styleClass="sk-mt-2" />
        </div>
      }
      @case ("table") {
        <div class="sk-table">
          <p-skeleton width="100%" height="40px" borderRadius="6px" />
          @for (r of repeatRows(); track r) {
            <p-skeleton
              width="100%"
              height="32px"
              borderRadius="4px"
              styleClass="sk-mt-2"
            />
          }
        </div>
      }
      @case ("chart") {
        <div class="sk-chart">
          <p-skeleton
            width="100%"
            [height]="chartHeight()"
            borderRadius="8px"
          />
        </div>
      }
      @case ("form") {
        <div class="sk-form">
          @for (f of formFields(); track f) {
            <div class="sk-form-row">
              <p-skeleton width="120px" height="12px" borderRadius="4px" />
              <p-skeleton
                width="100%"
                height="36px"
                borderRadius="6px"
                styleClass="sk-mt-1"
              />
            </div>
          }
          <p-skeleton
            width="120px"
            height="36px"
            borderRadius="6px"
            styleClass="sk-mt-3"
          />
        </div>
      }
      @case ("avatar") {
        <div class="sk-avatar-row">
          @for (a of repeatRows(); track a) {
            <div class="sk-avatar-item">
              <p-skeleton shape="circle" width="40px" height="40px" />
              <p-skeleton
                width="60px"
                height="12px"
                borderRadius="4px"
                styleClass="sk-mt-1"
              />
            </div>
          }
        </div>
      }
      @case ("list") {
        <div class="sk-list">
          @for (l of repeatRows(); track l) {
            <div class="sk-list-row">
              <p-skeleton shape="circle" width="32px" height="32px" />
              <div class="sk-list-text">
                <p-skeleton width="40%" height="14px" borderRadius="4px" />
                <p-skeleton
                  width="70%"
                  height="12px"
                  borderRadius="4px"
                  styleClass="sk-mt-1"
                />
              </div>
            </div>
          }
        </div>
      }
      @case ("stat") {
        <div class="sk-stat">
          <p-skeleton width="80px" height="12px" borderRadius="4px" />
          <p-skeleton
            width="60%"
            height="28px"
            borderRadius="6px"
            styleClass="sk-mt-2"
          />
          <p-skeleton
            width="100px"
            height="12px"
            borderRadius="4px"
            styleClass="sk-mt-2"
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
      .sk-mt-1 {
        margin-top: 0.25rem;
      }
      .sk-mt-2 {
        margin-top: 0.5rem;
      }
      .sk-mt-3 {
        margin-top: 0.75rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class WebSkeletonPresets {
  variant = input.required<SkeletonPresetType>();
  rows = input<number>(4);
  fields = input<number>(3);
  chartHeight = input<string>("250px");

  repeatRows = () => Array.from({ length: this.rows() });
  formFields = () => Array.from({ length: this.fields() });
}
