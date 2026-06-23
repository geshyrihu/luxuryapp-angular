import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
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
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
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
  apiResponseS = inject(ApiResponseService);
  announcement: IAnnouncement | null = null;

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
