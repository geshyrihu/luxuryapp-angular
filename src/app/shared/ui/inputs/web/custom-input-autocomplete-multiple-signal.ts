import { Component, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../base/base-input-signal";

/**
 * 🏷️ CUSTOM INPUT AUTOCOMPLETE MULTIPLE
 * -------------------------------------------------------------------------
 * Para cuando una sola opción no basta.
 * Permite seleccionar múltiples elementos con búsqueda inteligente.
 * ¡Atrapa todos los Pokémons que quieras! 🔴⚪
 */
@Component({
  selector: "custom-input-autocomplete-multiple-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    AutoCompleteModule,
    FormsModule,
  ],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <p-autocomplete
        [suggestions]="filteredData"
        (completeMethod)="search($event)"
        (onSelect)="onSelectItem($event)"
        (onUnselect)="onUnselectItem($event)"
        (onClear)="onClear()"
        [ngModel]="(control() || internalControl).value"
        (ngModelChange)="onModelChange($event)"
        [optionLabel]="'label'"
        [dataKey]="'value'"
        [placeholder]="placeholder()"
        [showClear]="true"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [emptyMessage]="'No se encontraron resultados'"
        [multiple]="true"
        fluid
        [inputId]="id()"
        [class]="getSizeClass()"
        appendTo="body"
      >
        <ng-template let-item #item>
          {{ item.label }}
        </ng-template>
        <ng-template let-item #selectedItem>
          {{ item?.label || "" }}
        </ng-template>
      </p-autocomplete>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputAutoMultiple),
      multi: true,
    },
  ],
})
export class CustomInputAutoMultiple extends BaseInputSignal {
  // <--- Inputs Específicos --->
  data = input<ISelectItem[]>([]);
  size = input<"small" | "large" | undefined>(undefined);

  // <--- Outputs --->
  propagar = output<any[]>();

  filteredData: ISelectItem[] = [];

  getSizeClass(): string {
    if (this.size() === "small") return "p-inputtext-sm";
    if (this.size() === "large") return "p-inputtext-lg";
    return "";
  }

  // 🔍 Lógica de búsqueda
  search(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredData = this.data().filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }

  public onModelChange(value: any[]): void {
    (this.control() || this.internalControl).setValue(value);
    const selectedValues = value ? value.map((item) => item.value) : [];
    this.propagar.emit(selectedValues);
  }

  // ✅ Al seleccionar un item
  public onSelectItem(event: any): void {
    const ctrl = this.control() || this.internalControl;
    const currentValue = ctrl.value || [];
    const selectedItem = event.value;

    const exists = currentValue.some(
      (item: any) => item.value === selectedItem.value,
    );

    if (!exists) {
      const newValue = [...currentValue, selectedItem];
      ctrl.setValue(newValue);
      const selectedValues = newValue.map((item) => item.value);
      this.propagar.emit(selectedValues);
    }
  }

  // ❌ Al deseleccionar un item
  public onUnselectItem(event: any): void {
    const ctrl = this.control() || this.internalControl;
    const currentValue = ctrl.value || [];
    const unselectedItem = event.value;

    const newValue = currentValue.filter(
      (item: any) => item.value !== unselectedItem.value,
    );

    ctrl.setValue(newValue);
    const selectedValues = newValue.map((item) => item.value);
    this.propagar.emit(selectedValues);
  }

  public onClear(): void {
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue([]);
    this.propagar.emit([]);
  }
}
