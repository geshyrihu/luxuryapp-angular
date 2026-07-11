import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";

@Component({
  imports: [NgTemplateOutlet],
  selector: "app-divider",

  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    <div
      class="app-divider"
      [class.app-divider-vertical]="layout() === 'vertical'"
      role="separator"
    >
      @if (layout() !== "vertical") {
        <span class="app-divider-content"><ng-container [ngTemplateOutlet]="projected" /></span>
      } @else {
        <ng-container [ngTemplateOutlet]="projected" />
      }
    </div>
  `,
  styles: [
    `
      .app-divider {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0.5rem 0;
      }
      .app-divider::before,
      .app-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--ds-border, #d7dbe3);
      }
      .app-divider-content {
        padding: 0 0.5rem;
      }
      .app-divider-vertical {
        flex-direction: column;
        width: 1px;
        height: 100%;
        margin: 0 0.5rem;
      }
      .app-divider-vertical::before,
      .app-divider-vertical::after {
        width: 1px;
        flex: 1;
        background: var(--ds-border, #d7dbe3);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppDivider extends DividerBase {}
