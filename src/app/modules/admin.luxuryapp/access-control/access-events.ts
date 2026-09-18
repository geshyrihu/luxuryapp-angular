import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppTable } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccessEventDto } from "@core/interfaces/access-event.dto";
import { PagedResultDto } from "@core/interfaces/paged-result.dto";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";

@Component({
  selector: "app-access-events",
  templateUrl: "./access-events.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiDatePipe, AppTable, WebButtonLabel],
})
export class AccessEvents implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  dataSignal = signal<AccessEventDto[]>([]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    const url = `${Endpoints.AccessControlOperations.events}?page=1&recordsNumber=100`;
    this.apiResponseS
      .onGetItem<PagedResultDto<AccessEventDto>>(url)
      .then((result) => this.dataSignal.set(result?.items ?? []));
  }

  export(): void {
    this.apiResponseS.onDownloadFile(
      Endpoints.AccessControlOperations.eventsExport,
      "bitacora-accesos.xlsx",
    );
  }
}
