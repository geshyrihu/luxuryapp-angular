import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import {
  IonApp,
  IonContent,
  IonHeader,
  IonToolbar,
} from "@ionic/angular/standalone";
import { LxLoader } from "@ui/adaptive/loader/loader";
import { filter, map } from "rxjs/operators";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { HidescrollnavService } from "src/app/core/services/hidescrollnav.service";
import { LayoutService } from "src/app/core/services/layout.service";
import { MenuService } from "src/app/core/services/menu.service";
import { HeaderMobile } from "../shared/header-mobile/header-mobile";
import { FooterCommitteeMonitor } from "./monitor/components/footer-committee-monitor/footer-committee-monitor";
import { HeaderCommitteeMonitor } from "./monitor/header-committee-monitor/header-committee-monitor";
import { AppLoader } from "@ui/web/loader/loader";
@Component({
  selector: "app-layout-committee",
  templateUrl: "./layout-committee.html",
  imports: [
    AppLoader,
    CommonModule,
    RouterOutlet,
    HeaderCommitteeMonitor,
    FooterCommitteeMonitor,
    HeaderMobile,
    IonApp,
    IonHeader,
    IonToolbar,
    IonContent,
    LxLoader,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      ion-app {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class LayoutCommittee implements OnInit {
  public breakpointObserver = inject(BreakpointObserver);
  public router = inject(Router);

  public isMobileView = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: null },
  );
  public hideScroolNavService = inject(HidescrollnavService);
  public layout = inject(LayoutService);
  public today: Date = new Date();
  public year: number = this.today.getFullYear();

  public footerFix = true;
  public footerLight = false;
  public footerDark: boolean = false;

  public navService = inject(MenuService);
  public aspRoleS = inject(AspRoleService);
  public authS = inject(AuthService);

  public AspRole = EApplicationRole;

  get layoutClass() {
    return this.layout.config.settings.sidebar_type + "";
  }

  constructor() {
    effect(() => {
      const url = this.currentUrl() || this.router.url;
      if (url) {
        if (url.includes("/page-layout/footer-dark")) {
          this.footerDark = true;
          this.footerLight = false;
          this.footerFix = false;
        } else if (url.includes("/page-layout/footer-light")) {
          this.footerLight = true;
          this.footerDark = false;
          this.footerFix = false;
        } else if (url.includes("/page-layout/footer-fixed")) {
          this.footerFix = true;
          this.footerLight = false;
          this.footerDark = false;
        }
      }
    });
  }

  ngOnInit(): void {
    document.body.setAttribute("data-layout", "vertical");
  }

  ngOnDestroy() {
    this.footerDark = false;
  }
}
