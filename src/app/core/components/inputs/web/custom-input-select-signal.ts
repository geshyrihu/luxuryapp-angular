import { Component, forwardRef, inject, input, output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { SelectModule } from "primeng/select";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-select-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, SelectModule, IonSelect, IonSelectOption],
  template: `
    <base-input-signal
      [control]="control()"
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
    >
      @if (platform.isMobile()) {
        <ion-select
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder() || 'Seleccione una opción'"
          [interface]="interfaceMode()"
          [cancelText]="cancelText()"
          [okText]="okText()"
          (ionChange)="onIonChange($event)"
        >
          @for (opt of data(); track opt[optionValue()]) {
            <ion-select-option [value]="opt[optionValue()]">
              {{ opt[optionLabel()] }}
            </ion-select-option>
          }
        </ion-select>
      } @else {
        <p-select
          [options]="data()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [showClear]="showClear()"
          [attr.disabled]="disabled() ? true : null"
          [readonly]="readonly()"
          [inputId]="id()"
          [optionLabel]="optionLabel()"
          [optionValue]="optionValue()"
          [dataKey]="optionValue()"
          [class]="customClass()"
          fluid
          (onChange)="selectionChange.emit($event)"
          appendTo="body"
          [filter]="filter()"
          [filterBy]="filterBy()"
          [invalid]="isInvalid()"
          [size]="size()"
        />
      }
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputSelectSignal),
      multi: true,
    },
  ],
})
export class CustomInputSelectSignal extends BaseInputSignal implements ControlValueAccessor {

  selectionChange = output<any>();
  data = input<ISelectItem[]>([]);
  valueDefault = input<any>(null);
  showClear = input<boolean>(true);
  filter = input<boolean>(false);
  loading = input<boolean>(false);
  filterBy = input<string>("label");
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  interfaceMode = input<"action-sheet" | "alert" | "popover">("action-sheet");
  cancelText = input<string>("Cancelar");
  okText = input<string>("Aceptar");

  constructor() {
    super();
  }

  onIonChange(event: any): void {
    this.selectionChange.emit(event.detail.value);
  }

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
  override writeValue(obj: any): void { super.writeValue(obj); }
  override setDisabledState(isDisabled: boolean): void { super.setDisabledState(isDisabled); }
}
