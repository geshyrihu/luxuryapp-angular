import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { RoleType } from "src/app/core/enums/role-type.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Roles } from "src/app/core/interfaces/roles.interface";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { GroupedRole } from "./interfaces/grouped-role.interface";

const roleTypeNames: { [key in RoleType]: string } = {
  [RoleType.System]: "Sistema",
  [RoleType.Executive]: "Direccion",
  [RoleType.Corporate]: "Corporativo",
  [RoleType.Staff]: "Personal Operativo",
  [RoleType.Client]: "Cliente",
  [RoleType.Contractor]: "Proveedor",
};

@Component({
  selector: "app-update-role",
  templateUrl: "./update-role.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AppIcon],
})
export class UpdateRole implements OnInit {
  apiResponseS = inject(ApiResponseService);
  email: string = "";
  phoneNumber: string = "";
  userName: string = "";
  applicationUserState: boolean = false;
  applicationUserId = input<string>("");
  roleType = input<RoleType | null>(null);

  groupedRolesSignal = signal<GroupedRole[]>([]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.getRoles(this.roleType());
    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeInternal.dataForRecoveryPassword(
          this.applicationUserId(),
        ),
      )
      .then((result: any) => {
        if (result) {
          const { email, phoneNumber, userName } = result;
          this.email = email;
          this.phoneNumber = phoneNumber;
          this.userName = userName;
        }
      });

    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeInternal.onValidateState(this.applicationUserId()),
      )
      .then((result: any) => {
        if (result !== null) {
          this.applicationUserState = result;
        }
      });
  }

  getRoles(roleType: RoleType | null = null) {
    const urlApi = Endpoints.UserAccounts.getRoleUrl(
      this.applicationUserId(),
      roleType,
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: Roles[] | null) => {
        if (!result) return;
        const grouped = new Map<RoleType, Roles[]>();

        for (const role of result) {
          if (!grouped.has(role.roleType)) {
            grouped.set(role.roleType, []);
          }
          grouped.get(role.roleType)!.push(role);
        }

        const groupedArray: GroupedRole[] = Array.from(grouped.entries())
          .map(([type, roles]) => ({
            groupName: roleTypeNames[type],
            roles: roles.sort((a, b) => a.sortOrder - b.sortOrder),
            order: type,
          }))
          .sort((a, b) => a.order - b.order);

        this.groupedRolesSignal.set(groupedArray);
      })
      .catch((error) => {
        console.error("Error loading roles:", error);
      });
  }

  selectRole(selectedRole: Roles): void {
    const updatedRole = {
      ...selectedRole,
      isSelected: !selectedRole.isSelected,
    };

    this.groupedRolesSignal.update((groups) =>
      groups.map((group) => ({
        ...group,
        roles: group.roles.map((role) => {
          if (role.roleId === updatedRole.roleId) {
            return updatedRole;
          }
          if (updatedRole.isSelected) {
            return { ...role, isSelected: false };
          }
          return role;
        }),
      })),
    );

    this.apiResponseS
      .onPost(
        Endpoints.UserAccounts.addRoleToUser(
          this.applicationUserId(),
          this.roleType(),
        ),
        updatedRole,
      )
      .catch((error) => {
        console.error("Error al actualizar el rol:", error);
        this.groupedRolesSignal.update((groups) =>
          groups.map((group) => ({
            ...group,
            roles: group.roles.map((role) =>
              role.roleId === selectedRole.roleId ? selectedRole : role,
            ),
          })),
        );
      });
  }
}
