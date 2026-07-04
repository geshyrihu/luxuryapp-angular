import { Directive, input, model } from "@angular/core";

/**
 * Base compartida de Slider.
 *  - web:     `app-slider`  (PrimeNG p-slider)
 *  - mobile:  `ili-slider`  (ion-range, con dualKnobs para rango)
 *  - wrapper: `lx-slider`   (auto runtime)
 */
@Directive()
export abstract class SliderBase {
  value = model<number | [number, number]>(0);

  label = input<string>("");
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  range = input<boolean>(false);
  disabled = input<boolean>(false);
  showValue = input<boolean>(true);
  prefix = input<string>("");
  suffix = input<string>("");

  singleDisplay(): string {
    const v = this.value();
    return typeof v === "number" ? String(v) : "";
  }

  rangeDisplay(): string {
    const v = this.value();
    return Array.isArray(v) ? `${v[0]} – ${v[1]}` : "";
  }
}
