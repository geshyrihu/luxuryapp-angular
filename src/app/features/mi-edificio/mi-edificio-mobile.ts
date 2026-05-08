import { Component, input } from "@angular/core";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { callOutline, locationOutline, mailOutline } from "ionicons/icons";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-mi-edificio-mobile",
  imports: [
    IonCard,
    IonCardContent,
    IonAvatar,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  ],
  templateUrl: "./mi-edificio-mobile.html",
})
export class MiEdificioMobile {
  data = input<any>();
  baseUrlImg = environment.API_BASE_URL;

  constructor() {
    addIcons({ locationOutline, callOutline, mailOutline });
  }
}
