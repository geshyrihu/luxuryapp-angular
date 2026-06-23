import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon, IonInput } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { PasswordModule } from "primeng/password";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-password-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    PasswordModule,
    IonInput,
    IonButton,
    IonIcon,
  ],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      @if (platform.isMobile()) {
        <ion-input
          [type]="showPassword() ? 'text' : 'password'"
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          clearInput
          [readonly]="readonly()"
        >
          <ion-button
            fill="clear"
            slot="end"
            aria-label="Toggle password visibility"
            (click)="togglePassword()"
          >
            <ion-icon
              slot="icon-only"
              [name]="showPassword() ? 'eye-outline' : 'eye-off-outline'"
              color="medium"
            />
          </ion-button>
        </ion-input>
      } @else {
        <p-password
          [inputId]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [feedback]="showStrengthIndicator()"
          [toggleMask]="true"
          [promptLabel]="promptLabel()"
          [weakLabel]="weakLabel()"
          [mediumLabel]="mediumLabel()"
          [strongLabel]="strongLabel()"
          [inputStyleClass]="inputStyleClass()"
          [invalid]="isInvalid()"
          fluid
        />
      }
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputPassword),
      multi: true,
    },
  ],
})
export class CustomInputPassword extends BaseInputSignal {

  showPassword = signal(false);

  customClass = input<string>("");
  showStrengthIndicator = input<boolean>(false);
  size = input<"small" | "large" | undefined>(undefined);
  promptLabel = input<string>("Ingresa una contraseña");
  weakLabel = input<string>("Débil");
  mediumLabel = input<string>("Media");
  strongLabel = input<string>("Fuerte");

  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " p-inputtext-sm";
    if (this.size() === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });

  constructor() {
    super();
    addIcons({ eyeOutline, eyeOffOutline });
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
