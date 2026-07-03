import { Component, input, output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

export interface ProfileAction {
  icon: string;
  label: string;
  action: string;
  severity?: "primary" | "secondary" | "success" | "danger" | "warn";
}

/**
 * AppProfileCard — Tarjeta de contacto CRM con avatar, datos básicos y acciones rápidas.
 * Uso: vistas de lista de clientes, búsqueda de contactos, header de perfil.
 */
@Component({
  selector: "app-profile-card",
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, TooltipModule, AppIcon],
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
            <app-icon icon="mdi:email-outline" class="text-xs" />
            {{ email() }}
          </a>
        }
        @if (phone()) {
          <a [href]="'tel:' + phone()" class="profile-phone">
            <app-icon icon="mdi:phone-outline" class="text-xs" />
            {{ phone() }}
          </a>
        }
        @if (company()) {
          <span class="profile-company">
            <app-icon icon="mdi:office-building-outline" class="text-xs" />
            {{ company() }}
          </span>
        }
      </div>

      <!-- Actions -->
      @if (actions().length > 0) {
        <div class="profile-actions">
          @for (act of actions(); track act.action) {
            <p-button
              [pTooltip]="act.label"
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
  styles: [`
    .profile-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: var(--ds-bg-surface, #fff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-lg, 8px);
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
      color: #fff;
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
      border: 2px solid var(--ds-bg-surface, #fff);
    }
    .profile-status-online  { background: var(--ds-success, #006837); }
    .profile-status-offline { background: var(--ds-text-muted, #737685); }
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
      font-size: var(--ds-font-size-card-title, 1rem);
      color: var(--ds-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-role {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-secondary);
    }
    .profile-email,
    .profile-phone,
    .profile-company {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .profile-email:hover,
    .profile-phone:hover {
      color: var(--ds-primary, #003d9b);
      text-decoration: underline;
    }
    /* Actions */
    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      align-self: center;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppProfileCard {
  name      = input.required<string>();
  role      = input<string>("");
  email     = input<string>("");
  phone     = input<string>("");
  company   = input<string>("");
  avatarUrl = input<string>("");
  badge     = input<string>("");
  online    = input<boolean | undefined>(undefined);
  compact   = input<boolean>(false);
  actions   = input<ProfileAction[]>([
    { icon: "mdi:phone-outline",       label: "Llamar",  action: "call",  severity: "secondary" },
    { icon: "mdi:email-outline",       label: "Email",   action: "email", severity: "secondary" },
    { icon: "mdi:calendar-plus-outline", label: "Reunión", action: "meeting", severity: "secondary" },
  ]);

  actionClick = output<string>();

  avatarBg(): string {
    const colors = [
      "#003d9b", "#006477", "#006837", "#b45309", "#7c3aed", "#ba1a1a",
    ];
    let hash = 0;
    for (const c of this.name()) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  initials(): string {
    return this.name()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
}
