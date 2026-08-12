import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ProfileCardBase } from "@ui/base/profile-card.base";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export { type ProfileAction } from "@ui/base/profile-card.base";

/**
 * AppProfileCard — Tarjeta de contacto CRM con avatar, datos básicos y acciones rápidas.
 * Uso: vistas de lista de clientes, búsqueda de contactos, header de perfil.
 */
@Component({
  selector: "app-profile-card",

  imports: [ButtonModule, TagModule, LxTooltipDirective, AppIcon],
  template: `
    <div class="profile-card" [class.profile-card-compact]="compact()">
      <!-- Avatar -->
      <div class="profile-avatar" [style.background]="avatarBg()">
        @if (avatarUrl()) {
          <img [src]="avatarUrl()" [alt]="name()" class="profile-avatar-img" />
        } @else {
          <span class="profile-avatar-initials">{{ initials() }}</span>
        }
        @if (online() !== undefined) {
          <span
            class="profile-status-dot"
            [class.profile-status-online]="online()"
            [class.profile-status-offline]="!online()"
          ></span>
        }
      </div>

      <!-- Info -->
      <div class="profile-info">
        <div class="profile-name-row">
          <strong class="profile-name">{{ name() }}</strong>
          @if (badge()) {
            <p-tag [value]="badge()" severity="info" styleClass="text-xs" />
          }
        </div>
        @if (role()) {
          <span class="profile-role">{{ role() }}</span>
        }
        @if (email()) {
          <a [href]="'mailto:' + email()" class="profile-email">
            <app-icon icon="material-symbols-light:mail-outline" class="text-xs" />
            {{ email() }}
          </a>
        }
        @if (phone()) {
          <a [href]="'tel:' + phone()" class="profile-phone">
            <app-icon icon="material-symbols-light:call-outline" class="text-xs" />
            {{ phone() }}
          </a>
        }
        @if (company()) {
          <span class="profile-company">
            <app-icon icon="material-symbols-light:apartment" class="text-xs" />
            {{ company() }}
          </span>
        }
      </div>

      <!-- Actions -->
      @if (actions().length > 0) {
        <div class="profile-actions">
          @for (act of actions(); track act.action) {
            <p-button
              [lxTooltip]="act.label"
              tooltipPosition="top"
              [rounded]="true"
              [text]="true"
              [severity]="act.severity ?? 'secondary'"
              (onClick)="actionClick.emit(act.action)"
            >
              <app-icon [icon]="act.icon" class="text-lg" />
            </p-button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .profile-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        transition: box-shadow 0.15s;
      }
      .profile-card:hover {
        box-shadow: var(--ds-shadow-sm);
      }
      .profile-card-compact {
        padding: 0.625rem;
        gap: 0.75rem;
      }
      /* Avatar */
      .profile-avatar {
        position: relative;
        flex-shrink: 0;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
      }
      .profile-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .profile-avatar-initials {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--ds-on-primary);
        text-transform: uppercase;
        line-height: 1;
      }
      .profile-status-dot {
        position: absolute;
        bottom: 1px;
        right: 1px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--ds-bg-surface);
      }
      .profile-status-online {
        background: var(--ds-success);
      }
      .profile-status-offline {
        background: var(--ds-text-muted);
      }
      /* Info */
      .profile-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .profile-name-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .profile-name {
        font-size: var(--ds-font-size-card-title);
        color: var(--ds-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .profile-role {
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-secondary);
      }
      .profile-email,
      .profile-phone,
      .profile-company {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-muted);
        text-decoration: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .profile-email:hover,
      .profile-phone:hover {
        color: var(--ds-primary);
        text-decoration: underline;
      }
      /* Actions */
      .profile-actions {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        align-self: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppProfileCard extends ProfileCardBase {}
