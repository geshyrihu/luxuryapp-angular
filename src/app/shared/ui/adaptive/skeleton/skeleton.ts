import { Component, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { MobileSkeletonPresets } from "../../mobile/skeleton-presets/skeleton-presets";
import { WebSkeletonPresets } from "../../web/skeleton-presets/skeleton-presets";
import type { SkeletonPresetType } from "../../web/skeleton-presets/skeleton-presets";

@Component({
  selector: "app-skeleton-presets",
  standalone: true,
  imports: [WebSkeletonPresets, MobileSkeletonPresets],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ili-skeleton-presets
        [variant]="variant()"
        [rows]="rows()"
        [fields]="fields()"
        [chartHeight]="chartHeight()"
      />
    } @else {
      <web-skeleton-presets
        [variant]="variant()"
        [rows]="rows()"
        [fields]="fields()"
        [chartHeight]="chartHeight()"
      />
    }
  `,
})
export class SkeletonPresets {
  protected platform = inject(PlatformService);

  variant = input.required<SkeletonPresetType>();
  rows = input<number>(4);
  fields = input<number>(3);
  chartHeight = input<string>("250px");
}
