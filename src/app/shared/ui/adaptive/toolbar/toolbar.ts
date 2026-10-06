import { Component, ContentChild, inject, TemplateRef } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { ToolbarBase } from "@ui/core/toolbar.base";
import { MobileToolbar } from "@ui/mobile/toolbar/toolbar";
import { AppToolbar } from "@ui/web/toolbar/toolbar";

@Component({
  selector: "lux-toolbar",

  imports: [AppToolbar, MobileToolbar],
  template: `
    @if (platform.isMobile()) {
      <ili-toolbar
        [leftTemplate]="_leftTemplate"
        [rightTemplate]="_rightTemplate"
        [styleClass]="styleClass()"
        ><ng-content
      /></ili-toolbar>
    } @else {
      <lux-toolbar-web
        [leftTemplate]="_leftTemplate"
        [rightTemplate]="_rightTemplate"
        [styleClass]="styleClass()"
        ><ng-content
      /></lux-toolbar-web>
    }
  `,
})
export class LxToolbar extends ToolbarBase {
  protected platform = inject(PlatformService);

  @ContentChild("left") _leftTemplate?: TemplateRef<any>;
  @ContentChild("right") _rightTemplate?: TemplateRef<any>;
}
