import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
  forwardRef,
  OnInit,
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { EditorBase } from "@ui/base/editor.base";
import { Editor, NgxEditorModule } from "ngx-editor";

@Component({
  selector: "app-editor",

  imports: [FormsModule, NgxEditorModule, NgClass],
  template: `
    <div class="app-editor NgxEditor__Wrapper" [ngClass]="styleClass()" [style]="style()">
      <ngx-editor-menu [editor]="editor" />
      <ngx-editor
        [editor]="editor"
        outputFormat="html"
        [placeholder]="placeholder() ?? ''"
        [(ngModel)]="_value"
        (ngModelChange)="onChange($event)"
        (focusOut)="onTouch()"
      />
    </div>
  `,
  styles: [
    `
      .app-editor { display: block; }
      .app-editor ::ng-deep .NgxEditor__Content {
        min-height: 150px;
        font-size: inherit;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppEditor),
      multi: true,
    },
  ],
})
export class AppEditor extends EditorBase implements OnInit, OnDestroy {
  editor!: Editor;

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
