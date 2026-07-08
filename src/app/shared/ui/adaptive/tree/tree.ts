import { Component, inject } from "@angular/core";
import { TreeBase } from "@ui/base/tree.base";
import { MobileTree } from "@ui/mobile/tree/tree";
import { Tree } from "@ui/web/tree/tree";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-tree",

  imports: [Tree, MobileTree],
  template: `
    @if (platform.isMobile()) {
      <ili-tree
        [value]="value()"
        [(selection)]="selection"
        [selectionMode]="selectionMode()"
      />
    } @else {
      <app-tree
        [value]="value()"
        [(selection)]="selection"
        [selectionMode]="selectionMode()"
      />
    }
  `,
})
export class LxTree extends TreeBase {
  protected platform = inject(PlatformService);
}
