import { Component, inject } from "@angular/core";
import { CascadeSelectBase } from "@ui/base/cascade-select.base";
import { MobileCascadeSelect } from "@ui/mobile/cascade-select/cascade-select";
import { AppCascadeSelect } from "@ui/web/cascade-select/cascade-select";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-cascade-select",

  imports: [AppCascadeSelect, MobileCascadeSelect],
  template: `
    @if (platform.isMobile()) {
      <ili-cascade-select
        [(value)]="value"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [placeholder]="placeholder()"
      />
    } @else {
      <app-cascade-select
        [(value)]="value"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [placeholder]="placeholder()"
      />
    }
  `,
})
export class LxCascadeSelect extends CascadeSelectBase {
  protected platform = inject(PlatformService);
}
