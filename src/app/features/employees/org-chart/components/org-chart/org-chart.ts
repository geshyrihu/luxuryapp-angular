import { ScrollingModule } from "@angular/cdk/scrolling";
import { OrgNode } from "../org-node/org-node";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { Drawer } from "primeng/drawer";
import { SelectButtonModule } from "primeng/selectbutton";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { DndModule, DndDropEvent } from "ngx-drag-drop"; // Importar ngx-drag-drop
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  DEPTO_BORDER_COLORS,
  IOrgChartTreeNode,
  IWorkPositionOrgChartNode,
  IWorkPositionReassignRequest,
  IWorkPositionReassignResponse,
} from "../../models/org-chart.interfaces";
import { validateReassignment } from "../../helpers/org-chart-validation";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-org-chart",
  templateUrl: "./org-chart.html",
  styleUrl: "./org-chart.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    OrgNode,
    DndModule, // Reemplaza DragDropModule
    ScrollingModule,
    AvatarModule,
    CustomButton,
    ConfirmDialogModule,
    Drawer,
    SelectButtonModule,
    TabsModule,
    TagModule,
    ToastModule,
    TooltipModule,
  ],
})
export class OrgChart {
  readonly apiS = inject(ApiResponseService);
  readonly customerIdS = inject(CustomerIdService);
  readonly aspRoleS = inject(AspRoleService);
  readonly confirmationS = inject(ConfirmationService);
  readonly messageS = inject(MessageService);

  readonly tree = signal<IOrgChartTreeNode[]>([]);
  readonly loading = signal(false);
  readonly reassignLoading = signal(false);
  readonly activeTab = signal<"view" | "edit">("view");
  readonly editMode = signal(false);
  readonly selectedOrigin = signal<IWorkPositionOrgChartNode | null>(null);
  readonly selectedDest = signal<IWorkPositionOrgChartNode | null>(null);
  readonly draggingNode = signal<IWorkPositionOrgChartNode | null>(null);
  readonly drawerVisible = signal(false);
  readonly selectedNodeForDetails = signal<IWorkPositionOrgChartNode | null>(
    null,
  );

  readonly rootNodes = computed(() => this.tree());
  readonly totalNodes = computed(() => this.countNodes(this.tree()));

  readonly vacantCount = computed(
    () => this.flattenNodes(this.tree()).filter((n) => !n.hasEmployee).length,
  );
  readonly canEdit = computed(() =>
    this.aspRoleS.hasRole(EApplicationRole.SuperUsuario),
  );
  readonly editTabDisabled = computed(() => !this.canEdit());

