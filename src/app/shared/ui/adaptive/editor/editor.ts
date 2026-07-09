import { Component, forwardRef, inject } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { EditorBase } from "@ui/base/editor.base";
import { MobileEditor } from "@ui/mobile/editor/editor";
import { AppEditor } from "@ui/web/editor/editor";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-editor",

  imports: [FormsModule, AppEditor, MobileEditor],
  template: `
    @if (platform.isMobile()) {
      <ili-editor
        [ngModel]="_value"
        (ngModelChange)="onInnerChange($event)"
        [style]="style()"
        [placeholder]="placeholder()"
        [styleClass]="styleClass()"
      ></ili-editor>
    } @else {
      <app-editor
        [ngModel]="_value"
        (ngModelChange)="onInnerChange($event)"
        [style]="style()"
        [placeholder]="placeholder()"
        [styleClass]="styleClass()"
      ></app-editor>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LxEditor),
      multi: true,
    },
  ],
})
export class LxEditor extends EditorBase {
  protected platform = inject(PlatformService);

  onInnerChange(val: any): void {
    this._value = val;
    this.onChange(val);
    this.onTouch();
  }
}
