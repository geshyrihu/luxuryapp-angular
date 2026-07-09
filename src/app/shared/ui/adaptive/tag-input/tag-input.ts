import { Component, inject } from "@angular/core";
import { TagInputBase } from "@ui/base/tag-input.base";
import { MobileTagInput } from "@ui/mobile/tag-input/tag-input";
import { AppTagInput } from "@ui/web/tag-input/tag-input";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de TagInput. Renderiza `app-tag-input` (PrimeNG) o
 * `ili-tag-input` (chips nativos) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-tag-input [(value)]="..." />`.
 */
@Component({
  selector: "lx-tag-input",

  imports: [AppTagInput, MobileTagInput],
  template: `
    @if (platform.isMobile()) {
      <ili-tag-input
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [suggestions]="suggestions()"
        [forceSelection]="forceSelection()"
        (tagAdded)="tagAdded.emit($event)"
        (tagRemoved)="tagRemoved.emit($event)"
      />
    } @else {
      <app-tag-input
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [suggestions]="suggestions()"
        [forceSelection]="forceSelection()"
        (tagAdded)="tagAdded.emit($event)"
        (tagRemoved)="tagRemoved.emit($event)"
      />
    }
  `,
})
export class LxTagInput extends TagInputBase {
  protected platform = inject(PlatformService);
}