  readonly DEPTO_COLORS = DEPTO_BORDER_COLORS;

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadTree();
    });
  }

  async loadTree(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.loading.set(true);
    try {
      const data = await this.apiS.onGetList<IWorkPositionOrgChartNode[]>(
        `WorkPositionOrgChart/tree/${customerId}`,
      );
      const nodes = data ?? [];
      const treeNodes = this.buildTreeNodes(nodes);

      if (treeNodes.length > 1 || (treeNodes.length === 1 && treeNodes[0].data.workPositionId !== '0')) {
        this.tree.set([
          {
            label: "Luxury App",
            type: "root",
            expanded: true,
            data: {
              folio: "ROOT",
              roleDisplayName: "Estructura Organizacional",
              departmentName: "Direcciones",
              employeeName: "Luxury Building Site",
              hasEmployee: false,
              workPositionId: "0",
              hierarchyLevel: -1,
              sortOrder: 0,
              state: "Activo",
              children: [],
            },
            children: treeNodes,
          },
        ]);
      } else {
        this.tree.set(treeNodes);
      }
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Maneja el evento de soltar (Drop) de ngx-drag-drop.
   */
  onDrop(event: DndDropEvent, target: IWorkPositionOrgChartNode | 'list-container'): void {
    if (!this.editMode()) return;

    const origin = event.data as IWorkPositionOrgChartNode;
    
    // CASO 1: REORDENAMIENTO HORIZONTAL (Soltado en el contenedor de hijos)
    if (target === 'list-container') {
      const newSortOrder = event.index ?? 0;

      this.confirmationS.confirm({
        message: `¿Cambiar el orden horizontal de "${origin.folio}"?`,
        header: "Confirmar reordenamiento",
        icon: "pi pi-sort-alt",
        acceptLabel: "Reordenar",
        rejectLabel: "Cancelar",
        accept: () =>
          this.executeReassign(origin, {
            workPositionId: origin.reportsToWorkPositionId ?? "0",
            sortOrder: newSortOrder,
          } as any),
      });
      return;
    }

    // CASO 2: REASIGNACIÓN DE JEFE (Soltado sobre una card)
    const dest = target as IWorkPositionOrgChartNode;
    if (!origin || !dest || origin.workPositionId === dest.workPositionId) {
      return;
    }

    const validation = validateReassignment(origin, dest);
    if (!validation.valid) {
      this.messageS.add({
        severity: "error",
        summary: "Movimiento inválido",
        detail: validation.reason,
        life: 4000,
      });
      return;
    }

    this.confirmationS.confirm({
      message: `¿Mover "${origin.folio}" para que reporte a "${
        dest.employeeName ?? dest.roleDisplayName
      }"?`,
      header: "Confirmar movimiento",
      icon: "pi pi-directions",
      acceptLabel: "Mover",
      rejectLabel: "Cancelar",
      accept: () => this.executeReassign(origin, dest),
    });
  }

  onCardClick(node: IWorkPositionOrgChartNode): void {
    if (!this.editMode()) return;

    if (node.workPositionId === "0") {
      this.messageS.add({
        severity: "warn",
        summary: "Acción no permitida",
        detail: "Este es un nodo de estructura virtual y no se puede mover.",
        life: 3000,
      });
      return;
    }

    const origin = this.selectedOrigin();

    if (!origin) {
      this.selectedOrigin.set(node);
      this.messageS.add({
        severity: "info",
        summary: "Origen seleccionado",
        detail: `${node.folio} — Ahora selecciona el nuevo jefe.`,
        life: 3000,
      });
      return;
    }

    if (origin.workPositionId === node.workPositionId) {
      this.selectedOrigin.set(null);
      this.messageS.add({
        severity: "info",
        summary: "Selección cancelada",
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

    this.confirmationS.confirm({
      message: `¿Mover "${origin.folio}" para que reporte a "${
        node.employeeName ?? node.roleDisplayName
      }"?`,
      header: "Confirmar reasignación",
      icon: "pi pi-directions",
      acceptLabel: "Reasignar",
      rejectLabel: "Cancelar",
      accept: () => this.executeReassign(origin, node),
    });
  }

  private async executeReassign(
    origin: IWorkPositionOrgChartNode,
    dest: IWorkPositionOrgChartNode,
  ): Promise<void> {
    this.reassignLoading.set(true);

    try {
      const payload: IWorkPositionReassignRequest = {
        workPositionId: origin.workPositionId,
        newReportsToWorkPositionId:
          dest.workPositionId === "0" ? null : 
          dest.workPositionId === origin.reportsToWorkPositionId ? origin.reportsToWorkPositionId :
          dest.workPositionId,
        sortOrder: dest.sortOrder ?? origin.sortOrder,
      };

      const res = await this.apiS.onPatch<IWorkPositionReassignResponse>(
        "WorkPositionOrgChart/reassign",
        payload,
      );

      if (res) {
        this.messageS.add({
          severity: "success",
          summary: "Éxito",
          detail: "Estructura actualizada correctamente.",
        });
        this.loadTree();
        this.selectedOrigin.set(null);
        this.selectedDest.set(null);
      }
    } finally {
      this.reassignLoading.set(false);
    }
  }

  onOpenDetails(node: IWorkPositionOrgChartNode): void {
    if (this.editMode() || node.workPositionId === "0") return;
    this.selectedNodeForDetails.set(node);
    this.drawerVisible.set(true);
  }

  isOrigin(node: IWorkPositionOrgChartNode): boolean {
    return this.selectedOrigin()?.workPositionId === node.workPositionId;
  }

  isDest(node: IWorkPositionOrgChartNode): boolean {
    return this.selectedDest()?.workPositionId === node.workPositionId;
  }

  getDeptoBorderClass(departmentName: string): string {
    return this.DEPTO_COLORS[departmentName] || "border-slate-200";
  }

  private buildTreeNodes(
    nodes: IWorkPositionOrgChartNode[],
  ): IOrgChartTreeNode[] {
    return nodes.map((node) => {
      return {
        label: node.folio,
        data: node,
        expanded: true,
        children:
          node.children.length > 0
            ? this.buildTreeNodes(node.children)
            : undefined,
      };
    });
  }

  private flattenNodes(nodes: IOrgChartTreeNode[]): IWorkPositionOrgChartNode[] {
    return nodes.flatMap((n) => [
      n.data,
      ...this.flattenNodes(n.children || []),
    ]);
  }

  private countNodes(nodes: IOrgChartTreeNode[]): number {
    return nodes.reduce(
      (acc, n) => acc + 1 + this.countNodes(n.children || []),
      0,
    );
  }
}
