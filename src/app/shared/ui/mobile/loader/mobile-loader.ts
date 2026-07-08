import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonSpinner } from "@ionic/angular/standalone";
import { LoaderBase } from "../../base/loader.base";

@Component({
  selector: "ili-loader",

  imports: [IonSpinner],
  template: `
    @if (isLoading()) {
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
      .mobile-loader-container {
        position: fixed;
        bottom: 20%;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100000;
        pointer-events: none;
      }
      .mobile-loader-pill {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.6rem 1.2rem;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        font-size: 0.85rem;
        font-weight: 500;
        backdrop-filter: blur(4px);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobileLoader extends LoaderBase {}
