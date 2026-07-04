import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
} from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IAnnouncementList } from "./announcement.model";
@Component({
  selector: "app-announcement-list",
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    TooltipModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonImg,
    AppIcon,
  ],
  templateUrl: "./announcement-list.html",
})
export class AnnouncementList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private state = signal<{
    announcements: IAnnouncementList[];
    loading: boolean;
  }>({
    announcements: [],
    loading: true,
  });

  public announcements = computed(() => this.state().announcements);
  public loading = computed(() => this.state().loading);

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  async loadAnnouncements(): Promise<void> {
    this.state.update((s) => ({ ...s, loading: true }));
    const response =
      await this.apiResponseS.onGetList<IAnnouncementList[]>("announcements");
    this.state.set({
      announcements: response || [],
      loading: false,
    });
  }

  // Helper para remover HTML del contenido para mostrar un snippet
  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  navigateToDetail(id: string): void {
    this.router.navigate(ROUTES.ANUNCIOS.DETALLE(id));
  }
}
