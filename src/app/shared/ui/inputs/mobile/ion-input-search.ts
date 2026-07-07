import { Component, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonSearchbar } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 🔍 ION INPUT SEARCH - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Barra de búsqueda nativa de Ionic, usada para filtrados o en reemplazo
 * de auto-completes complejos en mobile.
 */
@Component({
  selector: "ion-input-search",
  imports: [BaseIonicInput, ReactiveFormsModule, IonSearchbar],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
      [onlyInput]="true"
    >
      <ion-searchbar
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder() || 'Buscar...'"
        animated="true"
        [debounce]="debounce()"
        (ionInput)="onSearchChange($event)"
        (ionClear)="onClear()"
      ></ion-searchbar>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputSearch),
      multi: true,
    },
  ],
})
export class IonInputSearch extends BaseIonicInput {
  searchChange = output<any>();
  debounce = input<number>(300);

  onSearchChange(event: any): void {
    this.searchChange.emit(event.detail.value);
  }

  onClear(): void {
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(null);
    this.searchChange.emit(null);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
