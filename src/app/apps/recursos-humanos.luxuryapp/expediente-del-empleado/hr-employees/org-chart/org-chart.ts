import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { GraphModule, Orientation } from "@swimlane/ngx-graph";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxSidebar } from "@ui/adaptive/sidebar/sidebar";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxToast } from "@ui/adaptive/toast/toast";
import { TabItem } from "@ui/base/tabs.base";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MessageService } from "@ui/web/primeng-api/primeng-api";
import { SelectButtonModule } from "@ui/web/primeng-selectbutton/primeng-selectbutton";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import {
  buildOrgChartGraph,
  flattenOrgChartNodes,
  withVirtualRoot,
} from "./helpers/org-chart-graph-adapter";
import {
  flattenOrgChartEditorRows,
  getOrgSiblingContext,
  IOrgChartEditorRow,
} from "./helpers/org-chart-tree-ops";
import { validateReassignment } from "./helpers/org-chart-validation";
import {
  IWorkPositionOrgChartNode,
  IWorkPositionReassignRequest,
  IWorkPositionReassignResponse,
  ORG_CHART_VIRTUAL_ROOT_ID,
} from "./interfaces/org-chart.interfaces";

@Component({
  selector: "app-org-chart",
  templateUrl: "./org-chart.html",
  styleUrl: "./org-chart.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    AppIcon,
    CommonModule,
    GraphModule,
    LxAvatar,
    WebButtonLabel,
    LxSidebar,
    SelectButtonModule,
    LxTabs,
    LxTag,
    LxToast,
  ],
})
export class OrgChart {
  readonly apiS = inject(ApiResponseService);
  readonly customerIdS = inject(CustomerIdService);
  readonly aspRoleS = inject(AspRoleService);
  readonly messageS = inject(MessageService);

  readonly tree = signal<IWorkPositionOrgChartNode[]>([]);
  readonly loading = signal(false);
  readonly reassignLoading = signal(false);
  readonly tabs = computed<TabItem[]>(() => [
    { id: "view", label: "Visualizar" },
    { id: "edit", label: "Editar", disabled: !this.canEdit() },
  ]);
  readonly activeTab = signal<"view" | "edit">("edit");
  readonly editMode = signal(true);
  readonly selectedOrigin = signal<IWorkPositionOrgChartNode | null>(null);
  readonly selectedDest = signal<IWorkPositionOrgChartNode | null>(null);
  readonly draggingNode = signal<IWorkPositionOrgChartNode | null>(null);
  readonly dragHoverNodeId = signal<string | null>(null);
  readonly dragHoverEdge = signal<"before" | "after" | null>(null);
  readonly dragHoverRoot = signal(false);
  readonly drawerVisible = signal(false);
  readonly selectedNodeForDetails = signal<IWorkPositionOrgChartNode | null>(
    null,
  );
  readonly viewport = signal({ width: 1440, height: 900 });

  readonly canEdit = computed(() =>
    this.aspRoleS.hasRole(ApplicationRole.SuperUsuario),
  );
  readonly editTabDisabled = computed(() => !this.canEdit());
  readonly graphTree = computed(() => withVirtualRoot(this.tree()));
  readonly graphModel = computed(() =>
    buildOrgChartGraph(this.graphTree(), {
      selectedOriginId: this.selectedOrigin()?.workPositionId ?? null,
      selectedDestId:
        this.selectedDest()?.workPositionId ?? this.dragHoverNodeId(),
    }),
  );
  readonly totalNodes = computed(
    () =>
      flattenOrgChartNodes(this.tree()).filter(
        (node) => node.workPositionId !== ORG_CHART_VIRTUAL_ROOT_ID,
      ).length,
  );
  readonly vacantCount = computed(
    () =>
      flattenOrgChartNodes(this.tree()).filter(
        (node) =>
          node.workPositionId !== ORG_CHART_VIRTUAL_ROOT_ID &&
          !node.hasEmployee,
      ).length,
  );
  readonly isCompactViewport = computed(() => this.viewport().width < 960);
  readonly graphView = computed<[number, number]>(() => [
    Math.max(this.viewport().width - (this.isCompactViewport() ? 32 : 72), 720),
    Math.max(
      this.viewport().height - (this.isCompactViewport() ? 320 : 260),
      560,
    ),
  ]);
  readonly selectedOriginContext = computed(() => {
    const origin = this.selectedOrigin();
    if (!origin) {
      return null;
    }

    return getOrgSiblingContext(this.tree(), origin.workPositionId);
  });
  readonly editRows = computed<IOrgChartEditorRow[]>(() =>
    flattenOrgChartEditorRows(this.tree()),
  );
  readonly canMoveSelectedUp = computed(() => {
    const context = this.selectedOriginContext();
    return !!context && context.index > 0;
  });
  readonly canMoveSelectedDown = computed(() => {
    const context = this.selectedOriginContext();
    return !!context && context.index < context.siblings.length - 1;
  });

