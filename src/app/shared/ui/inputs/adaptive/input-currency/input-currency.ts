import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputCurrency } from "../../mobile/ion-input-currency";
import { WebInputCurrency } from "../../web/input-currency/input-currency";

@Component({
  selector: "custom-input-currency-signal",

  imports: [WebInputCurrency, IonInputCurrency],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCurrency),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-currency
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [prefix]="prefix()"
      />
    } @else {
      <web-input-currency
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
        [showButtons]="showButtons()"
        [minFractionDigits]="minFractionDigits()"
        [maxFractionDigits]="maxFractionDigits()"
        [useGrouping]="useGrouping()"
        [prefix]="prefix()"
        [suffix]="suffix()"
        [showClear]="showClear()"
        [customClass]="customClass()"
        [size]="size()"
      />
    }
  `,
})
export class InputCurrency extends BaseInputSignal {
  protected platform = inject(PlatformService);

  showButtons = input<boolean>(false);
  minFractionDigits = input<number>(2);
  maxFractionDigits = input<number>(2);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  useGrouping = input<boolean>(true);
  prefix = input<string | undefined>("$ ");
  suffix = input<string | undefined>(undefined);
  showClear = input<boolean>(false);
}
