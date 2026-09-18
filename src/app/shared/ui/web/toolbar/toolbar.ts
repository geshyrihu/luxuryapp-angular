import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ToolbarBase } from "@ui/base/toolbar.base";

@Component({
  selector: "app-toolbar",

  imports: [NgTemplateOutlet, NgClass],
  template: `
    <div class="app-toolbar d-flex align-items-center justify-content-between" [ngClass]="styleClass()">
      <div class="app-toolbar-start d-flex align-items-center">
        @if (leftTemplate(); as tpl) {
          <ng-container *ngTemplateOutlet="tpl" />
        }
      </div>
      @if (centerTemplate(); as tpl) {
        <div class="app-toolbar-center d-flex align-items-center">
          <ng-container *ngTemplateOutlet="tpl" />
        </div>
      }
      <div class="app-toolbar-end d-flex align-items-center">
        @if (rightTemplate(); as tpl) {
          <ng-container *ngTemplateOutlet="tpl" />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppToolbar extends ToolbarBase {}
