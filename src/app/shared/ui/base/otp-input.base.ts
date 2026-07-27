import { Directive, input, model, output, computed } from "@angular/core";

/**
 * Base compartida de OtpInput (API + notificación de completado).
 *  - web:     `app-otp-input` (PrimeNG p-inputotp)
 *  - mobile:  `ili-otp-input` (cajas <input> nativas con auto-avance)
 *  - wrapper: `lx-otp-input`  (auto runtime)
 */
@Directive()
export abstract class OtpInputBase {
  value = model<string>("");
  label = input<string>("");
  hint = input<string>("");
  error = input<string>("");
  length = input<number>(6);
  integerOnly = input<boolean>(true);
  disabled = input<boolean>(false);
  mask = input<boolean>(false);

  complete = output<string>();

  /** Índices [0..length-1] para renderizar cajas en la versión mobile. */
  slots = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  onValueChange(val: string): void {
    this.value.set(val);
    if (val && val.length === this.length()) {
      this.complete.emit(val);
    }
  }
}
