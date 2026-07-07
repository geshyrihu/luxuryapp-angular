import { Component, forwardRef, signal, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon, IonInput } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 🔐 ION INPUT PASSWORD - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Input seguro para contraseñas con botón nativo para ver/ocultar ("ojito").
 */
@Component({
  selector: "ion-input-password",
  imports: [BaseIonicInput, ReactiveFormsModule, IonInput, IonButton, IonIcon],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <ion-input
        [type]="showPassword() ? 'text' : 'password'"
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        fill="outline"
        shape="round"
        clearInput
        [readonly]="readonly()"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
        <ion-button
          fill="clear"
          slot="end"
          aria-label="Toggle password visibility"
          (click)="togglePasswordVisibility()"
        >
          <ion-icon
            slot="icon-only"
            [name]="showPassword() ? 'eye-outline' : 'eye-off-outline'"
            color="medium"
          ></ion-icon>
        </ion-button>
      </ion-input>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputPassword),
      multi: true,
    },
  ],
})
export class IonInputPassword extends BaseIonicInput {
  showPassword = signal(false);

  constructor() {
    super();
    addIcons({ eyeOutline, eyeOffOutline });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
