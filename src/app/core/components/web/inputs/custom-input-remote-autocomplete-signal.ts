import { CommonModule } from "@angular/common";
import { Component, forwardRef, input, output, signal } from "@angular/core";
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { BaseInputSignal } from "../base/base-input-signal";
import { Observable } from "rxjs";

@Component({
  selector: "custom-input-remote-autocomplete-signal",
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
        [suggestions]="filteredData()"
        (completeMethod)="onSearch($event)"
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
        [emptyMessage]="emptyMessage()"
        [delay]="delay()"
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
      useExisting: forwardRef(() => CustomInputRemoteAutocomplete),
      multi: true,
    },
  ],
})
export class CustomInputRemoteAutocomplete extends BaseInputSignal {
  searchFn = input.required<(query: string) => Observable<ISelectItem[]>>();
  minQueryLength = input<number>(2);
  delay = input<number>(300);
  emptyMessage = input<string>("No se encontraron resultados");
  size = input<"small" | "large" | undefined>(undefined);
  propagar = output<any>();

  filteredData = signal<ISelectItem[]>([]);

  onSearch(event: any): void {
    const query = event.query || "";
    if (query.length < this.minQueryLength()) {
      this.filteredData.set([]);
      return;
    }
    const fn = this.searchFn();
    fn(query).subscribe({
      next: (results) => this.filteredData.set(results),
    });
  }

  onModelChange(value: any): void {
    (this.control() || this.internalControl).setValue(value);
  }

  onSelectItem(event: any): void {
    const item = event.value as ISelectItem;
    (this.control() || this.internalControl).setValue(item);
    this.propagar.emit(item);
  }

  onClear(): void {
    (this.control() || this.internalControl).setValue(null);
    this.propagar.emit(null);
    this.filteredData.set([]);
  }
}
