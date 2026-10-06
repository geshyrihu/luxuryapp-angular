import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AccessEventDto } from "@core/interfaces/access-event.dto";
import { PagedResultDto } from "@core/interfaces/paged-result.dto";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";

import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-access-events",
  templateUrl: "./access-events.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb, ApiDatePipe, AppTable],
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
