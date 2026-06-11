import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { IonAvatar, IonItem, IonLabel } from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { Endpoints } from "src/app/core/constants/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IAnnouncementAnalyticsDTO } from "./announcement.model";
@Component({
  selector: "app-announcement-analytics",
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    TableModule,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonAvatar,
    AppIcon,
  ],
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
