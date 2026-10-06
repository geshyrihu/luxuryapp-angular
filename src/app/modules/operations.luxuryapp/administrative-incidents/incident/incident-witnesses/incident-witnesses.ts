import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { IncidentWitnessListDTO } from "../interfaces/incident.interfaces";
import { IncidentWitnessFormComponent } from "./incident-witness-form";

import { ButtonWeb } from "@ui/buttons/web";

@Component({
  selector: "app-incident-witnesses",
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    LxIcon],
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
