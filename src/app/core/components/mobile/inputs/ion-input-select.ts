import { Component, computed, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../../inputs/base/base-ionic-input";

@Component({
  selector: "ion-input-select",
  imports: [BaseIonicInput, ReactiveFormsModule, IonSelect, IonSelectOption],
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
      <ion-select
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder() || 'Seleccione una opción'"
        label-placement="floating"
        fill="outline"
        [disabled]="disabled() || readonly()"
        [interface]="interfaceMode()"
        [cancelText]="cancelText()"
        [okText]="okText()"
        (ionChange)="onSelectionChange($event)"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
        @for (opt of data(); track opt[optionValue()]) {
          <ion-select-option [value]="opt[optionValue()]">
            {{ opt[optionLabel()] }}
          </ion-select-option>
        }
      </ion-select>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputSelect),
      multi: true,
    },
  ],
})
export class IonInputSelect extends BaseIonicInput {
  selectionChange = output<any>();
  data = input<any[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  interfaceMode = input<"action-sheet" | "alert" | "popover">("action-sheet");
  cancelText = input<string>("Cancelar");
  okText = input<string>("Aceptar");
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);

  inputStyleClass = computed(() => {
    let classes = "ion-input-select-wrapper " + this.customClass();
    if (this.size() === "small") classes += " input-sm";
    if (this.size() === "large") classes += " input-lg";
    return classes.trim();
  });

  onSelectionChange(event: any): void {
    this.selectionChange.emit(event.detail.value);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
