import { Component, forwardRef, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonDatetime, IonDatetimeButton, IonModal } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

@Component({
  selector: "ion-input-date-time",
  imports: [BaseIonicInput, ReactiveFormsModule, IonDatetime, IonDatetimeButton, IonModal],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <ion-datetime-button
        [id]="id()"
        [formControl]="control() || internalControl"
        datetime="datetime"
      />
      <ion-modal [keepContentsMounted]="true">
        <ng-template>
          <ion-datetime
            id="datetime"
            presentation="date-time"
            [formControl]="control() || internalControl"
            locale="es-MX"
          />
        </ng-template>
      </ion-modal>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IonInputDateTime), multi: true },
  ],
})
export class IonInputDateTime extends BaseIonicInput {
  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
}
