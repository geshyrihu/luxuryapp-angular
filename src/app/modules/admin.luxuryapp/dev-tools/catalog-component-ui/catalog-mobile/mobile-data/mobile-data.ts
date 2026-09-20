import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList } from "@ionic/angular";

@Component({
  selector: "app-mobile-data",
  imports: [IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList],
  template: `<div class="mobile-card"><div class="mobile-card-header">Data Display</div><div class="mobile-card-body"><ion-list><ion-item><ion-label>Documento 1</ion-label></ion-item><ion-item><ion-label>Documento 2</ion-label></ion-item></ion-list><ion-accordion-group><ion-accordion value="details"><ion-item slot="header"><ion-label>Detalles</ion-label></ion-item><div slot="content" class="p-3">Contenido de ejemplo</div></ion-accordion></ion-accordion-group></div></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileData {}
