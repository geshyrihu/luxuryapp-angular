import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { MessageModule } from "primeng/message";
import { DividerModule } from "primeng/divider";
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: "app-web-forms",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    MessageModule,
    DividerModule,
    CheckboxModule,
  ],
  template: `
    <p-card header="Form Validation">
      <form [formGroup]="validationForm" class="flex flex-column gap-3">
        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Nombre (requerido)</label>
          <input pInputText formControlName="nombre" class="w-full" placeholder="Nombre completo" />
          @if (validationForm.controls['nombre'].invalid && validationForm.controls['nombre'].touched) {
            <p-message severity="error" text="El nombre es requerido" styleClass="mt-1 block"></p-message>
          }
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Email</label>
          <input pInputText formControlName="email" class="w-full" placeholder="correo@ejemplo.com" />
          @if (validationForm.controls['email'].invalid && validationForm.controls['email'].touched) {
            <p-message severity="error" text="Ingrese un email válido" styleClass="mt-1 block"></p-message>
          }
        </div>

        <div class="grid">
          <div class="col-6">
            <label class="block text-xs font-bold text-secondary mb-1">Edad (mín. 18)</label>
            <p-inputNumber formControlName="edad" class="w-full" [showButtons]="true" [min]="0" [max]="120"></p-inputNumber>
          </div>
          <div class="col-6">
            <label class="block text-xs font-bold text-secondary mb-1">Fecha</label>
            <p-datepicker formControlName="fecha" class="w-full"></p-datepicker>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-secondary mb-1">Rol</label>
          <p-select formControlName="rol" [options]="rolOptions" optionLabel="label" optionValue="value" placeholder="Seleccionar rol" class="w-full"></p-select>
        </div>

        <div class="flex align-items-center gap-2">
          <p-checkbox formControlName="terminos" [binary]="true"></p-checkbox>
          <label class="text-sm">Acepto los términos y condiciones</label>
        </div>

        <p-divider></p-divider>

        <div class="flex gap-2 justify-content-end">
          <button pButton label="Guardar" icon="mdi:content-save" [disabled]="validationForm.invalid" class="p-button-primary"></button>
          <button pButton label="Limpiar" icon="mdi:refresh" class="p-button-secondary p-button-outlined" (click)="validationForm.reset()"></button>
        </div>
      </form>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebForms {
  private fb = inject(FormBuilder);

  validationForm: FormGroup = this.fb.group({
    nombre: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    edad: [null, [Validators.min(18)]],
    fecha: [null],
    rol: [null],
    terminos: [false, Validators.requiredTrue],
  });

  readonly rolOptions = [
    { label: "Administrador", value: "ADMIN" },
    { label: "Supervisor", value: "SUPER" },
    { label: "Operador", value: "OPER" },
    { label: "Consulta", value: "VIEW" },
  ];
}
