import { Directive, inject, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";

@Directive({
  selector: "[lxTooltip]",
  standalone: true,
})
export class LxTooltip implements AfterViewInit, OnDestroy {
  protected platform = inject(PlatformService);
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    if (!this.platform.isMobile()) {
    }
  }

  ngOnDestroy(): void {
  }
}
