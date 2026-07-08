import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FluidBase } from "@ui/base/fluid.base";

@Component({
  selector: "ili-fluid",

  imports: [CommonModule],
  template: `
    <div class="ili-fluid">
      <ng-content />
    </div>
  `,
  styles: [
    `
      .ili-fluid {
        display: block;
        width: 100%;
      }
      .ili-fluid > * {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileFluid extends FluidBase {}
