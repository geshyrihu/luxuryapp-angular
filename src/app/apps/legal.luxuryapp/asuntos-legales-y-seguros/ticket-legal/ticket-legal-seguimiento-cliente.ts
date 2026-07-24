import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Component({
  selector: "app-ticket-legal-seguimiento-cliente",
  templateUrl: "./ticket-legal-seguimiento-cliente.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon],
})
export class TicketLegalSeguimientoCliente implements OnInit {
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  seguimientos = signal<any[]>([]);
  loading = signal(true);

  private taskId: string = this.config.data.ticketId ?? this.config.data.id;

  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  onCargaListaseguimientos() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(Endpoints.TaskFollowUps.listByTicketMessage(this.taskId))
      .then((result: any) => {
        this.seguimientos.set(result || []);
        this.loading.set(false);
      });
  }
}
