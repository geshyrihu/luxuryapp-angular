import { Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-ticket-legal-actualizar-estado",
  templateUrl: "./ticket-legal-actualizar-estado.html",
  imports: [ReactiveFormsModule, CardModule, SelectModule, CustomButton],
})
export class TicketLegalActualizarEstado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  loading = signal(false);
  statusControl = new FormControl<number>(0);
  id = this.config.data.id;

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
      .onPatch(Endpoints.Tasks.updateStatus(this.id), { status: this.statusControl.value })
      .then((result: any) => {
        if (result) {
          this.ref.close(true);
        } else {
          this.loading.set(false);
        }
      });
  }
}
