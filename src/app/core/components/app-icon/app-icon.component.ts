import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from "@angular/core";
import { resolveIconifyIcon } from "src/app/core/utils/prime-icon-resolver";

@Component({
  selector: "app-icon",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<iconify-icon [attr.icon]="resolvedIcon"></iconify-icon>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        vertical-align: middle;
      }
      iconify-icon {
        display: inline-block;
        width: 1em;
        height: 1em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIcon {
  protected resolvedIcon = "mdi:cog";

  @Input()
  set icon(value: string | null | undefined) {
    this.resolvedIcon = resolveIconifyIcon(value);
  }
}
