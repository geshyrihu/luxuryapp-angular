import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "../../../primitives/app-icon/app-icon";

@Component({
  selector: "web-input-search",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="input-group input-group--prefix">
      <span class="input-prefix">
        <lux-icon-base icon="material-symbols-light:search" />
      </span>

      <input
        class="input input-sm"
        type="text"
        (input)="onInput($event)"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
      />
    </div>
  `,
})
export class WebInputSearch {
  placeholder = input<string>("Buscar aquí...");
  disabled = input<boolean>(false);
  searchChange = output<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
