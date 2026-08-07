import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ProcessingOverlayBase } from "@ui/base/processing-overlay.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

/**
 * Overlay de procesamiento para web (PrimeNG).
 * Muestra un fondo oscuro con spinner y barra de progreso.
 * Usado en formularios durante operaciones CRUD.
 */
@Component({
  selector: "app-processing-overlay",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isProcessing()) {
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div
          class="bg-white rounded-lg shadow-2xl p-8 text-center max-w-sm w-11/12"
        >
          <!-- Spinner -->
          <div class="animate-spin mb-4 inline-block">
            <app-icon icon="mdi:loading" class="text-3xl text-primary-500" />
          </div>

          <!-- Mensaje principal -->
          <p class="text-lg font-bold text-gray-900 mb-2">
            {{ message() }}
          </p>

          <!-- Submensaje opcional -->
          @if (submessage()) {
            <p class="text-sm text-gray-600 mb-4">
              {{ submessage() }}
            </p>
          }

          <!-- Barra de progreso -->
          <div
            class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3"
          >
            <div
              class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              [style.width.%]="progress()"
            ></div>
          </div>

          <!-- Porcentaje -->
          <p class="text-xs text-gray-500 font-semibold">{{ progress() }}%</p>
        </div>
      </div>
    }
  `,
})
export class AppProcessingOverlay extends ProcessingOverlayBase {}
