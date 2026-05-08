import { Component, inject } from "@angular/core";
import { IonSpinner } from "@ionic/angular/standalone";
import { LoaderService } from "src/app/core/services/loader.service";

/**
 * 🌀 APP LOADER MODERNO
 * -------------------------------------------------------------------------
 * Un spinner elegante con gradiente cónico para escritorio e Ionic para móvil.
 */
@Component({
  selector: "app-loader",
  imports: [IonSpinner],
  template: `
    @if (isLoading()) {
      <!-- Loader de Escritorio -->
      <div class="loader-container desktop-loader">
        <div class="glass-overlay"></div>
        <div class="loader-content">
          <div class="spinner-box">
            <div class="main-spinner"></div>
            <div class="inner-spinner"></div>
          </div>
          <span class="loading-text">Cargando...</span>
        </div>
      </div>

      <!-- Loader de Móvil (Ionic Standard) -->
      <div class="mobile-loader-container">
        <div class="mobile-loader-pill shadow-4">
          <ion-spinner name="crescent"></ion-spinner>
          <span class="ml-2">Cargando...</span>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      /* ==========================================================================
         DESKTOP LOADER (Glassmorphism)
         ========================================================================== */
      .loader-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        overflow: hidden;
      }

      @media (max-width: 991px) {
        .desktop-loader {
          display: none !important;
        }
      }

      .glass-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(8px) saturate(180%);
        -webkit-backdrop-filter: blur(8px) saturate(180%);
      }

      .loader-content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }

      .spinner-box {
        position: relative;
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .main-spinner {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: conic-gradient(
          from 0deg,
          transparent 30%,
          var(--primary-500, #0b3164)
        );
        -webkit-mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 6px),
          #000 0
        );
        mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 6px),
          #000 0
        );
        animation: spin 1s linear infinite;
      }

      .inner-spinner {
        position: absolute;
        width: 60%;
        height: 60%;
        border-radius: 50%;
        border: 2px solid var(--primary-100, rgba(11, 49, 100, 0.1));
        border-top-color: var(--primary-500, #0b3164);
        animation: spin 1.5s reverse linear infinite;
        opacity: 0.5;
      }

      .loading-text {
        font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--primary-700, #072042);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        animation: pulse 2s ease-in-out infinite;
      }

      /* ==========================================================================
         MOBILE LOADER (Floating Pill)
         ========================================================================== */
      .mobile-loader-container {
        display: none;
        position: fixed;
        bottom: 20%;
        left: 0;
        width: 100%;
        justify-content: center;
        align-items: center;
        z-index: 100000;
        pointer-events: none;
      }

      @media (max-width: 991px) {
        .mobile-loader-container {
          display: flex;
        }
      }

      .mobile-loader-pill {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.6rem 1.2rem;
        border-round: 9999px; /* Fallback */
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        font-size: 0.85rem;
        font-weight: 500;
        backdrop-filter: blur(4px);
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.6;
          transform: scale(0.98);
        }
        50% {
          opacity: 1;
          transform: scale(1.02);
        }
      }
    `,
  ],
})
export class Loader {
  private loaderService = inject(LoaderService);

  // Signal directo del servicio
  public isLoading = this.loaderService.loading$;
}









