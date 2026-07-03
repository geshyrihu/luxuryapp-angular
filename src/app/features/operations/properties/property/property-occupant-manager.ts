import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { IPropertyOccupant } from "src/app/core/interfaces/property-occupant.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-property-occupant-manager",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    WebButtonLabel,
    CustomInputTextSignal,
    CheckboxModule,
    TagModule,
    MessageModule,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
  ],
  templateUrl: "./property-occupant-manager.html",
})
export class PropertyOccupantManager implements OnInit {
  apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  loading = signal(false);
  occupants = signal<IPropertyOccupant[]>([]);
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
      .onGetList<IPropertyOccupant[]>(
        `PropertyOccupant/list/${this.propertyId}`,
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
        .onPut<IPropertyOccupant>(
          `PropertyOccupant/${occupantData.id}`,
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
        .onPost<IPropertyOccupant>("PropertyOccupant", occupantData)
        .then((response) => {
          if (response && typeof response === "object" && "id" in response) {
            this.occupants.update((current) => [...current, response]);
            this.resetForm();
          } else {
            this.errorMensaje = "Error al Aóadir el ocupante.";
          }
        })
        .catch((error) => {
          this.errorMensaje =
            error.error?.message || "Error al Aóadir el ocupante.";
          console.error("Error adding occupant:", error);
        })
        .finally(() => this.loading.set(false));
    }
  }

  onEditOccupant(occupant: IPropertyOccupant): void {
    this.occupantForm.patchValue(occupant);
  }

  onDeleteOccupant(id: string): void {
    this.loading.set(true);
    this.errorMensaje = null;
    this.apiResponseS
      .onDelete(`PropertyOccupant/${id}`)
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
