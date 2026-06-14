import { Component, inject } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-jobs-dashboard",
  templateUrl: "./jobs-dashboard.html",
  imports: [ButtonModule],
  styles: [
    `
      .hangfire-shell {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-height: calc(100vh - 7rem);
      }

      .hangfire-toolbar {
        align-items: center;
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .hangfire-frame {
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        height: calc(100vh - 10.5rem);
        min-height: 42rem;
        width: 100%;
      }

      @media (max-width: 768px) {
        .hangfire-frame {
          height: calc(100vh - 8rem);
          min-height: 38rem;
        }
      }
    `,
  ],
})
export class JobsDashboard {
  private sanitizer = inject(DomSanitizer);

  hangfireDashboardUrl =
    environment.HANGFIRE_DASHBOARD_URL ??
    `${environment.API_DOMONIO.replace(/\/$/, "")}/api/hangfire/`;
  safeHangfireDashboardUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(this.hangfireDashboardUrl);

  openDashboard() {
    window.open(this.hangfireDashboardUrl, "_blank", "noopener,noreferrer");
  }
}
