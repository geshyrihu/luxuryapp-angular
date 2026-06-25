import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
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
} from "src/app/core/components/inputs/mobile";

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
      <div class="mobile-card-header">Custom Inputs — wrappers mobile (label flotante)</div>
      <div class="mobile-card-body flex flex-column gap-5">

        <!-- Buscador standalone -->
        <div>
          <div class="section-label">Buscador (ion-input-search)</div>
          <p class="section-desc">Sin label, solo placeholder. Se usa en listados para filtrar en tiempo real.</p>
          <ion-input-search
            placeholder="Buscar registros..."
            (searchChange)="mobileForm.controls['buscar'].setValue($event)"
          />
        </div>

        <!-- Texto, contraseña y textarea -->
        <div>
          <div class="section-label">Texto y contraseña</div>
          <p class="section-desc">label-placement="floating" + fill="outline". El label flota al enfocar o cuando tiene valor.</p>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-text
              [control]="mobileForm.controls['nombre']"
              label="Nombre"
              placeholder="Tu nombre..."
              [horizontal]="false"
            />
            <ion-input-password
              [control]="mobileForm.controls['password']"
              label="Contraseña"
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

        <!-- Numéricos -->
        <div>
          <div class="section-label">Numéricos</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-number
              [control]="mobileForm.controls['edad']"
              label="Edad"
              [horizontal]="false"
            />
            <ion-input-currency
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

        <!-- Selects -->
        <div>
          <div class="section-label">Selección</div>
          <form [formGroup]="mobileForm" class="flex flex-column gap-1">
            <ion-input-select
              [control]="mobileForm.controls['categoria']"
              label="Categoría"
              [data]="options"
              [horizontal]="false"
            />
            <ion-input-multiselect
              [control]="mobileForm.controls['roles']"
              label="Roles"
              [options]="options"
              [horizontal]="false"
            />
            <ion-input-select-bool
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
            <ion-input-toggle
              [control]="mobileForm.controls['activo']"
              label="Notificaciones push"
              [horizontal]="false"
            />
            <ion-input-checkbox
              [control]="mobileForm.controls['terminos']"
              placeholder="Acepto términos y condiciones"
            />
            <ion-input-file
              [control]="mobileForm.controls['archivo']"
              label="Adjuntar archivo"
              [horizontal]="false"
            />
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .mobile-card { background: var(--ds-bg-surface,#fff); border: 1px solid var(--ds-border,#e2e8f0); border-radius: var(--ds-radius-lg,8px); overflow: hidden; }
    .mobile-card-header { padding: 0.75rem 1rem; background: var(--ds-bg-elevated,#f4f5f8); font-weight: 600; font-size: var(--ds-font-size-body,0.9375rem); color: var(--ds-text-primary); border-bottom: 1px solid var(--ds-border,#e2e8f0); }
    .mobile-card-body { padding: 1rem; }
    .section-label { font-weight: 700; font-size: 0.8125rem; color: var(--ds-text-secondary,#64748b); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem; }
    .section-desc { font-size: 0.75rem; color: var(--ds-text-muted,#94a3b8); margin: 0 0 0.75rem 0; line-height: 1.4; }
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
