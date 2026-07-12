import { Component, output, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { ProgressBarModule } from "primeng/progressbar";
import { TextareaModule } from "primeng/textarea";
import { TicketAnalysisService } from "src/app/core/services/ticket-analysis.service";

@Component({
  selector: "app-image-analysis-dialog",
  imports: [
    FormsModule,
    ButtonModule,
    FileUploadModule,
    DialogModule,
    ProgressBarModule,
    TextareaModule,
  ],
  template: `
    <p-dialog
      header="📸 Diagnóstico Inteligente (Vision)"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [draggable]="false"
      [resizable]="false"
    >
      @if (!analysisResult) {
        <div>
          <p class="mb-3">
            Sube una foto del problema (ej. fuga, cable roto) y la IA lo
            analizará automáticamente.
          </p>

          <p-fileupload
            mode="basic"
            chooseLabel="Seleccionar Foto"
            accept="image/*"
            maxFileSize="5000000"
            (onSelect)="onFileSelect($event)"
            [auto]="false"
          >
          </p-fileupload>

          @if (selectedFile) {
            <div class="mt-3 text-center">
              <img
                [src]="previewUrl"
                class="preview-img mb-3"
                style="max-height: 200px; max-width: 100%; border-radius: 8px;"
              />

              @if (loading) {
                <div class="mt-2">
                  <p-progressbar
                    mode="indeterminate"
                    [style]="{ height: '6px' }"
                  ></p-progressbar>
                  <small class="text-muted"
                    >Analizando imagen con Gemini Vision...</small
                  >
                </div>
              }

              @if (!loading) {
                <button
                  pButton
                  type="button"
                  label="Analizar Ahora"
                  icon="mdi:lightning-bolt"
                  (click)="analyze()"
                  class="p-button-primary w-full mt-2"
                ></button>
              }
            </div>
          }
        </div>
      }

      @if (analysisResult) {
        <div class="result-container">
          <div class="text-center mb-3">
            <app-icon
              [icon]="'mdi:check-circle'"
              class="pi text-green-500 text-3xl"
            />
            <h3 class="m-0">Análisis Completado</h3>
          </div>

          <textarea
            pTextarea
            [rows]="8"
            class="w-full"
            [(ngModel)]="analysisResult"
            readonly
          ></textarea>

          <div class="flex justify-end gap-2 mt-3">
            <button
              pButton
              label="Cerrar"
              class="p-button-outlined"
              (click)="visible = false"
            ></button>
            <button
              pButton
              label="Copiar y Usar"
              icon="mdi:content-copy"
              (click)="useResult()"
            ></button>
          </div>
        </div>
      }
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .preview-img {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class ImageAnalysisDialogComponent {
  resultAccepted = output<string>();

  visible: boolean = false;
  loading: boolean = false;
  selectedFile: File | null = null;
  previewUrl: any = null;
  analysisResult: string | null = null;

  constructor(
    private ticketAnalysisService: TicketAnalysisService,
    private messageService: MessageService,
  ) {}

  show() {
    this.reset();
    this.visible = true;
  }

  reset() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.analysisResult = null; // Clear previous result
    this.loading = false;
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result);
      reader.readAsDataURL(this.selectedFile!);
    }
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
