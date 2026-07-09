import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ToolbarBase } from "@ui/base/toolbar.base";
import { ToolbarModule } from "primeng/toolbar";

@Component({
  selector: "app-toolbar",

  imports: [CommonModule, ToolbarModule],
  template: `
    <p-toolbar [class]="styleClass()">
      @if (leftTemplate(); as tpl) {
        <ng-template pTemplate="start">
          <ng-container *ngTemplateOutlet="tpl" />
        </ng-template>
      }
      @if (rightTemplate(); as tpl) {
        <ng-template pTemplate="end">
          <ng-container *ngTemplateOutlet="tpl" />
        </ng-template>
      }
    </p-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppToolbar extends ToolbarBase {}
