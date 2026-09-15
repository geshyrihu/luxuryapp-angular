import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AppLoader } from "@ui/web/loader/loader";
import { LayoutService } from "@core/services/layout.service";
import { HeaderCommitteedesktop } from "./desktop/header";
import { FooterCommitteedesktop } from "./desktop/footer";

@Component({
  selector: "app-committee-desktop",
  imports: [
    RouterOutlet,
    HeaderCommitteedesktop,
    FooterCommitteedesktop,
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

