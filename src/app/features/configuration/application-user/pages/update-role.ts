import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { FieldsetModule } from "primeng/fieldset";
import { Endpoints } from "src/app/core/constants/endpoints";
import { IRoles } from "src/app/core/interfaces/roles.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";

export enum ERoleType {
  System = 0,
  Executive = 1,
  Corporate = 2,
  Staff = 3,
  Client = 4,
  Contractor = 5,
}

interface GroupedRole {
  groupName: string;
  roles: IRoles[];
}

const roleTypeNames: { [key in ERoleType]: string } = {
  [ERoleType.System]: "Sistema",
  [ERoleType.Executive]: "Dirección",
  [ERoleType.Corporate]: "Corporativo",
  [ERoleType.Staff]: "Personal Operativo",
  [ERoleType.Client]: "Cliente",
  [ERoleType.Contractor]: "Proveedor",
};

@Component({
  selector: "app-update-role",
  templateUrl: "./update-role.html",
  imports: [CommonModule, CardModule, FieldsetModule],
})
export class UpdateRole implements OnInit {
  apiResponseS = inject(ApiResponseService);
  email: string = "";
  phoneNumber: string = "";
  userName: string = "";
  applicationUserState: boolean = false;
  applicationUserId = input<string>("");
  roleType = input<ERoleType | null>(null);

  groupedRolesSignal = signal<GroupedRole[]>([]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.getRoles(this.roleType());
    this.apiResponseS
      .onGetItem(
        `EmployeeInternal/DataForRecoveryPassword/${this.applicationUserId()}`,
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
      .onGetItem(`EmployeeInternal/OnValidateState/${this.applicationUserId()}`)
      .then((result: any) => {
        this.applicationUserState = result;
      });
  }

  getRoles(roleType: ERoleType | null = null) {
    const urlApi = Endpoints.ApplicationUsers.getRoleUrl(
      this.applicationUserId(),
      roleType,
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: IRoles[]) => {
        const grouped = new Map<ERoleType, IRoles[]>();

        // Agrupar roles por roleType
        for (const role of result) {
          if (!grouped.has(role.roleType)) {
            grouped.set(role.roleType, []);
          }
          grouped.get(role.roleType)!.push(role);
        }

        // Convertir el mapa a un array ordenado para la vista
        const groupedArray: GroupedRole[] = Array.from(grouped.entries())
          .map(([type, roles]) => ({
            groupName: roleTypeNames[type],
            roles: roles.sort((a, b) => a.sortOrder - b.sortOrder), // <-- ¡Aquí la nueva ordenación!
            order: type, // Usar el valor del enum para ordenar
          }))
          .sort((a, b) => a.order - b.order);

        this.groupedRolesSignal.set(groupedArray);
      })
      .catch((error) => {
        console.error("Error loading roles:", error);
      });
  }

  selectRole(selectedRole: IRoles): void {
    const updatedRole = {
      ...selectedRole,
      isSelected: !selectedRole.isSelected,
    };

    this.groupedRolesSignal.update((groups) =>
      groups.map((group) => ({
        ...group,
        roles: group.roles.map((role) => {
          if (role.roleId === updatedRole.roleId) {
            return updatedRole; // El rol que acabamos de cambiar
          }
          // Si el nuevo rol está seleccionado, deseleccionar todos los demás
          if (updatedRole.isSelected) {
            return { ...role, isSelected: false };
          }
          // Si estamos deseleccionando, no afectamos a los otros roles
          return role;
        }),
      })),
    );

    this.apiResponseS
      .onPost(
        Endpoints.ApplicationUsers.addRoleToUser(this.applicationUserId()),
        updatedRole,
      )
      .catch((error) => {
        console.error("Error al actualizar el rol:", error);
        // Opcional: Revertir el cambio en la UI si la API falla
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
