import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  FileUploadModule,
  FileUploadValidators,
} from "@iplab/ngx-file-upload";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "app-candidate-cv-upload",
  standalone: true,
  templateUrl: "./candidate-cv-upload.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FileUploadModule],
  styles: [
    `
      :host {
        display: block;
      }

      .cv-current-file {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-md);
        padding: var(--ds-space-md);
        border: 1px solid var(--ds-border-subtle);
        border-radius: var(--ds-radius-lg);
        background-color: var(--ds-bg-surface);
      }

      .cv-file-link {
        color: var(--ds-text-link);
        text-decoration: underline;
        word-break: break-word;
      }

      .cv-action-button {
        border: 1px solid var(--ds-border-strong);
        border-radius: var(--ds-radius-md);
        background-color: var(--ds-bg-surface);
        color: var(--ds-text-primary);
        cursor: pointer;
        font: inherit;
        padding: var(--ds-space-xs) var(--ds-space-md);
      }

      .cv-action-button:hover {
        background-color: var(--ds-bg-sunken);
      }

      .cv-action-button--subtle {
        border-color: var(--ds-border-subtle);
      }

      :host ::ng-deep {
        file-upload {
          display: block !important;
          width: 100% !important;
          border: 2px dashed var(--ds-border-strong) !important;
          border-radius: var(--ds-radius-lg) !important;
          background-color: var(--ds-bg-surface) !important;
          min-height: 140px !important;
          position: relative !important;
        }

        file-upload:hover {
          background-color: var(--ds-bg-sunken) !important;
          border-color: var(--ds-primary) !important;
        }

        file-upload label.upload-input {
          position: absolute !important;
          inset: 0 !important;
          transform: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          pointer-events: auto !important;
          cursor: pointer !important;
          color: inherit !important;
        }

        file-upload-drop-zone {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          min-height: 140px !important;
          padding: var(--ds-space-md) !important;
        }

        file-upload-drop-zone .upload-text {
          overflow: visible !important;
          padding: 0 !important;
          width: auto !important;
          text-align: center !important;
        }
      }
    `,
  ],
})
export class CandidateCvUpload {
  protected platform = inject(PlatformService);

  label = input<string>("CV del candidato");
  fileName = input<string | null>(null);
  fileUrl = input<string>("");
  fileSelected = output<string | null>();
  fileEmitted = output<File | null>();

  cvControl = new FormControl<File[] | null>(null, [
    FileUploadValidators.fileSize(10485760),
    FileUploadValidators.accept([".pdf"]),
  ]);

  currentFileName = signal<string | null>(null);
  replaceMode = signal(false);

  onFileChange() {
    const files = this.cvControl.value;
    if (files && files.length > 0) {
      const file = files[0];
      this.currentFileName.set(file.name);
      this.replaceMode.set(true);
      this.fileSelected.emit(file.name);
      this.fileEmitted.emit(file);
    } else {
      this.currentFileName.set(null);
      this.replaceMode.set(false);
      this.fileSelected.emit(this.fileName());
      this.fileEmitted.emit(null);
    }
  }

  protected enableReplaceMode() {
    this.replaceMode.set(true);
  }

  protected clearReplacement() {
    this.cvControl.reset(null);
    this.currentFileName.set(null);
    this.replaceMode.set(false);
    this.fileSelected.emit(this.fileName());
    this.fileEmitted.emit(null);
  }
}
