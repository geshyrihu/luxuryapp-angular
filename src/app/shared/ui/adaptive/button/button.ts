import { Component, inject, input, output } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import type { ButtonDisplayMode } from "@ui/buttons/base/base-button";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ButtonWeb } from "@ui/buttons/web";

type ButtonWebKind = ReturnType<ButtonWeb["kind"]>;
type ButtonMobileKind = ReturnType<ButtonMobile["kind"]>;

/**
 * Guard de compilación: solo resuelve a la unión común de `kind` cuando web y
 * mobile exponen exactamente el mismo conjunto. Si divergen, colapsa a `never`
 * y el default de `kind` deja de tipar → el build falla en vez de debilitar la
 * API a `string`/`any`.
 */
type KindsMatch<A, B> = [A] extends [B] ? ([B] extends [A] ? A : never) : never;
export type ButtonKind = KindsMatch<ButtonWebKind, ButtonMobileKind>;

/**
 * Delegador adaptativo de botón. Presenta la API común aprobada y elige la
 * implementación real según `PlatformService.isMobile()` (signal): `true` →
 * `<lux-button-mobile>`; `false` → `<lux-button-web>`.
 *
 * PoC técnica: no agrega servicios ni efectos. No confirma (delete), no abre
 * modales (view-pdf) y no promete paridad visual.
 */
@Component({
  selector: "lux-button",

  imports: [ButtonWeb, ButtonMobile],
  template: `
    @if (platform.isMobile()) {
      <lux-button-mobile
        [kind]="kind()"
        [displayMode]="displayMode()"
        [label]="label()"
        [icon]="icon()"
        [iconClass]="iconClass()"
        [disabled]="disabled()"
        [loading]="loading()"
        [type]="type()"
        [ariaLabel]="ariaLabel()"
        (clicked)="clicked.emit($event)"
      />
    } @else {
      <lux-button-web
        [kind]="kind()"
        [displayMode]="displayMode()"
        [label]="label()"
        [icon]="icon()"
        [iconClass]="iconClass()"
        [disabled]="disabled()"
        [loading]="loading()"
        [type]="type()"
        [ariaLabel]="ariaLabel()"
        (clicked)="clicked.emit($event)"
      />
    }
  `,
})
export class LuxButton {
  protected readonly platform = inject(PlatformService);

  kind = input<ButtonKind>("custom");
  displayMode = input<ButtonDisplayMode>("both");
  label = input<string>("");
  icon = input<string>("");
  iconClass = input<string>("");
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<"button" | "submit" | "reset">("button");
  ariaLabel = input<string>("");

  clicked = output<Event>();
}
