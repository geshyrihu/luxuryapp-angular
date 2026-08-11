import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { CardBase } from "@ui/base/card.base";

@Component({
  selector: "ili-card",

  imports: [NgTemplateOutlet],
  template: `
    <section class="ili-card" [class.ili-card-elevated]="elevated()">
      @if (headerTemplate()) {
        <div class="ili-card-header-tpl">
          <ng-container [ngTemplateOutlet]="headerTemplate() ?? null" />
        </div>
      } @else if (header() || subheader()) {
        <header class="ili-card-header">
          @if (header()) {
            <div class="ili-card-title">{{ header() }}</div>
          }
          @if (subheader()) {
            <div class="ili-card-subtitle">{{ subheader() }}</div>
          }
        </header>
      }
      <div class="ili-card-body" [class.ili-card-body-unpadded]="!padded()">
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
          <div class="ili-card-footer-tpl">
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
      .ili-card {
        display: block;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        overflow: hidden;
      }
      .ili-card-elevated {
        box-shadow: var(--ds-shadow-2);
      }
      .ili-card-header {
        padding: var(--ds-space-lg) var(--ds-space-lg) 0;
      }
      .ili-card-title {
        font-size: 0.98rem;
        font-weight: 700;
        color: var(--ds-text-primary);
        line-height: 1.3;
      }
      .ili-card-subtitle {
        margin-top: 0.25rem;
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
        line-height: 1.4;
      }
      .ili-card-body {
        padding: var(--ds-space-lg);
      }
      .ili-card-body-unpadded {
        padding: 0;
      }
      .ili-card-footer-tpl {
        margin-top: var(--ds-space-lg);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileCard extends CardBase {}
