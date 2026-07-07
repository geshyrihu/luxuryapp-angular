import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { AppIcon } from "../../../shared/app-icon/app-icon.component";

@Component({
  selector: "web-input-search",
  standalone: true,
  imports: [IconFieldModule, InputIconModule, InputTextModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p-iconfield iconPosition="left" fluid>
      <p-inputicon>
        <app-icon icon="mdi:magnify" />
      </p-inputicon>

      <input
        pInputText
        type="text"
        (input)="onInput($event)"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        fluid
        class="text-xs"
      />
    </p-iconfield>
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
