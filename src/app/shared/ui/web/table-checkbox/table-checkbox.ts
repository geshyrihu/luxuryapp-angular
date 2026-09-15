import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AbstractControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-table-checkbox",

  imports: [FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (control()) {
      <input
        type="checkbox"
        class="form-check-input"
        [disabled]="disabled()"
        [formControl]="control()"
        (change)="checkedChange.emit($any($event.target).checked)"
      />
    } @else {
      <input
        type="checkbox"
        class="form-check-input"
        [disabled]="disabled()"
        [ngModel]="checked()"
        (ngModelChange)="checkedChange.emit($event)"
      />
    }
  `,
  host: {
    class: "inline-flex align-items-center justify-content-center",
  },
})
export class TableCheckbox {
  checked = input(false);
  disabled = input(false);
  binary = input(true);
  value = input<any>(null);
  control = input<AbstractControl | null>(null);
  checkedChange = output<boolean>();
}
