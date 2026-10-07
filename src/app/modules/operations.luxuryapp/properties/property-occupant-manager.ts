import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PropertyOccupant } from "@core/interfaces/property-occupant.interface";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputCheckSignal } from "@ui/inputs/web/lux-input-check-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-property-occupant-manager",
  imports: [
    ButtonWeb,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxInputTextSignal,
    LuxInputCheckSignal,
    LxTag,
    LxMessage,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./property-occupant-manager.html",
})
export class PropertyOccupantManager implements OnInit {
  apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private confirmS = inject(ConfirmService);

  loading = signal(false);
  occupants = signal<PropertyOccupant[]>([]);
  errorMensaje: string | null = null;

  propertyId: string = this.config.data.propertyId;
  propertyName: string = this.config.data.propertyName;

  occupantForm = new FormGroup({
    id: new FormControl<string | null>(null),
    fullName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.email, Validators.maxLength(100)],
    }),
    phoneNumber: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.maxLength(20)],
    }),
    isOwner: new FormControl<boolean>(false, { nonNullable: true }),
    isResident: new FormControl<boolean>(false, { nonNullable: true }),
    isActive: new FormControl<boolean>(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.loadOccupants();
  }

  loadOccupants(): void {
    this.loading.set(true);
    this.errorMensaje = null;

    this.apiResponseS
      .onGetList<PropertyOccupant[]>(
        Endpoints.PropertyOccupants.listByProperty(this.propertyId),
      )
      .then((response) => {
        this.occupants.set(Array.isArray(response) ? response : []);
      })
      .catch((error) => {
        this.errorMensaje =
          error.error?.message || "Error al cargar los ocupantes.";
        this.occupants.set([]);
      })
      .finally(() => this.loading.set(false));
  }

  onAddOrUpdateOccupant(): void {
    if (this.occupantForm.invalid) {
      this.occupantForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMensaje = null;

    const formValue = this.occupantForm.getRawValue();
    const occupantData = {
      ...formValue,
      propertyId: this.propertyId,
      isActive: formValue.isActive,
    };

    if (occupantData.id) {
      this.apiResponseS
        .onPut<PropertyOccupant>(
          Endpoints.PropertyOccupants.update(occupantData.id),
          occupantData,
        )
        .then((response) => {
          if (response && typeof response === "object" && "id" in response) {
            this.occupants.update((current) =>
              current.map((occupant) =>
                occupant.id === response.id ? response : occupant,
              ),
            );
            this.resetForm();
            return;
          }

          this.errorMensaje = "Error al actualizar el ocupante.";
        })
        .catch((error) => {
          this.errorMensaje =
            error.error?.message || "Error al actualizar el ocupante.";
        })
        .finally(() => this.loading.set(false));

      return;
    }

    this.apiResponseS
      .onPost<PropertyOccupant>(
        Endpoints.PropertyOccupants.create,
        occupantData,
      )
      .then((response) => {
        if (response && typeof response === "object" && "id" in response) {
          this.occupants.update((current) => [...current, response]);
          this.resetForm();
          return;
        }

        this.errorMensaje = "Error al agregar el ocupante.";
      })
      .catch((error) => {
        this.errorMensaje =
          error.error?.message || "Error al agregar el ocupante.";
      })
      .finally(() => this.loading.set(false));
  }

  onEditOccupant(occupant: PropertyOccupant): void {
    this.occupantForm.patchValue({
      id: occupant.id,
      fullName: occupant.fullName,
      email: occupant.email,
      phoneNumber: occupant.phoneNumber,
      isOwner: occupant.isOwner,
      isResident: occupant.isResident,
      isActive: occupant.isActive,
    });
  }

  async onDeleteOccupant(id: string): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este ocupante?",
    );
    if (!confirmed) return;
    this.loading.set(true);
    this.errorMensaje = null;

    this.apiResponseS
      .onDelete(Endpoints.PropertyOccupants.delete(id))
      .then((response) => {
        if (response !== false) {
          this.occupants.update((current) =>
            current.filter((occupant) => occupant.id !== id),
          );
          return;
        }

        this.errorMensaje = "Error al eliminar el ocupante.";
      })
      .catch((error) => {
        this.errorMensaje =
          error.error?.message || "Error al eliminar el ocupante.";
      })
      .finally(() => this.loading.set(false));
  }

  resetForm(): void {
    this.occupantForm.reset({
      id: null,
      fullName: "",
      email: "",
      phoneNumber: "",
      isOwner: false,
      isResident: false,
      isActive: true,
    });
  }

  closeDialog(): void {
    this.ref.close(true);
  }
}
