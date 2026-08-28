import { ApiDatePipe } from "../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { LxImage } from "@ui/adaptive/image/image";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { IAnnouncement } from "./announcement.model";
@Component({
  selector: "app-announcement-detail",
  imports: [ApiDatePipe, RouterModule, AppIcon, LxImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./announcement-detail.html",
})
export class announcementDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  apiResponseS = inject(ApiResponseService);
  announcement = signal<IAnnouncement | null>(null);

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
      this.announcement.set(response);
    }
  }
}
