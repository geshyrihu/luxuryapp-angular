import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { MeterGroupBase } from "@ui/base/meter-group.base";
import { MeterGroupModule } from "primeng/metergroup";

@Component({
  selector: "app-meter-group",

  imports: [CommonModule, MeterGroupModule],
  template: ` <p-meterGroup [value]="value()" [min]="min()" [max]="max()" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppMeterGroup extends MeterGroupBase {}
