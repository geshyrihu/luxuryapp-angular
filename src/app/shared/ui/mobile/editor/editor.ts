import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  forwardRef,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { EditorBase } from "@ui/base/editor.base";
import { IonTextarea } from "@ionic/angular/standalone";

@Component({
  selector: "ili-editor",

  imports: [FormsModule, IonTextarea],
  template: `<ion-textarea
    [(ngModel)]="_value"
    (ngModelChange)="onChange($event)"
    [style]="style()"
    [placeholder]="placeholder()"
    [class]="styleClass()"
    autoGrow="true"
  ></ion-textarea>`,
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
