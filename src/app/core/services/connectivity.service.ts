import { effect, inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { fromEvent, merge, Observable, of } from "rxjs";
import { distinctUntilChanged, filter, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ConnectivityService {
  private router = inject(Router);

  // Signal: última URL válida antes de ir a /offline
  private lastUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
      filter((url) => url !== "/offline"),
    ),
    { initialValue: "/" },
  );

  // Observable de conectividad (se mantiene para isOnline$)
  private online$ = merge(
    of(navigator.onLine),
    fromEvent(window, "online").pipe(map(() => true)),
    fromEvent(window, "offline").pipe(map(() => false)),
  ).pipe(distinctUntilChanged());

  // Signal: estado de conexión reactivo
  private onlineSignal = toSignal(this.online$, {
    initialValue: navigator.onLine,
  });

  constructor() {
    // Navegar automáticamente cuando cambia el estado de conexión
    effect(() => {
      const isOnline = this.onlineSignal();
      if (isOnline) {
        if (this.router.url === "/offline") {
          this.router.navigateByUrl(this.lastUrl());
        }
      } else {
        this.router.navigateByUrl("/offline");
      }
    });
  }

  /**
   * Observable que emite `true` si hay conexión a internet
   * y `false` si no la hay.
   */
  public get isOnline$(): Observable<boolean> {
    return this.online$;
  }

  /**
   * Estado actual de la conexión de forma síncrona.
   */
  public get isOnline(): boolean {
    return navigator.onLine;
  }
}









