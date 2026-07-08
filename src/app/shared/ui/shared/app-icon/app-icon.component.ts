import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";
import { resolveIconifyIcon } from "src/app/core/utils/icon-mapping";

@Component({
  selector: "app-icon",

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<iconify-icon [attr.icon]="resolvedIcon()"></iconify-icon>`,
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
  icon = input<string | null | undefined>();

  protected resolvedIcon = computed(() => resolveIconifyIcon(this.icon()));
}
