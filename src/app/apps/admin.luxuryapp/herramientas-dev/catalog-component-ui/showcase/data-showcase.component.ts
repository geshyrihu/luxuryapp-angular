import { Component, ChangeDetectionStrategy } from "@angular/core";
import { DataGrid } from "@ui/web/data-grid/data-grid";
import { MOCK_USERS, MOCK_COLUMNS } from "../shared/mock-data";
import { TagModule } from "@ui/web/primeng-tag/primeng-tag";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { AppBadge } from "@ui/web/badge/badge";
import { AppTag } from "@ui/web/tag/tag";
import { AppProgressBar } from "@ui/web/progress-bar/progress-bar";
import { AppSkeleton } from "@ui/web/skeleton/skeleton";

@Component({
  selector: "app-data-showcase",
  imports: [DataGrid, TagModule, AppAvatar, AppBadge, AppTag, AppProgressBar, AppSkeleton],
  template: `
    <div class="p-4 fadein">
      <h2 class="text-2xl font-bold mb-4">Data Visualization</h2>
      <p class="text-secondary mb-6">Componentes de representación de datos masivos y tablas de datos.</p>

      <section class="mb-8">
        <h3 class="section-header">Data Grid (Table)</h3>
        <div class="card p-0 shadow-sm border-round overflow-hidden border-1 surface-border">
          <app-data-grid
            [data]="users"
            [columns]="columns"
            [paginator]="true"
            [rows]="5"
            [totalRecords]="users.length"
            rowHover="true"
          >
            <ng-template #bodyTemplate let-rowData let-columns="columns">
              <tr>
                @for (col of columns; track col.field) {
                  <td>
                    @if (col.field === 'status') {
                      <p-tag [value]="rowData[col.field]" [severity]="rowData[col.field] === 'Active' ? 'success' : (rowData[col.field] === 'Pending' ? 'warning' : 'danger')" />
                    } @else {
                      {{ rowData[col.field] }}
                    }
                  </td>
                }
              </tr>
            </ng-template>
          </app-data-grid>
        </div>
      </section>

      <section class="mb-8 mt-4">
        <h3 class="section-header">Indicators & Elements</h3>
        <div class="flex flex-column gap-4">
          <div class="flex gap-4 align-items-center">
            <app-avatar label="P" size="large" />
            <app-avatar label="V" size="large" shape="circle" />
            <app-badge value="2" size="large" severity="danger" />
            <app-tag value="Active" severity="success" />
            <app-tag value="Pending" severity="warning" />
          </div>
          
          <div>
            <h4 class="text-sm text-secondary mb-2">Progress Bar</h4>
            <app-progress-bar [value]="50" />
          </div>

          <div>
            <h4 class="text-sm text-secondary mb-2">Skeleton Loading</h4>
            <app-skeleton width="10rem" height="4rem" class="mb-2 block" />
            <app-skeleton width="100%" height="2rem" class="block" />
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataShowcaseComponent {
  users = MOCK_USERS;
  columns = MOCK_COLUMNS;
}
