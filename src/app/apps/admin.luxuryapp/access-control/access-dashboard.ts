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
import { DashboardStatsDto } from "src/app/core/interfaces/dashboard-stats.dto";
import { OccupancyDto } from "src/app/core/interfaces/occupancy.dto";

@Component({
  selector: "app-access-dashboard",
  templateUrl: "./access-dashboard.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TableModule, WebButtonLabel],
})
export class AccessDashboard implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  stats = signal<DashboardStatsDto | null>(null);
  occupancy = signal<OccupancyDto | null>(null);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetItem<DashboardStatsDto>(Endpoints.AccessControlOperations.stats)
      .then((result) => this.stats.set(result));
    this.apiResponseS
      .onGetItem<OccupancyDto>(Endpoints.AccessControlOperations.occupancy)
      .then((result) => this.occupancy.set(result));
  }
}
