import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { ChipBase } from "@ui/core/chip.base";
import { MobileChip } from "@ui/mobile/chip/chip";
import { AppChip } from "@ui/web/chip/chip";

/**
 * Wrapper multiplataforma de Chip. Renderiza `app-chip` (Bootstrap) o `ili-chip`
 * (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-chip label="..." />`.
 */
@Component({
  selector: "lux-chip",

  imports: [AppChip, MobileChip],
  template: `
    @if (platform.isMobile()) {
      <ili-chip
        [label]="label()"
        [icon]="icon()"
        [image]="image()"
        [removable]="removable()"
        [disabled]="disabled()"
        [clickable]="clickable()"
        [color]="color()"
        (removed)="removed.emit()"
        (chipClick)="chipClick.emit()"
      />
    } @else {
      <app-chip
        [label]="label()"
        [icon]="icon()"
        [image]="image()"
        [removable]="removable()"
        [disabled]="disabled()"
        [clickable]="clickable()"
        [color]="color()"
        (removed)="removed.emit()"
        (chipClick)="chipClick.emit()"
      />
    }
  `,
})
export class LxChip extends ChipBase {
  protected platform = inject(PlatformService);
}
