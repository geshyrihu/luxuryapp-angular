import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckboxBase } from "@ui/base/checkbox.base";

@Component({
  selector: "app-checkbox",

  imports: [FormsModule],
  template: `
    <input
      type="checkbox"
      class="form-check-input"
      [disabled]="disabled()"
      [id]="inputId()"
      [(ngModel)]="checked"
    />
    @if (label()) {
      <label [for]="inputId()" class="ms-2">{{ label() }}</label>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppCheckbox extends CheckboxBase {}
