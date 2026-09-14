import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import {
  SelectButtonBase,
  SelectButtonOption,
} from "@ui/base/select-button.base";

@Component({
  selector: "app-select-button",
  template: `
    <div
      class="btn-group"
      [class.btn-group-sm]="size() === 'small'"
      [class.btn-group-lg]="size() === 'large'"
      role="group"
    >
      @for (option of options(); track option.value) {
        <input
          type="radio"
          class="btn-check"
          [id]="inputId(option)"
          [checked]="option.value === value()"
          [disabled]="disabled() || !!option.disabled"
          (change)="onSelect(option.value)"
        />
        <label class="btn btn-outline-primary" [for]="inputId(option)">{{
          option.label
        }}</label>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSelectButton extends SelectButtonBase {
  private readonly instanceId = Math.random().toString(36).slice(2);

  protected inputId(option: SelectButtonOption): string {
    return `app-select-button-${this.instanceId}-${option.value}`;
  }

  protected onSelect(value: unknown): void {
    this.value.set(value);
  }
}
