import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputFile } from "src/app/core/components/inputs/web/custom-input-file-signal";
import { CustomInputHour } from "src/app/core/components/inputs/web/custom-input-hour-signal";
import { CustomInputMultiselectSignal } from "src/app/core/components/inputs/web/custom-input-multiselect-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputPassword } from "src/app/core/components/inputs/web/custom-input-password-signal";
import { CustomInputSelectBool } from "src/app/core/components/inputs/web/custom-input-select-bool-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";

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
    CustomInputHour,
    CustomInputSelectSignal,
    CustomInputMultiselectSignal,
    CustomInputSelectBool,
    CustomInputFile,
    CustomInputSwitch,
    CustomInputCheckSignal,
  ],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Inputs — auto-detectan plataforma (Ionic en mobile, PrimeNG en web)</div>
      <div class="mobile-card-body">
        <form [formGroup]="mobileForm">
        <custom-input-text-signal
          [control]="mobileForm.controls['nombre']"
          label="Nombre"
          placeholder="Tu nombre..."
        />
        <custom-input-textarea-signal
          [control]="mobileForm.controls['comentarios']"
          label="Comentarios"
          placeholder="Notas..."
        />
        <custom-search-input-signal
          placeholder="Buscar..."
          (searchChange)="mobileForm.controls['buscar'].setValue($event)"
        />
        <custom-input-password-signal
          [control]="mobileForm.controls['password']"
          label="Contrasena"
        />
        <custom-input-number-signal
          [control]="mobileForm.controls['edad']"
          label="Edad"
        />
        <custom-input-currency-signal
          [control]="mobileForm.controls['precio']"
          label="Precio"
        />
        <custom-input-date-signal
          [control]="mobileForm.controls['fecha']"
          label="Fecha"
        />
        <custom-input-hour-signal
          [control]="mobileForm.controls['hora']"
          label="Hora"
        />
        <custom-input-select-signal
          [control]="mobileForm.controls['categoria']"
          [data]="options"
          label="Categoria"
        />
        <custom-input-multiselect-signal
          [control]="mobileForm.controls['roles']"
          [options]="options"
          label="Roles"
        />
        <custom-input-select-signal-bool
          [control]="mobileForm.controls['activoBool']"
          label="Estado"
        />
        <custom-input-file-signal
          [control]="mobileForm.controls['archivo']"
          label="Archivo"
        />
        <custom-input-switch-signal
          [control]="mobileForm.controls['activo']"
          label="Activar"
          placeholder="Activar notificaciones"
        />
        <custom-input-check-signal
          [control]="mobileForm.controls['terminos']"
          placeholder="Aceptar Terminos"
        />
      </form>
      </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
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
    { label: "Opcion 1", value: 1 },
    { label: "Opcion 2", value: 2 },
    { label: "Opcion 3", value: 3 },
  ];
}
