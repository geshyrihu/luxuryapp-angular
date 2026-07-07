import { Component, computed, input, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface AvatarItem {
  label: string;
  image?: string;
  color?: string;
  tooltip?: string;
}

@Component({
  selector: "app-avatar-group",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-group-root" [title]="groupTitle()">
      @for (item of visibleAvatars(); track $index; let i = $index) {
        <div
          class="avatar-item"
          [style.background]="item.color || 'var(--ds-primary)'"
          [title]="item.tooltip || item.label"
        >
          @if (item.image) {
            <img [src]="item.image" [alt]="item.label" class="avatar-img" />
          } @else {
            <span class="avatar-initials">{{ getInitials(item.label) }}</span>
          }
        </div>
      }
      @if (overflow() > 0) {
        <div class="avatar-item avatar-overflow" [title]="overflowTitle()">
          <span class="avatar-initials">+{{ overflow() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .avatar-group-root {
      display: inline-flex;
      align-items: center;
    }
    .avatar-item {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--ds-bg-surface, #ffffff);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -6px;
      flex-shrink: 0;
      overflow: hidden;
    }
    .avatar-item:first-child {
      margin-left: 0;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-initials {
      font-size: var(--ds-font-size-micro, 0.75rem);
      font-weight: 600;
      color: var(--ds-text-inverse, #ffffff);
      line-height: 1;
    }
    .avatar-overflow {
      background: var(--ds-bg-elevated, #f1f3ff) !important;
      border-color: var(--ds-border, #e2e8f0);
    }
    .avatar-overflow .avatar-initials {
      color: var(--ds-text-muted, #737685);
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AvatarGroup {
  avatars = input.required<AvatarItem[]>();
  maxVisible = input<number>(4);

  visibleAvatars = computed(() => this.avatars().slice(0, this.maxVisible()));
  overflow = computed(() => {
    const total = this.avatars().length;
    return Math.max(0, total - this.maxVisible());
  });

  groupTitle = computed(() =>
    this.avatars().map((a) => a.tooltip || a.label).join(", ")
  );

  overflowTitle = computed(() => {
    const overflowItems = this.avatars().slice(this.maxVisible());
    return overflowItems.map((a) => a.tooltip || a.label).join(", ");
  });

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}
