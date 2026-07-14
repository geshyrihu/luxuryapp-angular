import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { CardBase } from "@ui/base/card.base";

@Component({
  selector: "app-card",

  imports: [NgTemplateOutlet],
  template: `
    <section class="app-card" [class.app-card-elevated]="elevated()">
      @if (headerTemplate()) {
        <div class="app-card-header-tpl">
          <ng-container [ngTemplateOutlet]="headerTemplate() ?? null" />
        </div>
      } @else if (header() || subheader()) {
        <header class="app-card-header">
          @if (header()) {
            <div class="app-card-title">{{ header() }}</div>
          }
          @if (subheader()) {
            <div class="app-card-subtitle">{{ subheader() }}</div>
          }
        </header>
      }
      <div class="app-card-body" [class.app-card-body-unpadded]="!padded()">
        @if (titleTemplate()) {
          <ng-container [ngTemplateOutlet]="titleTemplate() ?? null" />
        }
        @if (subtitleTemplate()) {
          <ng-container [ngTemplateOutlet]="subtitleTemplate() ?? null" />
        }
        @if (contentTemplate()) {
          <ng-container [ngTemplateOutlet]="contentTemplate() ?? null" />
        } @else {
          <ng-content />
        }
        @if (footerTemplate()) {
          <div class="app-card-footer-tpl">
            <ng-container [ngTemplateOutlet]="footerTemplate() ?? null" />
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .app-card {
        display: block;
        background: var(--ds-bg-surface, #ffffff);
        border: 1px solid var(--ds-border, #d7dbe3);
        border-radius: var(--ds-radius-lg, 12px);
        overflow: hidden;
      }
      .app-card-elevated {
        box-shadow: var(--ds-shadow-sm, 0 4px 16px rgba(15, 23, 42, 0.08));
      }
      .app-card-header {
        padding: 1rem 1rem 0;
      }
      .app-card-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--ds-text-primary, #1f2937);
        line-height: 1.3;
      }
      .app-card-subtitle {
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: var(--ds-text-secondary, #4d5562);
        line-height: 1.4;
      }
      .app-card-body {
        padding: 1rem;
      }
      .app-card-body-unpadded {
        padding: 0;
      }
      .app-card-footer-tpl {
        margin-top: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppCard extends CardBase {}
