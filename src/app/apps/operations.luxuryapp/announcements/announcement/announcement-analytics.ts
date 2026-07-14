import { CommonModule } from "@angular/common";
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
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IAnnouncementAnalyticsDTO } from "./announcement.model";
@Component({
  selector: "app-announcement-analytics",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
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
