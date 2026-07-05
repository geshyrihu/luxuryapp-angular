import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * ☯️ ION INPUT SELECT BOOL - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Para decisiones binarias (Sí/No, Activo/Inactivo) con interfaz nativa.
 */
@Component({
  selector: "ion-input-select-bool",
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
        interface="action-sheet"
        cancelText="Cancelar"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
        <ion-select-option [value]="true">{{
          activeLabel()
        }}</ion-select-option>
        <ion-select-option [value]="false">{{
          inactiveLabel()
        }}</ion-select-option>
      </ion-select>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputSelectBool),
      multi: true,
    },
  ],
})
export class IonInputSelectBool extends BaseIonicInput {
  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
