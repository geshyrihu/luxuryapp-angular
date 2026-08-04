import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ProcessingOverlayBase } from "@ui/base/processing-overlay.base";
import { MobileProcessingOverlay } from "@ui/mobile/processing-overlay/processing-overlay";
import { AppProcessingOverlay } from "@ui/web/processing-overlay/processing-overlay";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Overlay adaptativo de procesamiento con indicador de progreso.
 * Muestra un overlay modal con spinner y barra de progreso mientras se procesa.
 *
 * Uso:
 * ```html
 * <lx-processing-overlay
 *   [isProcessing]="isSubmitting()"
 *   [progress]="uploadProgress()"
 *   message="Guardando ticket..."
 *   submessage="Comprimiendo y subiendo imágenes"
 * />
 * ```
 *
 * Propiedades:
 * - `isProcessing`: boolean - Muestra/oculta el overlay
 * - `progress`: number (0-100) - Porcentaje de progreso
 * - `message`: string - Mensaje principal
 * - `submessage`: string | null - Mensaje secundario opcional
 */
@Component({
  selector: "lx-processing-overlay",
  imports: [AppProcessingOverlay, MobileProcessingOverlay],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (platform.isMobile()) {
      <ili-processing-overlay
        [isProcessing]="isProcessing()"
        [progress]="progress()"
        [message]="message()"
        [submessage]="submessage()"
      />
    } @else {
      <app-processing-overlay
        [isProcessing]="isProcessing()"
        [progress]="progress()"
        [message]="message()"
        [submessage]="submessage()"
      />
    }
  `,
})
export class LxProcessingOverlay extends ProcessingOverlayBase {
  protected platform = inject(PlatformService);
}
