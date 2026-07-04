import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { ProfileCardBase } from "src/app/core/components/shared/profile-card/profile-card-base";

@Component({
  selector: "ili-profile-card",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div class="ili-profile-card" [class.ili-profile-compact]="compact()">
      <div class="ili-profile-avatar" [style.background]="avatarBg()">
        @if (avatarUrl()) {
          <img [src]="avatarUrl()" [alt]="name()" class="ili-profile-avatar-img" />
        } @else {
          <span class="ili-profile-initials">{{ initials() }}</span>
        }
        @if (online() !== undefined) {
          <span
            class="ili-profile-dot"
            [class.ili-profile-online]="online()"
            [class.ili-profile-offline]="!online()"
          ></span>
        }
      </div>

      <div class="ili-profile-info">
        <div class="ili-profile-name-row">
          <strong class="ili-profile-name">{{ name() }}</strong>
          @if (badge()) {
            <span class="ili-profile-badge">{{ badge() }}</span>
          }
        </div>
        @if (role()) {
          <span class="ili-profile-role">{{ role() }}</span>
        }
        @if (email()) {
          <a [href]="'mailto:' + email()" class="ili-profile-line">
            <app-icon icon="mdi:email-outline" class="text-xs" />
            {{ email() }}
          </a>
        }
        @if (phone()) {
          <a [href]="'tel:' + phone()" class="ili-profile-line">
            <app-icon icon="mdi:phone-outline" class="text-xs" />
            {{ phone() }}
          </a>
        }
        @if (company()) {
          <span class="ili-profile-line">
            <app-icon icon="mdi:office-building-outline" class="text-xs" />
            {{ company() }}
          </span>
        }
      </div>

      @if (actions().length > 0) {
        <div class="ili-profile-actions">
          @for (act of actions(); track act.action) {
            <button
              type="button"
              class="ili-profile-action"
              (click)="actionClick.emit(act.action)"
            >
              <app-icon [icon]="act.icon" />
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-profile-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-lg, 8px);
      }
      .ili-profile-compact {
        padding: 0.625rem;
        gap: 0.75rem;
      }
      .ili-profile-avatar {
        position: relative;
        flex-shrink: 0;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ili-profile-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .ili-profile-initials {
        font-size: 1.125rem;
        font-weight: 700;
        color: #fff;
        text-transform: uppercase;
      }
      .ili-profile-dot {
        position: absolute;
        bottom: 1px;
        right: 1px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--ds-bg-surface, #fff);
      }
      .ili-profile-online {
        background: var(--ds-success, #006837);
      }
      .ili-profile-offline {
        background: var(--ds-text-muted, #737685);
      }
      .ili-profile-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .ili-profile-name-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .ili-profile-name {
        font-size: 1rem;
        color: var(--ds-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ili-profile-badge {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0.1rem 0.45rem;
        border-radius: 9999px;
        background: var(--ds-info-light);
        color: var(--ds-info);
      }
      .ili-profile-role {
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
      }
      .ili-profile-line {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
        text-decoration: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ili-profile-actions {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        align-self: center;
      }
      .ili-profile-action {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        border: none;
        background: var(--ds-bg-sunken, #f1f5f9);
        color: var(--ds-text-secondary);
        font-size: 1.15rem;
      }
      .ili-profile-action:active {
        background: var(--ds-bg-elevated, #f1f3ff);
        color: var(--ds-primary, #003d9b);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileProfileCard extends ProfileCardBase {}
