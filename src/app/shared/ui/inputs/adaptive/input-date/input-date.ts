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
import { IonInputDate } from "../../mobile/ion-input-date";
import { WebInputDate } from "../../web/input-date/input-date";

@Component({
  selector: "custom-input-date-signal",

  imports: [WebInputDate, IonInputDate],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDate),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-date
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-date
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
        [disable]="disable()"
        [mode]="mode()"
      />
    }
  `,
})
export class InputDate extends BaseInputSignal {
  protected platform = inject(PlatformService);

  disable = input<Date[]>([]);
  mode = input<"single" | "multiple" | "range">("single");
}