  readonly graphLayoutSettings = {
    orientation: Orientation.TOP_TO_BOTTOM,
    rankPadding: 110,
    nodePadding: 36,
  };

  constructor() {
    this.syncViewport();

    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        void this.loadTree();
      }
    });

    effect(() => {
      if (!this.canEdit() && this.activeTab() !== "view") {
        this.activeTab.set("view");
        this.editMode.set(false);
      }
    });
  }

  @HostListener("window:resize")
  onWindowResize(): void {
    this.syncViewport();
  }

  @HostListener("document:keydown.escape")
  onEscapePressed(): void {
    if (this.drawerVisible()) {
      this.drawerVisible.set(false);
      return;
    }

    if (this.editMode() && (this.selectedOrigin() || this.selectedDest())) {
      this.clearSelection();
    }
  }

  async loadTree(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return;
    }

    this.loading.set(true);
    try {
      const data = await this.apiS.onGetList<IWorkPositionOrgChartNode[]>(
        Endpoints.OrgChart.getTree(customerId),
      );
      this.tree.set(data ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  onGraphNodeClick(node: IWorkPositionOrgChartNode, event?: Event): void {
    event?.stopPropagation();

    if (!this.editMode()) {
      this.onOpenDetails(node);
      return;
    }

    if (node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID) {
      this.messageS.add({
        severity: "warn",
        summary: "Accion no permitida",
        detail: "El nodo raiz virtual no se puede mover.",
        life: 2500,
      });
      return;
    }

    const origin = this.selectedOrigin();

    if (!origin) {
      this.selectedOrigin.set(node);
      this.selectedDest.set(null);
      this.messageS.add({
        severity: "info",
        summary: "Origen seleccionado",
        detail: `${node.folio}: ahora selecciona el nuevo jefe.`,
        life: 2500,
      });
      return;
    }

    if (origin.workPositionId === node.workPositionId) {
      this.clearSelection();
      this.messageS.add({
        severity: "info",
        summary: "Seleccion cancelada",
        detail: "Se limpio la seleccion actual.",
        life: 2000,
      });
      return;
    }

    const validation = validateReassignment(origin, node);
    if (!validation.valid) {
      this.messageS.add({
        severity: "error",
        summary: "Movimiento invalido",
        detail: validation.reason,
        life: 4000,
      });
      return;
    }

    this.selectedDest.set(node);
    const newParentId =
      node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID
        ? null
        : node.workPositionId;
    const newSortOrder = node.children.length;
    void this.executeReassign(origin.workPositionId, newParentId, newSortOrder);
  }

  onGraphNodeKeydown(
    node: IWorkPositionOrgChartNode,
    event: KeyboardEvent,
  ): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    this.onGraphNodeClick(node, event);
  }

  onActiveTabChange(tab: "view" | "edit"): void {
    this.activeTab.set(tab);

    if (tab === "view") {
      this.editMode.set(false);
      this.clearSelection();
      return;
    }

    if (this.canEdit()) {
      this.editMode.set(true);
    }
  }

  onEditorRowClick(node: IWorkPositionOrgChartNode): void {
    if (this.selectedOrigin()?.workPositionId === node.workPositionId) {
      this.clearSelection();
      return;
    }

    this.selectedOrigin.set(node);
    this.selectedDest.set(null);
  }

  onEditorRowDragStart(
    node: IWorkPositionOrgChartNode,
    event: DragEvent,
  ): void {
    this.onCardDragStart(node, event);
  }

  onEditorRowDragOver(row: IOrgChartEditorRow, event: DragEvent): void {
    const origin = this.draggingNode();
    if (!origin || origin.workPositionId === row.node.workPositionId) {
      return;
    }

    const validation = validateReassignment(origin, row.node);
    if (!validation.valid) {
      this.dragHoverNodeId.set(null);
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }

    this.dragHoverRoot.set(false);
    this.dragHoverNodeId.set(row.node.workPositionId);
    this.dragHoverEdge.set(null);
  }

  onEditorRowDragLeave(row: IOrgChartEditorRow): void {
    if (this.dragHoverNodeId() === row.node.workPositionId) {
      this.dragHoverNodeId.set(null);
    }
  }

  onEditorRowDrop(row: IOrgChartEditorRow, event: DragEvent): void {
    event.preventDefault();

    const origin = this.draggingNode();
    this.draggingNode.set(null);
    this.dragHoverRoot.set(false);
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);

    if (!origin || origin.workPositionId === row.node.workPositionId) {
      return;
    }

    const validation = validateReassignment(origin, row.node);
    if (!validation.valid) {
      this.messageS.add({
        severity: "error",
        summary: "Movimiento invalido",
        detail: validation.reason,
        life: 4000,
      });
      return;
    }

    this.selectedOrigin.set(origin);
    this.selectedDest.set(row.node);
    void this.executeReassign(
      origin.workPositionId,
      row.node.workPositionId,
      row.node.children.length,
    );
  }

  onCardDragStart(node: IWorkPositionOrgChartNode, event: DragEvent): void {
    if (!this.editMode() || node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID) {
      event.preventDefault();
      return;
    }

    this.draggingNode.set(node);
    this.selectedOrigin.set(node);
    this.selectedDest.set(null);
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.dragHoverRoot.set(false);

    event.dataTransfer?.setData("text/plain", node.workPositionId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
    }
  }

  onCardDragEnd(): void {
    this.draggingNode.set(null);
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.dragHoverRoot.set(false);
  }

  onCardDragOver(node: IWorkPositionOrgChartNode, event: DragEvent): void {
    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    if (!origin || origin.workPositionId === node.workPositionId) {
      return;
    }

    const validation = validateReassignment(origin, node);
    if (!validation.valid) {
      this.dragHoverNodeId.set(null);
      this.dragHoverEdge.set(null);
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    this.dragHoverNodeId.set(node.workPositionId);
    this.dragHoverEdge.set(null);
  }

  onCardDragLeave(node: IWorkPositionOrgChartNode): void {
    if (this.dragHoverNodeId() === node.workPositionId) {
      this.dragHoverNodeId.set(null);
      this.dragHoverEdge.set(null);
    }
  }

  onCardDrop(node: IWorkPositionOrgChartNode, event: DragEvent): void {
    event.preventDefault();

    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.draggingNode.set(null);
    this.dragHoverRoot.set(false);

    if (!origin || origin.workPositionId === node.workPositionId) {
      return;
    }

    const validation = validateReassignment(origin, node);
    if (!validation.valid) {
      this.messageS.add({
        severity: "error",
        summary: "Movimiento invalido",
        detail: validation.reason,
        life: 4000,
      });
      return;
    }

    this.selectedOrigin.set(origin);
    this.selectedDest.set(node);
    const newParentId =
      node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID
        ? null
        : node.workPositionId;
    const newSortOrder = node.children.length;
    void this.executeReassign(origin.workPositionId, newParentId, newSortOrder);
  }

  onReorderZoneDragOver(
    node: IWorkPositionOrgChartNode,
    placement: "before" | "after",
    event: DragEvent,
  ): void {
    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    if (!origin || origin.workPositionId === node.workPositionId) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }

    this.dragHoverRoot.set(false);
    this.dragHoverNodeId.set(node.workPositionId);
    this.dragHoverEdge.set(placement);
  }

  onReorderZoneDrop(
    node: IWorkPositionOrgChartNode,
    placement: "before" | "after",
    event: DragEvent,
  ): void {
    event.preventDefault();

    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    this.draggingNode.set(null);
    this.dragHoverRoot.set(false);
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);

    if (!origin || origin.workPositionId === node.workPositionId) {
      return;
    }

    const delta = placement === "before" ? -1 : 1;
    this.reorderNode(origin, delta);
  }

  onRootDragOver(event: DragEvent): void {
    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    if (!origin) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.dragHoverRoot.set(true);
  }

  onRootDragLeave(): void {
    this.dragHoverRoot.set(false);
  }

  onRootDrop(event: DragEvent): void {
    event.preventDefault();

    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    this.draggingNode.set(null);
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.dragHoverRoot.set(false);

    if (!origin) {
      return;
    }

    this.selectedOrigin.set(origin);
    this.selectedDest.set(null);
    void this.executeReassign(origin.workPositionId, null, this.tree().length);
  }

  onOpenDetails(node: IWorkPositionOrgChartNode): void {
    if (this.editMode() || node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID) {
      return;
    }

    this.selectedNodeForDetails.set(node);
    this.drawerVisible.set(true);
  }

  clearSelection(): void {
    this.selectedOrigin.set(null);
    this.selectedDest.set(null);
    this.draggingNode.set(null);
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.dragHoverRoot.set(false);
  }

  moveSelectedToRoot(): void {
    const origin = this.selectedOrigin();
    if (!origin) {
      return;
    }

    this.moveNodeToRoot(origin);
  }

  reorderSelected(delta: -1 | 1): void {
    const origin = this.selectedOrigin();
    if (!origin) {
      return;
    }

    this.reorderNode(origin, delta);
  }

  moveNodeToRoot(node: IWorkPositionOrgChartNode): void {
    this.selectedOrigin.set(node);
    this.selectedDest.set(null);
    void this.executeReassign(node.workPositionId, null, this.tree().length);
  }

  reorderNode(node: IWorkPositionOrgChartNode, delta: -1 | 1): void {
    const context = this.selectedOriginContext();
    const effectiveContext =
      context?.node.workPositionId === node.workPositionId
        ? context
        : getOrgSiblingContext(this.tree(), node.workPositionId);

    if (!effectiveContext) {
      return;
    }

    const nextIndex = effectiveContext.index + delta;
    if (nextIndex < 0 || nextIndex >= effectiveContext.siblings.length) {
      return;
    }

    this.selectedOrigin.set(node);
    this.selectedDest.set(null);

    const newParentId = effectiveContext.parent?.workPositionId ?? null;
    void this.executeReassign(node.workPositionId, newParentId, nextIndex);
  }

  canMoveNodeUp(node: IWorkPositionOrgChartNode): boolean {
    const context = getOrgSiblingContext(this.tree(), node.workPositionId);
    return !!context && context.index > 0;
  }

  canMoveNodeDown(node: IWorkPositionOrgChartNode): boolean {
    const context = getOrgSiblingContext(this.tree(), node.workPositionId);
    return !!context && context.index < context.siblings.length - 1;
  }

  getEditorRowIndent(depth: number): string {
    return `${depth * 1.25}rem`;
  }

  getParentLabel(row: IOrgChartEditorRow): string {
    return row.parent?.folio ?? "Nivel raiz";
  }

  getEditorDropMessage(row: IOrgChartEditorRow): string {
    return `Soltar aqui para que reporte a ${row.node.folio}`;
  }

  getNodeInitials(node: IWorkPositionOrgChartNode): string {
    if (node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID) {
      return "LA";
    }

    const source = node.employeeName ?? node.roleDisplayName ?? node.folio;
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  getNodeAriaLabel(node: IWorkPositionOrgChartNode): string {
    const owner = node.employeeName ?? "Vacante";
    const department = node.departmentName
      ? `, departamento ${node.departmentName}`
      : "";
    const role = node.roleDisplayName ? `, puesto ${node.roleDisplayName}` : "";
    const modeHint = this.editMode()
      ? ". Presiona Enter o espacio para seleccionar o reasignar."
      : ". Presiona Enter o espacio para ver detalles.";

    if (node.workPositionId === ORG_CHART_VIRTUAL_ROOT_ID) {
      return "Nodo raiz virtual del organigrama.";
    }

    return `${owner}${role}${department}${modeHint}`;
  }

  isDraggingAnotherNode(node: IWorkPositionOrgChartNode): boolean {
    const dragging = this.draggingNode();
    return !!dragging && dragging.workPositionId !== node.workPositionId;
  }

  shouldShowReorderAffordances(node: IWorkPositionOrgChartNode): boolean {
    return (
      this.editMode() &&
      node.workPositionId !== ORG_CHART_VIRTUAL_ROOT_ID &&
      this.isDraggingAnotherNode(node)
    );
  }

  isReorderHover(
    node: IWorkPositionOrgChartNode,
    placement: "before" | "after",
  ): boolean {
    return (
      this.dragHoverNodeId() === node.workPositionId &&
      this.dragHoverEdge() === placement
    );
  }

  getDragGuideMessage(): string {
    const dragging = this.draggingNode();
    if (!dragging) {
      return "";
    }

    return `Arrastrando ${dragging.folio}: suelta la fila sobre otro puesto para cambiar su jefe inmediato o en la zona raiz para convertirlo en puesto de nivel raiz.`;
  }

  private async executeReassign(
    originWorkPositionId: string,
    newParentId: string | null,
    newSortOrder: number,
  ): Promise<void> {
    this.reassignLoading.set(true);

    try {
      const payload: IWorkPositionReassignRequest = {
        workPositionId: originWorkPositionId,
        newReportsToWorkPositionId: newParentId,
        sortOrder: newSortOrder,
      };

      const res = await this.apiS.onPatch<IWorkPositionReassignResponse>(
        Endpoints.OrgChart.reassign,
        payload,
      );

      if (res) {
        this.messageS.add({
          severity: "success",
          summary: "Estructura actualizada",
          detail: "La jerarquia del organigrama se actualizo correctamente.",
        });
        this.clearSelection();
        await this.loadTree();
        return;
      }

      this.messageS.add({
        severity: "error",
        summary: "No se pudo actualizar la estructura",
        detail:
          "La API rechazo el movimiento o no respondio correctamente. La seleccion actual se conserva para reintentar.",
        life: 5000,
      });
    } finally {
      this.reassignLoading.set(false);
    }
  }

  private syncViewport(): void {
    if (typeof window === "undefined") {
      return;
    }

    this.viewport.set({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
}
