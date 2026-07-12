import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TreeSelectBase } from "@ui/base/tree-select.base";
import { TreeSelectModule } from "primeng/treeselect";

@Component({
  selector: "app-tree-select",

  imports: [FormsModule, TreeSelectModule],
  template: `
    <p-treeSelect
      [(ngModel)]="value"
      [options]="options()"
      [selectionMode]="selectionMode()"
      styleClass="app-tree-select"
    />
  `,
  styles: [
    `
      .app-tree-select {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppTreeSelect extends TreeSelectBase {}
