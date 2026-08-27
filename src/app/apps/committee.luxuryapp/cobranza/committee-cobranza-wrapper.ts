import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeCobranzaMobile } from "./committee-cobranza-mobile";
import { CommitteeCobranzaWeb } from "./committee-cobranza-web";

@Component({
  selector: "app-committee-cobranza-wrapper",

  imports: [CommitteeCobranzaWeb, CommitteeCobranzaMobile],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isCompact()) {
      <app-committee-cobranza-mobile />
    } @else {
      <app-committee-cobranza-web />
    }
  `,
})
export class CommitteeCobranzaWrapper implements OnInit {
  private destroyRef = inject(DestroyRef);
  baseService = inject(CommitteeCobranzaBaseService);

  /**
   * Vista compacta (tarjetas) hasta desktop amplio; la tabla se reserva para
   * ≥1024px. Así móvil y tablet (incluye iPad portrait, donde el shell del
   * comité ya es mobile) muestran las tarjetas, y solo el desktop ve la tabla.
   */
  readonly isCompact = signal(this.checkCompact());

  constructor() {
    fromEvent(window, "resize")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isCompact.set(this.checkCompact()));
  }

  private checkCompact(): boolean {
    return window.innerWidth < 1024;
  }

  ngOnInit() {
    this.baseService.loadMorosos();
  }
}
