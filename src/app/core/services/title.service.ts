import { effect, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, mergeMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TitleService {
  // Signal derivado de los datos de la ruta activa
  private routeTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === "primary"),
      mergeMap((route) => route.data),
      map((data) => data["title"] || ""),
    ),
    { initialValue: "" },
  );

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // Efecto para actualizar el título cuando cambia la ruta
    effect(() => {
      const title = this.routeTitle();
      if (title) {
        this.setTitle(title);
      }
    });
  }

  // Establecer el título de la página
  setTitle(title: string) {
    // Actualizar el título del documento (pestaña del navegador)
    this.titleService.setTitle(`Mi App - ${title}`);

    // Puedes emitir un evento o actualizar un estado global aquí
    // para que los componentes puedan reaccionar al cambio de título
  }

  // Obtener el título actual
  getTitle(): string {
    return this.titleService.getTitle().replace("Mi App - ", "");
  }
}









