import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { BreadcrumbsBase } from "@ui/base/breadcrumbs.base";
import { BreadcrumbModule } from "primeng/breadcrumb";

@Component({
  selector: "app-breadcrumbs",

  imports: [BreadcrumbModule],
  template: `
    <div class="breadcrumbs-root">
      <p-breadcrumb [model]="items()" [home]="home()" />
    </div>
  `,
  styles: [
    `
      .breadcrumbs-root {
        padding: 0.5rem 0;
      }
      .breadcrumbs-root .p-breadcrumb {
        background: transparent;
        border: none;
        padding: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Breadcrumbs extends BreadcrumbsBase {}
