import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
} from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";

@Directive({
  selector: "[lxTooltip]",
})
export class LxTooltip implements AfterViewInit, OnDestroy {
  protected platform = inject(PlatformService);
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    if (!this.platform.isMobile()) {
    }
  }

  ngOnDestroy(): void {}
}
