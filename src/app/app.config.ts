// Importaciones de Angular y Core
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
  registerLocaleData,
} from "@angular/common";
import {
  HttpBackend,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import localeEs from "@angular/common/locales/es";
import {
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  LOCALE_ID,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig,
} from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { provideIonicAngular } from "@ionic/angular";
import { GlobalErrorHandler } from "@core/http/services/global-error-handler.service";
// Importaciones de Firebase
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
// Importaciones de Librerías de Terceros
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideFlatpickrDefaults } from "angularx-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es";
import { provideMarkdown } from "ngx-markdown";
import { provideEnvironmentNgxMask } from "ngx-mask";
import { provideToastr } from "ngx-toastr";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MessageService } from "@core/services/message.service";
// Importaciones de Archivos del Proyecto
import { imageFormDataInterceptor } from "@core/http/interceptors/image-form-data.interceptor.fn";
import { jwtInterceptor } from "@core/http/interceptors/jwt.interceptor.fn";
import { offlineInterceptorFn } from "@core/http/interceptors/offline.interceptor.fn";
import { preloadIconifyIcons } from "@core/services/icon-preload.service";
import { MessagingService } from "@core/services/notification-messaging.service";
import { initializeAppState } from "./app-initializer";
import { appRoutes } from "./app.routes";
import { registerIonicons } from "./core/services/ionicons-registry";
// Registrar datos locales para el pipe de fecha en español
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    // --- Proveedores base de Angular y Plantilla ---
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: "enabled" }),
      withRouterConfig({ onSameUrlNavigation: "reload" }),
    ),

    provideAppInitializer(initializeAppState),
    provideAppInitializer(preloadIconifyIcons()),
    provideAppInitializer(registerIonicons()),

    provideHttpClient(
      withInterceptors([
        imageFormDataInterceptor,
        offlineInterceptorFn,
        jwtInterceptor,
      ]),
      withInterceptorsFromDi(),
      withFetch(),
    ),
    {
      provide: "HttpClientWithoutInterceptors",
      useFactory: (backend: HttpBackend) => new HttpClient(backend),
      deps: [HttpBackend],
    },
    // Elimina provideAnimationsAsync() de tus providers
    // Migra tus animaciones a CSS + animate.enter/animate.leave
    // Elimina @angular/animations de tus dependencias (cuando hayas migrado todo)
    provideAnimationsAsync(),
    // --- Configuración de Librerías de UI y Terceros ---
    provideToastr(),
    provideCharts(withDefaultRegisterables()),
    provideEnvironmentNgxMask(),
    provideFlatpickrDefaults({
      locale: Spanish,
    }),
    provideMarkdown(),

    // --- Configuración de Internacionalización (i18n) ---
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: "./assets/i18n/",
        suffix: ".json",
      }),
      fallbackLang: "es",
    }),

    // --- Configuración Específica de la Aplicación ---
    { provide: LOCALE_ID, useValue: "es-MX" },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    // {
    //   provide: IMAGE_CONFIG,
    //   useValue: {
    //     disableImageSizeWarning: true,
    //     disableImageLazyLoadWarning: true,
    //   },
    // },

    // --- Servicios Singleton Globales ---
    MessageService,
    DatePipe,
    MessagingService,

    // --- Error Handler Global ---
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // --- Configuración de Firebase ---
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // --- Configuración del Service Worker (PWA) ---
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),

    // --- Configuración de Ionic (Hibrido) ---
    provideIonicAngular({ mode: "ios" }),
  ],
};
