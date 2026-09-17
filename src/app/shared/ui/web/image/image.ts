import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { NgStyle } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageBase } from "@ui/base/image.base";
import { TemplateRef, inject } from "@angular/core";

/**
 * AppImage — Imagen nativa con preview accesible mediante NgbModal.
 * `appendTo` se conserva por contrato, pero se ignora: NgbModal monta en body.
 */
@Component({
  selector: "app-image",

  imports: [NgStyle],
  template: `
    @if (preview()) {
      <button
        type="button"
        [class]="('app-image-trigger ' + styleClass()).trim()"
        aria-label="Ampliar imagen"
        (click)="openPreview(previewTemplate)"
      >
        <img
          [src]="src()"
          [alt]="alt()"
          [class]="imageClass()"
          [style.width]="widthStyle()"
          [style.height]="heightStyle()"
          [ngStyle]="imageStyle()"
        />
      </button>
    } @else {
      <span [class]="styleClass()">
        <img
          [src]="src()"
          [alt]="alt()"
          [class]="imageClass()"
          [style.width]="widthStyle()"
          [style.height]="heightStyle()"
          [ngStyle]="imageStyle()"
        />
      </span>
    }

    <ng-template #previewTemplate let-modal>
      <div class="app-image-preview" role="dialog" aria-modal="true" [attr.aria-label]="alt() || 'Vista previa de imagen'">
        <h2 id="app-image-preview-title" class="visually-hidden">
          Vista previa de imagen
        </h2>
        <button
          type="button"
          class="app-image-preview-close"
          aria-label="Cerrar vista previa"
          (click)="modal.dismiss()"
        >
          X
        </button>
        <img [src]="src()" [alt]="alt()" [ngStyle]="imageStyle()" />
      </div>
    </ng-template>
  `,
  styles: [
    `
      .app-image-trigger {
        display: inline-block;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: zoom-in;
      }

      .app-image-trigger:focus-visible,
      .app-image-preview-close:focus-visible {
        outline: 2px solid var(--ds-primary-500, #0d6efd);
        outline-offset: 2px;
      }

      .app-image-preview {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 3.5rem 1rem 1rem;
        background: rgba(0, 0, 0, 0.85);
      }

      .app-image-preview-window .modal-content {
        border: 0;
        background: transparent;
      }

      .app-image-preview-window .modal-body {
        padding: 0;
      }

      .app-image-preview img {
        display: block;
        max-width: 95vw;
        max-height: 90vh;
        object-fit: contain;
      }

      .app-image-preview-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        min-width: 2.75rem;
        min-height: 2.75rem;
        border: 0;
        background: transparent;
        color: #fff;
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppImage extends ImageBase {
  private readonly modal = inject(NgbModal);

  openPreview(template: TemplateRef<unknown>): void {
    this.modal.open(template, {
      centered: true,
      backdrop: true,
      keyboard: true,
      windowClass: "app-image-preview-window",
      ariaLabelledBy: "app-image-preview-title",
    });
  }

  widthStyle(): string | undefined {
    return this.nativeCssSize(this.widthStr());
  }

  heightStyle(): string | undefined {
    return this.nativeCssSize(this.heightStr());
  }

  private nativeCssSize(value: string | undefined): string | undefined {
    return value && /^\d+$/.test(value) ? `${value}px` : value;
  }
}
