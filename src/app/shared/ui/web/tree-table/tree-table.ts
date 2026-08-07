import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { TreeNode } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { TreeTableModule } from "primeng/treetable";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface TreeTableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  styleClass?: string;
  icon?: string;
}

@Component({
  selector: "app-tree-table",

  imports: [TreeTableModule, ButtonModule, AppIcon],
  template: `
    <div class="tree-table-root">
      @if (headerTemplate() || headerTitle()) {
        <div class="tree-table-header">
          @if (headerTitle()) {
            <strong>{{ headerTitle() }}</strong>
          }
          <ng-content select="[header]" />
        </div>
      }

      <p-treetable
        [value]="nodesWithIcon()"
        [columns]="cols()"
        [selectionMode]="selectionMode()"
        [selection]="selection()"
        (selectionChange)="selection.set($event)"
        [dataKey]="dataKey()"
        [loading]="loading()"
        [paginator]="paginator()"
        [rows]="rows()"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        [totalRecords]="totalRecords()"
        [sortField]="sortField()"
        [sortOrder]="sortOrder()"
        [multiSortMeta]="multiSortMeta()"
        [scrollable]="scrollable()"
        [scrollHeight]="scrollHeight()"
        [virtualScroll]="virtualScroll()"
        [virtualScrollItemSize]="virtualScrollItemSize()"
        [filters]="filters()"
        [globalFilterFields]="globalFilterFields()"
        [resizableColumns]="resizableColumns()"
        [reorderableColumns]="reorderableColumns()"
        [showGridlines]="showGridlines()"
        [rowHover]="true"
        [lazy]="lazy()"
        (onNodeExpand)="onNodeExpand.emit($event)"
        (onNodeCollapse)="onNodeCollapse.emit($event)"
        (onPage)="onPage.emit($event)"
        (onSort)="onSort.emit($event)"
        (onLazyLoad)="onLazyLoad.emit($event)"
        (onFilter)="onFilter.emit($event)"
        (onNodeSelect)="onNodeSelect.emit($event)"
        (onNodeUnselect)="onNodeUnselect.emit($event)"
        styleClass="w-full"
        tableStyleClass="w-full"
      >
        <ng-template #caption>
          <ng-content select="[caption]" />
        </ng-template>

        <ng-template #emptymessage>
          <div class="p-4 text-center text-color-secondary">
            <app-icon icon="mdi:file-tree-outline" class="text-2xl mb-2" />
            <p class="text-sm m-0">{{ emptyMessage() }}</p>
          </div>
        </ng-template>

        <ng-template #summary>
          @if (summaryTemplate()) {
            <ng-content select="[summary]" />
          } @else {
            <span class="text-sm text-color-secondary">
              {{ nodes().length }} registros
            </span>
          }
        </ng-template>
      </p-treetable>
    </div>
  `,
  styles: [
    `
      .tree-table-root {
        width: 100%;
      }
      .tree-table-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0;
        font-size: var(--ds-font-size-section-title);
        color: var(--ds-text-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TreeTable {
  nodes = input.required<TreeNode[]>();
  columns = input.required<TreeTableColumn[]>();
  dataKey = input<string>("data");
  selectionMode = input<"single" | "multiple" | "checkbox" | undefined>(
    undefined,
  );
  selection = model<any>(undefined);
  loading = input<boolean>(false);
  paginator = input<boolean>(false);
  rows = input<number>(20);
  rowsPerPageOptions = input<number[]>([10, 20, 50, 100]);
  totalRecords = input<number>(0);
  sortField = input<string>("");
  sortOrder = input<number>(1);
  multiSortMeta = input<any[]>([]);
  scrollable = input<boolean>(false);
  scrollHeight = input<string>("400px");
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(40);
  filters = input<any>({});
  globalFilterFields = input<string[]>([]);
  resizableColumns = input<boolean>(false);
  reorderableColumns = input<boolean>(false);
  showGridlines = input<boolean>(true);
  lazy = input<boolean>(false);
  emptyMessage = input<string>("Sin datos");

  headerTitle = input<string>("");
  headerTemplate = input<boolean>(false);

  onNodeExpand = output<any>();
  onNodeCollapse = output<any>();
  onPage = output<any>();
  onSort = output<any>();
  onLazyLoad = output<any>();
  onFilter = output<any>();
  onNodeSelect = output<any>();
  onNodeUnselect = output<any>();

  cols = computed<TreeTableColumn[]>(() => this.columns());

  nodesWithIcon = computed<TreeNode[]>(() =>
    this.nodes().map((node) => ({
      ...node,
      icon: node.icon || "mdi:folder-outline",
    })),
  );
}
