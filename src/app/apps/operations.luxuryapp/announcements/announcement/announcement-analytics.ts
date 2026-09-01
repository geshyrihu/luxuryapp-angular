import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { DataGrid, DataGridColumn } from "@ui/web/data-grid/data-grid";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { IAnnouncementAnalyticsDTO } from "./announcement.model";
@Component({
  selector: "app-announcement-analytics",
  imports: [
    ApiDatePipe,
    RouterModule,
    DataGrid,
    DataViewMobile,
    AppIcon,
    MobileListItem,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./announcement-analytics.html",
})
export default class AnnouncementAnalytics implements OnInit {
  apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private state = signal<{
    analytics: IAnnouncementAnalyticsDTO[];
    loading: boolean;
  }>({
    analytics: [],
    loading: true,
  });

  public analytics = computed(() => this.state().analytics);
  public loading = computed(() => this.state().loading);

  public globalFilterFields = computed(() =>
    globalFilterFields(this.analytics()),
  );

  announcementId: string = "";

  tableColumns: DataGridColumn[] = [
    { field: "userName", header: "Usuario", sortable: true },
    { field: "userEmail", header: "Email", sortable: true },
    { field: "customerName", header: "Cliente", sortable: true },
    { field: "role", header: "Rol", sortable: true },
    {
      field: "viewDate",
      header: "Fecha de Visualización",
      sortable: true,
      format: (val) => {
        if (!val) return "";
        const d = new Date(val);
        return (
          d.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) +
          " " +
          d.toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" })
        );
      },
    },
  ];

  ngOnInit(): void {
    this.announcementId = this.route.snapshot.paramMap.get("id");
    if (this.announcementId) {
      this.loadAnalytics();
    }
  }

  async loadAnalytics(): Promise<void> {
    this.state.update((s) => ({ ...s, loading: true }));

    const url = Endpoints.Announcements.analytics(this.announcementId);
    const response = await this.apiResponseS.onGetList<any>(url);

    this.state.set({
      analytics: response || [],
      loading: false,
    });
  }
}
