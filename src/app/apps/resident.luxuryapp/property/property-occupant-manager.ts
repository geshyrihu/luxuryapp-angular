import { CommonModule } from "@angular/common";
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
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PropertyOccupant } from "src/app/core/interfaces/property-occupant.interface";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-property-occupant-manager",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    WebButtonLabel,
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

  propertyId: any = this.config.data.propertyId;
  propertyName: string = this.config.data.propertyName;

  // Definición estricta del formulario
  occupantForm = new FormGroup({
    id: new FormControl<string | null>(null),
    fullName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>("", {
      validators: [Validators.email, Validators.maxLength(100)],
    }),
    phoneNumber: new FormControl<string>("", {
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
        `property-occupant/list/${this.propertyId}`,
      )
      .then((response) => {
        if (Array.isArray(response)) {
          this.occupants.set(response);
        } else {
          this.errorMensaje =
            "No se encontraron ocupantes para esta propiedad.";
          this.occupants.set([]);
        }
        this.loading.set(false);
      })
      .catch((error) => {
        this.errorMensaje =
          error.error?.message || "Error al cargar los ocupantes.";
        console.error("Error loading property occupants:", error);
        this.occupants.set([]);
        this.loading.set(false);
      });
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
      isActive: true,
    };

    if (occupantData.id) {
      // Actualizar
      this.apiResponseS
        .onPut<PropertyOccupant>(
          `property-occupant/${occupantData.id}`,
          occupantData,
        )
        .then((response) => {
          if (response && typeof response === "object" && "id" in response) {
            this.occupants.update((current) =>
              current.map((o) => (o.id === response.id ? response : o)),
            );
            this.resetForm();
          } else {
            this.errorMensaje = "Error al actualizar el ocupante.";
          }
        })
        .catch((error) => {
          this.errorMensaje =
            error.error?.message || "Error al actualizar el ocupante.";
          console.error("Error updating occupant:", error);
        })
        .finally(() => this.loading.set(false));
    } else {
      // Aóadir
      this.apiResponseS
        .onPost<PropertyOccupant>("PropertyOccupant", occupantData)
        .then((response) => {
          if (response && typeof response === "object" && "id" in response) {
            this.occupants.update((current) => [...current, response]);
            this.resetForm();
          } else {
            this.errorMensaje = "Error al Añadirel ocupante.";
          }
        })
        .catch((error) => {
          this.errorMensaje =
            error.error?.message || "Error al Añadirel ocupante.";
          console.error("Error adding occupant:", error);
        })
        .finally(() => this.loading.set(false));
    }
  }

  onEditOccupant(occupant: PropertyOccupant): void {
    this.occupantForm.patchValue(occupant);
  }

  onDeleteOccupant(id: string): void {
    this.loading.set(true);
    this.errorMensaje = null;
    this.apiResponseS
      .onDelete(`property-occupant/${id}`)
      .then((response) => {
        if (response !== false) {
          this.occupants.update((current) =>
            current.filter((o) => o.id !== id),
          );
        } else {
          this.errorMensaje = "Error al eliminar el ocupante.";
        }
        this.loading.set(false);
      })
      .catch((error) => {
        this.errorMensaje =
          error.error?.message || "Error al eliminar el ocupante.";
        console.error("Error deleting occupant:", error);
        this.loading.set(false);
      });
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
