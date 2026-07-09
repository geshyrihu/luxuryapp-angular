import { Component, inject } from "@angular/core";
import { RatingBase } from "@ui/base/rating.base";
import { MobileRating } from "@ui/mobile/rating/rating";
import { AppRating } from "@ui/web/rating/rating";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de Rating. Renderiza `app-rating` (PrimeNG) o
 * `ili-rating` (estrellas táctiles Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-rating [(value)]="..." />`.
 */
@Component({
  selector: "lx-rating",

  imports: [AppRating, MobileRating],
  template: `
    @if (platform.isMobile()) {
      <ili-rating
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [stars]="stars()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [allowCancel]="allowCancel()"
        [showLabel]="showLabel()"
        (changed)="changed.emit($event)"
      />
    } @else {
      <app-rating
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [stars]="stars()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [allowCancel]="allowCancel()"
        [showLabel]="showLabel()"
        (changed)="changed.emit($event)"
      />
    }
  `,
})
export class LxRating extends RatingBase {
  protected platform = inject(PlatformService);
}
