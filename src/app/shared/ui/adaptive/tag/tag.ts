import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { TagBase } from "@ui/core/tag.base";
import { MobileTag } from "@ui/mobile/tag/tag";
import { AppTag } from "@ui/web/tag/tag";

@Component({
  selector: "lux-tag",

  imports: [AppTag, MobileTag],
  template: `
    @if (platform.isMobile()) {
      <lux-tag-mobile
        [value]="value()"
        [severity]="severity()"
        [rounded]="rounded()"
        [icon]="icon()"
        [tooltip]="tooltip()"
      />
    } @else {
      <lux-tag-web
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
