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
import { IonInputDateTime } from "../../mobile/ion-input-date-time";
import { WebInputDateTime } from "../../web/input-date-time/input-date-time";

@Component({
  selector: "custom-input-date-time-signal",

  imports: [WebInputDateTime, IonInputDateTime],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateTime),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-date-time
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-date-time
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
        [size]="size()"
      />
    }
  `,
})
export class InputDateTime extends BaseInputSignal {
  protected platform = inject(PlatformService);
  size = input<"small" | "large" | undefined>(undefined);
}
