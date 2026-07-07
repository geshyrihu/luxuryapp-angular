import { animate, style, transition, trigger } from "@angular/animations";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

export interface IWarehouseForm {
  id: FormControl<string>;
  nombre: FormControl<string>;
  ubicacion: FormControl<string>;
  customerId: FormControl<string | null>;
  applicationUserId: FormControl<string>;
  responsablesIds: FormControl<string[] | null>;
}
/**
 * Componente para agregar o editar un almacÃ³n.
 * Permite gestionar informaciÃ³n bÃ³sica del almacÃ³n y asignar responsables si el usuario es administrador.
 */
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-warehouse-form",
  templateUrl: "./warehouse-form.html",
  imports: [
    WebButtonIcon,
    CardModule,
    CustomInputTextSignal,
    WebButtonLabelSave,

    DragDropModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  animations: [
    trigger("dropAnimation", [
      transition(":enter", [
        style({ transform: "scale(0.9)", opacity: 0 }),
        animate("200ms ease-out", style({ transform: "scale(1)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class WarehouseForm implements OnInit {
  // InyecciÃ³n de servicios mediante inject()
  apiResponseS = inject(ApiResponseService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;
  // SeÃ³ales reactivas
  submitting = signal(false); // Indica si se estÃ© enviando el formulario
  id: string = ""; // ID del almacÃ³n (si es ediciÃ³n)

  // Signals para manejo de usuarios (solo visible para admins)
  cb_users = signal<any[]>([]);
  isAdmin = this.aspRoleS.anyOf([
    EApplicationRole.Administrador,
    EApplicationRole.SuperUsuario,
  ]);

  // Listas de usuarios disponibles y asignados
  availableUsers: any[] = [];
  assignedUsers: any[] = [];

  // Campo de bÃ³squeda para filtrar usuarios disponibles
  searchAvailable = new FormControl("");

  // Formulario reactivo
  form: FormGroup<IWarehouseForm> = this.formBuilder.group({
    id: [""],
    nombre: ["", [Validators.required, Validators.minLength(5)]], // Nombre del almacÃ³n (mÃ­nimo 5 caracteres)
    ubicacion: ["", Validators.required], // UbicaciÃ³n del almacÃ³n
    customerId: [this.customerIdS.customerId()], // ID del cliente actual
    applicationUserId: [this.authS.applicationUserId], // Usuario que crea/actualiza
    responsablesIds: [[] as string[]], // IDs de los usuarios responsables (solo para admins)
  });

  // Propiedad para almacenar todos los usuarios cargados (para evitar mÃ­ltiples llamadas)
  private allUsers: any[] = [];

  /**
   * MÃ©todo de inicializaciÃ³n del componente.
   * Carga los datos del almacÃ³n si es ediciÃ³n o prepara para creaciÃ³n.
   */
  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    if (
      this.aspRoleS.anyOf([
        EApplicationRole.Administrador,
        EApplicationRole.SuperUsuario,
      ])()
    ) {
      await this.loadUsers(); // Carga todos los usuarios disponibles
    }

    if (this.id !== "") {
      this.onLoadData(); // Carga los datos del almacÃ³n existente
    } else if (
      this.aspRoleS.anyOf([
        EApplicationRole.Administrador,
        EApplicationRole.SuperUsuario,
      ])()
    ) {
      this.availableUsers = [...this.allUsers]; // Todos los usuarios estÃ©n disponibles para nuevo almacÃ³n
    }
  }

  /**
   * Carga la lista completa de usuarios del sistema.
   * @returns Promise<void>
   */
  loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      const customerId: string = this.customerIdS.customerId();
      this.apiResponseS
        .onGetSelectItem<ISelectItem[]>(`application-users/${customerId}`)
        .then((resp: any) => {
          this.allUsers = resp; // Guardamos la lista completa
          resolve();
        });
    });
  }

  /**
   * Carga los datos del almacÃ³n cuando se estÃ© en modo ediciÃ³n.
   */
  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Almacen.getById(this.id))
      .then((result: any) => {
        // Llenamos los campos bÃ³sicos del formulario
        this.form.patchValue(result);

        // Separamos usuarios disponibles y asignados segÃ³n los datos cargados
        const assignedIds = result.responsablesIds || [];
        this.assignedUsers = this.allUsers.filter((u) =>
          assignedIds.includes(u.value),
        );
        this.availableUsers = this.allUsers.filter(
          (u) => !assignedIds.includes(u.value),
        );

        // Actualizamos el formControl con los IDs correctos
        this.form.patchValue({ responsablesIds: assignedIds });
      });
  }

  /**
   * Maneja el envÃ­o del formulario.
   * Guarda primero el almacÃ³n y luego asigna los responsables si aplica.
   */
  async onSubmit() {
    const savedWarehouse = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "almacen",
      id: this.id,
      submitting: this.submitting,
      closeOnSuccess: false,
    });

    if (savedWarehouse === false) return;

    try {
      const warehouseId = this.id;
      const finalId =
        savedWarehouse?.id || savedWarehouse?.data?.id || warehouseId;

      if (this.isAdmin() && finalId) {
        const DTO = {
          almacenId: finalId,
          userIds: this.form.get("responsablesIds")?.value,
        };
        await this.apiResponseS.onPut(
          "almacen/assign-responsibles",
          DTO,
          false,
        );
      }

      this.ref.close(true);
    } catch (error) {
      console.error("Error al guardar el almacÃ³n:", error);
    } finally {
      this.submitting.set(false);
    }
  }

  /**
   * Maneja el evento de arrastrar y soltar usuarios a la lista de asignados.
   * @param event Evento de arrastre
   */
  onDropToAssigned(event: CdkDragDrop<any[]>) {
    const movedUser = event.previousContainer.data[event.previousIndex];
    if (!this.assignedUsers.some((u) => u.value === movedUser.value)) {
      this.assignedUsers.push(movedUser);
      this.availableUsers = this.availableUsers.filter(
        (u) => u.value !== movedUser.value,
      );
      this.updateResponsablesForm(); // Actualiza el formulario con los IDs asignados
    }
  }

  /**
   * Maneja el evento de arrastrar y soltar usuarios a la lista de disponibles.
   * @param event Evento de arrastre
   */
  onDropToAvailable(event: CdkDragDrop<any[]>) {
    const movedUser = event.previousContainer.data[event.previousIndex];
    if (!this.availableUsers.some((u) => u.value === movedUser.value)) {
      this.availableUsers.push(movedUser);
      this.assignedUsers = this.assignedUsers.filter(
        (u) => u.value !== movedUser.value,
      );
      this.updateResponsablesForm(); // Actualiza el formulario con los IDs restantes
    }
  }

  /**
   * Actualiza el valor del control 'responsablesIds' del formulario.
   */
  updateResponsablesForm() {
    const ids = this.assignedUsers.map((u) => u.value);
    this.form.get("responsablesIds")?.setValue(ids);
  }

  /**
   * Filtra la lista de usuarios disponibles segÃ³n el texto de bÃ³squeda.
   * @returns Lista de usuarios filtrados
   */
  filteredAvailableUsers() {
    const query = (this.searchAvailable.value || "").trim().toLowerCase();
    return this.availableUsers.filter((user) =>
      user.label.toLowerCase().includes(query),
    );
  }

  /**
   * Elimina un usuario de la lista de asignados y lo mueve a la lista de disponibles.
   * @param user Usuario a remover
   */
  onRemoveUser(user: any) {
    this.assignedUsers = this.assignedUsers.filter(
      (u) => u.value !== user.value,
    );
    this.availableUsers.push(user);
    this.updateResponsablesForm();
  }

  /**
   * Agrega un usuario a la lista de asignados y lo elimina de los disponibles.
   * @param user Usuario a agregar
   */
  onAddUser(user: any) {
    if (!this.assignedUsers.some((u) => u.value === user.value)) {
      this.assignedUsers.push(user);
      this.availableUsers = this.availableUsers.filter(
        (u) => u.value !== user.value,
      );
      this.updateResponsablesForm();
    }
  }
}
