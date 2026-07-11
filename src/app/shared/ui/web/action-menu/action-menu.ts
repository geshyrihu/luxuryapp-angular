import { Component, ChangeDetectionStrategy } from "@angular/core";
import { addIcons } from "ionicons";
import { ellipsisVertical } from "ionicons/icons";
import { ButtonModule } from "primeng/button";
import { Popover, PopoverModule } from "primeng/popover";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

/**
 * 🍔 ACTION MENU
 * -------------------------------------------------------------------------
 * Menú contextual — usa p-popover (PrimeNG) para web Y mobile.
 *
 * Razón: ng-content dentro del ng-template de ion-popover no funciona con
 * Angular content projection (lazy rendering vs. proyección en creación).
 * p-popover con appendTo="body" resuelve correctamente en ambas plataformas.
 *
 * El popover se cierra automáticamente 60ms después de cualquier clic interno,
 * dejando tiempo para que SweetAlert / AlertController abra encima.
 */
@Component({
  selector: "app-action-menu",
  imports: [PopoverModule, ButtonModule, AppIcon],
  template: `
    <!-- ✅ p-popover para web Y mobile — ng-content funciona correctamente -->
    <div class="action-menu">
      <button
        pButton
        type="button"
        class="border-round-lg p-button-text p-button-icon-only action-menu-button"
        (click)="popover.toggle($event)"
        aria-label="Opciones"
      >
        <app-icon icon="mdi:dots-vertical" class="text-xl" />
      </button>

      <p-popover #popover appendTo="body" styleClass="action-menu-popover">
        <!-- 60ms: handler del botón hijo se ejecuta antes del hide -->
        <div class="menu-container" (click)="closeMenu(popover)">
          <ng-content></ng-content>
        </div>
      </p-popover>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    .menu-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.375rem;
      min-width: 180px;
    }
    .menu-container ::ng-deep button {
      width: 100%;
      justify-content: flex-start;
    }
    /* Mobile: items más grandes para touch */
    @media (max-width: 767px) {
      .menu-container {
        min-width: 200px;
        gap: 0.125rem;
        padding: 0.25rem;
      }
    }
  `],
})
export class ActionMenu {
  constructor() {
    addIcons({ ellipsisVertical });
  }

  closeMenu(popover: Popover): void {
    setTimeout(() => popover?.hide(), 60);
  }
}
