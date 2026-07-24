import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { VisitDto } from "src/app/core/interfaces/visit.dto";

@Component({
  selector: "app-active-visits",
  templateUrl: "./active-visits.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TableModule, WebButtonLabel],
})
export class ActiveVisits implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  dataSignal = signal<VisitDto[]>([]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList<VisitDto[]>(Endpoints.AccessControlScan.activeVisits)
      .then((result) => this.dataSignal.set(result ?? []));
  }
}
