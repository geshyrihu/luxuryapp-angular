import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonCheckbox, IonDatetime, IonInput, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRange, IonSelect, IonSelectOption, IonTextarea, IonToggle } from "@ionic/angular/standalone";

@Component({
  selector: "app-mobile-forms",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonButton, IonCheckbox, IonDatetime, IonInput, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRange, IonSelect, IonSelectOption, IonTextarea, IonToggle],
  template: `
    <div class="mobile-card">
      <div class="mobile-card-header">Mobile Form Patterns</div>
      <div class="mobile-card-body">
        <div class="flex flex-column gap-3">
          <ion-item>
            <ion-input label="Nombre" label-placement="floating" fill="outline" placeholder="Ingrese nombre"></ion-input>
          </ion-item>

          <ion-item>
            <ion-textarea label="Comentarios" label-placement="floating" fill="outline" rows="3" placeholder="Notas..."></ion-textarea>
          </ion-item>

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

          <ion-button expand="block" type="submit" style="--border-radius:14px;margin-top:0.5rem;">
            Enviar Formulario
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
export class MobileForms {}
