import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DashboardStatsDto } from "@core/interfaces/dashboard-stats.dto";
import { OccupancyDto } from "@core/interfaces/occupancy.dto";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-access-dashboard",
  templateUrl: "./access-dashboard.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiDatePipe, AppTable, WebButtonLabel],
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
