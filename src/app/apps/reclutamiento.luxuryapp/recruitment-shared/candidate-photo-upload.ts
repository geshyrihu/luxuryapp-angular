import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppAvatar } from "src/app/shared/ui/web/avatar/avatar";
import { FileUpload } from "src/app/shared/ui/web/file-upload/file-upload";

@Component({
  selector: "app-candidate-photo-upload",
  templateUrl: "./candidate-photo-upload.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FileUpload, AppAvatar],
  styles: [
    `
      :host {
        display: block;
      }

      .photo-current {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-md);
        padding: var(--ds-space-md);
        border: 1px solid var(--ds-border-subtle);
        border-radius: var(--ds-radius-lg);
        background-color: var(--ds-bg-surface);
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
    `,
  ],
})
export class CandidatePhotoUpload {
  protected platform = inject(PlatformService);

  label = input<string>("Foto del candidato");
  currentFileLabel = input<string>("Foto actual");
  replaceLabel = input<string>("Reemplazar foto");
  fileName = input<string | null>(null);
  fileUrl = input<string>("");
  fileSelected = output<string | null>();
  fileEmitted = output<File | null>();

  previewUrl = signal<string | null>(null);
  replaceMode = signal(false);

  onFileSelect(event: any) {
    const files = event?.files;
    if (files && files.length > 0) {
      const file = files[0] as File;
      if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
      this.previewUrl.set(URL.createObjectURL(file));
      this.replaceMode.set(true);
      this.fileSelected.emit(file.name);
      this.fileEmitted.emit(file);
    }
  }

  protected enableReplaceMode() {
    this.replaceMode.set(true);
  }

  protected clearReplacement() {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.previewUrl.set(null);
    this.replaceMode.set(false);
    this.fileSelected.emit(this.fileName());
    this.fileEmitted.emit(null);
  }
}
