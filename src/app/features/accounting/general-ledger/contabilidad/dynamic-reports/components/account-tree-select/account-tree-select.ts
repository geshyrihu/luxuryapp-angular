import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { TreeNode } from "primeng/api";
import { BadgeModule } from "primeng/badge";
import { InputTextModule } from "primeng/inputtext";
import { TreeModule } from "primeng/tree";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IAccountTreeNode } from "../../models/report-definition.interface";
import { livePreviewState } from "../../state/live-preview.state";

const treeCatalogCache = new Map<string, IAccountTreeNode[]>();

@Component({
  selector: "app-account-tree-select",

  imports: [TreeModule, BadgeModule, InputTextModule, DragDropModule, AppIcon],
  template: `
    <div class="flex flex-column gap-2 p-1 h-full">
      <div class="p-inputgroup w-full sticky top-0 z-1 bg-white">
        <span class="p-inputgroup-addon"><app-icon [icon]="'mdi:magnify'"></app-icon></span>
        <input
          type="text"
          pInputText
          placeholder="Filtrar catálogo..."
          class="w-full p-inputtext-sm border-none shadow-none"
          (input)="onFilter($event)"
        />
      </div>

      @if (loading()) {
        <div
          class="flex flex-column align-items-center justify-content-center p-4 gap-2"
        >
          <app-icon [icon]="'mdi:spin'" class="text-2xl text-primary-500"></app-icon>
          <span class="text-xs text-500 uppercase font-bold tracking-wider"
            >Cargando...</span
          >
        </div>
      } @else {
        <div
          class="overflow-auto border-round surface-border"
          cdkDropList
          cdkDropListSortingDisabled="true"
        >
          <p-tree
            [value]="filteredNodes()"
            selectionMode="checkbox"
            [(selection)]="selectedNodes"
            [scrollHeight]="scrollHeight()"
            [metaKeySelection]="false"
            class="w-full border-none"
          >
            <ng-template pTemplate="default" let-node>
              <div
                class="flex align-items-center gap-2 py-1 w-full account-node"
                cdkDrag
                (cdkDragStarted)="onAccountDragStart()"
                (cdkDragEnded)="onAccountDragEnd()"
                [cdkDragData]="{ code: node.data?.code, name: node.data?.name }"
                [cdkDragDisabled]="!isDraggable()"
                [class.cursor-move]="isDraggable()"
              >
                <div
                  *cdkDragPreview
                  class="bg-primary-50 border-1 border-primary-200 border-round p-2 shadow-2 flex align-items-center gap-2 opacity-90 z-5"
                >
                  <app-icon [icon]="'mdi:menu'" class="text-primary-500"></app-icon>
                  <span class="font-mono text-xs font-bold text-primary-900">{{
                    node.data.code
                  }}</span>
                  <span class="text-sm font-semibold">{{
                    node.data.name
                  }}</span>
                </div>

                <p-badge
                  [value]="'N' + node.data.level"
                  [severity]="getBadgeSeverity(node.data.level)"
                  styleClass="text-xs"
                />

                <div class="flex flex-column gap-0 overflow-hidden">
                  <span
                    class="font-mono text-xs font-bold text-primary-700 line-height-1"
                    >{{ node.data.code }}</span
                  >
                  <span
                    class="text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis text-700"
                    >{{ node.data.name }}</span
                  >
                </div>
              </div>
            </ng-template>
          </p-tree>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .p-tree {
        padding: 0;
        background: transparent;
      }
      :host ::ng-deep .p-tree .p-treenode-content {
        padding: 0.15rem 0.4rem;
        border-radius: 6px;
        transition: background 0.2s;
      }
      :host ::ng-deep .p-tree .p-treenode-content:hover {
        background: var(--primary-50);
      }
      .account-node:hover {
        color: var(--primary-700);
      }
      .cursor-move {
        cursor: move;
      }
    `,
  ],
})
export class AccountTreeSelect {
  private apiResponseS = inject(ApiResponseService);
  private lastLoadKey = "";

  customerId = input.required<string>();
  year = input.required<number>();
  empresa = input<string>("Contabilidad");
  scrollHeight = input<string>("calc(100vh - 250px)");
  isDraggable = input<boolean>(false);
  selectedCodes = model<string[]>([]);

  loading = signal(false);
  nodes = signal<TreeNode[]>([]);
  filterText = signal("");

  filteredNodes = computed(() => {
    const text = this.filterText().toLowerCase().trim();
    if (!text) return this.nodes();
    return this.filterTree(this.nodes(), text);
  });

  get selectedNodes(): TreeNode[] {
    return this.mapCodesToNodes(this.nodes(), this.selectedCodes());
  }

