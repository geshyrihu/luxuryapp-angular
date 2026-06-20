import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import {
  IonCheckbox,
  IonDatetime,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-forms",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    IonCheckbox,
    IonDatetime,
    IonItem,
    IonLabel,
    IonRadio,
    IonRadioGroup,
    IonRange,
    IonSelect,
    IonSelectOption,
    IonToggle,
  ],
  template: `
    <p-card header="Mobile Form Patterns">
      <div class="flex flex-column gap-3">
        <ion-item>
          <ion-checkbox slot="start"></ion-checkbox>
          <ion-label>Acepto términos y condiciones</ion-label>
        </ion-item>

        <ion-item>
          <ion-radio-group>
            <ion-radio value="opcion1" slot="start"></ion-radio>
            <ion-label>Opción 1</ion-label>
          </ion-radio-group>
        </ion-item>

        <ion-item>
          <ion-range min="0" max="100" value="50"></ion-range>
        </ion-item>

        <ion-item>
          <ion-toggle slot="start"></ion-toggle>
          <ion-label>Notificaciones Push</ion-label>
        </ion-item>

        <ion-item>
          <ion-label>Fecha de Evento</ion-label>
          <ion-datetime slot="end" display-format="DD/MM/YYYY"></ion-datetime>
        </ion-item>

        <ion-item>
          <ion-label>Categoría</ion-label>
          <ion-select slot="end" placeholder="Seleccionar">
            <ion-select-option value="a">Opción A</ion-select-option>
            <ion-select-option value="b">Opción B</ion-select-option>
            <ion-select-option value="c">Opción C</ion-select-option>
          </ion-select>
        </ion-item>
      </div>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileForms {}
