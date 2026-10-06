import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { CardBase } from "@ui/core/card.base";

@Component({
  selector: "lux-card-web",

  imports: [NgTemplateOutlet],
  template: `
    <section class="lux-card-web" [class.app-card-elevated]="elevated()">
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
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-card);
        overflow: hidden;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .app-card-elevated {
        box-shadow: var(--ds-shadow-sm);
        border-color: transparent;
      }
      .app-card-elevated:hover {
        box-shadow: var(--ds-shadow-md);
        transform: translateY(-2px);
      }
      .app-card-header {
        padding: 1.25rem 1.5rem 0;
      }
      .app-card-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--ds-text-primary);
        line-height: 1.3;
      }
      .app-card-subtitle {
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        line-height: 1.4;
      }
      .app-card-body {
        padding: 1.25rem 1.5rem;
        flex: 1;
      }
      .app-card-body-unpadded {
        padding: 0;
      }
      .app-card-footer-tpl {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--ds-border);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppCard extends CardBase {}
