import { Component, computed, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonCheckbox } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../../inputs/base/base-ionic-input";

@Component({
  selector: "ion-input-checkbox",
  imports: [BaseIonicInput, ReactiveFormsModule, IonCheckbox],
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
      <ion-checkbox
        slot="end"
        [id]="id()"
        [formControl]="control() || internalControl"
        [disabled]="disabled() || readonly()"
        (ionChange)="onCheckboxChange($event)"
      >
        @if (placeholder()) {
          {{ placeholder() }}
        }
      </ion-checkbox>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputCheckbox),
      multi: true,
    },
  ],
})
export class IonInputCheckbox extends BaseIonicInput {
  checkChange = output<boolean>();
  customClass = input<string>("");

  inputStyleClass = computed(() => this.customClass());

  onCheckboxChange(event: any): void {
    this.checkChange.emit(event.detail.checked);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
