import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IconFieldBase } from "@ui/base/iconfield.base";
import { AppIconField } from "@ui/web/iconfield/iconfield";

@Component({
  selector: "ili-iconfield",

  imports: [AppIconField],
  template: `
    <app-iconfield [iconPosition]="iconPosition()">
      <ng-content />
    </app-iconfield>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobileIconField extends IconFieldBase {}
