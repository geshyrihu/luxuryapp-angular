import { Component, inject } from "@angular/core";
import { TreeSelectBase } from "@ui/base/tree-select.base";
import { MobileTreeSelect } from "@ui/mobile/tree-select/tree-select";
import { AppTreeSelect } from "@ui/web/tree-select/tree-select";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-tree-select",

  imports: [AppTreeSelect, MobileTreeSelect],
  template: `
    @if (platform.isMobile()) {
      <ili-tree-select
        [(value)]="value"
        [options]="options()"
        [selectionMode]="selectionMode()"
      />
    } @else {
      <app-tree-select
        [(value)]="value"
        [options]="options()"
        [selectionMode]="selectionMode()"
      />
    }
  `,
})
export class LxTreeSelect extends TreeSelectBase {
  protected platform = inject(PlatformService);
}
