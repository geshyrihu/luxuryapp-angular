import { Component, forwardRef, inject, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { MultiSelectModule } from "primeng/multiselect";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-multiselect-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, MultiSelectModule, IonSelect, IonSelectOption],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
    >
      @if (platform.isMobile()) {
        <ion-select
          [id]="id()"
          [multiple]="true"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder() || 'Selecciona múltiples'"
          interface="alert"
          [cancelText]="cancelText()"
          [okText]="okText()"
          (ionChange)="onIonChange($event)"
        >
          @for (opt of options(); track opt[optionValue()]) {
            <ion-select-option [value]="opt[optionValue()]">
              {{ opt[optionLabel()] }}
            </ion-select-option>
          }
        </ion-select>
      } @else {
        <p-multiSelect
          [options]="options()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [filter]="filter()"
          display="chip"
          [showClear]="showClear()"
          [optionLabel]="optionLabel()"
          [optionValue]="optionValue()"
          [group]="group()"
          [optionGroupLabel]="optionGroupLabel()"
          [optionGroupChildren]="optionGroupChildren()"
          [inputId]="id()"
          [class]="getSizeClass()"
          [scrollHeight]="scrollHeight()"
          [panelStyle]="panelStyle()"
          (onChange)="onChange($event.value)"
          (onBlur)="onTouch()"
          appendTo="body"
          fluid
        />
      }
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputMultiselectSignal),
      multi: true,
    },
  ],
})
export class CustomInputMultiselectSignal extends BaseInputSignal {

  selectionChange = output<any>();
  options = input<ISelectItem[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  group = input<boolean>(false);
  optionGroupLabel = input<string>("label");
  optionGroupChildren = input<string>("items");
  filter = input<boolean>(true);
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);
  scrollHeight = input<string>("350px");
  panelStyle = input<Record<string, string>>({ "min-width": "20rem" });
  cancelText = input<string>("Cancelar");
  okText = input<string>("Aceptar");

  onIonChange(event: any): void {
    this.onChange(event.detail.value);
    this.selectionChange.emit(event.detail.value);
  }

  getSizeClass(): string {
    if (this.size() === "small") return "p-inputtext-sm";
    if (this.size() === "large") return "p-inputtext-lg";
    return "";
  }
}
