import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputDatepicker } from "../../mobile/ion-input-datepicker";
import { WebInputDatepicker } from "../../web/input-datepicker/input-datepicker";

@Component({
  selector: "custom-input-datepicker-signal",

  imports: [WebInputDatepicker, IonInputDatepicker],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDatepicker),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-datepicker
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-datepicker
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
        [selectionMode]="selectionMode()"
        [dateFormat]="dateFormat()"
        [showTime]="showTime()"
        [showClear]="showClear()"
        [showIcon]="showIcon()"
        [hourFormat]="hourFormat()"
        [readonlyInput]="readonlyInput()"
        [showButtonBar]="showButtonBar()"
        [dateStyle]="dateStyle()"
        (dateSelect)="dateSelect.emit($event)"
        (dateClear)="dateClear.emit()"
      />
    }
  `,
})
export class InputDatepicker extends BaseInputSignal {
  protected platform = inject(PlatformService);
  selectionMode = input<"single" | "multiple" | "range">("single");
  dateFormat = input<string>("dd/mm/yy");
  showTime = input<boolean>(false);
  showClear = input<boolean>(false);
  showIcon = input<boolean>(true);
  hourFormat = input<string>("24");
  readonlyInput = input<boolean>(true);
  showButtonBar = input<boolean>(true);
  dateStyle = input<Record<string, string>>({ minWidth: "195px" });
  dateSelect = output<any>();
  dateClear = output<void>();
}
