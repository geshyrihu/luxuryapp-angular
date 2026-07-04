import { Directive, input, model, output } from "@angular/core";

/**
 * Base compartida de ColorPicker.
 *  - web:     `app-color-picker` (PrimeNG p-colorpicker)
 *  - mobile:  `ili-color-picker` (input type=color nativo)
 *  - wrapper: `lx-color-picker`  (auto runtime)
 */
@Directive()
export abstract class ColorPickerBase {
  value = model<string>("");
  label = input<string>("");
  hint = input<string>("");
  format = input<"hex" | "rgb" | "hsb">("hex");
  inline = input<boolean>(false);
  disabled = input<boolean>(false);
  showHex = input<boolean>(true);
  allowClear = input<boolean>(true);
  defaultColor = input<string>("ff0000");

  changed = output<string>();

  hexDisplay(): string {
    const v = this.value();
    if (!v) return "";
    return v.startsWith("#") ? v.toUpperCase() : `#${v}`.toUpperCase();
  }

  clear(): void {
    this.value.set("");
    this.changed.emit("");
  }
}
