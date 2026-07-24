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
  selector: "app-ticket-legal-seguimiento-solicitud-detalle",
  templateUrl: "./ticket-legal-seguimiento-solicitud-detalle.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon],
})
export class TicketLegalSeguimientoSolicitudDetalle implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  data: string = "";
  id = this.config.data.id;

  loading = signal(true);

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.getById(this.id))
      .then((result: any) => {
        this.data = result.description ?? "";
        this.loading.set(false);
      });
  }
}
