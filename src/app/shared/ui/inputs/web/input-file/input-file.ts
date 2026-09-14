import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { WebButtonIconDelete } from "../../../buttons/web-icon/button-delete";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-file",

  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    WebButtonIconDelete,
  ],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
    >
      <label class="form-label" [for]="id()">{{ chooseLabel() }}</label>
      <input
        type="file"
        class="form-control"
        [id]="id()"
        [accept]="accept()"
        [disabled]="disabled()"
        (change)="onFileSelected($event)"
      />
      @if (fileError) {
        <small class="text-danger">{{ fileError }}</small>
      }

      @if (fileSelectedValue) {
        <div class="file-info">
          <span class="file-details">
            {{ fileSelectedValue.name }} ({{
              formatFileSize(fileSelectedValue.size)
            }})
          </span>

          <iw-button-delete
            [disabled]="disabled()"
            (confirmed)="removeFile()"
          />
        </div>
      }
    </base-input-signal>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .file-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-top: 0.75rem;
        padding: 0.75rem;
        background-color: var(--ds-bg-sunken);
        border-radius: var(--ds-radius-card);
        width: 100%;
      }
      .file-details {
        font-size: 0.875rem;
        color: var(--ds-text-primary);
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputFile),
      multi: true,
    },
  ],
})
export class WebInputFile extends BaseInputSignal {
  accept = input<string>("");
  maxFileSize = input<number>(10000000);
  chooseLabel = input<string>("Seleccionar archivo");
  fileSelected = output<File | null>();

  fileSelectedValue: File | null = null;
  fileError = "";

  onFileSelected(event: any): void {
    const file = event.target?.files?.[0] as File | undefined;
    if (!file) return;
    if (this.maxFileSize() > 0 && file.size > this.maxFileSize()) {
      this.fileError = `El archivo excede el tamaño máximo de ${this.formatFileSize(this.maxFileSize())}.`;
      event.target.value = "";
      this.removeFile();
      return;
    }

    this.fileError = "";
    this.fileSelectedValue = file;
    const ctrl = this.control() || this.internalControl;
    if (ctrl) {
      ctrl.setValue(this.fileSelectedValue);
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
    this.fileSelected.emit(this.fileSelectedValue);
    this.onChange(this.fileSelectedValue);
    this.onTouch();
  }

  removeFile(): void {
    this.fileSelectedValue = null;
    const ctrl = this.control() || this.internalControl;
    if (ctrl) {
      ctrl.setValue(null);
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
    this.fileSelected.emit(null);
    this.onChange(null);
    this.onTouch();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
