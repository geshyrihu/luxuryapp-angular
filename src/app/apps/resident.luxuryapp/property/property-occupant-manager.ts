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
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PropertyOccupant } from "src/app/core/interfaces/property-occupant.interface";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";

@Component({
  selector: "app-property-occupant-manager",
  imports: [
    ReactiveFormsModule,
    TableModule,
    WebButtonLabel,
    WebButtonIconEdit,
    WebButtonIconDelete,
    CustomInputTextSignal,
    CustomInputCheckSignal,
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
        this.errorMensaje = error.error?.message || "Error al agregar el ocupante.";
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

  onDeleteOccupant(id: string): void {
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
