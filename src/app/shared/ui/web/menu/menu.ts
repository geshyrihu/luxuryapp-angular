import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { MenuBase } from "@ui/base/menu.base";
import { MenuModule } from "primeng/menu";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [MenuModule],
  template: `<p-menu [model]="model()" [popup]="popup()" [class]="styleClass()"><ng-content/></p-menu>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppMenu extends MenuBase {}
