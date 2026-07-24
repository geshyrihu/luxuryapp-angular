import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AppLoader } from "@ui/web/loader/loader";
import { LayoutService } from "src/app/core/services/layout.service";
import { HeaderCommitteeMonitor } from "./monitor/header";
import { FooterCommitteeMonitor } from "./monitor/footer";

@Component({
  selector: "app-committee-desktop",
  imports: [
    RouterOutlet,
    HeaderCommitteeMonitor,
    FooterCommitteeMonitor,
    AppLoader,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-desktop.html",
})
export class CommitteeDesktop {
  public layout = inject(LayoutService);

  get layoutClass() {
    return this.layout.config.settings.sidebar_type + "";
  }
}
