import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: "app-table-checkbox",

  imports: [FormsModule, ReactiveFormsModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (control()) {
      <p-checkbox
        [binary]="binary()"
        [disabled]="disabled()"
        [value]="value()"
        [formControl]="control()"
        (onChange)="checkedChange.emit($event.checked)"
      />
    } @else {
      <p-checkbox
        [binary]="binary()"
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
