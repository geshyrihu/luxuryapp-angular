import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CascadeSelectBase } from "@ui/base/cascade-select.base";
import { CascadeSelectModule } from "primeng/cascadeselect";

@Component({
  selector: "app-cascade-select",

  imports: [FormsModule, CascadeSelectModule],
  template: `
    <p-cascadeSelect
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [options]="options()"
      [optionLabel]="optionLabel()"
      [placeholder]="placeholder()"
      styleClass="app-cascade-select"
    />
  `,
  styles: [
    `
      .app-cascade-select {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppCascadeSelect extends CascadeSelectBase {}
