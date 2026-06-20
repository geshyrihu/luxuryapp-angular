import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import {
  IonInputNumber,
  IonInputSelect,
  IonInputText,
  IonInputToggle,
} from "src/app/core/components/inputs/mobile";

@Component({
  selector: "app-mobile-inputs",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    IonInputText,
    IonInputNumber,
    IonInputSelect,
    IonInputToggle,
  ],
  template: `
    <p-card header="Ionic Smart Inputs">
      <form [formGroup]="mobileForm">
        <ion-input-text
          [control]="mobileForm.controls['nombre']"
          label="Nombre"
          placeholder="Nombre completo"
        />
        <ion-input-number
          [control]="mobileForm.controls['edad']"
          label="Edad"
          placeholder="0"
        />
        <ion-input-select
          [control]="mobileForm.controls['categoria']"
          [data]="options"
          label="Categoría"
        />
        <ion-input-toggle
          [control]="mobileForm.controls['activo']"
          label="Activo"
        />
      </form>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileInputs {
  mobileForm: FormGroup;
  options = [
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];

  constructor(private fb: FormBuilder) {
    this.mobileForm = this.fb.group({
      nombre: [""],
      edad: [null],
      categoria: [null],
      activo: [true],
    });
  }
}
