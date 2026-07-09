import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SplitButtonBase } from "@ui/base/split-button.base";
import { SplitButtonModule } from "primeng/splitbutton";

@Component({
  selector: "app-split-button",

  imports: [SplitButtonModule],
  template: `<p-splitbutton
    [label]="label()"
    [icon]="icon()"
    [model]="model()"
    [size]="size()"
    [severity]="severity()"
    [disabled]="disabled()"
    (onClick)="onClick.emit($event)"
    [class]="styleClass()"
  ></p-splitbutton>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppSplitButton extends SplitButtonBase {}
