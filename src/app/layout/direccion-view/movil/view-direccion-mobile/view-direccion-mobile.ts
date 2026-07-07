import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonToolbar,
} from "@ionic/angular/standalone";
import { Loader } from "@ui/mobile/loader/loader";
import { HeaderMobile } from "../../../shared/header-mobile/header-mobile";

@Component({
  selector: "app-view-direccion-mobile",
  imports: [
    RouterOutlet,
    HeaderMobile,
    IonApp,
    IonContent,
    IonHeader,
    IonToolbar,
    Loader,
  ],
  templateUrl: "./view-direccion-mobile.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }
      ion-app {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class ViewDireccionMobile {}

