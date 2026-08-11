import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { MegaMenuBase } from "@ui/base/mega-menu.base";
import { MegaMenuModule } from "primeng/megamenu";

@Component({
  selector: "app-mega-menu",

  imports: [MegaMenuModule],
  template: `
    <p-megamenu
      [model]="items()"
      [orientation]="orientation()"
      [style]="{ background: 'transparent', border: 'none' }"
    />
  `,
  styles: [
    `
      app-mega-menu .p-megamenu {
        padding: 0;
      }
      app-mega-menu
        .p-megamenu-root-list
        > .p-menuitem
        > .p-menuitem-content
        .p-menuitem-link {
        padding: 0.625rem 1rem;
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
      }
      app-mega-menu
        .p-megamenu-root-list
        > .p-menuitem-active
        > .p-menuitem-content
        .p-menuitem-link {
        color: var(--ds-primary);
      }
      app-mega-menu .p-megamenu-panel {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        box-shadow: var(--ds-shadow-lg);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MegaMenu extends MegaMenuBase {}
