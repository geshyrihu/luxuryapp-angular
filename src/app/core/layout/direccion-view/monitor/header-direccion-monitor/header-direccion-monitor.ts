import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterModule,
} from "@angular/router";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { SelectModule } from "primeng/select";
import { ToolbarModule } from "primeng/toolbar";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { filter, map, startWith } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { ROUTES } from "src/app/routing/route-paths";
import { ProfileMonitor } from "../../../employee-view/monitor/profile-monitor/profile-monitor";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-header-direccion-monitor",
  imports: [
    BreadcrumbModule,
    FormsModule,
    ProfileMonitor,
    RouterModule,
    SelectModule,
    ToolbarModule,
    LxTooltipDirective,
    WebButtonIcon,
    AppIcon,
  ],
  templateUrl: "./header-direccion-monitor.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./header-direccion-monitor.scss",
})
export class HeaderDireccionMonitor implements OnInit {
  public authS = inject(AuthService);
  public customerIdS = inject(CustomerIdService);
  public themeService = inject(ThemeService);
  public location = inject(Location);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  public breadcrumbItems: MenuItem[] = [];
  public title: string = "";
  public customerId = this.customerIdS.customerId;
  public customerName = this.customerIdS.nombreCorto;
  public customerPhotoPath = this.customerIdS.customerPhotoPath;
  public cb_customer = this.authS.customerAccess;

  private routeEventSignal = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === PRIMARY_OUTLET),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const route = this.routeEventSignal();
      if (!route) return;
      this.title = route.snapshot.data["title"] || "";
      const parent = route.parent?.snapshot.data["breadcrumb"];
      const child = route.snapshot.data["breadcrumb"];
      this.breadcrumbItems = [{ icon: "material-symbols-light:home", routerLink: "/direccion" }];
      if (parent) this.breadcrumbItems.push({ label: parent });
      if (child) this.breadcrumbItems.push({ label: child });
    });
  }

  ngOnInit(): void {}

  onBack = () => this.location.back();
  onForward = () => this.location.forward();
  onHome = () => this.router.navigate(ROUTES.DIRECCION.HOME);
  toggleTheme = () => this.themeService.toggleTheme();
  getThemeIcon = () =>
    this.themeService.getCurrentTheme() === "light"
      ? "material-symbols-light:nightlight"
      : "material-symbols-light:sunny";
  selectCustomer = (newId: string) =>
    this.customerIdS.setCustomerId(newId).subscribe();
}
