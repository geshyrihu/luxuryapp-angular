import { Component, forwardRef, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { BaseInputSignal } from "../base/base-input-signal";
import { IonInputToggle } from "../mobile/ion-input-toggle";

@Component({
  selector: "custom-input-switch-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, ToggleSwitchModule, IonInputToggle],
  template: `
    @if (platform.isMobile()) {
      <ion-input-toggle
        [control]="control()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [hidden]="hidden()"
      />
    } @else {
      <base-input-signal
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [control]="control()"
      >
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <p-toggleswitch
            [inputId]="id()"
            [formControl]="control() || internalControl"
            (onChange)="onValueChange($event)"
          />
          @if (placeholder()) {
            <label [for]="id()" style="cursor: pointer; margin: 0; font-size: 0.875rem;">
              {{ placeholder() }}
            </label>
          }
        </div>
      </base-input-signal>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSwitch),
      multi: true,
    },
  ],
})
export class CustomInputSwitch extends BaseInputSignal {

  switchChange = output<boolean>();

  onValueChange(event: any): void {
    const newValue = event.checked ?? (event.target as HTMLInputElement)?.checked;
    this.onChange(newValue);
    this.onTouch();
    this.switchChange.emit(newValue);
  }
}
