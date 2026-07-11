import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import {
  } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { callOutline, locationOutline, mailOutline } from "ionicons/icons";
import { environment } from "src/environments/environment";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-mi-edificio-mobile",
  imports: [
    AppIcon,],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./mi-edificio-mobile.html",
})
export class MiEdificioMobile {
  data = input<any>();
  baseUrlImg = environment.API_BASE_URL;

  constructor() {
    addIcons({ locationOutline, callOutline, mailOutline });
  }
}
