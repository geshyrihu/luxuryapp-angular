import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { CardBase } from "@ui/core/card.base";

@Component({
  selector: "lux-card-mobile",

  imports: [NgTemplateOutlet],
  template: `
    <section class="lux-card-mobile" [class.lux-card-mobile-elevated]="elevated()">
      @if (headerTemplate()) {
        <div class="lux-card-mobile-header-tpl">
          <ng-container [ngTemplateOutlet]="headerTemplate() ?? null" />
        </div>
      } @else if (header() || subheader()) {
        <header class="lux-card-mobile-header">
          @if (header()) {
            <div class="lux-card-mobile-title">{{ header() }}</div>
          }
          @if (subheader()) {
            <div class="lux-card-mobile-subtitle">{{ subheader() }}</div>
          }
        </header>
      }
      <div class="lux-card-mobile-body" [class.lux-card-mobile-body-unpadded]="!padded()">
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
          <div class="lux-card-mobile-footer-tpl">
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
      .lux-card-mobile {
        display: block;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        overflow: hidden;
      }
      .lux-card-mobile-elevated {
        box-shadow: var(--ds-shadow-2);
      }
      .lux-card-mobile-header {
        padding: var(--ds-space-lg) var(--ds-space-lg) 0;
      }
      .lux-card-mobile-title {
        font-size: 0.98rem;
        font-weight: 700;
        color: var(--ds-text-primary);
        line-height: 1.3;
      }
      .lux-card-mobile-subtitle {
        margin-top: 0.25rem;
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
        line-height: 1.4;
      }
      .lux-card-mobile-body {
        padding: var(--ds-space-lg);
      }
      .lux-card-mobile-body-unpadded {
        padding: 0;
      }
      .lux-card-mobile-footer-tpl {
        margin-top: var(--ds-space-lg);
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileCard extends CardBase {}
