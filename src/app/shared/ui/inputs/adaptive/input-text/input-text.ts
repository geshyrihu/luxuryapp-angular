import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputText } from "../../mobile/ion-input-text";
import { WebInputText } from "../../web/input-text/input-text";

/**
 * 🔀 INPUT TEXT — adaptativo (web ↔ móvil)
 * -------------------------------------------------------------------------
 * Punto de entrada que usan los formularios: `<custom-input-text-signal>`.
 * Según `PlatformService.isMobile()` (viewport, reactivo) renderiza:
 *   - web:    <web-input-text>  (PrimeNG)
 *   - móvil:  <ion-input-text>  (Ionic)
 * La API (control, label, placeholder, required, …) es la misma en ambas por
 * `BaseInputSignal`. Única capa que cruza la frontera web/móvil (como los `lx-*`).
 */
@Component({
  selector: "custom-input-text-signal",

  imports: [WebInputText, IonInputText],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputText),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-text
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [type]="type()"
        (blur)="blur.emit()"
        (enter)="enter.emit()"
      />
    } @else {
      <web-input-text
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [type]="type()"
        [customClass]="customClass()"
        [size]="size()"
        [list]="list()"
        (blur)="blur.emit()"
        (enter)="enter.emit()"
      />
    }
  `,
})
export class InputText extends BaseInputSignal {
  protected platform = inject(PlatformService);

  // Específicos de texto (se ignoran en móvil los que no aplican)
  type = input<string>("text");
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  list = input<string | undefined>(undefined);
  blur = output<void>();
  enter = output<void>();
}
