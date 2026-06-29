import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonTextarea } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../../shared/inputs/base/base-ionic-input";

@Component({
  selector: "ion-input-textarea",
  imports: [BaseIonicInput, ReactiveFormsModule, IonTextarea],
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
      <ion-textarea
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        fill="outline"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [rows]="rows()"
        [maxlength]="maxLength()"
        [autoGrow]="autoGrow()"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
      </ion-textarea>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputTextarea),
      multi: true,
    },
  ],
})
export class IonInputTextarea extends BaseIonicInput {
  rows = input<number>(3);
  maxLength = input<number | undefined>(undefined);
  autoGrow = input<boolean>(true);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);

  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " input-sm";
    if (this.size() === "large") classes += " input-lg";
    return classes.trim();
  });

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}

