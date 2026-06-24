import { Component, input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-breadcrumbs",
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  template: `
    <div class="breadcrumbs-root">
      <p-breadcrumb
        [model]="items()"
        [home]="home()"
      />
    </div>
  `,
  styles: [`
    .breadcrumbs-root {
      padding: 0.5rem 0;
    }
    .breadcrumbs-root .p-breadcrumb {
      background: transparent;
      border: none;
      padding: 0;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class Breadcrumbs {
  items = input.required<MenuItem[]>();
  home = input<MenuItem | null>(null);
}
