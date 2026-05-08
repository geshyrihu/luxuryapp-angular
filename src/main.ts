import { registerLocaleData } from "@angular/common";
import localeEsMX from "@angular/common/locales/es-MX";
import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { App } from "./app/app";
import { appConfig } from "./app/app.config";

registerLocaleData(localeEsMX);
if (environment.production) {
  enableProdMode();
}
bootstrapApplication(App, appConfig).catch((err) => console.error(err));











