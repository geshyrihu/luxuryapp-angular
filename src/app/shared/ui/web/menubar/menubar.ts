import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MenubarBase } from "@ui/base/menubar.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import type { MenuItem } from "@core/interfaces/menu-item.interface";

@Component({
  selector: "app-menubar",
  imports: [RouterModule, AppIcon],
  template: `
    <ul class="nav app-menubar-nav" (mouseleave)="closeSubmenu()">
      @for (item of items(); track $index; let i = $index) {
        <li class="nav-item app-menubar-item" [class.dropdown]="children(item).length > 0">
          <a class="nav-link" [class.dropdown-toggle]="children(item).length > 0" href="#" (click)="onItemClick(item, $event, i)">
            @if (item.icon) { <app-icon [icon]="iconName(item.icon)" /> }
            {{ item.label }}
          </a>
          @if (children(item).length > 0 && openIndex() === i) {
            <ul class="dropdown-menu show app-menubar-dropdown">
              @for (sub of children(item); track $index) {
                <li><a class="dropdown-item" href="#" (click)="onItemClick(sub, $event, i)">@if (sub.icon) { <app-icon [icon]="iconName(sub.icon)" /> } {{ sub.label }}</a></li>
              }
            </ul>
          }
        </li>
      }
    </ul>
  `,
  styles: [`
    .app-menubar-nav { background: transparent; border: none; padding: 0; }
    .app-menubar-item { position: relative; }
    .app-menubar-nav .nav-link { padding: 0.625rem 1rem; font-size: var(--ds-font-size-body); color: var(--ds-text-primary); cursor: pointer; }
    .app-menubar-dropdown { background: var(--ds-bg-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius-md); box-shadow: var(--ds-shadow-lg); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Menubar extends MenubarBase {
  protected openIndex = signal<number | null>(null);

  protected children(item: MenuItem): MenuItem[] {
    return Array.isArray(item.items) ? item.items as MenuItem[] : [];
  }

  protected onItemClick(item: MenuItem, event: Event, index: number): void {
    event.preventDefault();
    if (this.children(item).length) {
      this.openIndex.update((current) => current === index ? null : index);
      return;
    }
    this.closeSubmenu();
    this.runCommand(item, event);
  }

  protected closeSubmenu(): void { this.openIndex.set(null); }
}
