import { Component, forwardRef, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputSelectBool } from "../../mobile/ion-input-select-bool";
import { WebInputSelectBool } from "../../web/input-select-bool/input-select-bool";

@Component({
  selector: "custom-input-select-signal-bool",
  standalone: true,
  imports: [WebInputSelectBool, IonInputSelectBool],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectBool),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-select-bool
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [activeLabel]="activeLabel()"
        [inactiveLabel]="inactiveLabel()"
      />
    } @else {
      <web-input-select-bool
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [activeLabel]="activeLabel()"
        [inactiveLabel]="inactiveLabel()"
        [showClear]="showClear()"
        [size]="size()"
      />
    }
  `,
})
export class InputSelectBool extends BaseInputSignal {
  protected platform = inject(PlatformService);

  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);
}
