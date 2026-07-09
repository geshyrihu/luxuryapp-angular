import { Component, inject } from "@angular/core";
import { FieldsetBase } from "@ui/base/fieldset.base";
import { IliFieldset } from "@ui/mobile/fieldset/fieldset";
import { AppFieldset } from "@ui/web/fieldset/fieldset";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-fieldset",

  imports: [AppFieldset, IliFieldset],
  template: `
    @if (platform.isMobile()) {
      <ili-fieldset [legend]="legend()">
        <ng-content />
      </ili-fieldset>
    } @else {
      <app-fieldset
        [legend]="legend()"
        [toggleable]="toggleable()"
        [collapsed]="collapsed()"
      >
        <ng-content />
      </app-fieldset>
    }
  `,
})
export class LxFieldset extends FieldsetBase {
  protected platform = inject(PlatformService);
}
