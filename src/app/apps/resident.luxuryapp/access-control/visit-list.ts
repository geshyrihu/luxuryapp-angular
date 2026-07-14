import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PagedResultDto } from "src/app/core/interfaces/paged-result.dto";
import { VisitDto } from "src/app/core/interfaces/visit.dto";

@Component({
  selector: "app-visit-list",
  templateUrl: "./visit-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, TableModule, WebButtonLabel],
})
export class VisitList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  dataSignal = signal<VisitDto[]>([]);
  loading = signal(true);

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData(): void {
    this.loading.set(true);
    const url = `${Endpoints.AccessControlVisits.getPaged}?page=1&recordsNumber=100`;
    this.apiResponseS
      .onGetItem<PagedResultDto<VisitDto>>(url)
      .then((result) => {
        this.dataSignal.set(result?.items ?? []);
        this.loading.set(false);
      });
  }

  cancel(visit: VisitDto): void {
    this.apiResponseS
      .onPatch<boolean>(Endpoints.AccessControlVisits.cancel(visit.id), {
        reason: "Cancelada por el residente",
      })
      .then((result) => {
        if (result) this.onLoadData();
      });
  }
}
