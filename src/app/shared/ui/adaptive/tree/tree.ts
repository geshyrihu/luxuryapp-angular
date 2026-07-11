import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TreeBase } from "@ui/base/tree.base";
import { MobileTree } from "@ui/mobile/tree/tree";
import { Tree } from "@ui/web/tree/tree";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-tree",

  imports: [NgTemplateOutlet, Tree, MobileTree],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-tree
        [value]="value()"
        [(selection)]="selection"
        [selectionMode]="selectionMode()"
        [scrollHeight]="scrollHeight()"
        [metaKeySelection]="metaKeySelection()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-tree>
    } @else {
      <app-tree
        [value]="value()"
        [(selection)]="selection"
        [selectionMode]="selectionMode()"
        [scrollHeight]="scrollHeight()"
        [metaKeySelection]="metaKeySelection()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-tree>
    }
  `,
})
export class LxTree extends TreeBase {
  protected platform = inject(PlatformService);
}
