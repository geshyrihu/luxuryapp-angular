import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-ticket-legal-actualizar-estado",
  templateUrl: "./ticket-legal-actualizar-estado.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputSelectSignal,
    WebButtonLabel,
  ],
})
export class TicketLegalActualizarEstado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  loading = signal(false);
  statusControl = new FormControl<number>(0);
  id = this.config.data.id;

  readonly statusOptions = [
    { label: "Pendiente", value: 0 },
    { label: "En Proceso", value: 1 },
    { label: "Concluido", value: 2 },
    { label: "Cancelado", value: 4 },
  ];

  ngOnInit() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.getStatus(this.id))
      .then((result: any) => {
        this.statusControl.setValue(result);
      });
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
