import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Platform } from "@ionic/angular";
import { fromEvent } from "rxjs";

@Injectable({ providedIn: "root" })
export class PlatformService {
  private readonly ionicPlatform = inject(Platform);
  private readonly destroyRef = inject(DestroyRef);

  readonly isMobile = signal(this._check());

  constructor() {
    this._updateBodyClass(this._check());
    
    fromEvent(window, "resize")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const isMobile = this._check();
        this.isMobile.set(isMobile);
        this._updateBodyClass(isMobile);
      });
  }

  private _updateBodyClass(isMobile: boolean) {
    if (isMobile) {
      document.body.classList.add('is-mobile');
      document.body.classList.remove('is-web');
    } else {
      document.body.classList.add('is-web');
      document.body.classList.remove('is-mobile');
    }
  }

  private _check(): boolean {
    // hybrid = Capacitor / Cordova (always native mobile)
    // width < 768 = pantalla chica (responsive breakpoint md)
    // ionicPlatform.is("mobile") se excluye: evalúa por user-agent
    // y da falsos positivos en browsers desktop
    return this.ionicPlatform.is("hybrid") || window.innerWidth < 768;
  }
}
