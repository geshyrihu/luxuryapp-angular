import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IconFieldModule } from "primeng/iconfield";
import { IconFieldBase } from "@ui/base/iconfield.base";

@Component({
  selector: "app-iconfield",
  standalone: true,
  imports: [IconFieldModule],
  template: `
    <p-iconfield [iconPosition]="iconPosition()">
      <ng-content />
    </p-iconfield>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AppIconField extends IconFieldBase {}
