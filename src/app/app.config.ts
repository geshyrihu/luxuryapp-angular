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
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig,
} from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { provideIonicAngular } from "@ionic/angular/standalone";
import { GlobalErrorHandler } from "src/app/core/services/global-error-handler.service";
// Importaciones de Firebase
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
// Importaciones de Librerías de Terceros
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideFlatpickrDefaults } from "angularx-flatpickr";
import * as echarts from "echarts";
import { Spanish } from "flatpickr/dist/l10n/es";
import { provideEchartsCore } from "ngx-echarts";
import { provideMarkdown } from "ngx-markdown";
import { provideEnvironmentNgxMask } from "ngx-mask";
import { provideToastr } from "ngx-toastr";
import { ConfirmationService, MessageService } from "primeng/api";
import { providePrimeNG, type PrimeNGConfigType } from "primeng/config";
import { DialogService } from "primeng/dynamicdialog";
// Importaciones de Archivos del Proyecto
import { preloadIconifyIcons } from "src/app/core/services/icon-preload.service";
import { jwtInterceptor } from "src/app/core/services/jwt.interceptor.fn";
import { MessagingService } from "src/app/core/services/notification-messaging.service";
import { offlineInterceptorFn } from "src/app/core/services/offline.interceptor.fn";
import MyPreset, { PrimeNgSpanishLocale } from "src/app/mypreset";
import { initializeAppState } from "./app-initializer";
import { appRoutes } from "./app.routes";
// Registrar datos locales para el pipe de fecha en español
registerLocaleData(localeEs);

// Configuración principal de la aplicación
const primeNgConfig: PrimeNGConfigType = {
  license:
    "eyJpZCI6IjYwMjZhNmI2LTAxM2MtNGI1Yy1hZTc0LTFjMjUyZWI0NmRmNCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODMzOTM4NjcsImV4cCI6MTgxNDkyOTg2N30.q9Bg8B3KhNVh6x40y5CBrosDUg5XsbUSUGE3tVtwl66DwRgF5pj8HdWB0906k5qFcEGQNTz5Gs7VzQAtoT0XBg",
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '[data-theme="dark"], .theme-dark',
      cssLayer: {
        name: "primeng",
        order: "primeng, primeflex",
      },
    },
  },
  translation: PrimeNgSpanishLocale,
};

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

    provideHttpClient(
      withInterceptors([offlineInterceptorFn, jwtInterceptor]),
      withInterceptorsFromDi(),
      withFetch(),
    ),
    {
      provide: "HttpClientWithoutInterceptors",
      useFactory: (backend: HttpBackend) => new HttpClient(backend),
      deps: [HttpBackend],
    },
    provideAnimations(),
    // --- Configuración de Librerías de UI y Terceros ---
    provideToastr(),
    providePrimeNG(primeNgConfig),
    provideEchartsCore({ echarts }),
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
    DialogService,
    ConfirmationService,
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
