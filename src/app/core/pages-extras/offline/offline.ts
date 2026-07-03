import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";
import { ConnectivityService } from "../../services/connectivity.service";
import { RedirectService } from "../../services/redirect.service";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-offline",
  templateUrl: "./offline.html",
  styleUrls: ["./offline.scss"],
  imports: [WebButtonLabel],
})
export class Offline implements OnInit, OnDestroy {
  private router = inject(Router);
  private connectivityService = inject(ConnectivityService);
  private redirectService = inject(RedirectService);
  private returnUrl: string = "/";
  private connectionSubscription: Subscription;

  public isRetrying = false;

  ngOnInit(): void {
    this.returnUrl = this.redirectService.returnUrl || "/";
    console.log(
      `%c[Offline] URL de retorno guardada: ${this.returnUrl}`,
      "color: blue; font-weight: bold;",
    );

    // Escuchar la reconexión automática
    this.connectionSubscription = this.connectivityService.isOnline$
      .pipe(
        filter((isOnline) => isOnline),
        debounceTime(1000), // Esperar 1 segundo para asegurar que la conexión es estable
      )
      .subscribe(() => {
        this.navigateToReturnUrl();
      });
  }

  ngOnDestroy(): void {
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
  }

  retry(): void {
    this.isRetrying = true;
    setTimeout(() => (this.isRetrying = false), 1000);

    if (this.connectivityService.isOnline) {
      this.navigateToReturnUrl();
    } else {
      console.warn("[Offline] Reintento fallido, sigue sin conexión.");
    }
  }

  private navigateToReturnUrl(): void {
    console.log(
      `%c[Offline] Conexión detectada. Navegando a: ${this.returnUrl}`,
      "color: green; font-weight: bold;",
    );

    // Limpiar la URL para que no se re-utilice accidentalmente
    this.redirectService.returnUrl = null;

    this.router.navigateByUrl(this.returnUrl).catch((err) => {
      console.error(
        `[Offline] Falló la navegación a ${this.returnUrl}. Error:`,
        err,
      );
      // Como último recurso, ir a la página principal.
      this.router.navigate(ROUTES.HOME);
    });
  }
}









