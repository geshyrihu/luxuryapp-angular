import { Component, inject } from "@angular/core";
import { CheckboxBase } from "@ui/base/checkbox.base";
import { AppCheckbox } from "@ui/web/checkbox/checkbox";
import { IliCheckbox } from "@ui/mobile/checkbox/checkbox";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-checkbox",
  standalone: true,
  imports: [AppCheckbox, IliCheckbox],
  template: `
    @if (platform.isMobile()) {
      <ili-checkbox
        [(checked)]="checked"
        [disabled]="disabled()"
        [label]="label()"
      />
    } @else {
      <app-checkbox
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
