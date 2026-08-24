import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlatformService } from "src/app/core/services/platform.service";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { FileUpload } from "src/app/shared/ui/web/file-upload/file-upload";

@Component({
  selector: "app-candidate-cv-upload",
  standalone: true,
  templateUrl: "./candidate-cv-upload.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FileUpload, WebButtonIconViewPdf],
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
        padding: var(--ds-space-sm) var(--ds-space-md);
        color: var(--ds-text);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .cv-action-button:hover {
        background-color: var(--ds-bg-surface-hover);
      }

      .cv-action-button--subtle {
        border-color: transparent;
        color: var(--ds-text-subtle);
      }

      .cv-action-button--subtle:hover {
        background-color: var(--ds-bg-subtle);
        color: var(--ds-text);
      }
    `,
  ],
})
export class CandidateCvUpload {
  protected platform = inject(PlatformService);

  label = input<string>("CV del candidato");
  currentFileLabel = input<string>("Archivo actual");
  replaceLabel = input<string>("Reemplazar archivo");
  viewAriaLabel = input<string>("Ver archivo");
  fileName = input<string | null>(null);
  fileUrl = input<string>("");
  fileSelected = output<string | null>();
  fileEmitted = output<File | null>();

  currentFileName = signal<string | null>(null);
  replaceMode = signal(false);

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.currentFileName.set(file.name);
      this.replaceMode.set(true);
      this.fileSelected.emit(file.name);
      this.fileEmitted.emit(file);
    }
  }

  protected enableReplaceMode() {
    this.replaceMode.set(true);
  }

  protected clearReplacement() {
    this.currentFileName.set(null);
    this.replaceMode.set(false);
    this.fileSelected.emit(this.fileName());
    this.fileEmitted.emit(null);
  }
}
