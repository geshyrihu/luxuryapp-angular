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
import { IonInputAutocomplete } from "../../mobile/ion-input-autocomplete";
import { WebInputAutocomplete } from "../../web/input-autocomplete/input-autocomplete";

@Component({
  selector: "custom-input-autocomplete-signal",

  imports: [WebInputAutocomplete, IonInputAutocomplete],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocomplete),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-autocomplete
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [suggestions]="data()"
      />
    } @else {
      <web-input-autocomplete
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
        [onlyInput]="onlyInput()"
        [forceSelection]="forceSelection()"
        [dropdown]="dropdown()"
        [data]="data()"
        [field]="field()"
        (propagar)="propagar.emit($event)"
        (completeMethod)="completeMethod.emit($event)"
        (cleared)="cleared.emit()"
      />
    }
  `,
})
export class InputAutocomplete extends BaseInputSignal {
  protected platform = inject(PlatformService);
  data = input<any[]>([]);
  field = input<string>("label");
  forceSelection = input<boolean>(true);
  dropdown = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(28);

  propagar = output<any>();
  completeMethod = output<any>();
  cleared = output<void>();
}
