import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  CustomInputTextSignal,
  CustomInputTextAreaSignal,
  CustomSearchInput,
  CustomInputPassword,
  CustomInputNumberSignal,
  CustomInputCurrencySignal,
  CustomInputDateSignal,
  CustomInputTime,
  CustomInputSelectSignal,
  CustomInputMultiselectSignal,
  CustomInputSelectBool,
  CustomInputFile,
  CustomInputSwitch,
  CustomInputCheckSignal,
} from "src/app/core/components/inputs/web";
import { MOBILE_SHOWCASE_STYLES } from "../../../../shared/mobile-showcase-styles";

@Component({
  selector: "app-mobile-inputs",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomSearchInput,
    CustomInputPassword,
    CustomInputNumberSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputTime,
    CustomInputSelectSignal,
    CustomInputMultiselectSignal,
    CustomInputSelectBool,
    CustomInputFile,
    CustomInputSwitch,
    CustomInputCheckSignal,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Custom Inputs — wrappers mobile (label flotante)</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- ─── FIELD STATES (DS) ─── -->
        <div>
          <div class="section-label">Field States (DS)</div>
          <p class="section-desc">Estados estándar de campos de formulario: default, icon, error, disabled.</p>
          <div class="flex flex-column gap-3">
            <div class="ds-field">
              <label class="ds-field__label">Full Name</label>
              <input class="ds-field__input" type="text" placeholder="e.g. John Doe" />
            </div>
            <div class="ds-field">
              <label class="ds-field__label">Email Address</label>
              <div class="ds-field__icon-left">
                <span class="material-symbols-outlined ds-field__icon">mail</span>
                <input class="ds-field__input ds-field__input--icon" type="email" placeholder="name@company.com" />
              </div>
            </div>
            <div class="ds-field ds-field--error">
              <label class="ds-field__label">Password</label>
              <input class="ds-field__input ds-field__input--error" type="password" value="12345" />
              <span class="material-symbols-outlined ds-field__error-icon">error</span>
              <span class="ds-field__error-text">Password is too short</span>
            </div>
            <div class="ds-field">
              <label class="ds-field__label ds-field__label--disabled">User ID (Read-only)</label>
              <input class="ds-field__input ds-field__input--disabled" type="text" value="USR-99210-XB" disabled />
            </div>
            <div class="ds-field">
              <label class="ds-field__label">Bio</label>
              <textarea class="ds-field__textarea" placeholder="Tell us about yourself..." rows="3"></textarea>
            </div>
          </div>
        </div>

        <!-- Buscador standalone -->
        <div>
          <div class="section-label">Buscador</div>
          <p class="section-desc">Sin label, solo placeholder. Se usa en listados para filtrar en tiempo real.</p>
          <custom-search-input-signal
            placeholder="Buscar registros..."
            (searchChange)="mobileForm.controls['buscar'].setValue($event)"
          />
        </div>

        <!-- Texto, contraseña y textarea -->
        <div>
          <div class="section-label">Texto y contraseña</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <custom-input-text-signal
              [control]="mobileForm.controls['nombre']"
              label="Nombre"
              placeholder="Tu nombre..."
              [horizontal]="false"
            />
            <custom-input-password-signal
              [control]="mobileForm.controls['password']"
              label="Contraseña"
              [horizontal]="false"
            />
            <custom-input-textarea-signal
              [control]="mobileForm.controls['comentarios']"
              label="Comentarios"
              placeholder="Notas..."
              [horizontal]="false"
            />
          </form>
        </div>

        <!-- Numéricos -->
        <div>
          <div class="section-label">Numéricos</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <custom-input-number-signal
              [control]="mobileForm.controls['edad']"
              label="Edad"
              [horizontal]="false"
            />
            <custom-input-currency-signal
              [control]="mobileForm.controls['precio']"
              label="Precio"
              [horizontal]="false"
            />
          </form>
        </div>

        <!-- Fecha y hora -->
        <div>
          <div class="section-label">Fecha y hora</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <custom-input-date-signal
              [control]="mobileForm.controls['fecha']"
              label="Fecha"
              [horizontal]="false"
            />
            <custom-input-time-signal
              [control]="mobileForm.controls['hora']"
              label="Hora"
              [horizontal]="false"
            />
          </form>
        </div>

        <!-- Selects -->
        <div>
          <div class="section-label">Selección</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <custom-input-select-signal
              [control]="mobileForm.controls['categoria']"
              label="Categoría"
              [data]="options"
              [horizontal]="false"
            />
            <custom-input-multiselect-signal
              [control]="mobileForm.controls['roles']"
              label="Roles"
              [options]="options"
              [horizontal]="false"
            />
            <custom-input-select-signal-bool
              [control]="mobileForm.controls['activoBool']"
              label="Estado"
              [horizontal]="false"
            />
          </form>
        </div>

        <!-- Controles booleanos y archivo -->
        <div>
          <div class="section-label">Toggle, checkbox y archivo</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <custom-input-switch-signal
              [control]="mobileForm.controls['activo']"
              label="Notificaciones push"
              [horizontal]="false"
            />
            <custom-input-check-signal
              [control]="mobileForm.controls['terminos']"
              placeholder="Acepto términos y condiciones"
            />
            <custom-input-file-signal
              [control]="mobileForm.controls['archivo']"
              label="Adjuntar archivo"
              [horizontal]="false"
            />
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [MOBILE_SHOWCASE_STYLES, `
    .ds-field { position:relative; }
    .ds-field__label { display:block; font-size:0.78rem; font-weight:600; color:var(--ds-text-secondary); margin-bottom:0.25rem; }
    .ds-field__label--disabled { color:var(--ds-text-muted); }
    .ds-field__input { width:100%; height:44px; padding:0 0.85rem; border:1px solid var(--ds-border-strong); border-radius:8px; font-size:0.9rem; background:var(--ds-bg-surface); outline:none; transition:border-color 150ms, box-shadow 150ms; font-family:inherit; color:var(--ds-text-primary); }
    .ds-field__input:focus { border-color:var(--ds-primary); box-shadow:0 0 0 3px color-mix(in srgb, var(--ds-primary) 10%, transparent); }
    .ds-field__input--icon { padding-left:2.5rem; }
    .ds-field__input--error { border-color:var(--ds-danger); }
    .ds-field__input--error:focus { box-shadow:0 0 0 3px color-mix(in srgb, var(--ds-danger) 10%, transparent); }
    .ds-field__input--disabled { background:var(--ds-bg-elevated); color:var(--ds-text-muted); cursor:not-allowed; }
    .ds-field__icon-left { position:relative; }
    .ds-field__icon { position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); font-size:1.25rem; color:var(--ds-text-muted); }
    .ds-field__error-icon { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); font-size:1.25rem; color:var(--ds-danger); }
    .ds-field--error .ds-field__label { color:var(--ds-danger); }
    .ds-field__error-text { display:block; font-size:0.72rem; color:var(--ds-danger); margin-top:0.2rem; }
    .ds-field__textarea { width:100%; padding:0.65rem 0.85rem; border:1px solid var(--ds-border-strong); border-radius:8px; font-size:0.9rem; background:var(--ds-bg-surface); outline:none; resize:vertical; font-family:inherit; transition:border-color 150ms, box-shadow 150ms; color:var(--ds-text-primary); }
    .ds-field__textarea:focus { border-color:var(--ds-primary); box-shadow:0 0 0 3px color-mix(in srgb, var(--ds-primary) 10%, transparent); }
    .material-symbols-outlined { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; vertical-align:middle; }
  `],
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
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];
}
