import { CommonModule } from "@angular/common";
import { Component, forwardRef, input, output } from "@angular/core";
import {
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
} from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-autocomplete-signal",
  imports: [
    CommonModule,
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
      [required]="requiredInput()"
      [description]="description()"
      [hidden]="hidden()"
    >
      <p-autoComplete
        [suggestions]="filteredData"
        (completeMethod)="search($event)"
        (onSelect)="onSelectItem($event)"
        (onClear)="onClear()"
        [ngModel]="(control() || internalControl).value"
        (ngModelChange)="onModelChange($event)"
        [optionLabel]="'label'"
        [dataKey]="'value'"
        [placeholder]="placeholder()"
        [forceSelection]="true"
        [showClear]="true"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [emptyMessage]="'No se encontraron resultados'"
        fluid
        [inputId]="id()"
        [class.p-inputtext-sm]="size() === 'small'"
        [class.p-inputtext-lg]="size() === 'large'"
        appendTo="body"
      >
        <ng-template let-item pTemplate="item">
          {{ item.label }}
        </ng-template>
        <ng-template let-item pTemplate="selectedItem">
          {{ item?.label || "" }}
        </ng-template>
      </p-autoComplete>
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputAutoComplete),
      multi: true,
    },
  ],
})
export class CustomInputAutoComplete extends BaseInputSignal {
  data = input<ISelectItem[]>([]);
  size = input<"small" | "large" | undefined>(undefined);
  propagar = output<any>();

  filteredData: ISelectItem[] = [];

  search(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredData = this.data().filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }

  public onModelChange(value: any): void {
    // Actualizar el FormControl con el objeto completo
    (this.control() || this.internalControl).setValue(value);
  }

  public onSelectItem(event: any): void {
    const selectedItem = event.value as ISelectItem;
    // Actualizar el FormControl con el objeto completo
    (this.control() || this.internalControl).setValue(selectedItem);
    // Emitir el OBJETO COMPLETO para actualizar el formulario padre
    this.propagar.emit(selectedItem);
  }

  public onClear(): void {
    (this.control() || this.internalControl).setValue(null);
    this.propagar.emit(null);
  }
}










