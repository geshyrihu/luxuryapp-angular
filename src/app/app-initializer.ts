import { inject } from "@angular/core";
import { of } from "rxjs";
import { catchError, filter, switchMap, take, timeout } from "rxjs/operators";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";

/** Tiempo máximo (ms) que el inicializador espera antes de continuar sin bloquear la app. */
const INIT_TIMEOUT_MS = 10_000;

/**
 * Fábrica de inicialización de estado de la aplicación.
 *
 * Esta función se ejecuta y bloquea el arranque de la aplicación hasta que el Promise que retorna se resuelva.
 * Su propósito es asegurar que el estado de autenticación y del cliente se haya verificado y cargado
 * ANTES de que cualquier componente intente renderizarse.
 *
 * ⏱️ Incluye un timeout de seguridad de 10s para evitar que la app se quede bloqueada
 * indefinidamente si el servicio de autenticación no responde.
 *
 * @returns Un Promise que siempre se resuelve (nunca rechaza), incluso en caso de error o timeout.
 */
export function initializeAppState(): Promise<any> {
  const authS = inject(AuthService);
  const customerIdS = inject(CustomerIdService);
  const consoleLogger = inject(ConsoleLoggerService);

  return new Promise((resolve) => {
    consoleLogger.custom(
      "🚀",
      "purple",
      "[Initializer] Starting application state initialization...",
    );

    authS.initialAuthCheckCompleted$
      .pipe(
        filter((isComplete) => isComplete),
        take(1),
        switchMap(() => authS.userToken$),
        take(1),
        switchMap((userToken) => {
          if (userToken) {
            consoleLogger.custom(
              "🏢",
              "#3F51B5",
              "[Initializer] User session found. Initializing customer state...",
            );
            return customerIdS.initializeCustomerStateAfterLogin(userToken);
          } else {
            consoleLogger.custom(
              "🤷",
              "#9E9E9E",
              "[Initializer] No user session. Skipping customer state initialization.",
            );
            return of(true);
          }
        }),
        // ⏱️ Timeout de seguridad: si no completa en 10s, continuamos sin bloquear
        timeout(INIT_TIMEOUT_MS),
        catchError((err) => {
          if (err?.name === "TimeoutError") {
            consoleLogger.custom(
              "⏱️",
              "#FF9800",
              `[Initializer] Timeout after ${INIT_TIMEOUT_MS / 1000}s. Continuing without blocking...`,
            );
          } else {
            consoleLogger.custom(
              "💀",
              "red",
              "[Initializer] State initialization failed. Continuing anyway...",
            );
          }
          return of(true); // Siempre resolvemos para no bloquear la app
        }),
      )
      .subscribe({
        next: () =>
          consoleLogger.custom(
            "✅",
            "green",
            "[Initializer] State initialization complete.",
          ),
        complete: () => resolve(true),
      });
  });
}
