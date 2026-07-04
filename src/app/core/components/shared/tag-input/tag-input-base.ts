import { Directive, input, model, output } from "@angular/core";

/**
 * Base compartida de TagInput (API + lógica de sugerencias/tags).
 *  - web:     `app-tag-input` (PrimeNG p-autocomplete)
 *  - mobile:  `ili-tag-input` (chips nativos con input táctil)
 *  - wrapper: `lx-tag-input`  (auto runtime)
 */
@Directive()
export abstract class TagInputBase {
  value = model<string[]>([]);
  label = input<string>("");
  hint = input<string>("");
  placeholder = input<string>("Escribe un tag...");
  disabled = input<boolean>(false);
  suggestions = input<string[]>([]);
  forceSelection = input<boolean>(false);

  tagAdded = output<string>();
  tagRemoved = output<string>();

  /** Usado por la versión web (p-autocomplete completeMethod). */
  filteredSuggestions: string[] = [];

  onSearch(event: { query: string }): void {
    const q = event.query.toLowerCase();
    const existing = this.value();
    this.filteredSuggestions = this.suggestions().filter(
      (s) => s.toLowerCase().includes(q) && !existing.includes(s),
    );
  }

  /** Sugerencias disponibles (no seleccionadas) — para la versión mobile. */
  availableSuggestions(query = ""): string[] {
    const q = query.toLowerCase();
    const existing = this.value();
    return this.suggestions().filter(
      (s) => s.toLowerCase().includes(q) && !existing.includes(s),
    );
  }

  addTag(raw: string): void {
    const tag = raw.trim();
    if (!tag || this.disabled()) return;
    if (this.forceSelection() && !this.suggestions().includes(tag)) return;
    if (this.value().includes(tag)) return;
    this.value.set([...this.value(), tag]);
    this.tagAdded.emit(tag);
  }

  removeTag(tag: string): void {
    if (this.disabled()) return;
    this.value.set(this.value().filter((t) => t !== tag));
    this.tagRemoved.emit(tag);
  }
}
