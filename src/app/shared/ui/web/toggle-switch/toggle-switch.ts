import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ToggleSwitchBase } from "@ui/base/toggle-switch.base";

@Component({
  selector: "app-toggle-switch",
  template: `
    <div class="form-check form-switch app-toggle-switch">
      <input
        type="checkbox"
        role="switch"
        class="form-check-input"
        [id]="inputId()"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onToggle($event)"
      />
      @if (label()) {
        <label [for]="inputId()" class="form-check-label">{{
          label()
        }}</label>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppToggleSwitch extends ToggleSwitchBase {
  protected onToggle(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
