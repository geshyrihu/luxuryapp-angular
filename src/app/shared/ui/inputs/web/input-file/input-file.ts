import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { WebButtonIconDelete } from "../../../buttons/web-icon/button-delete";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-file",

  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    FileUploadModule,
    ButtonModule,
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
      <p-fileupload
        styleClass="w-full"
        chooseStyleClass="w-full"
        [id]="id()"
        mode="basic"
        [chooseLabel]="chooseLabel()"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [disabled]="disabled()"
        [auto]="true"
        (onSelect)="onFileSelected($event)"
        (onClear)="removeFile()"
        [showUploadButton]="false"
        [showCancelButton]="false"
      />

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
      :host ::ng-deep .p-fileupload-basic {
        width: 100%;
        display: block;
      }
      :host ::ng-deep .p-fileupload-basic .p-button {
        width: 100%;
        display: flex;
        justify-content: center;
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

  onFileSelected(event: any): void {
    if (!event.files || event.files.length === 0) return;

    this.fileSelectedValue = event.files[0];
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
