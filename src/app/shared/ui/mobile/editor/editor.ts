import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  forwardRef,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { EditorBase } from "@ui/base/editor.base";
import { EditorModule } from "primeng/editor";

@Component({
  selector: "ili-editor",

  imports: [FormsModule, EditorModule],
  template: `<p-editor
    [(ngModel)]="_value"
    (ngModelChange)="onChange($event)"
    [style]="style()"
    [placeholder]="placeholder()"
    [class]="styleClass()"
  ></p-editor>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MobileEditor),
      multi: true,
    },
  ],
})
export class MobileEditor extends EditorBase {}
