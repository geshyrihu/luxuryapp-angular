import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { PanelBase } from "@ui/base/panel.base";
import { PanelModule } from "primeng/panel";

@Component({
  selector: "app-panel",

  imports: [PanelModule],
  template: `
    <p-panel [header]="header()">
      <ng-content />
    </p-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppPanel extends PanelBase {}
