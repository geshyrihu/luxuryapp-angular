import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppTagInput } from "src/app/core/components/web/tag-input/tag-input";
import { MobileTagInput } from "src/app/core/components/mobile/tag-input/tag-input";
import { TagInputBase } from "./tag-input-base";

/**
 * Wrapper multiplataforma de TagInput. Renderiza `app-tag-input` (PrimeNG) o
 * `ili-tag-input` (chips nativos) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-tag-input [(value)]="..." />`.
 */
@Component({
  selector: "lx-tag-input",
  standalone: true,
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
