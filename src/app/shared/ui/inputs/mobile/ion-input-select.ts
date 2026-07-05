import { Component, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 🔽 ION INPUT SELECT - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Selector nativo (Action Sheet o Popover) para vistas móviles.
 */
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
    >
      <ion-select
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder() || 'Seleccione una opción'"
        label-placement="floating"
        mode="md"
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

  // Botones para interfaz alert
  cancelText = input<string>("Cancelar");
  okText = input<string>("Aceptar");

  override readonly customClass = () => "ion-input-select-wrapper";

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
