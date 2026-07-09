import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { TreeBase } from "@ui/base/tree.base";
import { TreeModule } from "primeng/tree";

@Component({
  selector: "app-tree",

  imports: [CommonModule, TreeModule],
  template: `
    <p-tree
      [value]="value()"
      [(selection)]="selection"
      [selectionMode]="selectionMode()"
      [scrollHeight]="scrollHeight()"
      [metaKeySelection]="metaKeySelection()"
      styleClass="w-full"
    >
      <ng-content />
    </p-tree>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Tree extends TreeBase {}
