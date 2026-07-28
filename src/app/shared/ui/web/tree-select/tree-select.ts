import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TreeSelectBase } from "@ui/base/tree-select.base";
import { TreeSelectModule } from "primeng/treeselect";

@Component({
  selector: "app-tree-select",
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
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
