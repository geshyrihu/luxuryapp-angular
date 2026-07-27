import { Directive, input, model, output, computed } from "@angular/core";

/**
 * Base compartida de Rating (API + lógica de etiqueta/valor).
 *  - web:     `app-rating`  (PrimeNG p-rating)
 *  - mobile:  `ili-rating`  (estrellas táctiles con app-icon)
 *  - wrapper: `lx-rating`   (auto runtime)
 */
@Directive()
export abstract class RatingBase {
  value = model<number | undefined>(undefined);
  label = input<string>("");
  hint = input<string>("");
  stars = input<number>(5);
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  allowCancel = input<boolean>(true);
  showLabel = input<boolean>(true);

  changed = output<number | undefined>();

  private readonly labels = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];

  /** [1..stars] para renderizar estrellas en la versión mobile. */
  starRange = computed(() => {
    return Array.from({ length: this.stars() }, (_, i) => i + 1);
  });

  ratingLabel = computed(() => {
    const v = this.value();
    if (!v) return "";
    return this.stars() === 5 ? (this.labels[v] ?? String(v)) : `${v} / ${this.stars()}`;
  });

  setValue(n: number): void {
    if (this.readonly() || this.disabled()) return;
    this.value.set(n);
    this.changed.emit(n);
  }

  clear(): void {
    this.value.set(undefined);
    this.changed.emit(undefined);
  }
}
