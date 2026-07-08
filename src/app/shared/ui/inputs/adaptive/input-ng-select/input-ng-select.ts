import { Component, forwardRef, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { WebInputNgSelect } from "../../web/input-ng-select/input-ng-select";
import { IonInputNgSelect } from "../../mobile/ion-input-ng-select";

@Component({
  selector: "custom-input-ng-select",
  standalone: true,
  imports: [WebInputNgSelect, IonInputNgSelect],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputNgSelect), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-ng-select
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [options]="options()"
      />
    } @else {
      <web-input-ng-select
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
        [options]="options()"
        [bindLabel]="bindLabel()"
        [bindValue]="bindValue()"
        [searchable]="searchable()"
        [clearable]="clearable()"
        [multiple]="multiple()"
      />
    }
  `,
})
export class InputNgSelect extends BaseInputSignal {
  protected platform = inject(PlatformService);
  options = input<any[]>([]);
  bindLabel = input<string>("label");
  bindValue = input<string>("value");
  searchable = input<boolean>(true);
  clearable = input<boolean>(true);
  multiple = input<boolean>(false);
}
