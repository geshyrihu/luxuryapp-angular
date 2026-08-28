import { CommonModule } from "@angular/common";
import { ApiDatePipe } from "../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { IAnnouncementList } from "./announcement.model";
@Component({
  selector: "app-announcement-list",
  imports: [CommonModule, ApiDatePipe, RouterModule, LxTooltipDirective, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
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
