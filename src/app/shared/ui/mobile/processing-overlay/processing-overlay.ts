import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ProcessingOverlayBase } from "@ui/base/processing-overlay.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

/**
 * Overlay de procesamiento para mobile (Ionic).
 * Versión optimizada para pantallas pequeñas.
 */
@Component({
  selector: "ili-processing-overlay",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isProcessing()) {
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl p-6 mx-3 w-full max-w-xs">
        <!-- Spinner -->
        <div class="animate-spin mb-3 inline-block w-full text-center">
          <app-icon icon="mdi:loading" class="text-2xl text-primary-500" />
        </div>

        <!-- Mensaje principal -->
        <p class="text-base font-bold text-gray-900 mb-1 text-center">
          {{ message() }}
        </p>

        <!-- Submensaje opcional -->
        @if (submessage()) {
        <p class="text-xs text-gray-600 mb-3 text-center">
          {{ submessage() }}
        </p>
        }

        <!-- Barra de progreso -->
        <div class="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
            [style.width.%]="progress()"
          ></div>
        </div>

        <!-- Porcentaje -->
        <p class="text-xs text-gray-500 font-semibold text-center">
          {{ progress() }}%
        </p>
      </div>
    </div>
    }
  `,
})
export class MobileProcessingOverlay extends ProcessingOverlayBase {}
