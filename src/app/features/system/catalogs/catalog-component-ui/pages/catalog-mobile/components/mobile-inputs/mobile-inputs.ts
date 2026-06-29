import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  IonInputCheckbox,
  IonInputCurrency,
  IonInputDate,
  IonInputFile,
  IonInputMultiselect,
  IonInputNumber,
  IonInputPassword,
  IonInputSearch,
  IonInputSelect,
  IonInputSelectBool,
  IonInputText,
  IonInputTextarea,
  IonInputTime,
  IonInputToggle,
} from "src/app/core/components/inputs/mobile";
import { MOBILE_SHOWCASE_STYLES } from "../../../../shared/mobile-showcase-styles";

@Component({
  selector: "app-mobile-inputs",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInputText,
    IonInputTextarea,
    IonInputSearch,
    IonInputPassword,
    IonInputNumber,
    IonInputCurrency,
    IonInputDate,
    IonInputTime,
    IonInputSelect,
    IonInputMultiselect,
    IonInputSelectBool,
    IonInputFile,
    IonInputToggle,
    IonInputCheckbox,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">
        Mobile Inputs - wrappers Ionic reales
      </div>
      <div class="mobile-card-body flex flex-column gap-5">
        <div>
          <div class="section-label">Field states</div>
          <p class="section-desc">
            Estados base para una interfaz mobile real: default, icono, error,
            disabled y textarea.
          </p>
          <div class="flex flex-column gap-3">
            <div class="ds-field">
              <label class="ds-field__label">Full Name</label>
              <input
                class="ds-field__input"
                type="text"
                placeholder="e.g. John Doe"
              />
            </div>
            <div class="ds-field">
              <label class="ds-field__label">Email Address</label>
              <div class="ds-field__icon-left">
                <span class="material-symbols-outlined ds-field__icon"
                  >mail</span
                >
                <input
                  class="ds-field__input ds-field__input--icon"
                  type="email"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div class="ds-field ds-field--error">
              <label class="ds-field__label">Password</label>
              <input
                class="ds-field__input ds-field__input--error"
                type="password"
                value="12345"
              />
              <span class="material-symbols-outlined ds-field__error-icon"
                >error</span
              >
              <span class="ds-field__error-text">Password is too short</span>
            </div>
            <div class="ds-field">
              <label class="ds-field__label ds-field__label--disabled"
                >User ID (Read-only)</label
              >
              <input
                class="ds-field__input ds-field__input--disabled"
                type="text"
                value="USR-99210-XB"
                disabled
              />
            </div>
            <div class="ds-field">
              <label class="ds-field__label">Bio</label>
              <textarea
                class="ds-field__textarea"
                placeholder="Tell us about yourself..."
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div>
          <div class="section-label">Buscador</div>
          <p class="section-desc">
            Input Ionic real para filtros y listados mobile.
          </p>
          <ion-input-search
            [control]="mobileForm.controls['buscar']"
            label="Buscar"
            placeholder="Buscar registros..."
            [horizontal]="false"
          />
        </div>

        <div>
          <div class="section-label">Texto y password</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-text
              [control]="mobileForm.controls['nombre']"
              label="Nombre"
              placeholder="Tu nombre..."
              [horizontal]="false"
            />
            <ion-input-password
              [control]="mobileForm.controls['password']"
              label="Password"
              placeholder="Escribe tu password"
              [horizontal]="false"
            />
            <ion-input-textarea
              [control]="mobileForm.controls['comentarios']"
              label="Comentarios"
              placeholder="Notas..."
              [horizontal]="false"
            />
          </form>
        </div>

        <div>
          <div class="section-label">Numericos</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-number
              [control]="mobileForm.controls['edad']"
              label="Edad"
              placeholder="18"
              [horizontal]="false"
            />
            <ion-input-currency
              [control]="mobileForm.controls['precio']"
              label="Precio"
              placeholder="$ 0.00"
              [horizontal]="false"
            />
          </form>
        </div>

        <div>
          <div class="section-label">Fecha y hora</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-date
              [control]="mobileForm.controls['fecha']"
              label="Fecha"
              [horizontal]="false"
            />
            <ion-input-time
              [control]="mobileForm.controls['hora']"
              label="Hora"
              [horizontal]="false"
            />
          </form>
        </div>

        <div>
          <div class="section-label">Seleccion</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-select
              [control]="mobileForm.controls['categoria']"
              label="Categoria"
              [data]="options"
              placeholder="Selecciona una categoria"
              [horizontal]="false"
            />
            <ion-input-multiselect
              [control]="mobileForm.controls['roles']"
              label="Roles"
              [options]="options"
              placeholder="Selecciona uno o mas roles"
              [horizontal]="false"
            />
            <ion-input-select-bool
              [control]="mobileForm.controls['activoBool']"
              label="Estado"
              [horizontal]="false"
            />
          </form>
        </div>

        <div>
          <div class="section-label">Toggle, checkbox y archivo</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-toggle
              [control]="mobileForm.controls['activo']"
              label="Notificaciones push"
              placeholder="Activar"
              [horizontal]="false"
            />
            <ion-input-checkbox
              [control]="mobileForm.controls['terminos']"
              label="Terminos"
              placeholder="Acepto terminos y condiciones"
            />
            <ion-input-file
              [control]="mobileForm.controls['archivo']"
              label="Adjuntar archivo"
              chooseLabel="Seleccionar archivo"
              [horizontal]="false"
            />
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    MOBILE_SHOWCASE_STYLES,
    `
      .ds-field {
        position: relative;
      }
      .ds-field__label {
        display: block;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--ds-text-secondary);
        margin-bottom: 0.25rem;
      }
      .ds-field__label--disabled {
        color: var(--ds-text-muted);
      }
      .ds-field__input {
        width: 100%;
        height: 44px;
        padding: 0 0.85rem;
        border: 1px solid var(--ds-border-strong);
        border-radius: 8px;
        font-size: 0.9rem;
        background: var(--ds-bg-surface);
        outline: none;
        transition:
          border-color 150ms,
          box-shadow 150ms;
        font-family: inherit;
        color: var(--ds-text-primary);
      }
      .ds-field__input:focus {
        border-color: var(--ds-primary);
        box-shadow: 0 0 0 3px
          color-mix(in srgb, var(--ds-primary) 10%, transparent);
      }
      .ds-field__input--icon {
        padding-left: 2.5rem;
      }
      .ds-field__input--error {
        border-color: var(--ds-danger);
      }
      .ds-field__input--error:focus {
        box-shadow: 0 0 0 3px
          color-mix(in srgb, var(--ds-danger) 10%, transparent);
      }
      .ds-field__input--disabled {
        background: var(--ds-bg-elevated);
        color: var(--ds-text-muted);
        cursor: not-allowed;
      }
      .ds-field__icon-left {
        position: relative;
      }
      .ds-field__icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.25rem;
        color: var(--ds-text-muted);
      }
      .ds-field__error-icon {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.25rem;
        color: var(--ds-danger);
      }
      .ds-field--error .ds-field__label {
        color: var(--ds-danger);
      }
      .ds-field__error-text {
        display: block;
        font-size: 0.72rem;
        color: var(--ds-danger);
        margin-top: 0.2rem;
      }
      .ds-field__textarea {
        width: 100%;
        padding: 0.65rem 0.85rem;
        border: 1px solid var(--ds-border-strong);
        border-radius: 8px;
        font-size: 0.9rem;
        background: var(--ds-bg-surface);
        outline: none;
        resize: vertical;
        font-family: inherit;
        transition:
          border-color 150ms,
          box-shadow 150ms;
        color: var(--ds-text-primary);
      }
      .ds-field__textarea:focus {
        border-color: var(--ds-primary);
        box-shadow: 0 0 0 3px
          color-mix(in srgb, var(--ds-primary) 10%, transparent);
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
  encapsulation: ViewEncapsulation.None,
})
export class MobileInputs {
  private fb = inject(FormBuilder);

  mobileForm: FormGroup = this.fb.group({
    nombre: [""],
    comentarios: [""],
    buscar: [""],
    password: [""],
    edad: [null],
    precio: [null],
    fecha: [null],
    hora: [null],
    categoria: [null],
    roles: [[]],
    activoBool: [null],
    archivo: [null],
    activo: [true],
    terminos: [false],
  });

  readonly options = [
    { label: "Opcion 1", value: 1 },
    { label: "Opcion 2", value: 2 },
    { label: "Opcion 3", value: 3 },
  ];
}
