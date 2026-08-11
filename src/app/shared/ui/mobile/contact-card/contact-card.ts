import { Component, ViewEncapsulation } from "@angular/core";
import { ContactCardBase, ContactSeverity } from "@ui/base/contact-card.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

const SEVERITY_COLORS: Record<ContactSeverity, { bg: string; text: string }> = {
  success: { bg: "var(--ds-success-light)", text: "var(--ds-success)" },
  info: { bg: "var(--ds-info-light)", text: "var(--ds-info)" },
  secondary: { bg: "var(--ds-bg-sunken)", text: "var(--ds-text-secondary)" },
  warn: { bg: "var(--ds-warning-light)", text: "var(--ds-warning)" },
};

@Component({
  selector: "ili-contact-card",

  imports: [AppIcon],
  template: `
    <div
      class="ili-contact-card"
      [class.ili-contact-selected]="selected()"
      (click)="cardClick.emit()"
    >
      <div class="ili-contact-avatar" [style.background]="avatarBg()">
        @if (avatarUrl()) {
          <img
            [src]="avatarUrl()"
            [alt]="name()"
            class="ili-contact-avatar-img"
          />
        } @else {
          <span>{{ initials() }}</span>
        }
      </div>

      <div class="ili-contact-info">
        <div class="ili-contact-name-row">
          <span class="ili-contact-name">{{ name() }}</span>
          @if (status()) {
            <span
              class="ili-contact-badge"
              [style.background]="badgeStyle().bg"
              [style.color]="badgeStyle().text"
            >
              {{ statusLabel() }}
            </span>
          }
        </div>
        @if (role()) {
          <span class="ili-contact-role">{{ role() }}</span>
        }
        @if (company()) {
          <span class="ili-contact-company">
            <app-icon icon="mdi:office-building-outline" class="text-xs" />
            {{ company() }}
          </span>
        }
      </div>

      <div class="ili-contact-actions">
        @if (email()) {
          <a
            [href]="'mailto:' + email()"
            class="ili-contact-action"
            (click)="$event.stopPropagation()"
          >
            <app-icon icon="mdi:email-outline" />
          </a>
        }
        @if (phone()) {
          <a
            [href]="'tel:' + phone()"
            class="ili-contact-action"
            (click)="$event.stopPropagation()"
          >
            <app-icon icon="mdi:phone-outline" />
          </a>
        }
        <button
          type="button"
          class="ili-contact-action"
          (click)="$event.stopPropagation(); meetingClick.emit()"
        >
          <app-icon icon="mdi:calendar-plus-outline" />
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .ili-contact-card {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0.875rem;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
      }
      .ili-contact-selected {
        border-color: var(--ds-primary);
        background: var(--ds-bg-elevated);
      }
      .ili-contact-avatar {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--ds-on-primary);
        overflow: hidden;
      }
      .ili-contact-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .ili-contact-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }
      .ili-contact-name-row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .ili-contact-name {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--ds-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ili-contact-badge {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        padding: 0.1rem 0.45rem;
        border-radius: 9999px;
        white-space: nowrap;
      }
      .ili-contact-role {
        font-size: 0.75rem;
        color: var(--ds-text-secondary);
      }
      .ili-contact-company {
        font-size: 0.75rem;
        color: var(--ds-text-muted);
        display: flex;
        align-items: center;
        gap: 0.2rem;
      }
      .ili-contact-actions {
        display: flex;
        gap: 0.25rem;
        flex-shrink: 0;
      }
      .ili-contact-action {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--ds-radius-sm);
        border: none;
        background: var(--ds-bg-sunken);
        color: var(--ds-text-secondary);
        text-decoration: none;
        font-size: 1.15rem;
      }
      .ili-contact-action:active {
        background: var(--ds-bg-elevated);
        color: var(--ds-primary);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileContactCard extends ContactCardBase {
  protected badgeStyle(): { bg: string; text: string } {
    return SEVERITY_COLORS[this.statusSeverity()];
  }
}
