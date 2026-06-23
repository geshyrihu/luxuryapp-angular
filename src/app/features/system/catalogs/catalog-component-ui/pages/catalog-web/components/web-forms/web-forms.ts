import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputFile } from "src/app/core/components/inputs/web/custom-input-file-signal";
import { CustomInputMultiselectSignal } from "src/app/core/components/inputs/web/custom-input-multiselect-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputPassword } from "src/app/core/components/inputs/web/custom-input-password-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";

@Component({
  selector: "app-web-forms",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    MessageModule,
    DividerModule,
    CustomInputTextSignal,
    CustomInputPassword,
    CustomInputNumberSignal,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputMultiselectSignal,
    CustomInputTextAreaSignal,
    CustomInputCheckSignal,
    CustomInputSwitch,
    CustomInputFile,
  ],
  template: `
    <div class="grid">

      <!-- Formulario de solicitud ERP (patrón estándar) -->
      <div class="col-12">
        <p-card header="Formulario ERP — Solicitud Operativa">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Patrón estándar: labels persistentes (<code>custom-input-*</code>),
            grid PrimeFlex, validación visible y acciones Cancelar → Guardar al final.
          </p>

          <form [formGroup]="form" class="formgrid grid">

            <div class="field col-12 md:col-6 xl:col-4">
              <custom-input-text-signal
                [control]="form.controls['nombre']"
                label="Nombre de la solicitud *"
                placeholder="Descripción breve y auditable"
              />
            </div>

            <div class="field col-12 md:col-6 xl:col-4">
              <custom-input-select-signal
                [control]="form.controls['area']"
                label="Área responsable *"
                [data]="areas"
                placeholder="Selecciona área"
              />
            </div>

            <div class="field col-12 md:col-6 xl:col-4">
              <custom-input-select-signal
                [control]="form.controls['prioridad']"
                label="Prioridad"
                [data]="prioridades"
                placeholder="Selecciona prioridad"
              />
            </div>

            <div class="field col-12 md:col-6 xl:col-3">
              <custom-input-currency-signal
                [control]="form.controls['importe']"
                label="Importe autorizado"
              />
            </div>

            <div class="field col-12 md:col-6 xl:col-3">
              <custom-input-number-signal
                [control]="form.controls['cantidad']"
                label="Cantidad"
                [showButtons]="true"
                [min]="1"
              />
            </div>

            <div class="field col-12 md:col-6 xl:col-3">
              <custom-input-date-signal
                [control]="form.controls['fechaCompromiso']"
                label="Fecha compromiso"
              />
            </div>

            <div class="field col-12 md:col-6 xl:col-3">
              <custom-input-date-signal
                [control]="form.controls['fechaVencimiento']"
                label="Fecha vencimiento"
              />
            </div>

            <div class="field col-12 md:col-8">
              <custom-input-multiselect-signal
                [control]="form.controls['modulos']"
                label="Módulos relacionados"
                [options]="modulos"
                placeholder="Selecciona módulos"
              />
            </div>

            <div class="field col-12 md:col-4 flex align-items-end pb-2 gap-4">
              <custom-input-switch-signal
                [control]="form.controls['activo']"
                label="Activo"
              />
              <custom-input-check-signal
                [control]="form.controls['urgente']"
                label="Urgente"
              />
            </div>

            <div class="field col-12">
              <custom-input-textarea-signal
                [control]="form.controls['descripcion']"
                label="Descripción ejecutiva"
                placeholder="Descripción breve, accionable y sin lenguaje ambiguo para el usuario operativo."
                [rows]="3"
              />
            </div>

            <div class="field col-12 md:col-6">
              <custom-input-file-signal
                [control]="form.controls['archivo']"
                label="Documento de soporte"
              />
            </div>

          </form>

          @if (submitted() && form.invalid) {
            <p-message
              severity="error"
              text="Corrige los campos marcados antes de continuar."
              styleClass="mb-3 block"
            />
          }

          @if (saved()) {
            <p-message
              severity="success"
              text="Solicitud guardada correctamente. Folio: ERP-2026-042"
              [closable]="true"
              styleClass="mb-3 block"
            />
          }

          <p-divider />
          <div class="flex justify-content-end gap-2">
            <p-button label="Cancelar"        severity="secondary" [outlined]="true" icon="mdi:close" (onClick)="reset()" />
            <p-button label="Guardar solicitud" icon="mdi:content-save"               (onClick)="submit()" />
          </div>
        </p-card>
      </div>

      <!-- Formulario de acceso / login (referencia) -->
      <div class="col-12 lg:col-6">
        <p-card header="Formulario de Acceso">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Patrón login: email + contraseña con indicador de fortaleza.
          </p>
          <form [formGroup]="loginForm" class="flex flex-column gap-3">
            <custom-input-text-signal
              [control]="loginForm.controls['email']"
              label="Correo electrónico"
              placeholder="admin@luxuryapp.com"
            />
            <custom-input-password-signal
              [control]="loginForm.controls['password']"
              label="Contraseña"
              placeholder="••••••••"
              [showStrengthIndicator]="true"
            />
            @if (loginForm.controls['email'].invalid && loginForm.controls['email'].touched) {
              <p-message severity="error" text="Ingresa un correo electrónico válido." />
            }
            <p-button label="Iniciar sesión" icon="mdi:login" styleClass="w-full" (onClick)="loginForm.markAllAsTouched()" />
          </form>
        </p-card>
      </div>

      <!-- Validación explícita de estados -->
      <div class="col-12 lg:col-6">
        <p-card header="Estados de Validación Explícitos">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Haz clic en «Mostrar errores» para ver todos los estados de validación activos.
          </p>
          <form [formGroup]="validationShowcase" class="flex flex-column gap-3">
            <custom-input-text-signal
              [control]="validationShowcase.controls['requerido']"
              label="Campo requerido (vacío)"
              placeholder="No ingresaste nada"
            />
            <custom-input-text-signal
              [control]="validationShowcase.controls['minLength']"
              label="Mínimo 5 caracteres"
              placeholder="abc"
            />
            <custom-input-number-signal
              [control]="validationShowcase.controls['rango']"
              label="Número entre 10 y 100"
              [min]="10"
              [max]="100"
            />
          </form>
          <p-divider />
          <p-button
            label="Mostrar errores"
            severity="warn"
            [outlined]="true"
            icon="mdi:alert"
            (onClick)="validationShowcase.markAllAsTouched()"
            class="mt-2"
          />
        </p-card>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebForms {
  private fb = inject(FormBuilder);

  submitted = signal(false);
  saved     = signal(false);

  form: FormGroup = this.fb.group({
    nombre:          ["Torre Administrativa", Validators.required],
    area:            [1, Validators.required],
    prioridad:       [2],
    importe:         [125000],
    cantidad:        [1],
    fechaCompromiso: [new Date(2026, 6, 15)],
    fechaVencimiento:[new Date(2026, 8, 30)],
    modulos:         [[1, 3]],
    activo:          [true],
    urgente:         [false],
    descripcion:     ["Descripción breve, accionable y sin lenguaje ambiguo."],
    archivo:         [null],
  });

  loginForm: FormGroup = this.fb.group({
    email:    ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  validationShowcase: FormGroup = this.fb.group({
    requerido: ["", Validators.required],
    minLength: ["ab", [Validators.required, Validators.minLength(5)]],
    rango:     [5,   [Validators.min(10), Validators.max(100)]],
  });

  readonly areas = [
    { label: "Administración",   value: 1 },
    { label: "Operaciones",      value: 2 },
    { label: "Finanzas",         value: 3 },
    { label: "Recursos Humanos", value: 4 },
    { label: "Sistemas",         value: 5 },
  ];

  readonly prioridades = [
    { label: "Baja",   value: 1 },
    { label: "Media",  value: 2 },
    { label: "Alta",   value: 3 },
    { label: "Urgente",value: 4 },
  ];

  readonly modulos = [
    { label: "Cuentas por cobrar", value: 1 },
    { label: "Mantenimiento",      value: 2 },
    { label: "Compras",            value: 3 },
    { label: "Biblioteca",         value: 4 },
    { label: "RRHH",               value: 5 },
  ];

  submit() {
    this.submitted.set(true);
    if (this.form.valid) {
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 5000);
    } else {
      this.form.markAllAsTouched();
    }
  }

  reset() {
    this.submitted.set(false);
    this.saved.set(false);
    this.form.reset({
      activo: true, urgente: false, cantidad: 1, importe: 0,
    });
  }
}
