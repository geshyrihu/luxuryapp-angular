import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ToolbarBase } from "@ui/base/toolbar.base";
import { IonToolbar, IonButtons } from "@ionic/angular/standalone";

@Component({
  selector: "ili-toolbar",
  imports: [CommonModule, IonToolbar, IonButtons],
  template: `
    <ion-toolbar [class]="styleClass()">
      @if (leftTemplate(); as tpl) {
        <ion-buttons slot="start">
          <ng-container *ngTemplateOutlet="tpl" />
        </ion-buttons>
      }
      @if (rightTemplate(); as tpl) {
        <ion-buttons slot="end">
          <ng-container *ngTemplateOutlet="tpl" />
        </ion-buttons>
      }
    </ion-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileToolbar extends ToolbarBase {}
