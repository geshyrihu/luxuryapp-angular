import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { PanelMenuBase } from "@ui/base/panel-menu.base";
import { PanelMenuModule } from "primeng/panelmenu";

@Component({
  selector: "ili-panel-menu",

  imports: [PanelMenuModule],
  template: `<p-panelmenu [model]="model()" [class]="styleClass()"
    ><ng-content
  /></p-panelmenu>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobilePanelMenu extends PanelMenuBase {}
