import { Component, input, ChangeDetectionStrategy } from "@angular/core";

/**
 * 🛠️ PAGE TITLE MAINTENANCE
 * -------------------------------------------------------------------------
 * Cabecera con breadcrumbs para páginas de mantenimiento.
 */
@Component({
  selector: "page-title-report-maintenance",
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <!-- breadcrumb item -->
    <div class="grid">
      <div class="col-12">
        <div
          class="page-title-box flex align-items-center justify-content-between"
        >
          <h4 class="mb-0 text-lg font-semibold">{{ title() }}</h4>
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              @for (item of breadcrumbItems(); track item) {
                <li
                  class="breadcrumb-item"
                  [class.active]="item.active == true"
                >
                  {{ item.label }}
                </li>
              }
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PageTitleReportMaintenance {
  breadcrumbItems = input<
    Array<{
      active?: boolean;
      label?: string;
    }>
  >([]);

  title = input<string | undefined>(undefined);
}
