import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { TreeBase } from "@ui/core/tree.base";
import { MobileTree } from "@ui/mobile/tree/tree";
import { Tree } from "@ui/web/tree/tree";

@Component({
  selector: "lux-tree",

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
      <lux-tree-web
        [value]="value()"
        [(selection)]="selection"
        [selectionMode]="selectionMode()"
        [scrollHeight]="scrollHeight()"
        [metaKeySelection]="metaKeySelection()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-tree-web>
    }
  `,
})
export class LxTree extends TreeBase {
  protected platform = inject(PlatformService);
}
