import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { EditorBase } from "@ui/base/editor.base";
import { EditorModule } from "primeng/editor";

@Component({
  selector: "app-editor",
  standalone: true,
  imports: [EditorModule],
  template: `<p-editor [formControlName]="formControlName()" [formControl]="formControl()" [style]="style()" [placeholder]="placeholder()" [class]="styleClass()"></p-editor>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppEditor extends EditorBase {}
