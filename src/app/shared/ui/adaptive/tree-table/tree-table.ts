import { Component, inject } from "@angular/core";
import { TreeTableBase } from "@ui/base/tree-table.base";
import { MobileTreeTable } from "@ui/mobile/tree-table/tree-table";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-tree-table",

  imports: [MobileTreeTable],
  template: `
    @if (platform.isMobile()) {
      <ili-tree-table
        [nodes]="nodes()"
        [columns]="columns()"
        [dataKey]="dataKey()"
        [selectionMode]="selectionMode()"
        [(selection)]="selection"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [headerTitle]="headerTitle()"
        (nodeSelect)="nodeSelect.emit($event)"
        (nodeUnselect)="nodeUnselect.emit($event)"
        (nodeExpand)="nodeExpand.emit($event)"
        (nodeCollapse)="nodeCollapse.emit($event)"
      />
    } @else {
      <app-tree-table
        [nodes]="nodes()"
        [columns]="columns()"
        [dataKey]="dataKey()"
        [selectionMode]="selectionMode()"
        [(selection)]="selection"
        [loading]="loading()"
        [emptyMessage]="emptyMessage()"
        [headerTitle]="headerTitle()"
        (onNodeSelect)="nodeSelect.emit($event)"
        (onNodeUnselect)="nodeUnselect.emit($event)"
        (onNodeExpand)="nodeExpand.emit($event)"
        (onNodeCollapse)="nodeCollapse.emit($event)"
      />
    }
  `,
})
export class LxTreeTable extends TreeTableBase {
  protected platform = inject(PlatformService);
}
