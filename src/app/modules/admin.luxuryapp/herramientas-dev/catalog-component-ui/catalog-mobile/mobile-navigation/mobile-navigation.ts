import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular";

@Component({
  selector: "app-mobile-navigation",
  imports: [IonButton, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonContent, IonHeader, IonTitle, IonToolbar],
  template: `<ion-menu contentId="catalog-navigation"><ion-header><ion-toolbar><ion-title>Navegación</ion-title></ion-toolbar></ion-header><ion-content><ion-list><ion-item button>Inicio</ion-item><ion-item button>Reportes</ion-item></ion-list></ion-content></ion-menu><div id="catalog-navigation" class="mobile-card"><div class="mobile-card-header d-flex align-items-center gap-2"><ion-menu-button /><span>Navigation</span></div><div class="mobile-card-body"><ion-button expand="block">Abrir menú</ion-button></div></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNavigation {}
