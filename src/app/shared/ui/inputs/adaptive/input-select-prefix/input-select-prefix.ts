import { Component, forwardRef, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { WebInputSelectPrefix } from "../../web/input-select-prefix/input-select-prefix";
import { IonInputSelectPrefix } from "../../mobile/ion-input-select-prefix";

@Component({
  selector: "custom-input-select-signal-prefix",
  standalone: true,
  imports: [WebInputSelectPrefix, IonInputSelectPrefix],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputSelectPrefix), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-select-prefix
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [prefixOptions]="items()"
        [selectedPrefix]="selectedPrefixValue()"
      />
    } @else {
      <web-input-select-prefix
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
        [items]="items()"
        [prefixField]="prefixField()"
      />
    }
  `,
})
export class InputSelectPrefix extends BaseInputSignal {
  protected platform = inject(PlatformService);
  items = input<any[]>([]);
  prefixField = input<string>("prefix");
  selectedPrefixValue = input<string>("");
}
