import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { PanelmenuBase } from "@ui/base/panelmenu.base";
import { PanelMenuModule } from "primeng/panelmenu";

@Component({
  selector: "app-panelmenu",
  standalone: true,
  imports: [PanelMenuModule],
  template: `<p-panelMenu [model]="model()" [class]="styleClass()"><ng-content/></p-panelMenu>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppPanelmenu extends PanelmenuBase {}
