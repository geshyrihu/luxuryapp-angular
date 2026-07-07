import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppChip } from "@ui/web/chip/chip";
import { MobileChip } from "@ui/mobile/chip/chip";
import { ChipBase } from "@ui/base/chip.base";

/**
 * Wrapper multiplataforma de Chip. Renderiza `app-chip` (PrimeNG) o `ili-chip`
 * (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-chip label="..." />`.
 */
@Component({
  selector: "lx-chip",
  standalone: true,
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
