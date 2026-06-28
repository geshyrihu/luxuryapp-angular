import { Component, computed, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonToggle } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../../inputs/base/base-ionic-input";

@Component({
  selector: "ion-input-toggle",
  imports: [BaseIonicInput, ReactiveFormsModule, IonToggle],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="requiredInput()"
      [hidden]="hidden()"
      [description]="description()"
      [horizontal]="horizontal()"
      [noMargin]="noMargin()"
      [onlyInput]="onlyInput()"
      [class]="inputStyleClass()"
    >
      <ion-toggle
        slot="end"
        [id]="id()"
        [formControl]="control() || internalControl"
        [disabled]="disabled() || readonly()"
        (ionChange)="onToggleChange($event)"
      >
        @if (placeholder()) {
          {{ placeholder() }}
        }
      </ion-toggle>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputToggle),
      multi: true,
    },
  ],
})
export class IonInputToggle extends BaseIonicInput {
  toggleChange = output<boolean>();
  customClass = input<string>("");

  inputStyleClass = computed(() => this.customClass());

  onToggleChange(event: any): void {
    this.toggleChange.emit(event.detail.checked);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
