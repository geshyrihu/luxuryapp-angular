import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonTextarea } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 📄 ION INPUT TEXTAREA - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Área de texto multilinea responsiva nativa para vistas móviles.
 */
@Component({
  selector: "ion-input-textarea",
  imports: [BaseIonicInput, ReactiveFormsModule, IonTextarea],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <ion-textarea
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        mode="md"
        fill="outline"
        [readonly]="readonly()"
        [rows]="rows()"
        [maxlength]="maxLength()"
        [autoGrow]="autoGrow()"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
      </ion-textarea>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputTextarea),
      multi: true,
    },
  ],
})
export class IonInputTextarea extends BaseIonicInput {
  rows = input<number>(3);
  maxLength = input<number | undefined>(undefined);
  autoGrow = input<boolean>(true);

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
