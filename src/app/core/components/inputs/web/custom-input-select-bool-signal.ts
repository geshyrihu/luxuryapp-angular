import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { BaseInputSignal } from "../base/base-input-signal";
import { IonInputSelectBool } from "../mobile/ion-input-select-bool";

@Component({
  selector: "custom-input-select-signal-bool",
  imports: [BaseInputSignal, ReactiveFormsModule, SelectModule, IonInputSelectBool],
  template: `
    @if (platform.isMobile()) {
      <ion-input-select-bool
        [control]="control()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [customClass]="customClass()"
        [size]="size()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
      >
        <p-select
          [inputId]="id()"
          [options]="boolOptions()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          optionLabel="label"
          optionValue="value"
          [showClear]="showClear()"
          [readonly]="readonly()"
          [class]="getInputStyleClass()"
          fluid
          appendTo="body"
        />
      </base-input-signal>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectBool),
      multi: true,
    },
  ],
})
export class CustomInputSelectBool extends BaseInputSignal {
  customClass = input<string>("");

  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);

  boolOptions = computed(() => [
    { value: true, label: this.activeLabel() },
    { value: false, label: this.inactiveLabel() },
  ]);

  getInputStyleClass = computed(() => {
    if (this.size() === "small") return "p-inputtext-sm";
    if (this.size() === "large") return "p-inputtext-lg";
    return "";
  });
}
