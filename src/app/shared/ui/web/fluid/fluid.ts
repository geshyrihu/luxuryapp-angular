import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FluidBase } from "@ui/base/fluid.base";
import { FluidModule } from "primeng/fluid";

@Component({
  selector: "app-fluid",

  imports: [FluidModule],
  template: `
    <p-fluid>
      <ng-content />
    </p-fluid>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppFluid extends FluidBase {}
