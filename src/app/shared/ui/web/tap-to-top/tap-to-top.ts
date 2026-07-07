import { Component, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollTopModule } from "primeng/scrolltop";
import { TapToTopBase } from "@ui/base/tap-to-top.base";

@Component({
  selector: "app-scroll-top",
  standalone: true,
  imports: [CommonModule, ScrollTopModule],
  template: `
    <p-scrolltop
      [threshold]="600"
      [icon]="'pi pi-arrow-up'"
      [style]="{ background: 'var(--ds-primary)', color: '#fff' }"
    />
  `,
  styles: [`
    :host { display: contents; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class ScrollTop extends TapToTopBase {
}
