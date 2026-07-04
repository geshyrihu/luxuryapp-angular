import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IAnnouncement } from "./announcement.model";
@Component({
  selector: "app-announcement-detail",
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonImg,
    IonButton,

    IonList,
    IonItem,
    IonLabel,
    AppIcon,
  ],
  templateUrl: "./announcement-detail.html",
})
export class announcementDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  apiResponseS = inject(ApiResponseService);
  announcement: IAnnouncement | null = null;

  readonly ROUTES = ROUTES;

  navigateBack() {
    this.router.navigate(ROUTES.ANUNCIOS.LISTA);
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      const response = await this.apiResponseS.onGetItem<any>(
        Endpoints.Announcements.getById(id),
      );
      this.announcement = response;
    }
  }
}
