import { Component, forwardRef, inject, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonToggle } from "@ionic/angular/standalone";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-switch-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, ToggleSwitchModule, IonToggle],
  template: `
    <base-input-signal
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [control]="control()"
    >
      @if (platform.isMobile()) {
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <ion-toggle
            [id]="id()"
            [formControl]="control() || internalControl"
            (ionChange)="onIonToggleChange($event)"
          />
          @if (placeholder()) {
            <label [for]="id()" style="cursor: pointer; margin: 0;">{{ placeholder() }}</label>
          }
        </div>
      } @else {
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
      }
    </base-input-signal>
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

  onIonToggleChange(event: any): void {
    const newValue = event.detail.checked;
    this.onChange(newValue);
    this.onTouch();
    this.switchChange.emit(newValue);
  }
}
