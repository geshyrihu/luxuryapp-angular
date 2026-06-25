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
      <div class="mobile-card-header">Inputs — Ionic nativos</div>
      <div class="mobile-card-body">
        <form [formGroup]="mobileForm">
          <ion-input-text [control]="mobileForm.controls['nombre']" label="Nombre" placeholder="Tu nombre..." />
          <ion-input-textarea [control]="mobileForm.controls['comentarios']" label="Comentarios" placeholder="Notas..." />
          <ion-input-search placeholder="Buscar..." (searchChange)="mobileForm.controls['buscar'].setValue($event)" />
          <ion-input-password [control]="mobileForm.controls['password']" label="Contraseña" />
          <ion-input-number [control]="mobileForm.controls['edad']" label="Edad" />
          <ion-input-currency [control]="mobileForm.controls['precio']" label="Precio" />
          <ion-input-date [control]="mobileForm.controls['fecha']" label="Fecha" />
          <ion-input-time [control]="mobileForm.controls['hora']" label="Hora" />
          <ion-input-select [control]="mobileForm.controls['categoria']" [data]="options" label="Categoría" />
          <ion-input-multiselect [control]="mobileForm.controls['roles']" [options]="options" label="Roles" />
          <ion-input-select-bool [control]="mobileForm.controls['activoBool']" label="Estado" />
          <ion-input-file [control]="mobileForm.controls['archivo']" label="Archivo" />
          <ion-input-toggle [control]="mobileForm.controls['activo']" label="Activar" placeholder="Activar notificaciones" />
          <ion-input-checkbox [control]="mobileForm.controls['terminos']" placeholder="Aceptar Términos" />
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
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];
}
