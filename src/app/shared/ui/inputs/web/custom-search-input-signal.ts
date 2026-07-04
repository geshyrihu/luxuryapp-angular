import { Component, input, output } from "@angular/core";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
// import { AppIcon } from "../../app-icon/app-icon.component";

/**
 * 🔍 CUSTOM SEARCH INPUT
 * -------------------------------------------------------------------------
 * Barra de búsqueda reutilizable con icono integrado.
 * Emite valores en tiempo real (debounce recomendado en el padre).
 */
@Component({
  selector: "custom-search-input-signal",
  imports: [IconFieldModule, InputIconModule, InputTextModule, AppIcon],
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
export class CustomSearchInput {
  placeholder = input<string>("Buscar aquí...");
  disabled = input<boolean>(false);

  searchChange = output<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
