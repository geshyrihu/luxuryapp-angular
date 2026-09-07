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
import { getOrgSiblingContext } from "./helpers/org-chart-tree-ops";
import { validateReassignment } from "./helpers/org-chart-validation";
import {
  IRoleOrgChartMember,
  IRoleOrgChartNode,
  IRoleOrgChartReassignRequest,
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

  readonly tree = signal<IRoleOrgChartNode[]>([]);
  readonly loading = signal(false);
  readonly reassignLoading = signal(false);
  readonly tabs = computed<TabItem[]>(() => [
    { id: "view", label: "Visualizar" },
    { id: "edit", label: "Editar", disabled: !this.canEdit() },
  ]);
  readonly activeTab = signal<"view" | "edit">("edit");
  readonly editMode = signal(true);
  readonly selectedOrigin = signal<IRoleOrgChartNode | null>(null);
  readonly selectedDest = signal<IRoleOrgChartNode | null>(null);
  readonly draggingNode = signal<IRoleOrgChartNode | null>(null);
  readonly dragHoverNodeId = signal<string | null>(null);
  readonly dragHoverEdge = signal<"before" | "after" | null>(null);
  readonly dragHoverRoot = signal(false);
  readonly drawerVisible = signal(false);
  readonly selectedNodeForDetails = signal<IRoleOrgChartNode | null>(null);
  readonly viewport = signal({ width: 1440, height: 900 });

  readonly canEdit = computed(() =>
    this.aspRoleS.hasRole(ApplicationRole.SuperUsuario),
  );
  readonly editTabDisabled = computed(() => !this.canEdit());
  readonly displayTree = computed(() => this.tree());
  readonly graphTree = computed(() => withVirtualRoot(this.displayTree()));
  readonly graphModel = computed(() =>
    buildOrgChartGraph(this.graphTree(), {
      selectedOriginId: this.selectedOrigin()?.roleId ?? null,
      selectedDestId: this.selectedDest()?.roleId ?? this.dragHoverNodeId(),
    }),
  );
  readonly totalNodes = computed(
    () =>
      flattenOrgChartNodes(this.tree()).filter(
        (node) => node.roleId !== ORG_CHART_VIRTUAL_ROOT_ID,
      ).length,
  );
  readonly vacantCount = computed(() =>
    flattenOrgChartNodes(this.tree())
      .filter((node) => node.roleId !== ORG_CHART_VIRTUAL_ROOT_ID)
      .reduce((total, node) => total + this.getVacantMemberCount(node), 0),
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

    return getOrgSiblingContext(this.tree(), origin.roleId);
  });
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
      const data = await this.apiS.onGetList<IRoleOrgChartNode[]>(
        Endpoints.OrgChart.getTree(customerId),
      );
      this.tree.set(data ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  onGraphNodeClick(node: IRoleOrgChartNode, event?: Event): void {
    event?.stopPropagation();

    if (!this.editMode()) {
      this.onOpenDetails(node);
      return;
    }

    if (node.roleId === ORG_CHART_VIRTUAL_ROOT_ID) {
      this.messageS.add({
        severity: "warn",
        summary: "Acción no permitida",
        detail: "El nodo raíz virtual no se puede mover.",
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
        detail: `${node.roleDisplayName}: ahora selecciona el nuevo rol superior.`,
        life: 2500,
      });
      return;
    }

    if (origin.roleId === node.roleId) {
      this.clearSelection();
      this.messageS.add({
        severity: "info",
        summary: "Selección cancelada",
        detail: "Se limpió la selección actual.",
        life: 2000,
      });
      return;
    }

    const validation = validateReassignment(origin, node);
    if (!validation.valid) {
      this.messageS.add({
        severity: "error",
        summary: "Movimiento inválido",
        detail: validation.reason,
        life: 4000,
      });
      return;
    }

    this.selectedDest.set(node);
    const newParentId =
      node.roleId === ORG_CHART_VIRTUAL_ROOT_ID ? null : node.roleId;
    const newSortOrder = node.children.length;
    void this.executeReassign(origin.roleId, newParentId, newSortOrder);
  }

  onGraphNodeKeydown(node: IRoleOrgChartNode, event: KeyboardEvent): void {
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
      this.drawerVisible.set(false);
    }
  }

  onCardDragStart(node: IRoleOrgChartNode, event: DragEvent): void {
    if (!this.editMode() || node.roleId === ORG_CHART_VIRTUAL_ROOT_ID) {
      event.preventDefault();
      return;
    }

    this.draggingNode.set(node);
    this.selectedOrigin.set(node);
    this.selectedDest.set(null);
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.dragHoverRoot.set(false);

    event.dataTransfer?.setData("text/plain", node.roleId);
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

  onCardDragOver(node: IRoleOrgChartNode, event: DragEvent): void {
    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    if (!origin || origin.roleId === node.roleId) {
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
    this.dragHoverNodeId.set(node.roleId);
    this.dragHoverEdge.set(null);
  }

  onCardDragLeave(node: IRoleOrgChartNode): void {
    if (this.dragHoverNodeId() === node.roleId) {
      this.dragHoverNodeId.set(null);
      this.dragHoverEdge.set(null);
    }
  }

  onCardDrop(node: IRoleOrgChartNode, event: DragEvent): void {
    event.preventDefault();

    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    this.dragHoverNodeId.set(null);
    this.dragHoverEdge.set(null);
    this.draggingNode.set(null);
    this.dragHoverRoot.set(false);

    if (!origin || origin.roleId === node.roleId) {
      return;
    }

    const validation = validateReassignment(origin, node);
    if (!validation.valid) {
      this.messageS.add({
        severity: "error",
        summary: "Movimiento inválido",
        detail: validation.reason,
        life: 4000,
      });
      return;
    }

    this.selectedOrigin.set(origin);
    this.selectedDest.set(node);
    const newParentId =
      node.roleId === ORG_CHART_VIRTUAL_ROOT_ID ? null : node.roleId;
    const newSortOrder = node.children.length;
    void this.executeReassign(origin.roleId, newParentId, newSortOrder);
  }

  onReorderZoneDragOver(
    node: IRoleOrgChartNode,
    placement: "before" | "after",
    event: DragEvent,
  ): void {
    if (!this.editMode()) {
      return;
    }

    const origin = this.draggingNode();
    if (!origin || origin.roleId === node.roleId) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }

    this.dragHoverRoot.set(false);
    this.dragHoverNodeId.set(node.roleId);
    this.dragHoverEdge.set(placement);
  }

  onReorderZoneDrop(
    node: IRoleOrgChartNode,
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

    if (!origin || origin.roleId === node.roleId) {
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
    void this.executeReassign(origin.roleId, null, this.tree().length);
  }

  onOpenDetails(node: IRoleOrgChartNode): void {
    if (this.editMode() || node.roleId === ORG_CHART_VIRTUAL_ROOT_ID) {
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

  moveNodeToRoot(node: IRoleOrgChartNode): void {
    this.selectedOrigin.set(node);
    this.selectedDest.set(null);
    void this.executeReassign(node.roleId, null, this.tree().length);
  }

  reorderNode(node: IRoleOrgChartNode, delta: -1 | 1): void {
    const context = this.selectedOriginContext();
    const effectiveContext =
      context?.node.roleId === node.roleId
        ? context
        : getOrgSiblingContext(this.tree(), node.roleId);

    if (!effectiveContext) {
      return;
    }

    const nextIndex = effectiveContext.index + delta;
    if (nextIndex < 0 || nextIndex >= effectiveContext.siblings.length) {
      return;
    }

    this.selectedOrigin.set(node);
    this.selectedDest.set(null);

    const newParentId = effectiveContext.parent?.roleId ?? null;
    void this.executeReassign(node.roleId, newParentId, nextIndex);
  }

  getMemberCount(node: IRoleOrgChartNode): number {
    return node.members.length;
  }

  getAssignedMemberCount(node: IRoleOrgChartNode): number {
    return node.members.filter((member) => member.hasEmployee).length;
  }

  getVacantMemberCount(node: IRoleOrgChartNode): number {
    return node.members.filter((member) => !member.hasEmployee).length;
  }

  getPrimaryMember(node: IRoleOrgChartNode): IRoleOrgChartMember | null {
    return (
      node.members.find((member) => member.hasEmployee) ??
      node.members[0] ??
      null
    );
  }

  getMemberInitials(member: IRoleOrgChartMember | null): string {
    const source = member?.employeeName ?? member?.folio ?? "Vacante";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  getNodeInitials(node: IRoleOrgChartNode): string {
    if (node.roleId === ORG_CHART_VIRTUAL_ROOT_ID) {
      return "LA";
    }

    const source =
      node.roleDisplayName || this.getPrimaryMember(node)?.folio || "Rol";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }

  getRosterSummary(node: IRoleOrgChartNode): string {
    const memberCount = this.getMemberCount(node);
    const vacantCount = this.getVacantMemberCount(node);
    return `${memberCount} ${memberCount === 1 ? "miembro" : "miembros"} · ${vacantCount} vacantes`;
  }

  getNodeAriaLabel(node: IRoleOrgChartNode): string {
    const department = node.departmentName
      ? `, departamento ${node.departmentName}`
      : "";
    const modeHint = this.editMode()
      ? ". Presiona Enter o espacio para seleccionar o reasignar."
      : ". Presiona Enter o espacio para ver miembros.";

    if (node.roleId === ORG_CHART_VIRTUAL_ROOT_ID) {
      return "Nodo raíz virtual del organigrama.";
    }

    return `Rol ${node.roleDisplayName}${department}, ${this.getRosterSummary(node)}${modeHint}`;
  }

  isDraggingAnotherNode(node: IRoleOrgChartNode): boolean {
    const dragging = this.draggingNode();
    return !!dragging && dragging.roleId !== node.roleId;
  }

  shouldShowReorderAffordances(node: IRoleOrgChartNode): boolean {
    return (
      this.editMode() &&
      node.roleId !== ORG_CHART_VIRTUAL_ROOT_ID &&
      this.isDraggingAnotherNode(node)
    );
  }

  isReorderHover(
    node: IRoleOrgChartNode,
    placement: "before" | "after",
  ): boolean {
    return (
      this.dragHoverNodeId() === node.roleId &&
      this.dragHoverEdge() === placement
    );
  }

  getDragGuideMessage(): string {
    const dragging = this.draggingNode();
    if (!dragging) {
      return "";
    }

    return `Arrastrando ${dragging.roleDisplayName}: suelta la tarjeta sobre otro rol para cambiar su superior o en la zona raíz para convertirlo en rol de nivel raíz.`;
  }

  private async executeReassign(
    originRoleId: string,
    newParentId: string | null,
    newSortOrder: number,
  ): Promise<void> {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return;
    }

    this.reassignLoading.set(true);

    try {
      const payload: IRoleOrgChartReassignRequest = {
        roleId: originRoleId,
        newReportsToRoleId: newParentId,
        sortOrder: newSortOrder,
      };

      const res = await this.apiS.onPatch<IWorkPositionReassignResponse>(
        Endpoints.OrgChart.reassign(customerId),
        payload,
      );

      if (res) {
        this.messageS.add({
          severity: "success",
          summary: "Estructura actualizada",
          detail: "La jerarquía del organigrama se actualizó correctamente.",
        });
        this.clearSelection();
        await this.loadTree();
        return;
      }

      this.messageS.add({
        severity: "error",
        summary: "No se pudo actualizar la estructura",
        detail:
          "La API rechazó el movimiento o no respondió correctamente. La selección actual se conserva para reintentar.",
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
