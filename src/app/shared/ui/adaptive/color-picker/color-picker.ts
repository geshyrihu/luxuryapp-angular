import { Component, inject } from "@angular/core";
import { ColorPickerBase } from "@ui/base/color-picker.base";
import { MobileColorPicker } from "@ui/mobile/color-picker/color-picker";
import { AppColorPicker } from "@ui/web/color-picker/color-picker";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de ColorPicker. Renderiza `app-color-picker` (PrimeNG)
 * o `ili-color-picker` (input nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-color-picker [(value)]="..." />`.
 */
@Component({
  selector: "lx-color-picker",

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
