import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ToolbarBase } from "@ui/base/toolbar.base";
import { ToolbarModule } from "primeng/toolbar";

@Component({
  selector: "ili-toolbar",
  standalone: true,
  imports: [ToolbarModule],
  template: `<p-toolbar  [class]="styleClass()"><ng-content/></p-toolbar>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileToolbar extends ToolbarBase {}
