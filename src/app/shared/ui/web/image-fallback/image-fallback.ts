import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-image-fallback",
  imports: [AppIcon],
  template: `
    @if (!hasError()) {
      <img
        [src]="src() || undefined"
        [alt]="alt()"
        [style.width]="width()"
        [style.height]="height()"
        [style.object-fit]="objectFit()"
        [class]="imageClass()"
        [style]="imageStyle()"
        (error)="onError()"
        loading="lazy"
      />
    } @else {
      <div
        class="fallback-container"
        [style.width]="width()"
        [style.height]="height()"
        [class]="fallbackClass()"
        [style]="fallbackStyle()"
      >
        <app-icon
          [icon]="fallbackIcon()"
          [style.font-size]="fallbackIconSize()"
          [style.color]="fallbackIconColor()"
        />
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: inline-block;
        position: relative;
        vertical-align: middle;
      }
      img {
        display: block;
        object-fit: cover;
        border-radius: inherit;
      }
      .fallback-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--ds-bg-sunken, #f1f5f9);
        border-radius: inherit;
        border: 1px solid var(--ds-border, #e2e8f0);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppImageFallback {
  src = input<string>("");
  alt = input<string>("");
  width = input<string>("auto");
  height = input<string>("auto");
  objectFit = input<"cover" | "contain" | "fill" | "none" | "scale-down">(
    "cover",
  );
  imageClass = input<string>("");
  imageStyle = input<Record<string, string> | string>("");

  fallbackIcon = input<string>("mdi:image-off-outline");
  fallbackIconSize = input<string>("1.5rem");
  fallbackIconColor = input<string>("var(--ds-text-muted, #94a3b8)");
  fallbackClass = input<string>("");
  fallbackStyle = input<Record<string, string> | string>("");

  protected hasError = signal(false);

  protected onError(): void {
    this.hasError.set(true);
  }
}
