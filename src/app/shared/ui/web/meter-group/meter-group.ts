import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { MeterGroupBase } from "@ui/base/meter-group.base";
import { MeterGroupModule } from "primeng/metergroup";

@Component({
  selector: "app-meter-group",
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [MeterGroupModule],
  template: ` <p-meterGroup [value]="value()" [min]="min()" [max]="max()" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppMeterGroup extends MeterGroupBase {}
