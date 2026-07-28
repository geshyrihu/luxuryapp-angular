import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { Subject, Subscription, interval, takeWhile, tap } from "rxjs";

@Component({
  selector: "app-session-timeout",

  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [resizable]="false"
      header="Sesión por expirar"
      [style]="{ width: '400px', maxWidth: '90vw' }"
    >
      <p class="session-timeout-msg">
        Tu sesión expirará en <strong>{{ countdown }}</strong> segundos por
        inactividad.
      </p>
      <div class="session-timeout-actions">
        <button
          pButton
          label="Cerrar sesión"
          severity="danger"
          (click)="logout()"
        ></button>
        <button
          pButton
          label="Continuar sesión"
          severity="primary"
          (click)="extend()"
        ></button>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .session-timeout-msg {
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-secondary);
        margin: 0.5rem 0 1.25rem;
      }
      .session-timeout-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SessionTimeout implements OnDestroy {
  visible = false;
  countdown = 60;
  private sub: Subscription | null = null;
  private onExtend?: () => void;
  private onLogout?: () => void;

  private reset$ = new Subject<void>();

  start(durationSec: number, onExtend: () => void, onLogout: () => void): void {
    this.onExtend = onExtend;
    this.onLogout = onLogout;
    this.countdown = durationSec;
    this.visible = true;

    this.sub?.unsubscribe();
    this.sub = interval(1000)
      .pipe(
        takeWhile(() => this.countdown > 0),
        tap(() => this.countdown--),
      )
      .subscribe({
        complete: () => {
          this.visible = false;
          this.onLogout?.();
        },
      });
  }

  extend(): void {
    this.onExtend?.();
    this.visible = false;
    this.sub?.unsubscribe();
  }

  logout(): void {
    this.visible = false;
    this.sub?.unsubscribe();
    this.onLogout?.();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