  set selectedNodes(val: TreeNode[] | undefined | null) {
    if (!val) {
      this.selectedCodes.set([]);
      return;
    }

    const selected = [
      ...new Map(
        val
          .map((node) => ({
            code: node.data?.code as string | undefined,
            level: node.data?.level as number | undefined,
          }))
          .filter(
            (item): item is { code: string; level: number } =>
              typeof item.code === "string" &&
              item.code.length > 0 &&
              typeof item.level === "number",
          )
          .map((item) => [item.code, item]),
      ).values(),
    ];

    const codes = selected
      .filter((item) => item.level > 0)
      .sort((left, right) => left.level - right.level)
      .filter(
        (item) =>
          !selected.some(
            (other) =>
              other.code !== item.code &&
              other.level > 0 &&
              other.level < item.level &&
              this.isAncestorCode(other.code, item.code),
          ),
      )
      .map((item) => item.code);

    this.selectedCodes.set(codes);
  }

  constructor() {
    effect(() => {
      const customerId = this.customerId();
      const year = this.year();
      const empresa = this.empresa();

      if (!customerId || !year) {
        this.nodes.set([]);
        return;
      }

      const key = `${customerId}-${year}-${empresa}`;
      if (this.lastLoadKey === key) return;

      this.lastLoadKey = key;
      void this.loadCatalog(customerId, year, empresa);
    });
  }

  onFilter(event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.filterText.set(target?.value ?? "");
  }

  onAccountDragStart() {
    livePreviewState.draggingType.set('account');
  }

  onAccountDragEnd() {
    livePreviewState.draggingType.set(null);
  }

  onDragStart(event: DragEvent, node: TreeNode) {
    if (!this.isDraggable()) return;

    const code = node.data?.code;
    if (!event.dataTransfer || typeof code !== "string" || code.length === 0) {
      return;
    }

    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", code);
    event.dataTransfer.setData("application/x-luxuryapp-account-code", code);
  }

  onDragEnd(_event: DragEvent) {}

  private async loadCatalog(customerId: string, year: number, empresa: string) {
    this.loading.set(true);
    try {
      const key = `${customerId}-${year}-${empresa}`;
      const cachedTree = treeCatalogCache.get(key);
      const tree =
        cachedTree ??
        (await this.apiResponseS.onGetItem<IAccountTreeNode[]>(
          Endpoints.DynamicReports.Accounts.tree(customerId, year, empresa),
        )) ??
        [];

      if (!cachedTree && tree.length > 0) {
        treeCatalogCache.set(key, tree);
      }

      this.nodes.set(this.mapToTreeNodes(tree));
    } catch (error) {
      console.error("Error al cargar el catálogo de cuentas:", error);
    } finally {
      this.loading.set(false);
    }
  }

  private mapToTreeNodes(data: IAccountTreeNode[]): TreeNode[] {
    return data.map((item) => ({
      label: item.name,
      data: { code: item.code, name: item.name, level: item.level },
      expanded: item.level < 1,
      leaf: item.children.length === 0,
      children: this.mapToTreeNodes(item.children),
    }));
  }

  private mapCodesToNodes(nodes: TreeNode[], codes: string[]): TreeNode[] {
    const result: TreeNode[] = [];
    const codeSet = new Set(codes);

    const traverse = (list: TreeNode[]) => {
      list.forEach((node) => {
        if (codeSet.has(node.data.code)) result.push(node);
        if (node.children) traverse(node.children);
      });
    };

    traverse(nodes);
    return result;
  }

  private filterTree(nodes: TreeNode[], text: string): TreeNode[] {
    return nodes
      .map((node) => {
        const match =
          node.data.code.toLowerCase().includes(text) ||
          node.data.name.toLowerCase().includes(text);
        const filteredChildren = node.children
          ? this.filterTree(node.children, text)
          : [];

        if (match || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren, expanded: true };
        }
        return null;
      })
      .filter((node) => node !== null) as TreeNode[];
  }

  private isAncestorCode(ancestor: string, descendant: string): boolean {
    if (ancestor === descendant) return false;
    if (ancestor.length === 1) return descendant.startsWith(ancestor);

    const parts = ancestor.split("-");
    if (parts.length !== 3) return false;

    if (parts[1] === "000" && parts[2] === "000") {
      return descendant.startsWith(`${parts[0]}-`);
    }

    if (parts[2] === "000") {
      return descendant.startsWith(`${parts[0]}-${parts[1]}-`);
    }

    return false;
  }

  getBadgeSeverity(
    level: number,
  ): "info" | "success" | "warning" | "secondary" {
    if (level <= 1) return "info";
    if (level === 2) return "success";
    return "warning";
  }
}
