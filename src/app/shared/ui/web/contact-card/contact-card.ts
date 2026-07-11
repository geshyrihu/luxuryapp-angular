import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { ContactCardBase } from "@ui/base/contact-card.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

export { type ContactStatus } from "@ui/base/contact-card.base";

/**
 * AppContactCard — Tarjeta horizontal compacta de contacto CRM para listas densas.
 * Diferente de ProfileCard (vertical, mayor detalle): orientada a listas de contactos.
 */
@Component({
  selector: "app-contact-card",

  imports: [CommonModule, ButtonModule, TagModule, LxTooltipDirective, AppIcon],
  template: `
    <div
      class="contact-card"
      (click)="cardClick.emit()"
      [class.contact-card-selected]="selected()"
    >
      <!-- Avatar -->
      <div class="contact-avatar" [style.background]="avatarBg()">
        @if (avatarUrl()) {
          <img [src]="avatarUrl()" [alt]="name()" class="contact-avatar-img" />
        } @else {
          <span>{{ initials() }}</span>
        }
      </div>

      <!-- Info -->
      <div class="contact-info">
        <div class="contact-name-row">
          <span class="contact-name">{{ name() }}</span>
          @if (status()) {
            <p-tag
              [value]="statusLabel()"
              [severity]="statusSeverity()"
              styleClass="text-xs"
            />
          }
        </div>
        @if (role()) {
          <span class="contact-role">{{ role() }}</span>
        }
        @if (company()) {
          <span class="contact-company">
            <app-icon icon="mdi:office-building-outline" class="text-xs" />
            {{ company() }}
          </span>
        }
      </div>

      <!-- Quick Actions -->
      <div class="contact-actions">
        @if (email()) {
          <a
            [href]="'mailto:' + email()"
            lxTooltip="Enviar email"
            tooltipPosition="top"
            class="contact-action-btn"
            (click)="$event.stopPropagation()"
          >
            <app-icon icon="mdi:email-outline" />
          </a>
        }
        @if (phone()) {
          <a
            [href]="'tel:' + phone()"
            lxTooltip="Llamar"
            tooltipPosition="top"
            class="contact-action-btn"
            (click)="$event.stopPropagation()"
          >
            <app-icon icon="mdi:phone-outline" />
          </a>
        }
        <button
          lxTooltip="Agendar reunión"
          tooltipPosition="top"
          class="contact-action-btn"
          (click)="$event.stopPropagation(); meetingClick.emit()"
        >
          <app-icon icon="mdi:calendar-plus-outline" />
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .contact-card {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.875rem;
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        cursor: pointer;
        transition:
          box-shadow 0.15s,
          border-color 0.15s;
      }
      .contact-card:hover,
      .contact-card-selected {
        border-color: var(--ds-primary, #003d9b);
        box-shadow: var(--ds-shadow-sm);
      }
      .contact-card-selected {
        background: var(--ds-bg-elevated, #f1f3ff);
      }
      /* Avatar */
      .contact-avatar {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        color: #fff;
        overflow: hidden;
      }
      .contact-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      /* Info */
      .contact-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }
      .contact-name-row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .contact-name {
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 600;
        color: var(--ds-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .contact-role {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-secondary);
      }
      .contact-company {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
        display: flex;
        align-items: center;
        gap: 0.2rem;
      }
      /* Actions */
      .contact-actions {
        display: flex;
        gap: 0.25rem;
        flex-shrink: 0;
      }
      .contact-action-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ds-radius-sm, 4px);
        border: 1px solid transparent;
        background: none;
        color: var(--ds-text-muted);
        cursor: pointer;
        text-decoration: none;
        font-size: 1rem;
        transition:
          background 0.15s,
          color 0.15s;
      }
      .contact-action-btn:hover {
        background: var(--ds-bg-elevated, #f1f3ff);
        color: var(--ds-primary, #003d9b);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppContactCard extends ContactCardBase {}
