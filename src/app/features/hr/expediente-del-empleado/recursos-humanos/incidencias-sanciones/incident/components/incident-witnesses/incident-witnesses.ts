import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import { IncidentWitnessListDTO } from "../../models/incident.interfaces";
import { IncidentWitnessFormComponent } from "./incident-witness-form";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-incident-witnesses",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonLabel,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./incident-witnesses.html",
})
export class IncidentWitnessesComponent implements OnInit {
  incidentId = input.required<string>();

  private apiResponseS = inject(ApiResponseService);
  private dialogS = inject(DialogHandlerService);
  private swalS = inject(SwalService);

  witnesses = signal<IncidentWitnessListDTO[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadWitnesses();
  }

  loadWitnesses(): void {
    if (!this.incidentId()) return;
    this.loading.set(true);
    this.apiResponseS
      .onGetList<IncidentWitnessListDTO[]>(
        Endpoints.HR.Incident.witnesses.getByIncident(this.incidentId()),
      )
      .then((result) => {
        if (result) this.witnesses.set(result);
      })
      .finally(() => this.loading.set(false));
  }

  openAddDialog(): void {
    this.dialogS
      .openDialog(
        IncidentWitnessFormComponent,
        { incidentId: this.incidentId() },
        "Agregar Testigo",
        this.dialogS.sizeMd,
      )
      .then((result) => {
        if (result) this.loadWitnesses();
      });
  }

  openEditDialog(witness: IncidentWitnessListDTO): void {
    this.dialogS
      .openDialog(
        IncidentWitnessFormComponent,
        { incidentId: this.incidentId(), witnessId: witness.id },
        "Editar Testigo",
        this.dialogS.sizeMd,
      )
      .then((result) => {
        if (result) this.loadWitnesses();
      });
  }

  deleteWitness(witness: IncidentWitnessListDTO): void {
    this.swalS
      .fire({
        icon: "question",
        title: "Eliminar testigo",
        text: `¿Está seguro que desea eliminar a ${witness.fullName}?`,
        confirmButtonText: "Sí, eliminar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.apiResponseS
            .onDelete(Endpoints.HR.Incident.witnesses.delete(witness.id))
            .then((success) => {
              if (success) {
                this.witnesses.update((curr) =>
                  curr.filter((w) => w.id !== witness.id),
                );
                this.swalS.success("Eliminado", "Testigo eliminado.");
              }
            });
        }
      });
  }
}
