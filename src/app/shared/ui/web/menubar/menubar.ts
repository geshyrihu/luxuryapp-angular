import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarModule } from "primeng/menubar";
import { MenubarBase } from "@ui/base/menubar.base";

@Component({
  selector: "app-menubar",
  standalone: true,
  imports: [CommonModule, MenubarModule],
  template: `
    <p-menubar
      [model]="items()"
      [style]="{ background: 'transparent', border: 'none', padding: '0' }"
    />
  `,
  styles: [`
    app-menubar .p-menubar {
      padding: 0;
    }
    app-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-content .p-menuitem-link {
      padding: 0.625rem 1rem;
      font-size: var(--ds-font-size-body, 0.9375rem);
      color: var(--ds-text-primary);
    }
    app-menubar .p-menubar .p-menuitem-text {
      color: var(--ds-text-primary);
    }
    app-menubar .p-menubar .p-submenu-list {
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-md, 6px);
      box-shadow: var(--ds-shadow-lg);
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Menubar extends MenubarBase {}
