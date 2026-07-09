import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppEditor } from "@ui/web/editor/editor";
import { MobileEditor } from "@ui/mobile/editor/editor";
import { EditorBase } from "@ui/base/editor.base";

@Component({
  selector: "lx-editor",
  standalone: true,
  imports: [AppEditor, MobileEditor],
  template: `
    @if (platform.isMobile()) {
      <ili-editor [formControlName]="formControlName()" [formControl]="formControl()" [style]="style()" [placeholder]="placeholder()" [styleClass]="styleClass()"></ili-${c.folder}>
    } @else {
      <app-editor [formControlName]="formControlName()" [formControl]="formControl()" [style]="style()" [placeholder]="placeholder()" [styleClass]="styleClass()"></app-${c.folder}>
    }
  `,
})
export class LxEditor extends EditorBase {
  protected platform = inject(PlatformService);
}
