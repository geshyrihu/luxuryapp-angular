import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppLangSelector } from "@ui/web/lang-selector/lang-selector";
import { MobileLangSelector } from "@ui/mobile/lang-selector/lang-selector";
import { LangSelectorBase } from "@ui/base/lang-selector.base";

/**
 * Wrapper multiplataforma de LangSelector. Renderiza `app-lang-selector`
 * (PrimeNG) o `ili-lang-selector` (ion-select) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-lang-selector [(selectedCode)]="..." />`.
 */
@Component({
  selector: "lx-lang-selector",
  standalone: true,
  imports: [AppLangSelector, MobileLangSelector],
  template: `
    @if (platform.isMobile()) {
      <ili-lang-selector
        [(selectedCode)]="selectedCode"
        [languages]="languages()"
        [label]="label()"
        [placeholder]="placeholder()"
        [showLabel]="showLabel()"
        (langChange)="langChange.emit($event)"
      />
    } @else {
      <app-lang-selector
        [(selectedCode)]="selectedCode"
        [languages]="languages()"
        [label]="label()"
        [placeholder]="placeholder()"
        [showLabel]="showLabel()"
        (langChange)="langChange.emit($event)"
      />
    }
  `,
})
export class LxLangSelector extends LangSelectorBase {
  protected platform = inject(PlatformService);
}
