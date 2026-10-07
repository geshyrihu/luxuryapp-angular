import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { DividerBase } from "@ui/core/divider.base";

@Component({
  imports: [NgTemplateOutlet],
  selector: "lux-divider-mobile",
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    <div
      class="lux-divider-mobile"
      [class.lux-divider-mobile-vertical]="layout() === 'vertical'"
      role="separator"
    >
      @if (layout() !== "vertical") {
        <span class="lux-divider-mobile-content"
          ><ng-container [ngTemplateOutlet]="projected"
        /></span>
      } @else {
        <ng-container [ngTemplateOutlet]="projected" />
      }
    </div>
  `,
  styles: [
    `
      .lux-divider-mobile {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0.5rem 0;
      }
      .lux-divider-mobile::before,
      .lux-divider-mobile::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--ds-border);
      }
      .lux-divider-mobile-content {
        padding: 0 0.5rem;
      }
      .lux-divider-mobile-vertical {
        flex-direction: column;
        width: 1px;
        height: 100%;
        margin: 0 0.5rem;
      }
      .lux-divider-mobile-vertical::before,
      .lux-divider-mobile-vertical::after {
        width: 1px;
        flex: 1;
        background: var(--ds-border);
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliDivider extends DividerBase {}
