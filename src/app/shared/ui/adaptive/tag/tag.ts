import { Component, inject } from "@angular/core";
import { TagBase } from "@ui/base/tag.base";
import { MobileTag } from "@ui/mobile/tag/tag";
import { AppTag } from "@ui/web/tag/tag";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-tag",
  standalone: true,
  imports: [AppTag, MobileTag],
  template: `
    @if (platform.isMobile()) {
      <ili-tag
        [value]="value()"
        [severity]="severity()"
        [rounded]="rounded()"
        [icon]="icon()"
        [tooltip]="tooltip()"
      />
    } @else {
      <app-tag
        [value]="value()"
        [severity]="severity()"
        [rounded]="rounded()"
        [icon]="icon()"
        [tooltip]="tooltip()"
      />
    }
  `,
})
export class LxTag extends TagBase {
  protected platform = inject(PlatformService);
}
