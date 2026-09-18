import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "@core/services/message.service";
import { TicketAnalysisService } from "@core/services/ticket-analysis.service";
import { ImageProcessingService } from "@core/services/image-processing.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-image-analysis-dialog",
  imports: [FormsModule, WebButtonLabel, AppIcon],
  template: `
    <div
      class="modal fade"
      [class.show]="visible"
      [style.display]="visible ? 'block' : 'none'"
      tabindex="-1"
      role="dialog"
      [attr.aria-hidden]="!visible"
    >
      <div class="modal-dialog modal-dialog-centered" style="width: 500px; max-width: 96vw;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">📸 Diagnóstico Inteligente (Vision)</h5>
            <button type="button" class="btn-close" aria-label="Cerrar" (click)="visible = false"></button>
          </div>
          <div class="modal-body">
            @if (!analysisResult) {
              <div>
                <p class="mb-3">
                  Sube una foto del problema (ej. fuga, cable roto) y la IA lo
                  analizará automáticamente.
                </p>

                <input
                  #chooseInput
                  type="file"
                  accept="image/*,.heic,.heif"
                  (change)="onFileSelect($event)"
                  hidden
                />
                <il-button label="Seleccionar Foto" (clicked)="chooseInput.click()" />

                @if (selectedFile) {
                  <div class="mt-3 text-center">
                    <img
                      [src]="previewUrl"
                      class="preview-img mb-3"
                      style="max-height: 200px; max-width: 100%; border-radius: 8px;"
                    />

                    @if (loading) {
                      <div class="mt-2">
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                        </div>
                        <small class="text-muted">Analizando imagen con Gemini Vision...</small>
                      </div>
                    }

                    @if (!loading) {
                      <il-button
                        label="Analizar Ahora"
                        icon="material-symbols-light:bolt"
                        (clicked)="analyze()"
                        class="w-100 mt-2"
                      />
                    }
                  </div>
                }
              </div>
            }

            @if (analysisResult) {
              <div class="result-container">
                <div class="text-center mb-3">
                  <app-icon
                    [icon]="'material-symbols-light:check-circle'"
                    class="text-green-500 text-3xl"
                  />
                  <h3 class="m-0">Análisis Completado</h3>
                </div>

                <textarea class="form-control" [rows]="8" [(ngModel)]="analysisResult" readonly></textarea>

                <div class="d-flex justify-content-end gap-2 mt-3">
                  <il-button label="Cerrar" severity="secondary" variant="outline" (clicked)="visible = false" />
                  <il-button
                    label="Copiar y Usar"
                    icon="material-symbols-light:content-copy"
                    (clicked)="useResult()"
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
    @if (visible) {
      <div class="modal-backdrop fade show"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .preview-img {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      :host { position: relative; z-index: 1055; }
    `,
  ],
})
export class ImageAnalysisDialogComponent implements OnDestroy {
  resultAccepted = output<string>();

  visible: boolean = false;
  loading: boolean = false;
  selectedFile: File | null = null;
  previewUrl: any = null;
  analysisResult: string | null = null;

  constructor(
    private ticketAnalysisService: TicketAnalysisService,
    private messageService: MessageService,
    private imageProcessing: ImageProcessingService,
  ) {}

  show() {
    this.reset();
    this.visible = true;
  }

  reset() {
    if (
      typeof this.previewUrl === "string" &&
      this.previewUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.selectedFile = null;
    this.previewUrl = null;
    this.analysisResult = null; // Clear previous result
    this.loading = false;
  }

  async onFileSelect(event: any): Promise<void> {
    const files = (event.target as HTMLInputElement | null)?.files;
    if (files?.length) {
      try {
        this.selectedFile = await this.imageProcessing.processImage(
          files[0],
          { maxBytes: 5 * 1024 * 1024, maxDimension: 2560 },
        );
        if (
          typeof this.previewUrl === "string" &&
          this.previewUrl.startsWith("blob:")
        ) {
          URL.revokeObjectURL(this.previewUrl);
        }
        this.previewUrl = URL.createObjectURL(this.selectedFile);
      } catch (error) {
        this.messageService.add({
          severity: "error",
          summary: "No se pudo procesar la imagen",
          detail: error instanceof Error ? error.message : "Imagen no valida.",
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.reset();
  }

  async analyze() {
    if (!this.selectedFile) return;

    this.loading = true;
    try {
      // analyzeImage now returns Promise<string | false>
      const result = await this.ticketAnalysisService.analyzeImage(
        this.selectedFile,
      );
      if (result && typeof result === "string") {
        this.analysisResult = result;
      } else {
        // If result is false, ApiResponseService already showed the toast error
      }
    } catch (e) {
      console.error(e);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Falló el análisis de imagen.",
      });
    } finally {
      this.loading = false;
    }
  }

  useResult() {
    if (this.analysisResult && this.analysisResult !== "") {
      this.resultAccepted.emit(this.analysisResult);
      this.visible = false;
    }
  }
}
