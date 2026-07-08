import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputGroupBase } from "@ui/base/input-group.base";

@Component({
  selector: "app-input-group",
  standalone: true,
  imports: [CommonModule, InputGroupModule, InputGroupAddonModule],
  template: `
    <p-inputgroup>
      @if (addonBefore()) {
        <p-inputgroup-addon>{{ addonBefore() }}</p-inputgroup-addon>
      }
      <ng-content />
      @if (addonAfter()) {
        <p-inputgroup-addon>{{ addonAfter() }}</p-inputgroup-addon>
      }
    </p-inputgroup>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppInputGroup extends InputGroupBase {}
