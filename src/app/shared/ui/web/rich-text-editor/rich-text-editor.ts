import { Component, input, model, output, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EditorModule } from "primeng/editor";

@Component({
  selector: "app-rich-text-editor",

  imports: [FormsModule, EditorModule],
  template: `
    <p-editor
      [(ngModel)]="content"
      [style]="{ height: height() }"
      [readonly]="readonly()"
      [placeholder]="placeholder()"
      [formats]="formats()"
      (onTextChange)="onTextChange.emit($event)"
    />
  `,
  styles: [
    `
      app-rich-text-editor .p-editor-container {
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        overflow: hidden;
      }
      app-rich-text-editor .p-editor-toolbar {
        background: var(--ds-bg-elevated);
        border-bottom: 1px solid var(--ds-border);
        padding: 0.5rem;
      }
      app-rich-text-editor .p-editor-content {
        min-height: 200px;
      }
      app-rich-text-editor .ql-editor {
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RichTextEditor {
  readonly content = model<string>("");
  placeholder = input<string>("Escribe aquí...");
  height = input<string>("300px");
  readonly = input<boolean>(false);
  onTextChange = output<any>();

  formats = input<string[]>([
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "ordered",
    "indent",
    "link",
    "image",
    "blockquote",
    "code-block",
    "align",
    "color",
    "background",
    "font",
    "size",
  ]);
}
