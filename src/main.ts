import { registerLocaleData } from "@angular/common";
import localeEsMX from "@angular/common/locales/es-MX";
import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import "iconify-icon";
import { environment } from "src/environments/environment";
import { App } from "./app/app";
import { appConfig } from "./app/app.config";

const iosStandalone =
  (navigator as Navigator & { standalone?: boolean }).standalone === true;
const standalonePwa =
  window.matchMedia("(display-mode: standalone)").matches || iosStandalone;

if (standalonePwa) {
  document.documentElement.classList.add("pwa-standalone");

  // Safari/iOS fallback: CSS touch-action does not suppress pinch zoom on all
  // supported WebKit versions. This event is emitted for multi-touch gestures.
  document.addEventListener(
    "gesturestart",
    (event: Event) => event.preventDefault(),
    { capture: true, passive: false },
  );
}

registerLocaleData(localeEsMX);
if (environment.production) {
  enableProdMode();
}
bootstrapApplication(App, appConfig).catch((err) => console.error(err));











