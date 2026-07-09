import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IconFieldBase } from "@ui/base/iconfield.base";
import { IconFieldModule } from "primeng/iconfield";

@Component({
  selector: "app-iconfield",

  imports: [IconFieldModule],
  template: `
    <p-iconfield [iconPosition]="iconPosition()">
      <ng-content />
    </p-iconfield>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AppIconField extends IconFieldBase {}
