import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LoaderBase } from "../../base/loader.base";

@Component({
  selector: "app-loader",
  template: `
    @if (isLoading()) {
      <div class="loader-container">
        <div class="glass-overlay"></div>
        <div class="loader-content">
          <div class="spinner-box">
            <div class="main-spinner"></div>
            <div class="inner-spinner"></div>
          </div>
          <span class="loading-text">Cargando...</span>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
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
      .glass-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        background: color-mix(in srgb, white 40%, transparent);
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
          var(--primary-500)
        );
        -webkit-mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 6px),
          var(--ds-text-primary) 0
        );
        mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 6px),
          var(--ds-text-primary) 0
        );
        animation: spin 1s linear infinite;
      }
      .inner-spinner {
        position: absolute;
        width: 60%;
        height: 60%;
        border-radius: 50%;
        border: 2px solid var(--primary-100);
        border-top-color: var(--primary-500);
        animation: spin 1.5s reverse linear infinite;
        opacity: 0.5;
      }
      .loading-text {
        font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--primary-700);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        animation: pulse 2s ease-in-out infinite;
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
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AppLoader extends LoaderBase {}
