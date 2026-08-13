import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { WebButtonIcon, WebButtonIconDelete } from "@ui/buttons/web-icon";
import { LxCheckbox } from "@ui/adaptive/checkbox/checkbox";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { BadgeModule } from "primeng/badge";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-notifications-list-web",
  templateUrl: "./notifications-list-web.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BadgeModule,
    ScrollPanelModule,
    AppIcon,
    WebButtonIcon,
    WebButtonIconDelete,
    LxCheckbox,
    LxTooltipDirective,
  ],
})
export class NotificationsListWeb implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  private signalRService = inject(SignalRService);
  private destroyRef = inject(DestroyRef);
  private consoleLogger = inject(ConsoleLoggerService);

  notifications = signal<any[]>([]);
  loading = signal(false);

  selectionMode = signal(false);
  selectedIds = signal<Set<string>>(new Set<string>());

  allSelected = computed(
    () =>
      this.notifications().length > 0 &&
      this.notifications().every((n) => this.selectedIds().has(n.id)),
  );

  constructor() {
    this.signalRService.messageReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.consoleLogger.info(
          "NotificationsListWeb: Evento recibido, recargando la lista.",
        );
        this.onLoadNotification();
      });
  }

  ngOnInit(): void {
    this.onLoadNotification();
  }

  onLoadNotification(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetListNotLoading(Endpoints.Notifications.getAll)
      .then((result: any) => {
        if (result) {
          this.notifications.set(result);
        }
        this.loading.set(false);
      });
  }

  toggleSelectionMode(): void {
    this.selectionMode.update((v) => !v);
    if (!this.selectionMode()) {
      this.selectedIds.set(new Set<string>());
    }
  }

  toggleSelection(notificationId: string): void {
    this.selectedIds.update((set) => {
      const next = new Set(set);
      if (next.has(notificationId)) {
        next.delete(notificationId);
      } else {
        next.add(notificationId);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set<string>());
    } else {
      this.selectedIds.set(new Set(this.notifications().map((n) => n.id)));
    }
  }

  markAsRead(notificationId: string, url: string): void {
    const urlApi = Endpoints.Notifications.markAsRead(notificationId);
    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadNotification();
      this.router.navigateByUrl(url);
    });
  }

  deleteNotification(notificationId: string): void {
    const urlApi = Endpoints.Notifications.delete(notificationId);
    this.apiResponseS.onDelete(urlApi).then((deleted) => {
      if (deleted) {
        this.onLoadNotification();
      }
    });
  }

  deleteSelected(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;
    this.apiResponseS
      .onDelete(Endpoints.Notifications.deleteRange, ids)
      .then((deleted) => {
        if (deleted) {
          this.selectedIds.set(new Set<string>());
          this.onLoadNotification();
        }
      });
  }
}
