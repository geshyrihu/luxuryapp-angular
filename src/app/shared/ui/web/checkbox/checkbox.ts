import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CheckboxBase } from "@ui/base/checkbox.base";
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: "app-checkbox",

  imports: [FormsModule, CheckboxModule],
  template: `
    <p-checkbox
      [binary]="binary()"
      [disabled]="disabled()"
      [inputId]="inputId()"
      [(ngModel)]="checked"
    />
    @if (label()) {
      <label [for]="inputId()" class="ml-2">{{ label() }}</label>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppCheckbox extends CheckboxBase {}
