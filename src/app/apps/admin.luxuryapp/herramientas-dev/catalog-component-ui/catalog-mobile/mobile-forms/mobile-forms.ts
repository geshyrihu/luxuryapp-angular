import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  IonButton,
  IonCheckbox,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonInputOtp,
  IonLabel,
  IonModal,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  checkmarkCircleOutline,
  keyOutline,
  timeOutline,
} from "ionicons/icons";
import { IliCheckbox } from "@ui/mobile/checkbox/checkbox";
import { MobileRadioButton } from "@ui/mobile/radio-button/radio-button";
import { MobileStepper } from "@ui/mobile/stepper/stepper";
import { MobileSlider } from "@ui/mobile/slider/slider";
import { MobileRating } from "@ui/mobile/rating/rating";
import { MobileKnob } from "@ui/mobile/knob/knob";
import { MobileColorPicker } from "@ui/mobile/color-picker/color-picker";
import { MobileOtpInput } from "@ui/mobile/otp-input/otp-input";

@Component({
  selector: "app-mobile-forms",

  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonCheckbox,
    IonDatetime,
    IonDatetimeButton,
    IonIcon,
    IonInput,
    IonInputOtp,
    IonLabel,
    IonModal,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonRadio,
    IonRadioGroup,
    IonRange,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToggle,
    IliCheckbox,
    MobileRadioButton,
    MobileStepper,
    MobileSlider,
    MobileRating,
    MobileKnob,
    MobileColorPicker,
    MobileOtpInput,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">
        Formulario nativo Ionic é Material Design moderno
      </div>
      <div class="mobile-card-body">
        <div class="flex flex-column gap-3">
          <!-- Text inputs: fill="outline" + label-placement="floating" (Material 3) -->
          <ion-input
            label="Nombre"
            label-placement="floating"
            fill="outline"
            placeholder="Ingresa tu nombre"
            clearInput
          >
          </ion-input>

          <ion-textarea
            label="Comentarios"
            label-placement="floating"
            fill="outline"
            rows="3"
            placeholder="Escribe tus notas..."
          >
          </ion-textarea>

          <!-- Select: fill="outline" standalone (no ion-item wrapper) -->
          <ion-select
            label="Categoría"
            label-placement="floating"
            fill="outline"
            placeholder="Seleccionar categoría"
          >
            <ion-select-option value="a">Operaciones</ion-select-option>
            <ion-select-option value="b">Mantenimiento</ion-select-option>
            <ion-select-option value="c">Administración</ion-select-option>
          </ion-select>

          <!-- Range con label integrado (Ionic 8) -->
          <ion-range
            label="Nivel de prioridad"
            label-placement="start"
            min="0"
            max="10"
            value="5"
            pin="true"
            snaps="true"
            ticks="true"
          >
            <ion-label slot="start">0</ion-label>
            <ion-label slot="end">10</ion-label>
          </ion-range>

          <!-- Checkbox: labelPlacement="end" (Ionic 8 moderno) -->
          <ion-checkbox labelPlacement="end" justify="start">
            Acepto tórminos y condiciones
          </ion-checkbox>

          <!-- Radio group -->
          <ion-radio-group value="a">
            <p
              class="text-xs font-bold m-0 mb-2"
              style="color:var(--ds-text-secondary)"
            >
              Tipo de usuario
            </p>
            <div class="flex flex-column gap-1">
              <ion-radio value="a" labelPlacement="end" justify="start"
                >Administrador</ion-radio
              >
              <ion-radio value="b" labelPlacement="end" justify="start"
                >Operador</ion-radio
              >
              <ion-radio value="c" labelPlacement="end" justify="start"
                >Solo lectura</ion-radio
              >
            </div>
          </ion-radio-group>

          <!-- Toggle: labelPlacement="start" + justify="space-between" (Ionic 8) -->
          <ion-toggle
            labelPlacement="start"
            justify="space-between"
            checked="true"
          >
            Notificaciones push
          </ion-toggle>

          <ion-toggle labelPlacement="start" justify="space-between">
            Modo oscuro
          </ion-toggle>

          <!-- Datetime Button -->
          <div>
            <p
              class="text-xs font-bold m-0 mb-1"
              style="color:var(--ds-text-secondary)"
            >
              <ion-icon
                name="time-outline"
                style="vertical-align:middle;margin-right:4px"
              ></ion-icon>
              Fecha y hora (ion-datetime-button)
            </p>
            <p class="text-xs text-secondary mb-2">
              Abre ion-datetime en un modal nativo al tocar.
            </p>
            <div class="flex align-items-center gap-3 flex-wrap">
              <div class="flex align-items-center gap-1">
                <span class="text-sm">Fecha:</span>
                <ion-datetime-button
                  datetime="cat-dt-date"
                ></ion-datetime-button>
              </div>
              <div class="flex align-items-center gap-1">
                <span class="text-sm">Hora:</span>
                <ion-datetime-button
                  datetime="cat-dt-time"
                ></ion-datetime-button>
              </div>
            </div>
            <ion-modal [keepContentsMounted]="true">
              <ng-template>
                <ion-datetime
                  id="cat-dt-date"
                  presentation="date"
                  [showDefaultButtons]="true"
                ></ion-datetime>
              </ng-template>
            </ion-modal>
            <ion-modal [keepContentsMounted]="true">
              <ng-template>
                <ion-datetime
                  id="cat-dt-time"
                  presentation="time"
                  [showDefaultButtons]="true"
                ></ion-datetime>
              </ng-template>
            </ion-modal>
          </div>

          <!-- Picker inline -->
          <div>
            <p
              class="text-xs font-bold m-0 mb-1"
              style="color:var(--ds-text-secondary)"
            >
              Picker de columnas (ion-picker)
            </p>
            <p class="text-xs text-secondary mb-2">
              Rueda de selección nativa. Desliza para cambiar el valor.
            </p>
            <ion-picker>
              <ion-picker-column [value]="pickerAmPm">
                <ion-picker-column-option value="AM"
                  >AM</ion-picker-column-option
                >
                <ion-picker-column-option value="PM"
                  >PM</ion-picker-column-option
                >
              </ion-picker-column>
              <ion-picker-column [value]="pickerHour">
                @for (h of hours; track h) {
                  <ion-picker-column-option [value]="h">{{
                    h
                  }}</ion-picker-column-option>
                }
              </ion-picker-column>
              <ion-picker-column [value]="pickerMinute">
                @for (m of minutes; track m) {
                  <ion-picker-column-option [value]="m">{{
                    m
                  }}</ion-picker-column-option>
                }
              </ion-picker-column>
            </ion-picker>
          </div>

          <!-- OTP Input -->
          <div>
            <p
              class="text-xs font-bold m-0 mb-1"
              style="color:var(--ds-text-secondary)"
            >
              <ion-icon
                name="key-outline"
                style="vertical-align:middle;margin-right:4px"
              ></ion-icon>
              Código OTP (ion-input-otp)
            </p>
            <p class="text-xs text-secondary mb-2">
              Entrada segmentada para códigos de verificación de 6 dógitos.
            </p>
            <ion-input-otp
              [(ngModel)]="otpValue"
              [length]="6"
              type="number"
            ></ion-input-otp>
            <p class="text-xs text-secondary mt-1">
              Código ingresado: <strong>{{ otpValue || "é" }}</strong>
            </p>
          </div>

          <!-- Botén submit esténdar -->
          <ion-button
            expand="block"
            color="primary"
            style="--border-radius:12px;margin-top:0.5rem;"
          >
            <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
            Guardar
          </ion-button>
        </div>
      </div>
    </div>

    <!-- --- PATRóN: Login (ui-stiich Corporate Integrity) --- -->
    <div class="stiich-section">
      <div class="stiich-section__header">
        <span class="stiich-section__eyebrow">Corporate Integrity</span>
        <h4 class="stiich-section__title">
          Login Screen ó inicio de sesión corporativo
        </h4>
      </div>
      <p class="stiich-section__desc">
        Pantalla de login con glass card, formulario de credenciales y
        autenticación SSO. Inspirado en <code>login_modo_claro</code>.
      </p>
      <div class="stiich-login-card">
        <div class="stiich-login-header">
          <span class="material-symbols-outlined stiich-login-shield"
            >shield</span
          >
          <span class="stiich-login-brand">SecureVault</span>
        </div>
        <div class="stiich-login-body">
          <h3 class="stiich-login-title">Welcome back</h3>
          <p class="stiich-login-subtitle">
            Enter your institutional credentials to access your secure portal.
          </p>

          <div class="stiich-field">
            <label class="stiich-field__label">Email or User ID</label>
            <div class="stiich-field__input-wrap">
              <input
                class="stiich-field__input"
                type="email"
                placeholder="name@corporate.com"
              />
            </div>
          </div>

          <div class="stiich-field">
            <div class="flex justify-content-between">
              <label class="stiich-field__label">Password</label>
              <a class="stiich-field__forgot" href="javascript:void(0)"
                >Forgot Password?</a
              >
            </div>
            <div class="stiich-field__input-wrap">
              <input
                class="stiich-field__input"
                type="password"
                placeholder="óíóíóíóó"
              />
              <button class="stiich-field__pw-toggle">
                <span class="material-symbols-outlined">visibility</span>
              </button>
            </div>
          </div>

          <button class="stiich-btn-block stiich-btn-block--primary">
            Login
          </button>

          <div class="stiich-divider-with-text">
            <span>or</span>
          </div>

          <button class="stiich-btn-block stiich-btn-block--outline">
            <span class="material-symbols-outlined" style="font-size:1.25rem;"
              >key</span
            >
            Login with SSO
          </button>
        </div>
        <div class="stiich-login-footer">
          <div class="stiich-login-badge">
            <span
              class="material-symbols-outlined"
              style="font-size:1rem;color:#00040a;"
              >verified_user</span
            >
            <div>
              <span class="stiich-login-badge__label">Encryption</span>
              <span class="stiich-login-badge__value">AES-256 Enabled</span>
            </div>
          </div>
          <div class="stiich-login-badge">
            <span
              class="material-symbols-outlined"
              style="font-size:1rem;color:#446083;"
              >public</span
            >
            <div>
              <span class="stiich-login-badge__label">Compliance</span>
              <span class="stiich-login-badge__value">SOC2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-card mt-4">
      <div class="mobile-card-header">Form Wrappers (ili-*)</div>
      <div class="mobile-card-body flex flex-column gap-5">
        <div>
          <div class="font-bold text-sm mb-3">ili-checkbox</div>
          <ili-checkbox label="Ili Checkbox" [checked]="true"></ili-checkbox>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-radio-button</div>
          <ili-radio-button label="Ili Radio"></ili-radio-button>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-stepper</div>
          <ili-stepper [steps]="[{label:'Step 1', value:1}, {label:'Step 2', value:2}, {label:'Step 3', value:3}]"></ili-stepper>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-slider</div>
          <ili-slider [value]="50" [min]="0" [max]="100" label="Volume"></ili-slider>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-rating</div>
          <ili-rating [value]="4"></ili-rating>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-knob</div>
          <ili-knob [value]="60"></ili-knob>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-color-picker</div>
          <ili-color-picker [value]="'#ff0000'"></ili-color-picker>
        </div>

        <div>
          <div class="font-bold text-sm mb-3">ili-otp-input</div>
          <ili-otp-input [value]="'1234'"></ili-otp-input>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../shared/mobile-showcase-styles.css"],
  styles: [
    `
      /* -----------------------------------------------
       Corporate Integrity DS é patrones ui-stiich
       ----------------------------------------------- */
      .stiich-section {
        margin-top: 1.5rem;
      }
      .stiich-section__header {
        margin-bottom: 0.25rem;
      }
      .stiich-section__eyebrow {
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--ds-primary);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .stiich-section__desc {
        font-size: 0.75rem;
        color: var(--ds-text-muted);
        margin: 0.25rem 0 0.75rem 0;
        line-height: 1.4;
      }

      .stiich-login-card {
        background: color-mix(in srgb, var(--ds-bg-surface) 85%, transparent);
        backdrop-filter: blur(8px);
        border: 1px solid
          color-mix(in srgb, var(--ds-border-strong) 20%, transparent);
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 1px 3px
          color-mix(in srgb, var(--ds-text-primary) 6%, transparent);
      }
      .stiich-login-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid
          color-mix(in srgb, var(--ds-border-strong) 20%, transparent);
      }
      .stiich-login-shield {
        font-size: 1.5rem;
        color: var(--ds-primary-dark, var(--ds-primary));
        font-variation-settings: "FILL" 1;
      }
      .stiich-login-brand {
        font-weight: 700;
        font-size: 1rem;
        color: var(--ds-primary-dark, var(--ds-primary));
      }
      .stiich-login-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .stiich-login-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .stiich-login-subtitle {
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
        margin: 0;
        line-height: 1.4;
      }

      .stiich-field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .stiich-field__label {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--ds-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .stiich-field__forgot {
        font-size: 0.7rem;
        color: var(--ds-primary-dark, var(--ds-primary));
        text-decoration: none;
        font-weight: 600;
      }
      .stiich-field__forgot:hover {
        text-decoration: underline;
      }
      .stiich-field__input-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }
      .stiich-field__input {
        width: 100%;
        background: var(--ds-bg-surface);
        border: 1px solid
          color-mix(in srgb, var(--ds-border-strong) 50%, transparent);
        border-radius: 0.5rem;
        padding: 0.75rem;
        font-size: 0.875rem;
        font-family: inherit;
        outline: none;
        transition: all 150ms;
      }
      .stiich-field__input:focus {
        border-color: var(--ds-primary);
        box-shadow: 0 0 0 2px
          color-mix(in srgb, var(--ds-primary) 15%, transparent);
      }
      .stiich-field__pw-toggle {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--ds-text-muted);
        padding: 0.25rem;
        display: flex;
      }

      .stiich-btn-block {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border: none;
        cursor: pointer;
        font-weight: 700;
        border-radius: 0.5rem;
        padding: 0.875rem;
        font-size: 0.9375rem;
        font-family: inherit;
        transition: all 150ms;
      }
      .stiich-btn-block--primary {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
        box-shadow: 0 2px 4px
          color-mix(in srgb, var(--ds-primary) 15%, transparent);
      }
      .stiich-btn-block--primary:hover {
        background: var(--ds-primary-dark, var(--ds-primary));
      }
      .stiich-btn-block--outline {
        background: transparent;
        color: var(--ds-primary);
        border: 1px solid var(--ds-primary);
      }
      .stiich-btn-block--outline:hover {
        background: color-mix(in srgb, var(--ds-primary) 5%, transparent);
      }

      .stiich-divider-with-text {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .stiich-divider-with-text::before,
      .stiich-divider-with-text::after {
        content: "";
        flex: 1;
        height: 1px;
        background: color-mix(
          in srgb,
          var(--ds-border-strong) 20%,
          transparent
        );
      }
      .stiich-divider-with-text span {
        font-size: 0.7rem;
        color: var(--ds-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 600;
      }

      .stiich-login-footer {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-top: 1px solid
          color-mix(in srgb, var(--ds-border-strong) 20%, transparent);
      }
      .stiich-login-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .stiich-login-badge__label {
        display: block;
        font-size: 0.6rem;
        font-weight: 700;
        color: #00040a;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .stiich-login-badge__value {
        display: block;
        font-size: 0.65rem;
        color: #44474c;
      }
      .material-symbols-outlined {
        font-variation-settings:
          "FILL" 0,
          "wght" 400,
          "GRAD" 0,
          "opsz" 24;
        vertical-align: middle;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileForms {
  otpValue = "";
  pickerAmPm = "AM";
  pickerHour = "09";
  pickerMinute = "00";

  readonly hours = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  readonly minutes = [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ];

  constructor() {
    addIcons({ checkmarkCircleOutline, keyOutline, timeOutline });
  }
}
