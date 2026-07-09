import { Component, ContentChild, inject, TemplateRef } from "@angular/core";
import { ToolbarBase } from "@ui/base/toolbar.base";
import { MobileToolbar } from "@ui/mobile/toolbar/toolbar";
import { AppToolbar } from "@ui/web/toolbar/toolbar";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-toolbar",

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
      <app-toolbar
        [leftTemplate]="_leftTemplate"
        [rightTemplate]="_rightTemplate"
        [styleClass]="styleClass()"
        ><ng-content
      /></app-toolbar>
    }
  `,
})
export class LxToolbar extends ToolbarBase {
  protected platform = inject(PlatformService);

  @ContentChild("left") _leftTemplate?: TemplateRef<any>;
  @ContentChild("right") _rightTemplate?: TemplateRef<any>;
}
