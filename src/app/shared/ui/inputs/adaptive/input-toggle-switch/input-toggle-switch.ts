import { Component, forwardRef, inject, input, output, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputToggle } from "../../mobile/ion-input-toggle";
import { WebInputToggleSwitch } from "../../web/input-toggle-switch/input-toggle-switch";

@Component({
  selector: "custom-input-toggle-switch-signal",
  standalone: true,
  imports: [WebInputToggleSwitch, IonInputToggle],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputToggleSwitch),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-toggle
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        (toggleChange)="onToggleChange($event)"
      />
    } @else {
      <web-input-toggle-switch
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
        (toggleChange)="onToggleChange($event)"
      />
    }
  `,
})
export class InputToggleSwitch extends BaseInputSignal {
  protected platform = inject(PlatformService);

  toggleChange = output<any>();
  size = input<"small" | "large" | undefined>(undefined);

  onToggleChange(event: any): void {
    this.toggleChange.emit(event);
  }
}
