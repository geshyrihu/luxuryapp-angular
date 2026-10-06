import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";

@Component({
  selector: "app-ticket-legal-actualizar-estado",
  templateUrl: "./ticket-legal-actualizar-estado.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputSelectSignal],
})
export class TicketLegalActualizarEstado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  loading = signal(false);
  statusControl = new FormControl<number>(0);
  id = this.config.data.id;

  statusOptions: { label: string; value: number }[] = [];

  ngOnInit() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.getStatus(this.id))
      .then((result: any) => {
        const currentStatus = Number(result);
        this.statusControl.setValue(currentStatus);
        this.statusOptions = this.getAllowedStatusOptions(currentStatus);
      });
  }

  private getAllowedStatusOptions(currentStatus: number) {
    // Must match TaskAppService.IsValidStatusTransition and GanttStatus.
    const allowedTransitions: Record<number, number[]> = {
      0: [0, 1, 2, 4],
      1: [1, 2, 4],
      2: [2, 3],
      3: [3, 1, 4],
      4: [4],
      5: [5],
    };
    const statusLabels: Record<number, string> = {
      0: "No Iniciada",
      1: "En Proceso",
      2: "Concluido",
      3: "Reabierta",
      4: "Cancelada",
      5: "En Espera",
    };

    return (allowedTransitions[currentStatus] ?? [currentStatus])
      .filter((status) => statusLabels[status] !== undefined)
      .map((status) => ({ label: statusLabels[status], value: status }));
  }

  onSubmit() {
    this.loading.set(true);
    this.apiResponseS
      .onPatch(Endpoints.Tasks.updateStatus(this.id), {
        status: this.statusControl.value,
      })
      .then((result: any) => {
        if (result) {
          this.ref.close(true);
        } else {
          this.loading.set(false);
        }
      });
  }
}
