import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { CardModule } from "primeng/card";

import {
  CustomInputTextSignal,
  CustomInputNumberSignal,
  CustomInputSelectSignal,
  CustomInputDateSignal,
  CustomInputSwitch,
} from "src/app/core/components/inputs/web";

@Component({
  selector: "app-web-inputs",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputSwitch,
  ],
  template: `
    <p-card header="Smart Inputs (Signals Ready)">
      <form [formGroup]="webForm" class="flex flex-column gap-3">
        <custom-input-text-signal [control]="webForm.controls['nombre']" label="Nombre de Usuario" placeholder="Ingresa nombre..." />
        <div class="grid">
          <div class="col-6">
            <custom-input-number-signal [control]="webForm.controls['edad']" label="Edad" [showButtons]="true" />
          </div>
          <div class="col-6">
            <custom-input-date-signal [control]="webForm.controls['fecha']" label="Fecha" />
          </div>
        </div>
        <custom-input-select-signal [control]="webForm.controls['categoria']" [data]="options" label="Nivel de Acceso" [filter]="true" />
        <custom-input-switch-signal [control]="webForm.controls['activo']" label="Habilitar Cuenta" />
      </form>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebInputs {
  private fb = inject(FormBuilder);

  webForm: FormGroup = this.fb.group({
    nombre: [""],
    edad: [null],
    categoria: [null],
    fecha: [null],
    activo: [true],
  });

  readonly options = [
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];
}
