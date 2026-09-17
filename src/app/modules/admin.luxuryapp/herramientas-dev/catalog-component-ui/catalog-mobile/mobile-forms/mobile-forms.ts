import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonCheckbox, IonInput, IonRange, IonSelect, IonSelectOption, IonTextarea, IonToggle } from "@ionic/angular";

@Component({
  selector: "app-mobile-forms",
  imports: [IonCheckbox, IonInput, IonRange, IonSelect, IonSelectOption, IonTextarea, IonToggle],
  template: `<div class="mobile-card"><div class="mobile-card-header">Forms</div><div class="mobile-card-body d-flex flex-column gap-3"><ion-input label="Nombre" label-placement="floating" fill="outline" /><ion-textarea label="Comentarios" label-placement="floating" fill="outline" /><ion-select label="Categoría" label-placement="floating" fill="outline"><ion-select-option value="ops">Operaciones</ion-select-option><ion-select-option value="admin">Administración</ion-select-option></ion-select><ion-range label="Prioridad" min="0" max="10" value="5" /><ion-checkbox>Acepto términos</ion-checkbox><ion-toggle>Notificaciones</ion-toggle></div></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileForms {}
