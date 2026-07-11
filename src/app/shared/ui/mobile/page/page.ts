import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonApp, IonContent } from "@ionic/angular/standalone";

/**
 * MobilePage — Shell de página móvil de pantalla completa sobre
 * `ion-app` + `ion-content`. Para páginas standalone (auth, onboarding)
 * que no viven dentro de un layout con `ion-app` propio.
 *
 * `background` se aplica como `--background` del `ion-content`
 * (los estilos scoped del consumidor no cruzan el boundary).
 */
@Component({
  selector: "ili-page",
  imports: [IonApp, IonContent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-app>
      <ion-content
        [fullscreen]="fullscreen()"
        [style.--background]="background() || null"
      >
        <ng-content />
      </ion-content>
    </ion-app>
  `,
})
export class MobilePage {
  fullscreen = input<boolean>(true);
  background = input<string>("");
}
