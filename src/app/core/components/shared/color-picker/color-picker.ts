import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppColorPicker } from "src/app/core/components/web/color-picker/color-picker";
import { MobileColorPicker } from "src/app/core/components/mobile/color-picker/color-picker";
import { ColorPickerBase } from "./color-picker-base";

/**
 * Wrapper multiplataforma de ColorPicker. Renderiza `app-color-picker` (PrimeNG)
 * o `ili-color-picker` (input nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-color-picker [(value)]="..." />`.
 */
@Component({
  selector: "lx-color-picker",
  standalone: true,
  imports: [AppColorPicker, MobileColorPicker],
  template: `
    @if (platform.isMobile()) {
      <ili-color-picker
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [format]="format()"
        [inline]="inline()"
        [disabled]="disabled()"
        [showHex]="showHex()"
        [allowClear]="allowClear()"
        [defaultColor]="defaultColor()"
        (changed)="changed.emit($event)"
      />
    } @else {
      <app-color-picker
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [format]="format()"
        [inline]="inline()"
        [disabled]="disabled()"
        [showHex]="showHex()"
        [allowClear]="allowClear()"
        [defaultColor]="defaultColor()"
        (changed)="changed.emit($event)"
      />
    }
  `,
})
export class LxColorPicker extends ColorPickerBase {
  protected platform = inject(PlatformService);
}
