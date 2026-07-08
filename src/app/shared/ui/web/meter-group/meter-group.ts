import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeterGroupModule } from "primeng/metergroup";
import { MeterGroupBase } from "@ui/base/meter-group.base";

@Component({
  selector: "app-meter-group",
  standalone: true,
  imports: [CommonModule, MeterGroupModule],
  template: `
    <p-meterGroup
      [value]="value()"
      [min]="min()"
      [max]="max()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppMeterGroup extends MeterGroupBase {}
