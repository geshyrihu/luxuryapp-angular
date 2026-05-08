import { Component, input, output } from "@angular/core";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";

/**
 * 🔍 CUSTOM SEARCH INPUT
 * -------------------------------------------------------------------------
 * Barra de búsqueda reutilizable con icono integrado.
 * Emite valores en tiempo real (debounce recomendado en el padre).
 */
@Component({
  selector: "custom-search-input-signal",
  imports: [IconFieldModule, InputIconModule, InputTextModule],
  template: `
    <p-iconfield iconPosition="left" fluid>
      <p-inputicon>
        <i class="pi pi-search"></i>
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
