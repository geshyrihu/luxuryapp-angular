import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { CheckboxBase } from "@ui/core/checkbox.base";
import { IliCheckbox } from "@ui/mobile/checkbox/checkbox";
import { AppCheckbox } from "@ui/web/checkbox/checkbox";

@Component({
  selector: "lux-checkbox",

  imports: [AppCheckbox, IliCheckbox],
  template: `
    @if (platform.isMobile()) {
      <ili-checkbox
        [(checked)]="checked"
        [disabled]="disabled()"
        [label]="label()"
      />
    } @else {
      <lux-checkbox-web
        [(checked)]="checked"
        [binary]="binary()"
        [disabled]="disabled()"
        [inputId]="inputId()"
        [label]="label()"
      />
    }
  `,
})
export class LxCheckbox extends CheckboxBase {
  protected platform = inject(PlatformService);
}
