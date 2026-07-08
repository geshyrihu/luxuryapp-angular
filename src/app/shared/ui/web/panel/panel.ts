import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { PanelModule } from "primeng/panel";
import { PanelBase } from "@ui/base/panel.base";

@Component({
  selector: "app-panel",
  standalone: true,
  imports: [PanelModule],
  template: `
    <p-panel [header]="header()">
      <ng-content />
    </p-panel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppPanel extends PanelBase {}
