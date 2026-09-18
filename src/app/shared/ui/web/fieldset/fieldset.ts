import { ChangeDetectionStrategy, Component, ViewEncapsulation, linkedSignal } from "@angular/core";
import { FieldsetBase } from "@ui/base/fieldset.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-fieldset",
  imports: [AppIcon],
  template: `
    <fieldset class="app-fieldset">
      <legend
        class="app-fieldset-legend"
        [class.app-fieldset-legend-toggleable]="toggleable()"
        [attr.tabindex]="toggleable() ? 0 : null"
        [attr.role]="toggleable() ? 'button' : null"
        [attr.aria-expanded]="toggleable() ? !isCollapsed() : null"
        (click)="toggle()"
        (keydown.enter)="toggle()"
        (keydown.space)="$event.preventDefault(); toggle()"
      >
        @if (toggleable()) {
          <app-icon [icon]="isCollapsed() ? 'material-symbols-light:chevron-right' : 'material-symbols-light:expand-more'" />
        }
        {{ legend() }}
      </legend>
      @if (!isCollapsed()) { <div class="app-fieldset-content"><ng-content /></div> }
    </fieldset>
  `,
  styles: [`
    .app-fieldset { border: 1px solid var(--ds-border, #dee2e6); border-radius: var(--ds-radius, 0.375rem); padding: 0.75rem 1rem 1rem; margin: 0; }
    .app-fieldset-legend { display: inline-flex; align-items: center; gap: 0.25rem; width: auto; padding: 0 0.375rem; margin: 0 0 0.5rem -0.375rem; font-size: 0.9rem; font-weight: 600; }
    .app-fieldset-legend-toggleable { cursor: pointer; user-select: none; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppFieldset extends FieldsetBase {
  protected isCollapsed = linkedSignal(() => this.collapsed());

  protected toggle(): void {
    if (this.toggleable()) this.isCollapsed.update((value) => !value);
  }
}
