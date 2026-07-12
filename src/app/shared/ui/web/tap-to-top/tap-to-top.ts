import { Component, ViewEncapsulation } from "@angular/core";
import { TapToTopBase } from "@ui/base/tap-to-top.base";
import { ScrollTopModule } from "primeng/scrolltop";

@Component({
  selector: "app-scroll-top",

  imports: [ScrollTopModule],
  template: `
    <p-scrolltop
      [threshold]="600"
      [icon]="'pi pi-arrow-up'"
      [style]="{ background: 'var(--ds-primary)', color: '#fff' }"
    />
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ScrollTop extends TapToTopBase {}
