import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EndpointsSelectItem } from "@core/constants/endpoints/select-item.endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { LxCard } from "@ui/adaptive/card/card";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppTag } from "@ui/web/tag/tag";
import { ApplicationRoleDto } from "../application-roles/interfaces/application-role.dto";
import {
  EvaluationAuthorizationMatrixDto,
  EvaluationAuthorizationMatrixWriteDto,
} from "./interfaces/evaluation-authorization-matrix.dto";
import { EvaluationAuthorizationRoleDto } from "./interfaces/evaluation-authorization-role.dto";

const MATRIX_ENDPOINT = "evaluation-template-authorization-matrices";
const GLOBAL_ADMINISTRATORS = new Set([
  "RecursosHumanos",
  "Legal",
  "Reclutamiento",
  "GerenteMantenimiento",
  "SistemasGeneral",
  "SupervisionOperativa",
  "Administrador",
  "GerenteOperaciones",
  "GerenteAtencion",
  "JefeMantenimiento",
]);

@Component({
  selector: "app-evaluation-authorization-matrix",
  templateUrl: "./evaluation-authorization-matrix.html",
  styleUrls: ["./evaluation-authorization-matrix.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LxCard, LxSkeleton, AppIcon, AppTag],
})
export class EvaluationAuthorizationMatrix implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly matrices = signal<EvaluationAuthorizationMatrixDto[]>([]);
  readonly roles = signal<EvaluationAuthorizationRoleDto[]>([]);
  readonly editingId = signal<string | null>(null);
  readonly administratorRoles = computed(() =>
    this.roles().filter((role) => role.isActive && GLOBAL_ADMINISTRATORS.has(role.name)),
  );
  readonly targetRoles = computed(() =>
    this.roles().filter(
      (role) => role.isActive && ["Corporate", "Staff"].includes(role.roleType),
    ),
  );

  administratorRoleId = "";
  allowedScope = 2;
  canCreate = true;
  canEdit = true;
  canDeactivate = true;
  canDelete = false;
  targetRoleIds = new Set<string>();

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const [matrices, roles] = await Promise.all([
        this.apiResponseS.onGetItem<EvaluationAuthorizationMatrixDto[]>(MATRIX_ENDPOINT),
        this.apiResponseS.onGetItem<ApplicationRoleDto[]>(
          EndpointsSelectItem.SelectItems.applicationRoles,
        ),
      ]);
      this.matrices.set(matrices ?? []);
      this.roles.set(
        (roles ?? []).map((role) => ({
          id: role.id,
          name: role.name,
          displayName: role.displayName,
          roleType: role.roleType,
          isActive: role.isActive,
          sortOrder: role.sortOrder,
        })),
      );
    } finally {
      this.loading.set(false);
    }
  }

  beginCreate(): void {
    this.editingId.set(null);
    this.administratorRoleId = "";
    this.allowedScope = 2;
    this.canCreate = true;
    this.canEdit = true;
    this.canDeactivate = true;
    this.canDelete = false;
    this.targetRoleIds = new Set();
  }

  beginEdit(matrix: EvaluationAuthorizationMatrixDto): void {
    this.editingId.set(matrix.id);
    this.administratorRoleId = matrix.administratorRoleId;
    this.allowedScope = matrix.allowedScope;
    this.canCreate = matrix.canCreate;
    this.canEdit = matrix.canEdit;
    this.canDeactivate = matrix.canDeactivate;
    this.canDelete = matrix.canDelete;
    this.targetRoleIds = new Set(matrix.targetRoles.map((role) => role.roleId));
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  toggleTargetRole(roleId: string): void {
    const next = new Set(this.targetRoleIds);
    next.has(roleId) ? next.delete(roleId) : next.add(roleId);
    this.targetRoleIds = next;
  }

  isTargetSelected(roleId: string): boolean {
    return this.targetRoleIds.has(roleId);
  }

  async save(): Promise<void> {
    if (!this.administratorRoleId || this.targetRoleIds.size === 0) return;

    const payload: EvaluationAuthorizationMatrixWriteDto = {
      administratorRoleId: this.administratorRoleId,
      allowedScope: this.allowedScope,
      canCreate: this.canCreate,
      canEdit: this.canEdit,
      canDeactivate: this.canDeactivate,
      canDelete: this.canDelete,
      targetRoleIds: [...this.targetRoleIds],
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      const saved = id
        ? await this.apiResponseS.onPut<EvaluationAuthorizationMatrixDto>(
            `${MATRIX_ENDPOINT}/${id}`,
            payload,
          )
        : await this.apiResponseS.onPost<EvaluationAuthorizationMatrixDto>(
            MATRIX_ENDPOINT,
            payload,
          );

      if (saved && typeof saved !== "boolean") {
        this.matrices.update((current) =>
          id
            ? current.map((matrix) => (matrix.id === id ? saved : matrix))
            : [...current, saved],
        );
        this.cancelEdit();
      }
    } finally {
      this.saving.set(false);
    }
  }

  async remove(matrix: EvaluationAuthorizationMatrixDto): Promise<void> {
    if (!matrix.canDelete || !window.confirm("¿Eliminar esta regla de autorización?")) return;
    await this.apiResponseS.onDelete(`${MATRIX_ENDPOINT}/${matrix.id}`);
    this.matrices.update((current) => current.filter((item) => item.id !== matrix.id));
  }
}
