import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonCheckbox, IonIcon, IonInput, IonLabel, IonRadio, IonRadioGroup, IonRange, IonSelect, IonSelectOption, IonTextarea, IonToggle } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { checkmarkCircleOutline } from "ionicons/icons";

@Component({
  selector: "app-mobile-forms",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonButton, IonCheckbox, IonIcon, IonInput, IonLabel, IonRadio, IonRadioGroup, IonRange, IonSelect, IonSelectOption, IonTextarea, IonToggle],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Formulario nativo Ionic — Material Design moderno</div>
      <div class="mobile-card-body">
        <div class="flex flex-column gap-3">

          <!-- Text inputs: fill="outline" + label-placement="floating" (Material 3) -->
          <ion-input
            label="Nombre"
            label-placement="floating"
            fill="outline"
            placeholder="Ingresa tu nombre"
            clearInput>
          </ion-input>

          <ion-textarea
            label="Comentarios"
            label-placement="floating"
            fill="outline"
            rows="3"
            placeholder="Escribe tus notas...">
          </ion-textarea>

          <!-- Select: fill="outline" standalone (no ion-item wrapper) -->
          <ion-select
            label="Categoría"
            label-placement="floating"
            fill="outline"
            placeholder="Seleccionar categoría">
            <ion-select-option value="a">Operaciones</ion-select-option>
            <ion-select-option value="b">Mantenimiento</ion-select-option>
            <ion-select-option value="c">Administración</ion-select-option>
          </ion-select>

          <!-- Range con label integrado (Ionic 8) -->
          <ion-range
            label="Nivel de prioridad"
            label-placement="start"
            min="0" max="10" value="5"
            pin="true"
            snaps="true"
            ticks="true">
            <ion-label slot="start">0</ion-label>
            <ion-label slot="end">10</ion-label>
          </ion-range>

          <!-- Checkbox: labelPlacement="end" (Ionic 8 moderno) -->
          <ion-checkbox labelPlacement="end" justify="start">
            Acepto términos y condiciones
          </ion-checkbox>

          <!-- Radio group -->
          <ion-radio-group value="a">
            <p class="text-xs font-bold m-0 mb-2" style="color:var(--ds-text-secondary)">Tipo de usuario</p>
            <div class="flex flex-column gap-1">
              <ion-radio value="a" labelPlacement="end" justify="start">Administrador</ion-radio>
              <ion-radio value="b" labelPlacement="end" justify="start">Operador</ion-radio>
              <ion-radio value="c" labelPlacement="end" justify="start">Solo lectura</ion-radio>
            </div>
          </ion-radio-group>

          <!-- Toggle: labelPlacement="start" + justify="space-between" (Ionic 8) -->
          <ion-toggle labelPlacement="start" justify="space-between" checked="true">
            Notificaciones push
          </ion-toggle>

          <ion-toggle labelPlacement="start" justify="space-between">
            Modo oscuro
          </ion-toggle>

          <!-- Botón submit estándar -->
          <ion-button expand="block" color="primary" style="--border-radius:12px;margin-top:0.5rem;">
            <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
            Guardar
          </ion-button>

        </div>
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
export class MobileForms {
  constructor() {
    addIcons({ checkmarkCircleOutline });
  }
}
