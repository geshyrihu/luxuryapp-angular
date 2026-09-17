import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from "@angular/core";
import { IonImg } from "@ionic/angular";
import { ImageBase } from "@ui/base/image.base";

/** MobileImage — Wrapper sobre ion-img con preview accesible propio. */
@Component({
  selector: "ili-image",
  imports: [CommonModule, IonImg],
  template: `
    @if (preview()) {
      <button
        #previewTrigger
        type="button"
        class="ili-image-trigger"
        aria-label="Ampliar imagen"
        (click)="openPreview()"
      >
        <ion-img
          [src]="src()"
          [alt]="alt()"
          [class]="(imageClass() + ' ' + styleClass()).trim()"
          [ngStyle]="mobileStyle()"
        />
      </button>
    } @else {
      <ion-img
        [src]="src()"
        [alt]="alt()"
        [class]="(imageClass() + ' ' + styleClass()).trim()"
        [ngStyle]="mobileStyle()"
      />
    }

    @if (previewOpen()) {
      <div
        class="ili-image-preview"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="alt() || 'Vista previa de imagen'"
        tabindex="-1"
        (click)="onOverlayClick($event)"
      >
        <button
          type="button"
          class="ili-image-preview-close"
          aria-label="Cerrar vista previa"
          (click)="closePreview()"
        >X</button>
        <img [src]="src()" [alt]="alt()" [ngStyle]="imageStyle()" />
      </div>
    }
  `,
  styles: [
    `
      ili-image ion-img::part(image) { object-fit: contain; }

      .ili-image-trigger {
        display: inline-block;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: zoom-in;
      }

      .ili-image-preview {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3.5rem 1rem 1rem;
        background: rgba(0, 0, 0, 0.85);
      }

      .ili-image-preview img {
        max-width: 95vw;
        max-height: 90vh;
        object-fit: contain;
      }

      .ili-image-preview-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        min-width: 3rem;
        min-height: 3rem;
        border: 0;
        background: transparent;
        color: #fff;
        font-size: 1.25rem;
      }

      .ili-image-trigger:focus-visible,
      .ili-image-preview:focus-visible,
      .ili-image-preview-close:focus-visible {
        outline: 2px solid var(--ds-primary-500, #0d6efd);
        outline-offset: 2px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileImage extends ImageBase {
  private readonly renderer = inject(Renderer2);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly previewOpen = signal(false);
  private previousOverflow = "";

  @ViewChild("previewTrigger") private previewTrigger?: ElementRef<HTMLButtonElement>;

  openPreview(): void {
    this.previousOverflow = document.body.style.overflow;
    this.renderer.setStyle(document.body, "overflow", "hidden");
    this.previewOpen.set(true);
    queueMicrotask(() => (this.host.nativeElement.querySelector(".ili-image-preview") as HTMLElement | null)?.focus());
  }

  closePreview(): void {
    this.previewOpen.set(false);
    this.renderer.setStyle(document.body, "overflow", this.previousOverflow);
    queueMicrotask(() => this.previewTrigger?.nativeElement.focus());
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closePreview();
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.previewOpen()) this.closePreview();
  }
}
