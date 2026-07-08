import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { CascadeSelectBase } from "@ui/base/cascade-select.base";

@Component({
  selector: "app-cascade-select",
  standalone: true,
  imports: [CommonModule, FormsModule, CascadeSelectModule],
  template: `
    <p-cascadeSelect
      [(ngModel)]="value"
      [options]="options()"
      [optionLabel]="optionLabel()"
      [placeholder]="placeholder()"
      styleClass="app-cascade-select"
    />
  `,
  styles: [`
    .app-cascade-select {
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppCascadeSelect extends CascadeSelectBase {}
